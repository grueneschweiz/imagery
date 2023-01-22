<?php
declare(strict_types=1);

namespace App\Services\ImageEditor;

use App\Exceptions\ImageEditorException;
use App\Image;

class ImageEditorJpeg extends ImageEditor
{
    public const FILE_FORMAT = 'jpeg';
    public const COLOR_PROFILE = 'sRGB';
    private const QUALITY = 90; // 0-100 (0 = worst, 100 = best)

    public function __construct(
        Image $image,
    ) {
        parent::__construct(
            $image,
            static::FILE_FORMAT,
            static::COLOR_PROFILE,
            false,
            null,
        );
    }

    protected function getFilename(): string
    {
        $filename = pathinfo($this->image->filename, PATHINFO_FILENAME);
        $bleed = (int) $this->image->bleed;

        return $filename
               ."-{$this->colorProfile}"
               ."-{$bleed}px"
               .'.jpeg';
    }

    /**
     * @throws ImageEditorException
     * @throws \ImagickException
     */
    protected function generate(): void
    {
        $im = $this->getUneditedWithoutBleed();
        $outPath = $this->getAbsPath();

        if (!(
            $im->stripImage()
            && $im->setColorspace(\Imagick::COLORSPACE_SRGB)
            && $im->setImageCompression(\Imagick::COMPRESSION_JPEG)
            && $im->setImageCompressionQuality(self::QUALITY)
            && $im->writeImage($outPath)
            && $im->destroy()
        )) {
            throw new ImageEditorException('Image generation failed.');
        }
    }
}
