<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Only create tasks if we have users
        if (User::count() === 0) {
            return;
        }

        $users = User::all();
        
        foreach ($users as $user) {
            // Create a variety of tasks for each user
            Task::factory(15)->for($user)->create();
            
            // Create some specific task examples
            Task::factory()->for($user)->create([
                'title' => 'Review project proposal',
                'description' => 'Go through the new client proposal and provide feedback',
                'priority' => 'high',
                'category' => 'Work',
                'tags' => ['urgent', 'review'],
                'due_date' => now()->addDays(2),
                'completed' => true,
                'completed_at' => now()->subHour(),
            ]);
            
            Task::factory()->for($user)->create([
                'title' => 'Buy groceries for dinner',
                'description' => 'Need to get ingredients for tonight\'s dinner party',
                'priority' => 'medium',
                'category' => 'Personal',
                'tags' => ['shopping'],
                'due_date' => now()->endOfDay(),
                'reminder_date' => now()->addHours(2),
            ]);
            
            Task::factory()->for($user)->create([
                'title' => 'Learn new React hooks',
                'description' => 'Study useCallback and useMemo hooks for better performance',
                'priority' => 'low',
                'category' => 'Learning',
                'tags' => ['react', 'javascript', 'programming'],
                'due_date' => now()->addWeek(),
            ]);
            
            Task::factory()->for($user)->create([
                'title' => 'Schedule dentist appointment',
                'priority' => 'medium',
                'category' => 'Health',
                'tags' => ['appointment', 'health'],
                'due_date' => now()->addDays(5),
            ]);
            
            Task::factory()->for($user)->overdue()->create([
                'title' => 'Submit tax documents',
                'description' => 'Gather and submit all required tax documents',
                'priority' => 'high',
                'category' => 'Finance',
                'tags' => ['urgent', 'taxes'],
            ]);
        }
    }
}