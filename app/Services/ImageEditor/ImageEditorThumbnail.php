<?php
declare(strict_types=1);

namespace App\Services\ImageEditor;

use App\Exceptions\ImageEditorException;

class ImageEditorThumbnail extends ImageEditorPng
{
    public const BASE_DIR = 'thumb';

    private const THUMB_MAX_WIDTH = 600;
    private const THUMB_MAX_HEIGHT = 5000;

    protected function getFilename(): string
    {
        return $this->image->filename;
    }

    /**
     * @throws \ImagickException
     * @throws ImageEditorException
     */
    protected function generate(): void
    {
        $im = $this->getUneditedWithoutBleed();
        $outPath = $this->getAbsPath();

        if (!(
            $im->thumbnailImage(static::THUMB_MAX_WIDTH, static::THUMB_MAX_HEIGHT, true)
            && $im->writeImage($outPath)
            && $im->destroy()
        )) {
            throw new ImageEditorException('Thumbnail generation failed.');
        }
    }

}
