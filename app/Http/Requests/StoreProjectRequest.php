<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'image' => ['nullable', 'image', 'mimes:png,jpeg,jpg', 'max:2048'],
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'description' => ['string', 'min:3'],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
            'status' => ['required', 'in:pending,in_progress,completed'],
        ];
    }
}
