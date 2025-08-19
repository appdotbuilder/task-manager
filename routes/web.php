<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Welcome page for unauthenticated users, tasks for authenticated
Route::get('/', function () {
    if (auth()->check()) {
        return app(TaskController::class)->index(request());
    }
    return Inertia::render('welcome');
})->name('home');

// Alternative welcome route
Route::get('/welcome', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Task management routes
    Route::resource('tasks', TaskController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
