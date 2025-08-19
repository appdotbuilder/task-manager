<?php

use App\Models\Task;
use App\Models\User;

test('authenticated user can view tasks index', function () {
    $user = User::factory()->create();
    Task::factory(3)->for($user)->create();

    $response = $this
        ->actingAs($user)
        ->get(route('home'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('tasks/index'));
});

test('user can create task', function () {
    $user = User::factory()->create();

    $taskData = [
        'title' => 'Test Task',
        'description' => 'This is a test task',
        'priority' => 'high',
        'category' => 'Work',
        'tags' => ['test', 'urgent'],
        'due_date' => now()->addDays(3)->toDateTimeString(),
    ];

    $response = $this
        ->actingAs($user)
        ->post(route('tasks.store'), $taskData);

    $response->assertRedirect(route('tasks.index'));
    expect(Task::where('user_id', $user->id)->where('title', 'Test Task')->exists())->toBeTrue();
});

test('user can update task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create([
        'title' => 'Original Title',
        'completed' => false,
    ]);

    $updateData = [
        'title' => 'Updated Title',
        'completed' => true,
    ];

    $response = $this
        ->actingAs($user)
        ->patch(route('tasks.update', $task), $updateData);

    $response->assertRedirect(route('tasks.index'));
    
    $task->refresh();
    expect($task->title)->toBe('Updated Title');
    expect($task->completed)->toBeTrue();
    expect($task->completed_at)->not->toBeNull();
});

test('user can delete their task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();

    $response = $this
        ->actingAs($user)
        ->delete(route('tasks.destroy', $task));

    $response->assertRedirect(route('tasks.index'));
    expect(Task::find($task->id))->toBeNull();
});

test('user cannot access other users tasks', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $task = Task::factory()->for($user2)->create();

    $response = $this
        ->actingAs($user1)
        ->get(route('tasks.show', $task));

    $response->assertStatus(403);
});

test('task filtering works', function () {
    $user = User::factory()->create();
    
    Task::factory()->for($user)->create([
        'title' => 'High Priority Task',
        'priority' => 'high',
        'completed' => false,
    ]);
    
    Task::factory()->for($user)->create([
        'title' => 'Low Priority Task',
        'priority' => 'low',
        'completed' => true,
    ]);

    // Test priority filter
    $response = $this
        ->actingAs($user)
        ->get(route('home', ['priority' => 'high']));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->has('tasks.data', 1)
             ->where('tasks.data.0.priority', 'high')
    );
});

test('unauthenticated user sees welcome page', function () {
    $response = $this->get(route('home'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('welcome'));
});

test('task validation works', function () {
    $user = User::factory()->create();

    // Test required fields
    $response = $this
        ->actingAs($user)
        ->post(route('tasks.store'), []);

    $response->assertSessionHasErrors(['title', 'priority']);
});