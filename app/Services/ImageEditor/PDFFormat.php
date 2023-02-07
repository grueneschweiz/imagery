<?php
declare(strict_types=1);

namespace App\Services\ImageEditor;

use App\Image;

class PDFFormat
{
    // TCPDF uses factor 4 to define the whitespace between the center
    // of the crop mark and the beginning of the stroke. We do therefore
    // bind the crop mark length to the bleed value, so the crop marks
    // start at the edge of the bleed box.
    public const CROP_MARK_LEN_FACTOR = 4;
    private const INCH_2_MM = 25.4; // 1inch = 25.4mm

    private float $bleedMm;
    private float $cropMarkLenMm;
    private float $imageWidthWithBleedMm;
    private float $imageHeightWithBleedMm;
    private float $imageWidthTrimmedMm;
    private float $imageHeightTrimmedMm;


    public function __construct(
        private readonly Image $image,
        private readonly bool  $withBleed,
        private readonly int   $resolution,
    ) {
        $this->setBleedMm();
        $this->setImageDimsMm();
        $this->setCropMarkLenMm();
    }

    private function setBleedMm(): void
    {
        if (!$this->withBleed) {
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
        $this->imageWidthWithBleedMm  = $this->px2mm($this->image->width);
        $this->imageHeightWithBleedMm = $this->px2mm($this->image->height);

        if ($this->withBleed) {
            $this->imageWidthTrimmedMm  = $this->imageWidthWithBleedMm - (2 * $this->bleedMm);
            $this->imageHeightTrimmedMm = $this->imageHeightWithBleedMm - (2 * $this->bleedMm);
        } else {
            $this->imageWidthTrimmedMm  = $this->imageWidthWithBleedMm;
            $this->imageHeightTrimmedMm = $this->imageHeightWithBleedMm;
        }
    }

    private function setCropMarkLenMm(): void
    {
        $this->cropMarkLenMm = $this->withBleed
            ? self::CROP_MARK_LEN_FACTOR * $this->bleedMm
            : 0;
    }

    public function getOrientation(): string
    {
        return $this->image->width > $this->image->height ? 'L' : 'P';
    }

    public function getFormatArray(): array
    {
        $trimBox = $this->getTrimBox();
        $mediaBox = $this->getMediaBox();

        return [
            'MediaBox' => $mediaBox,
            'CropBox'  => $mediaBox,
            'BleedBox' => $this->getBleedBox(),
            'TrimBox'  => $trimBox,
//            'ArtBox'   => $trimBox,
        ];
    }

    private function getTrimBox(): array
    {
        return [
            'llx' => $this->cropMarkLenMm + $this->bleedMm,
            'lly' => $this->cropMarkLenMm + $this->bleedMm,
            'urx' => $this->imageWidthTrimmedMm + $this->cropMarkLenMm + $this->bleedMm,
            'ury' => $this->imageHeightTrimmedMm + $this->cropMarkLenMm + $this->bleedMm,
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
            'urx' => $this->imageWidthWithBleedMm + $this->cropMarkLenMm * 2,
            'ury' => $this->imageHeightWithBleedMm + $this->cropMarkLenMm * 2,
        ];
    }

    private function getBleedBox(): array
    {
        return [
            'llx' => $this->cropMarkLenMm,
            'lly' => $this->cropMarkLenMm,
            'urx' => $this->imageWidthWithBleedMm + $this->cropMarkLenMm,
            'ury' => $this->imageHeightWithBleedMm + $this->cropMarkLenMm,
        ];
    }

    public function getImagePosArray(): array
    {
        $bleedBox = $this->getBleedBox();

        return [
            'x' => $bleedBox['llx'],
            'y' => $bleedBox['lly'],
            'w' => $bleedBox['urx'] - $bleedBox['llx'],
            'h' => $bleedBox['ury'] - $bleedBox['lly'],
        ];
    }

    public function getCropMarkPosArray(): array
    {
        return [
            'TL' => [
                'x' => $this->cropMarkLenMm + $this->bleedMm,
                'y' => $this->cropMarkLenMm + $this->bleedMm,
                'w' => $this->cropMarkLenMm,
                'h' => $this->cropMarkLenMm,
            ],
            'TR' => [
                'x' => $this->cropMarkLenMm + $this->bleedMm + $this->imageWidthTrimmedMm,
                'y' => $this->cropMarkLenMm + $this->bleedMm,
                'w' => $this->cropMarkLenMm,
                'h' => $this->cropMarkLenMm,
            ],
            'BL' => [
                'x' => $this->cropMarkLenMm + $this->bleedMm,
                'y' => $this->cropMarkLenMm + $this->bleedMm + $this->imageHeightTrimmedMm,
                'w' => $this->cropMarkLenMm,
                'h' => $this->cropMarkLenMm,
            ],
            'BR' => [
                'x' => $this->cropMarkLenMm + $this->bleedMm + $this->imageWidthTrimmedMm,
                'y' => $this->cropMarkLenMm + $this->bleedMm + $this->imageHeightTrimmedMm,
                'w' => $this->cropMarkLenMm,
                'h' => $this->cropMarkLenMm,
            ],
        ];
    }
}
