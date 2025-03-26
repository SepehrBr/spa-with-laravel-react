<?php

namespace Database\Factories;

use Faker\Factory as FakerFactory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker = FakerFactory::create('fa_IR');

        return [
            'name' => fake()->sentence(),
            'description' => fake()->text(),
            'due_date' => fake()->dateTimeBetween('now', '+1 year'),
            'status' => fake()->randomElement(['نامعلوم', 'در حال انجام', 'تمام شده']),
            'image_path' => 'https://avatar.iran.liara.run/public/',
            'priority' => fake()->randomElement(['کم', 'متوسط', 'زیاد']),
            'assigned_to' => 1,
            'created_by' => 1,
            'updated_by' => 1,
        ];
    }
}
