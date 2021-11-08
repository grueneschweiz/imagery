<?php


namespace App\Logo;


class Alternative extends SimpleLogoCompositor
{
    private const BASE_LOGO_NAME = 'alternative-%s.svg';

    protected function getBaseLogoName(): string
    {
        return sprintf(self::BASE_LOGO_NAME, $this->colorScheme);
    }
}
