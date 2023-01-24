<?php
declare(strict_types=1);

namespace App\Services\ImageEditor;

use App\Exceptions\ImageEditorException;
use App\Image;

class ImageEditorFactory
{
    /**
     * @throws ImageEditorException
     */
    public function make(
        Image $image,
        string $format,
        bool $withBleed = false,
        int $resolution = null, // required for ImageEditorPdf
        string $colorProfile = null // for future usage, currently ignored
    ): ImageEditor
    {
        return match ($format) {
            ImageEditorPdf::FILE_FORMAT => app(
                ImageEditorPdf::class,
                [
                    'image'      => $image,
                    'withBleed'  => $withBleed,
                    'resolution' => (int) $resolution
                ]
            ),

            ImageEditorPng::FILE_FORMAT => app(
                ImageEditorPng::class,
                [
                    'image' => $image
                ]
            ),

            ImageEditorJpeg::FILE_FORMAT => app(
                ImageEditorJpeg::class,
                [
                    'image' => $image
                ]
            ),

            default => throw new ImageEditorException("Unknown file format: $format")
        };
    }
}
