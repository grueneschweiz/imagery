<?php
declare(strict_types=1);

namespace App\Services\ImageEditor;

use App\Exceptions\ImageEditorException;
use App\Image;

class ImageEditorPng extends ImageEditor
{
    public const FILE_FORMAT = 'png';
    public const COLOR_PROFILE = 'sRGB';

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
               .'.png';
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
            && $im->writeImage($outPath)
            && $im->destroy()
        )) {
            throw new ImageEditorException('Image generation failed.');
        }
    }
}
