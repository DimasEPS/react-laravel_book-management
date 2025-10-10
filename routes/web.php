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
    
    // AJAX routes for book management (with CSRF protection)
    Route::get('/ajax/books', [WebBookController::class, 'index'])->name('ajax.books.index');
    Route::post('/ajax/books', [WebBookController::class, 'store'])->name('ajax.books.store');
    Route::get('/ajax/books/{book}', [WebBookController::class, 'show'])->name('ajax.books.show');
    Route::put('/ajax/books/{book}', [WebBookController::class, 'update'])->name('ajax.books.update');
    Route::delete('/ajax/books/{book}', [WebBookController::class, 'destroy'])->name('ajax.books.destroy');
});

// Include original Breeze auth routes for traditional email/password authentication
require __DIR__.'/auth.php';
