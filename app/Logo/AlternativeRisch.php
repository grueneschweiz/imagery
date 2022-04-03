<?php


namespace App\Logo;


class AlternativeRisch extends SimpleLogoCompositor
{
    private const TEMPLATE_DIR_NAME = 'alternative-risch';
    private const BASE_LOGO_NAME = 'alternative-risch-%s.svg';

    protected function getBaseLogoName(): string
    {
        return sprintf(self::BASE_LOGO_NAME, $this->colorScheme);
    }

    public function getTemplateDirName(): string
    {
        return self::TEMPLATE_DIR_NAME;
    }
}
