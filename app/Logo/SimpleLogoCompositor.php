<?php


namespace App\Logo;


use App\Exceptions\LogoException;
use Imagick;

abstract class SimpleLogoCompositor implements LogoCompositor
{
    use VectorImageLoaderTrait;

    protected string $baseLogoDirPath;
    protected string $colorScheme;

    public function compose(int $width): Imagick
    {
        $path = $this->getAbsLogoPath();

        return $this->imFromVectorFile($path, $width);
    }

    /**
     * Filename of the logo
     *
     * @return string
     */
    abstract protected function getBaseLogoName(): string;

    /**
     * Path to the logo.
     *
     * The class properties $this->baseLogoDirPath and $this->colorScheme are
     * your friends.
     *
     * @return string
     */
    protected function getAbsLogoPath(): string
    {
        return $this->baseLogoDirPath
               . DIRECTORY_SEPARATOR
               . $this->getBaseLogoName();
    }

    public function setColorScheme(string $colorScheme): void
    {
        $this->colorScheme = $colorScheme;
    }

    public function setBaseLogoDirPath(string $path): void
    {
        $this->baseLogoDirPath = $path;
    }

    public function getLogoIdentifier(int $width): string
    {
        return $this->getBaseLogoName()."-{$width}";
    }
}
