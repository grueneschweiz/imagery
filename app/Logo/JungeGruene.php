<?php


namespace App\Logo;


class JungeGruene extends SimpleLogoCompositor
{
    private const TEMPLATE_DIR_NAME = 'junge-gruene';
    private const BASE_LOGO_NAME = 'junge-gruene-%s.svg';

    protected function getBaseLogoName(): string
    {
        return sprintf(self::BASE_LOGO_NAME, $this->colorScheme);
    }

    public function getTemplateDirName(): string
    {
        return self::TEMPLATE_DIR_NAME;
    }
}
