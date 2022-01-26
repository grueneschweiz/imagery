<?php


namespace App\Logo;


class Basta extends SimpleLogoCompositor
{
    private const TEMPLATE_DIR_NAME = 'basta';
    private const BASE_LOGO_NAME = 'basta-%s.svg';

    protected function getBaseLogoName(): string
    {
        return sprintf(self::BASE_LOGO_NAME, $this->colorScheme);
    }

    public function getTemplateDirName(): string
    {
        return self::TEMPLATE_DIR_NAME;
    }
}
