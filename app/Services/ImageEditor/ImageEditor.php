<?php
declare(strict_types=1);

namespace App\Services\ImageEditor;

use App\Image;
use Illuminate\Support\Facades\Storage;

abstract class ImageEditor
{
    public const BASE_DIR = 'full';
    public const FILE_FORMAT = 'override';
    public const COLOR_PROFILE = 'override';

    protected const BASE_DIR_UNEDITED_IMAGES = 'full';

    public function __construct(
        protected readonly Image $image,
        protected string         $format,
        protected string         $colorProfile,
        protected bool           $withBleed,
        protected int|null       $resolution,
    ) {
    }

    public function generateIfNeeded(): void
    {
        $path = $this->getRelPath();

        if (Storage::exists($path)) {
            return;
        }

        $this->generate();

        Storage::setVisibility($path, 'private');
    }

    public function getRelPath(): string
    {
        return static::getStorageDir()
               .DIRECTORY_SEPARATOR
               .$this->getFilename();
    }

    public static function getStorageDir(): string
    {
        $dir = static::getBaseDir().DIRECTORY_SEPARATOR.static::BASE_DIR;

        return create_dir($dir);
    }

    private static function getBaseDir(): string
    {
        return trim(config('app.image_dir'), '/');
    }

    abstract protected function getFilename(): string;

    abstract protected function generate(): void;

    /**
     * @throws \ImagickException
     */
    protected function getUneditedWithoutBleed(): \Imagick
    {
        $im = $this->getUneditedImage();

        if (!$this->image->bleed) {
            return $im;
        }

        $bleed  = $this->image->bleed;
        $width  = $this->image->width - 2 * $bleed;
        $height = $this->image->height - 2 * $bleed;
        $im->cropImage($width, $height, $bleed, $bleed);

        return $im;
    }

    /**
     * @throws \ImagickException
     */
    protected function getUneditedImage(): \Imagick
    {
        $path = disk_path($this->getRelPathOfUneditedImage());
        return new \Imagick($path);
    }

    public function getRelPathOfUneditedImage(): string
    {
        return static::getStorageDirOfUneditedImage()
               .DIRECTORY_SEPARATOR
               .$this->image->filename;
    }

    public static function getStorageDirOfUneditedImage(): string
    {
        return static::getBaseDir()
               .DIRECTORY_SEPARATOR
               .static::BASE_DIR_UNEDITED_IMAGES;
    }
}
