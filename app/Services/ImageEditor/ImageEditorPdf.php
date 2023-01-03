<?php
declare(strict_types=1);

namespace App\Services\ImageEditor;

use App\Exceptions\ImageEditorException;
use App\Image;

class ImageEditorPdf extends ImageEditor
{
    public const FILE_FORMAT = 'pdf';
    public const COLOR_PROFILE = 'FOGRA51';

    private const SRC_COLOR_PROFILE_FILENAME = 'sRGB_ICC_v4_Appearance.icc';
    private const DST_COLOR_PROFILE_FILENAME = 'PSOcoated_v3.icc';

    public const RESOLUTION_MIN = 72;
    public const RESOLUTION_MAX = 600;
    public const RESOLUTION_DEFAULT = 300;

    public function __construct(
        Image $image,
        bool  $withBleed,
        int   $resolution,
    ) {
        if ($resolution < static::RESOLUTION_MIN || $resolution > static::RESOLUTION_MAX) {
            throw new ImageEditorException(
                sprintf(
                    'Invalid argument. Resolution out of range [%d, %d]: %s',
                    static::RESOLUTION_MIN,
                    static::RESOLUTION_MAX,
                    $resolution
                )
            );
        }

        parent::__construct(
            $image,
            static::FILE_FORMAT,
            static::COLOR_PROFILE,
            $withBleed,
            $resolution,
        );
    }

    protected function getFilename(): string
    {
        $filename = pathinfo($this->image->filename, PATHINFO_FILENAME);
        $bleed    = (int) $this->image->bleed;

        return $filename
               ."-{$this->colorProfile}"
               ."-{$this->resolution}dpi"
               ."-{$bleed}px"
               .'.pdf';
    }

    /**
     * @throws \ImagickException
     * @throws ImageEditorException
     */
    protected function generate(): void
    {
        if ($this->withBleed && 0 === $this->image->bleed) {
            throw new ImageEditorException('Can not generate image with bleed since original image was saved without.');
        }

        // load image
        $im = $this->withBleed ? $this->getUneditedImage() : $this->getUneditedWithoutBleed();

        // prepare image
        if (!(
            $im->stripImage()
            && $this->transformToCmyk($im)
            && $im->setImageResolution($this->resolution, $this->resolution)
            && $im->setFormat('jpeg')
        )) {
            throw new ImageEditorException('Image generation failed.');
        }

        // setup dimensions
        $format      = app(PDFFormat::class, [
            'image'      => $this->image,
            'withBleed'  => $this->withBleed,
            'resolution' => $this->resolution,
        ]);

        // prepare pdf file
        $pdf = app(MyTCPDF::class, [
            'orientation' => $format->getOrientation(),
            'unit' => 'mm',
            'format' => $format->getFormatArray(),
        ]);

        // set document information
        $user   = $this->image->user;
        $author = $user ? $user->first_name.' '.$user->last_name : config('app.name');

        $pdf->setCreator(config('app.url'));
        $pdf->setAuthor($author);
        $pdf->setTitle($this->image->logo?->name || config('app.name'));
        $pdf->setSubject($this->image->keywords);

        // configure pdf
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);
        $pdf->setMargins(0, 0, 0);
        $pdf->setAbsXY(0, 0);
        $pdf->setAutoPageBreak(false);

        // add image
        $pdf->AddPage();
        $pdf->Image(
            '@'.$im->getImageBlob(), // '@' indicates data stream instead of filename
            ...$format->getImagePosArray(),
        );

        // add crop marks
        if ($this->withBleed) {
            $pos = $format->getCropMarkPosArray();
            $pdf->cropMark(...$pos['TL'], type: 'TL');
            $pdf->cropMark(...$pos['TR'], type: 'TR');
            $pdf->cropMark(...$pos['BL'], type: 'BL');
            $pdf->cropMark(...$pos['BR'], type: 'BR');
        }

        // save pdf file
        $pdf->Output($this->getAbsPath(), 'F');
        $im->destroy();
    }

    /**
     * @link https://gist.github.com/Neoglyph/645d25d2b784a8fb77fd77e3bdfce006
     * @link https://github.com/rmagick/rmagick/issues/46
     * @link https://www.php.net/manual/en/imagick.transformimagecolorspace.php
     *
     * @param  \Imagick  $im
     * @return bool
     * @throws \ImagickException
     * @throws ImageEditorException
     */
    private function transformToCmyk(\Imagick $im): bool
    {
        $srgb = $this->getColorProfileString(static::SRC_COLOR_PROFILE_FILENAME);
        $cmyk = $this->getColorProfileString(static::DST_COLOR_PROFILE_FILENAME);

        // the following lines correspond to the following command:
        // `convert src.png -profile sRGB_ICC_v4_Appearance.icc -profile PSOcoated_v3.icc cmyk.jpg`
        //
        // you probably don't want to mess with it unless you like to go down the rabbit hole...
        //
        // Resources:
        // - canvas is srgb: https://html.spec.whatwg.org/multipage/canvas.html#colour-spaces-and-colour-correction
        // - why we use sRGB_ICC_v4_Appearance.icc: https://color.org/whitepapers/ICC_White_Paper42_Using_the_sRGB_ICC_v4_appearance_profile_2014.pdf
        // - why we use PSOcoated_v3.icc: https://www.flyerline.ch/api/rm/7M537AS5DZZ3ZNH/tipps-zur-datenanlieferung-ch-2021.pdf
        //   the differences between coated and uncoated: https://proofing.de/topics/psocoatedv3/
        // - some theory about color profiles and how image magick handles them: https://legacy.imagemagick.org/Usage/formats/#profiles
        // - why we apply profile image twice: https://stackoverflow.com/a/15587798
        //   - first we define the input color profile
        //   - then we define the output color profile
        return $im->profileImage('icc', $srgb)
               && $im->profileImage('icc', $cmyk)
               && $im->transformImageColorspace(\Imagick::COLORSPACE_CMYK);
    }

    /**
     * @throws ImageEditorException
     */
    private function getColorProfileString(string $profile): string
    {
        $path    = disk_path($profile);
        $profile = file_get_contents($path);

        if (!$profile) {
            throw new ImageEditorException("Failed to load color profile: $path");
        }

        return $profile;
    }
}
