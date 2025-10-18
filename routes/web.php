<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WebBookController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Authenticated Routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Book Management Dashboard
    Route::get('/books', function () {
        return Inertia::render('BookManagement', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    })->name('books.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // API routes for book management (with CSRF protection)
    Route::get('/api/books', [WebBookController::class, 'index'])->name('api.books.index');
    Route::post('/api/books', [WebBookController::class, 'store'])->name('api.books.store');
    Route::get('/api/books/{book}', [WebBookController::class, 'show'])->name('api.books.show');
    Route::put('/api/books/{book}', [WebBookController::class, 'update'])->name('api.books.update');
    Route::delete('/api/books/{book}', [WebBookController::class, 'destroy'])->name('api.books.destroy');
});

// Include original Breeze auth routes for traditional email/password authentication
require __DIR__.'/auth.php';
