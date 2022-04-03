<?php


namespace App\Logo;


class Alternative extends SimpleLogoCompositor
{
    private const TEMPLATE_DIR_NAME = 'alternative';
    private const BASE_LOGO_NAME = 'alternative-%s.svg';

    protected function getBaseLogoName(): string
    {
        return sprintf(self::BASE_LOGO_NAME, $this->colorScheme);
    }

    public function getTemplateDirName(): string
    {
        return self::TEMPLATE_DIR_NAME;
    }
}
