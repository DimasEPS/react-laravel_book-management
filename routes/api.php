<?php

use App\Http\Controllers\OtpController;
use App\Http\Controllers\Auth\CustomAuthController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/send-otp', [OtpController::class, 'sendOtp']);
Route::post('/auth/verify-otp', [OtpController::class, 'verifyOtp']);

// Login API endpoint for enhanced authentication
Route::post('/auth/login', [CustomAuthController::class, 'login']);

// Protected routes (using session authentication for Inertia)
Route::middleware(['auth:web', 'web'])->group(function () {
    Route::put('/user/update-profile', [OtpController::class, 'updateProfile']);
});