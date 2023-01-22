<?php
declare(strict_types=1);

namespace App\Services\ImageEditor;

use App\Exceptions\ImageEditorException;

class ImageEditorThumbnail extends ImageEditorPng
{
    public const BASE_DIR = 'thumb';

    private const THUMB_MAX_WIDTH = 600;
    private const THUMB_MAX_HEIGHT = 5000;
    private const FILE_EXTENSION = 'png';

    protected function getFilename(): string
    {
        $filename = pathinfo($this->image->filename, PATHINFO_FILENAME);

        return $filename.'.'.self::FILE_EXTENSION;
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
