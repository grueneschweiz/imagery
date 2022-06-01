<?php
declare(strict_types=1);

namespace App\Logo;

class Alternative extends SimpleLogoCompositor
{

    private const BASE_LOGO_NAME = '%s-%s.svg';

    public function __construct(private readonly string $logoBaseName)
    {
    }

    protected function getBaseLogoName(): string
    {
        return sprintf(
            self::BASE_LOGO_NAME,
            $this->logoBaseName,
            $this->colorScheme
        );
    }

    public function getTemplateDirName(): string
    {
        return $this->logoBaseName;
    }
}
