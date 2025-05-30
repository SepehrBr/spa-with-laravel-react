<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
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
            'name' => 'required|string|max:255|min:1',
            'description' => 'nullable|string|min:3',
            'status' => 'required|in:pending,in_progress,completed',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'due_date' => 'nullable|date|after_or_equal:today',
        ];
    }
}
