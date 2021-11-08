<?php


namespace App\Logo;


class JeunesVertes extends SimpleLogoCompositor
{
    private const BASE_LOGO_NAME = 'jeunes-vert-e-s-%s.svg';

    protected function getBaseLogoName(): string
    {
        return sprintf(self::BASE_LOGO_NAME, $this->colorScheme);
    }
}
