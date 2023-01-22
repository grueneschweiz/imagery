<?php
declare(strict_types=1);

namespace App\Services\ImageEditor;

class MyTCPDF extends \TCPDF
{
    // remove ArtBox (it is not PDF/X-4 compatible)
    protected $page_boxes = ['MediaBox', 'CropBox', 'BleedBox', 'TrimBox'];

    /**
     * Prevent printing TCPDF link, so we don't have to embed a font
     */
    public function Close()
    {
        $this->tcpdflink = false;
        parent::Close();
    }
}
