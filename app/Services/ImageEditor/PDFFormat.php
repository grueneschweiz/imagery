<?php
declare(strict_types=1);

namespace App\Services\ImageEditor;

use App\Image;

class PDFFormat
{
    public const CROP_MARK_LEN_MM = 5;
    private const INCH_2_MM = 25.4; // 1inch = 25.4mm

    private float $bleedMm;
    private float $cropMarkLenMm;
    private float $imageWidthMm;
    private float $imageHeightMm;

    public function __construct(
        private readonly Image $image,
        private readonly bool $withBleed,
        private readonly int $resolution,
    ) {
        $this->setBleedMm();
        $this->setImageDimsMm();
        $this->setCropMarkLenMm();
    }

    private function setBleedMm(): void
    {
        if (! $this->withBleed) {
            $this->bleedMm = 0;
            return;
        }

        $this->bleedMm = $this->px2mm($this->image->bleed);
    }

    public function px2mm(int $px): float
    {
        return $px * (self::INCH_2_MM / $this->resolution);
    }

    private function setImageDimsMm(): void
    {
        $this->imageWidthMm  = $this->px2mm($this->image->width);
        $this->imageHeightMm = $this->px2mm($this->image->height);
    }

    private function setCropMarkLenMm()
    {
        $this->cropMarkLenMm = $this->withBleed ? self::CROP_MARK_LEN_MM : 0;
    }

    public function getOrientation(): string
    {
        return $this->image->width > $this->image->height ? 'L' : 'P';
    }

    public function getFormatArray(): array
    {
        $trimBox = $this->getTrimBox();

        return [
            'MediaBox' => $this->getMediaBox(),
            'BleedBox' => $this->getBleedBox(),
            'TrimBox' => $trimBox,
            'CropBox' => $trimBox,
        ];
    }

    private function getTrimBox(): array
    {
        return [
            'llx' => $this->cropMarkLenMm + $this->bleedMm,
            'lly' => $this->cropMarkLenMm + $this->bleedMm,
            'urx' => $this->imageWidthMm,
            'ury' => $this->imageHeightMm,
        ];
    }

    /**
     * All dims in px
     *
     * @return array
     */
    private function getMediaBox(): array
    {
        return [
            'llx' => 0,
            'lly' => 0,
            'urx' => $this->imageWidthMm + $this->bleedMm * 2 + $this->cropMarkLenMm * 2,
            'ury' => $this->imageHeightMm + $this->bleedMm * 2 + $this->cropMarkLenMm * 2,
        ];
    }

    private function getBleedBox(): array
    {
        return [
            'llx' => $this->cropMarkLenMm,
            'lly' => $this->cropMarkLenMm,
            'urx' => $this->imageWidthMm + $this->bleedMm * 2,
            'ury' => $this->imageHeightMm + $this->bleedMm * 2,
        ];
    }
}
