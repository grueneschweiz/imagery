<?php

namespace App\Rules;

use App\Image;
use Illuminate\Contracts\Validation\Rule;

class ImageBleedRule implements Rule
{
    private Image $model;

    public function __construct(Image $model)
    {
        $this->model = clone $model;
        $this->model->fill(request()?->toArray() ?? []); // @phpstan-ignore-line // -> could probably be used instead of ?-> if laravel request lifecycle is to be trusted
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value): bool
    {
        if (null === $value) {
            return $this->model->type === Image::TYPE_RAW;
        }

        if (!is_numeric($value)) {
            return false;
        }

        $value = (int) $value;

        return $value >= 0;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message(): string
    {
        return 'Invalid :attribute value.';
    }
}
