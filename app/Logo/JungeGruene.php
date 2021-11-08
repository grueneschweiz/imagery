<?php


namespace App\Logo;


class JungeGruene extends SimpleLogoCompositor
{
    private const BASE_LOGO_NAME = 'junge-gruene-%s.svg';

    protected function getBaseLogoName(): string
    {
        return sprintf(self::BASE_LOGO_NAME, $this->colorScheme);
    }
}
