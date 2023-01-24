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

    private string $relPath;
    private string $absPath;

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
        if (!isset($this->relPath)) {
            $this->relPath = static::getStorageDir()
                             .DIRECTORY_SEPARATOR
                             .$this->getFilename();
        }

        return $this->relPath;
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

    public function getAbsPath(): string
    {
        if (!isset($this->absPath)) {
            $this->absPath = disk_path($this->getRelPath());
        }

        return $this->absPath;
    }

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
        $width  = $im->getImageWidth() - 2 * $bleed;
        $height = $im->getImageHeight() - 2 * $bleed;
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
