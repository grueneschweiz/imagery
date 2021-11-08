<?php


namespace App\Logo;


class GiovaniVerdi extends SimpleLogoCompositor
{
    private const BASE_LOGO_NAME = 'giovani-verdi-%s.svg';

    protected function getBaseLogoName(): string
    {
        return sprintf(self::BASE_LOGO_NAME, $this->colorScheme);
    }
}
