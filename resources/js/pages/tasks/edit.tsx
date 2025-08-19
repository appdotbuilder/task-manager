import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';

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



interface Props {
    task: Task;
    categories: string[];
    [key: string]: unknown;
}

export default function EditTask({ task, categories }: Props) {
    const [tagInput, setTagInput] = useState('');
    
    const form = useForm({
        title: task.title,
        description: task.description || '',
        completed: task.completed,
        priority: task.priority as 'low' | 'medium' | 'high',
        category: task.category || '',
        tags: (task.tags || []) as string[],
        due_date: task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
        reminder_date: task.reminder_date ? new Date(task.reminder_date).toISOString().slice(0, 16) : '',
    });
    
    const { data, setData, patch, processing, errors } = form;

    const addTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !data.tags.includes(trimmedTag)) {
            setData('tags', [...data.tags, trimmedTag]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setData('tags', data.tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('tasks.update', task.id));
    };

    const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <AppShell>
            <Head title={`✏️ Edit: ${task.title}`} />
            
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Link href={route('home')}>
                        <Button variant="outline" size="sm">
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Tasks
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            ✏️ Edit Task
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Update your task details
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Task Details
                            {task.completed && (
                                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900/20 dark:text-green-400">
                                    ✅ Completed
                                </span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Completion Status */}
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg dark:bg-gray-900/50">
                                <input
                                    id="completed"
                                    type="checkbox"
                                    checked={data.completed}
                                    onChange={(e) => setData('completed', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <Label htmlFor="completed" className="text-sm font-medium">
                                    {data.completed ? '✅ Mark as incomplete' : '☐ Mark as complete'}
                                </Label>
                            </div>

                            {/* Title */}
                            <div>
                                <Label htmlFor="title">Task Title *</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="mt-1"
                                    placeholder="What needs to be done?"
                                    required
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            {/* Description */}
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1"
                                    placeholder="Add more details about this task..."
                                    rows={4}
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            {/* Priority and Category Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Priority *</Label>
                                    <Select value={data.priority} onValueChange={(value) => setData('priority', value as 'low' | 'medium' | 'high')}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">🌱 Low Priority</SelectItem>
                                            <SelectItem value="medium">⚡ Medium Priority</SelectItem>
                                            <SelectItem value="high">🔥 High Priority</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.priority} className="mt-2" />
                                </div>

                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <div className="mt-1 space-y-2">
                                        {categories.length > 0 ? (
                                            <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select or create category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">No Category</SelectItem>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category} value={category}>
                                                            📂 {category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : null}
                                        <Input
                                            type="text"
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            placeholder={categories.length > 0 ? "Or create new category" : "Enter category name"}
                                        />
                                    </div>
                                    <InputError message={errors.category} className="mt-2" />
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <Label>Tags</Label>
                                <div className="mt-1 space-y-3">
                                    <div className="flex space-x-2">
                                        <Input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={handleTagKeyPress}
                                            placeholder="Add a tag and press Enter"
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            onClick={addTag}
                                            variant="outline"
                                            size="sm"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </Button>
                                    </div>
                                    
                                    {data.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {data.tags.map((tag) => (
                                                <div
                                                    key={tag}
                                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/20 dark:text-blue-400"
                                                >
                                                    🏷️ {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <InputError message={errors.tags} className="mt-2" />
                            </div>

                            {/* Due Date and Reminder */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="due_date">Due Date</Label>
                                    <Input
                                        id="due_date"
                                        type="datetime-local"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="mt-1"
                                    />
                                    <InputError message={errors.due_date} className="mt-2" />
                                </div>

                                <div>
                                    <Label htmlFor="reminder_date">Reminder</Label>
                                    <Input
                                        id="reminder_date"
                                        type="datetime-local"
                                        value={data.reminder_date}
                                        onChange={(e) => setData('reminder_date', e.target.value)}
                                        className="mt-1"
                                        max={data.due_date || undefined}
                                    />
                                    <InputError message={errors.reminder_date} className="mt-2" />
                                    {data.due_date && (
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Reminder must be before due date
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                                <Link href={route('home')}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Update Task
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Task Info */}
                <Card>
                    <CardContent className="p-4">
                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                            <div>Created: {new Date(task.created_at).toLocaleString()}</div>
                            <div>Last updated: {new Date(task.updated_at).toLocaleString()}</div>
                            {task.completed_at && (
                                <div>Completed: {new Date(task.completed_at).toLocaleString()}</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}