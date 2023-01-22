<?php

namespace App\Rules;

use App\Services\ImageEditor\ImageEditorPdf;
use App\Services\ImageEditor\ImageEditorPng;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Http\Request;

class ImageColorProfileRule implements Rule
{
    private string $format;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->format = $request->query('format', ImageEditorPng::FILE_FORMAT);
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        return match($this->format) {
            ImageEditorPng::FILE_FORMAT => $value === ImageEditorPng::COLOR_PROFILE,
            ImageEditorPdf::FILE_FORMAT => $value === ImageEditorPdf::COLOR_PROFILE,
            default => false,
        };
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return "Format {$this->format} doesn't allow color profile: :value";
    }
}
