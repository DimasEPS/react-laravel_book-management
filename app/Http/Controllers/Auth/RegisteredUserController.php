<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Check if email was verified via OTP
        $otp = \App\Models\Otp::where('email', $request->email)
            ->where('is_verified', true)
            ->where('created_at', '>=', now()->subMinutes(10))
            ->first();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'email_verified_at' => $otp ? now() : null, // Mark as verified if OTP was validated
        ]);

        // Clean up the OTP record
        if ($otp) {
            $otp->delete();
        }

        event(new Registered($user));

        // Only auto-login if email was verified
        if ($user->email_verified_at) {
            Auth::login($user);
            return redirect(route('dashboard', absolute: false));
        }

        // If not verified, redirect to login with a message
        return redirect(route('login'))->with('status', 'Registration successful! Please login with your credentials.');
    }
}
