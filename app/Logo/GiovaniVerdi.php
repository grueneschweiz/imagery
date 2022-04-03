<?php


namespace App\Logo;


class GiovaniVerdi extends SimpleLogoCompositor
{
    private const TEMPLATE_DIR_NAME = 'giovani-verdi';
    private const BASE_LOGO_NAME = 'giovani-verdi-%s.svg';

    protected function getBaseLogoName(): string
    {
        return sprintf(self::BASE_LOGO_NAME, $this->colorScheme);
    }

    public function getTemplateDirName(): string
    {
        return self::TEMPLATE_DIR_NAME;
    }
}
