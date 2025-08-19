import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Task {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    category?: string;
    tags?: string[];
    due_date?: string;
    reminder_date?: string;
    completed_at?: string;
    created_at: string;
    updated_at: string;
}

interface PaginatedTasks {
    data: Task[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    tasks: PaginatedTasks;
    categories: string[];
    stats: {
        total: number;
        completed: number;
        pending: number;
        high_priority: number;
        due_today: number;
    };
    filters: {
        search?: string;
        priority?: string;
        category?: string;
        status?: string;
        due_filter?: string;
    };
    [key: string]: unknown;
}

export default function TasksIndex({ tasks, categories, stats, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (search: string) => {
        router.get(route('home'), { ...filters, search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleFilter = (key: string, value: string) => {
        const newFilters = { ...filters } as Record<string, string>;
        if (value) {
            newFilters[key] = value;
        } else {
            delete newFilters[key];
        }
        router.get(route('home'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const toggleTaskCompletion = (task: Task) => {
        router.patch(route('tasks.update', task.id), {
            completed: !task.completed,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
        const colors = {
            high: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
            medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
            low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Overdue';
        if (diffDays === 0) return 'Due today';
        if (diffDays === 1) return 'Due tomorrow';
        return `Due ${date.toLocaleDateString()}`;
    };

    const isOverdue = (dueDateString: string) => {
        const dueDate = new Date(dueDateString);
        const now = new Date();
        return dueDate < now;
    };

    return (
        <AppShell>
            <Head title="📝 My Tasks" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            📝 My Tasks
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Stay organized and productive
                        </p>
                    </div>
                    <Link href={route('tasks.create')}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            New Task
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <div className="text-2xl">📊</div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <div className="text-2xl">✅</div>
                                <div>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Done</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <div className="text-2xl">⏳</div>
                                <div>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.pending}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <div className="text-2xl">🔥</div>
                                <div>
                                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.high_priority}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">High Priority</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <div className="text-2xl">📅</div>
                                <div>
                                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.due_today}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Due Today</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="relative flex-1">
                                    <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <Input
                                        placeholder="Search tasks..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                                        className="pl-9"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSearch(searchTerm)}
                                >
                                    Search
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                                    </svg>
                                    Filters
                                </Button>
                            </div>

                            {showFilters && (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-4 border-t">
                                    <Select value={filters.status || ''} onValueChange={(value) => handleFilter('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All Status</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={filters.priority || ''} onValueChange={(value) => handleFilter('priority', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Priorities" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All Priorities</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={filters.category || ''} onValueChange={(value) => handleFilter('category', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All Categories</SelectItem>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>{category}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select value={filters.due_filter || ''} onValueChange={(value) => handleFilter('due_filter', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Due Dates" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All Due Dates</SelectItem>
                                            <SelectItem value="overdue">Overdue</SelectItem>
                                            <SelectItem value="due_today">Due Today</SelectItem>
                                            <SelectItem value="due_soon">Due Soon</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Task List */}
                <div className="space-y-3">
                    {tasks.data.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    No tasks found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    Get started by creating your first task!
                                </p>
                                <Link href={route('tasks.create')}>
                                    <Button>
                                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Create Task
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        tasks.data.map((task) => (
                            <Card
                                key={task.id}
                                className={`transition-all duration-200 hover:shadow-md ${
                                    task.completed ? 'opacity-60' : ''
                                }`}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex items-center mt-1">
                                            <button
                                                onClick={() => toggleTaskCompletion(task)}
                                                className="text-gray-400 hover:text-blue-500 transition-colors"
                                            >
                                                {task.completed ? (
                                                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className={`text-lg font-medium ${
                                                    task.completed 
                                                        ? 'line-through text-gray-500 dark:text-gray-400' 
                                                        : 'text-gray-900 dark:text-gray-100'
                                                }`}>
                                                    {task.title}
                                                </h3>
                                                <div className="flex items-center space-x-2 ml-4">
                                                    <Link href={route('tasks.edit', task.id)}>
                                                        <Button variant="ghost" size="sm">
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this task?')) {
                                                                router.delete(route('tasks.destroy', task.id));
                                                            }
                                                        }}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>

                                            {task.description && (
                                                <p className={`mt-1 text-sm ${
                                                    task.completed 
                                                        ? 'text-gray-400 dark:text-gray-500' 
                                                        : 'text-gray-600 dark:text-gray-300'
                                                }`}>
                                                    {task.description}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap items-center gap-2 mt-3">
                                                <Badge
                                                    variant="outline"
                                                    className={getPriorityColor(task.priority)}
                                                >
                                                    {task.priority === 'high' && '🔥 '}
                                                    {task.priority === 'medium' && '⚡ '}
                                                    {task.priority === 'low' && '🌱 '}
                                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                                </Badge>

                                                {task.category && (
                                                    <Badge variant="secondary">
                                                        📂 {task.category}
                                                    </Badge>
                                                )}

                                                {task.due_date && (
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            !task.completed && isOverdue(task.due_date)
                                                                ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                                : 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                                        }
                                                    >
                                                        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {formatDate(task.due_date)}
                                                    </Badge>
                                                )}

                                                {task.tags && task.tags.map((tag) => (
                                                    <Badge key={tag} variant="outline" className="text-xs">
                                                        🏷️ {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {tasks.last_page > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                        {Array.from({ length: tasks.last_page }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === tasks.current_page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => router.get(route('home'), { ...filters, page })}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
}