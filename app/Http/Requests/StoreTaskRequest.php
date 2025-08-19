<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'due_date' => 'nullable|date|after:now',
            'reminder_date' => 'nullable|date|after:now|before_or_equal:due_date',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Task title is required.',
            'title.max' => 'Task title cannot exceed 255 characters.',
            'priority.required' => 'Priority is required.',
            'priority.in' => 'Priority must be low, medium, or high.',
            'due_date.after' => 'Due date must be in the future.',
            'reminder_date.after' => 'Reminder date must be in the future.',
            'reminder_date.before_or_equal' => 'Reminder date must be before or equal to due date.',
        ];
    }
}