<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\User;
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
        $categories = ['Work', 'Personal', 'Shopping', 'Health', 'Learning', 'Travel'];
        $tags = ['urgent', 'important', 'quick', 'review', 'meeting', 'call', 'email', 'research'];
        
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(random_int(3, 8)),
            'description' => fake()->optional(0.7)->paragraph(),
            'completed' => fake()->boolean(30),
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
            'category' => fake()->optional(0.6)->randomElement($categories),
            'tags' => fake()->optional(0.5)->randomElements($tags, random_int(1, 3)),
            'due_date' => fake()->optional(0.4)->dateTimeBetween('now', '+30 days'),
            'reminder_date' => fake()->optional(0.3)->dateTimeBetween('now', '+25 days'),
            'completed_at' => function (array $attributes) {
                return $attributes['completed'] ? fake()->dateTimeBetween('-30 days', 'now') : null;
            },
        ];
    }

    /**
     * Indicate that the task is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'completed' => true,
            'completed_at' => fake()->dateTimeBetween('-30 days', 'now'),
        ]);
    }

    /**
     * Indicate that the task is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'completed' => false,
            'completed_at' => null,
        ]);
    }

    /**
     * Indicate that the task has high priority.
     */
    public function highPriority(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'high',
        ]);
    }

    /**
     * Indicate that the task is overdue.
     */
    public function overdue(): static
    {
        return $this->state(fn (array $attributes) => [
            'due_date' => fake()->dateTimeBetween('-7 days', '-1 day'),
            'completed' => false,
            'completed_at' => null,
        ]);
    }
}