import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-6xl lg:flex-row lg:items-center lg:gap-12">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-center lg:text-left shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <div className="mb-6">
                                <div className="text-6xl mb-4">📝</div>
                                <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                                    Smart To-Do App
                                </h1>
                                <p className="mb-8 text-xl text-[#706f6c] dark:text-[#A1A09A]">
                                    Stay organized, productive, and never miss a deadline again!
                                </p>
                            </div>

                            <div className="grid gap-4 mb-8 text-left">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">✅</div>
                                    <div>
                                        <h3 className="font-semibold">Task Management</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Create, edit, and organize your tasks with ease</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">🏷️</div>
                                    <div>
                                        <h3 className="font-semibold">Smart Organization</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Priorities, categories, tags, and due dates</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">🔍</div>
                                    <div>
                                        <h3 className="font-semibold">Advanced Search</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Find tasks instantly with powerful filters</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">⏰</div>
                                    <div>
                                        <h3 className="font-semibold">Smart Reminders</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Never miss a deadline with custom reminders</p>
                                    </div>
                                </div>
                            </div>

                            {!auth.user ? (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                    >
                                        Get Started Free
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center justify-center rounded-md border border-gray-300 px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex justify-center lg:justify-start">
                                    <Link
                                        href={route('home')}
                                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                    >
                                        Go to My Tasks
                                    </Link>
                                </div>
                            )}

                            <footer className="mt-12 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                Built with ❤️ by{" "}
                                <a 
                                    href="https://app.build" 
                                    target="_blank" 
                                    className="font-medium text-[#f53003] hover:underline dark:text-[#FF4433]"
                                >
                                    app.build
                                </a>
                            </footer>
                        </div>
                        
                        {/* Demo Preview */}
                        <div className="flex-1 mb-6 lg:mb-0">
                            <div className="relative mx-auto max-w-md">
                                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📝 My Tasks</h3>
                                        <div className="flex space-x-1">
                                            <div className="h-3 w-3 rounded-full bg-red-400"></div>
                                            <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                                            <div className="h-3 w-3 rounded-full bg-green-400"></div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 rounded-md bg-gray-50 p-3 dark:bg-gray-700">
                                            <div className="h-4 w-4 rounded border-2 border-blue-500 bg-blue-500"></div>
                                            <div className="flex-1">
                                                <div className="text-sm line-through text-gray-500">Review project proposal</div>
                                                <div className="flex space-x-2 text-xs">
                                                    <span className="rounded bg-green-100 px-2 py-0.5 text-green-800">🔥 High</span>
                                                    <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-800">📂 Work</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-3 rounded-md bg-gray-50 p-3 dark:bg-gray-700">
                                            <div className="h-4 w-4 rounded border-2 border-gray-300"></div>
                                            <div className="flex-1">
                                                <div className="text-sm text-gray-900 dark:text-white">Buy groceries for dinner</div>
                                                <div className="flex space-x-2 text-xs">
                                                    <span className="rounded bg-yellow-100 px-2 py-0.5 text-yellow-800">⚡ Medium</span>
                                                    <span className="rounded bg-purple-100 px-2 py-0.5 text-purple-800">📅 Due today</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-3 rounded-md bg-gray-50 p-3 dark:bg-gray-700">
                                            <div className="h-4 w-4 rounded border-2 border-gray-300"></div>
                                            <div className="flex-1">
                                                <div className="text-sm text-gray-900 dark:text-white">Learn new React hooks</div>
                                                <div className="flex space-x-2 text-xs">
                                                    <span className="rounded bg-green-100 px-2 py-0.5 text-green-800">🌱 Low</span>
                                                    <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-800">🏷️ learning</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 text-center">
                                        <div className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm text-white">
                                            + Add New Task
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
