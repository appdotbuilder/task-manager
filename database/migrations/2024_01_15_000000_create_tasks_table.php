<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->boolean('completed')->default(false);
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->string('category')->nullable();
            $table->json('tags')->nullable();
            $table->datetime('due_date')->nullable();
            $table->datetime('reminder_date')->nullable();
            $table->datetime('completed_at')->nullable();
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['user_id', 'completed']);
            $table->index(['user_id', 'priority']);
            $table->index(['user_id', 'due_date']);
            $table->index(['user_id', 'category']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};