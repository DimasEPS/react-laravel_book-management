<?php

namespace App\Http\Controllers;

use App\Models\Otp;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class OtpController extends Controller
{
    /**
     * send Otp for email verification
     */
    public function sendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Check if email is already taken
        if (User::where('email', $request->email)->exists()) {
            return response()->json(['message' => 'Email is already registered.'], 422);
        }

        // Delete any existing OTP for this email
        Otp::where('email', $request->email)->delete();

        $otp = rand(100000, 999999);
        Otp::create([
            'email' => $request->email,
            'otp_code' => $otp,
            'expires_at' => now()->addMinutes(10),
            'is_verified' => false,
        ]);

        try {
            Mail::raw("Your email verification code is: {$otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.", function ($message) use ($request) {
                $message->to($request->email)
                    ->subject('Email Verification Code - Book Management')
                    ->from(config('mail.from.address'), config('mail.from.name'));
            });

            // Log the OTP for development (since we're using log driver)
            Log::info("OTP sent to {$request->email}: {$otp}");

            return response()->json([
                'message' => 'Verification code sent to your email.',
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to send OTP to {$request->email}: " . $e->getMessage());
            return response()->json(['message' => 'Failed to send verification code. Please try again.'], 500);
        }
    }

    /**
     * Verify Otp for email verification
     */
    public function verifyOtp(Request $request)
    {
        $request->validate(['email' => 'required|email', 'otp_code' => 'required|digits:6']);

        $otp = Otp::where('email', $request->email)
            ->where('otp_code', $request->otp_code)
            ->where('expires_at', '>', now())
            ->first();

        if (!$otp) {
            return response()->json(['message' => 'Invalid or expired verification code.'], 401);
        }

        // Mark OTP as verified (don't delete yet, we'll delete after registration)
        $otp->update(['is_verified' => true]);

        return response()->json([
            'message' => 'Email verified successfully. You can now complete registration.',
            'verified' => true,
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
        ]);

        $user = $request->user();
        
        if ($request->has('name')) {
            $user->name = $request->name;
            $user->save();
        }

        return response()->json([
            'message' => 'Profil berhasil diperbarui.',
            'user' => $user,
        ]);
    }
}
