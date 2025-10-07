<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\OtpController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/send-otp', [OtpController::class, 'sendOtp']);
Route::post('/auth/verify-otp', [OtpController::class, 'verifyOtp']);

// book routes

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('books', BookController::class);
});