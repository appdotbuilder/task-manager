<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Task::where('user_id', auth()->id())
            ->with('user')
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($request->filled('priority')) {
            $query->priority($request->input('priority'));
        }

        if ($request->filled('category')) {
            $query->category($request->input('category'));
        }

        if ($request->filled('status')) {
            $status = $request->input('status');
            if ($status === 'completed') {
                $query->completed();
            } elseif ($status === 'pending') {
                $query->pending();
            }
        }

        if ($request->filled('due_filter')) {
            $dueFilter = $request->input('due_filter');
            if ($dueFilter === 'overdue') {
                $query->where('due_date', '<', now())
                      ->where('completed', false);
            } elseif ($dueFilter === 'due_today') {
                $query->whereDate('due_date', today())
                      ->where('completed', false);
            } elseif ($dueFilter === 'due_soon') {
                $query->dueSoon()
                      ->where('completed', false);
            }
        }

        $tasks = $query->paginate(20);

        // Get filter options
        $categories = Task::where('user_id', auth()->id())
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        $stats = [
            'total' => Task::where('user_id', auth()->id())->count(),
            'completed' => Task::where('user_id', auth()->id())->completed()->count(),
            'pending' => Task::where('user_id', auth()->id())->pending()->count(),
            'high_priority' => Task::where('user_id', auth()->id())->priority('high')->pending()->count(),
            'due_today' => Task::where('user_id', auth()->id())
                ->whereDate('due_date', today())
                ->pending()
                ->count(),
        ];

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'categories' => $categories,
            'stats' => $stats,
            'filters' => $request->only(['search', 'priority', 'category', 'status', 'due_filter']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Task::where('user_id', auth()->id())
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return Inertia::render('tasks/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $task = auth()->user()->tasks()->create($request->validated());

        return redirect()->route('tasks.index')
            ->with('success', 'Task created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        if ($task->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('tasks/show', [
            'task' => $task->load('user'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        if ($task->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $categories = Task::where('user_id', auth()->id())
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return Inertia::render('tasks/edit', [
            'task' => $task,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $data = $request->validated();
        
        // Handle completion
        if (isset($data['completed'])) {
            $data['completed_at'] = $data['completed'] ? now() : null;
        }

        $task->update($data);

        return redirect()->route('tasks.index')
            ->with('success', 'Task updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        if ($task->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $task->delete();

        return redirect()->route('tasks.index')
            ->with('success', 'Task deleted successfully!');
    }
}