<?php


namespace App\Logo;


class AlternativeRisch extends SimpleLogoCompositor
{
    private const BASE_LOGO_NAME = 'alternative-risch-%s.svg';

    protected function getBaseLogoName(): string
    {
        return sprintf(self::BASE_LOGO_NAME, $this->colorScheme);
    }
}
