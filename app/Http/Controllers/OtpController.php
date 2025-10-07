<?php

namespace App\Http\Controllers;

use App\Models\Otp;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;

class OtpController extends Controller
{
    /**
     * send Otp
     */
    public function sendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $otp = rand(100000, 999999);
        Otp::create([
            'email' => $request->email,
            'otp_code' => $otp,
            'expires_at' => now()->addMinutes(10),
        ]);

        Mail::raw("Kode OTP anda adalah: $otp", function ($message) use ($request) {
            $message->to($request->email)->subject('Kode OTP Anda');
        });

        return response()->json(['message' => 'OTP telah dikirim ke email Anda.']);
    }

    /**
     * Verify Otp
     */
    public function verifyOtp(Request $request)
    {
        $request->validate(['email' => 'required|email', 'otp_code' => 'required|digits:6']);

        $otp = Otp::where('email', $request->email)
            ->where('otp_code', $request->otp_code)
            ->where('expires_at', '>', now())
            ->first();


        if (!$otp) return response()->json(['message' => 'Kode OTP tidak valid atau telah kedaluwarsa.'], 401);

        $user = User::firstOrCreate(['email' => $request->email]);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'OTP berhasil diverifikasi.',
            'token' => $token,
            'user' => $user,
        ]);
    }
}
