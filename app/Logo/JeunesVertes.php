<?php


namespace App\Logo;


class JeunesVertes extends SimpleLogoCompositor
{
    private const TEMPLATE_DIR_NAME = 'jeunes-vert-e-s';
    private const BASE_LOGO_NAME = 'jeunes-vert-e-s-%s.svg';

    protected function getBaseLogoName(): string
    {
        return sprintf(self::BASE_LOGO_NAME, $this->colorScheme);
    }

    public function getTemplateDirName(): string
    {
        return self::TEMPLATE_DIR_NAME;
    }
}
