import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Register() {
    const [step, setStep] = useState(1); // 1: registration form, 2: OTP verification
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        otp_code: "",
    });

    const sendOtpForVerification = async (e) => {
        e.preventDefault();

        // Validate form first
        if (
            !data.name ||
            !data.email ||
            !data.password ||
            data.password !== data.password_confirmation
        ) {
            setError("Please fill all required fields correctly");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                },
                body: JSON.stringify({ email: data.email }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to send verification code"
                );
            }

            setSuccess(result.message);
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const verifyOtpAndRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // First verify the OTP
            const otpResponse = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                },
                body: JSON.stringify({
                    email: data.email,
                    otp_code: data.otp_code,
                }),
            });

            const otpResult = await otpResponse.json();

            if (!otpResponse.ok) {
                throw new Error(
                    otpResult.message || "Invalid verification code"
                );
            }

            // If OTP is valid, proceed with registration
            post(route("register"), {
                onSuccess: () => {
                    setSuccess(
                        "Registration successful! Redirecting to login..."
                    );
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 2000);
                },
                onError: (errors) => {
                    setError("Registration failed. Please try again.");
                    setStep(1);
                },
                onFinish: () => setLoading(false),
            });
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleBackToForm = () => {
        setStep(1);
        setData("otp_code", "");
        setError("");
        setSuccess("");
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            {error && (
                <div className="mb-4 text-sm font-medium text-red-600 bg-red-100 border border-red-400 rounded px-4 py-3">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-100 border border-green-400 rounded px-4 py-3">
                    {success}
                </div>
            )}

            {step === 1 ? (
                <form onSubmit={sendOtpForVerification}>
                    <div>
                        <InputLabel htmlFor="name" value="Name" />

                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />

                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Email" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                        />

                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                        <Link
                            href={route("login")}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Already registered?
                        </Link>

                        <PrimaryButton className="ms-4" disabled={loading}>
                            {loading
                                ? "Sending verification code..."
                                : "Send Verification Code"}
                        </PrimaryButton>
                    </div>
                </form>
            ) : (
                <form onSubmit={verifyOtpAndRegister}>
                    <div className="text-center mb-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            Verify Your Email
                        </h2>
                        <p className="text-sm text-gray-600 mt-2">
                            Enter the verification code sent to{" "}
                            <strong>{data.email}</strong>
                        </p>
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="otp_code"
                            value="Verification Code"
                        />

                        <TextInput
                            id="otp_code"
                            type="text"
                            name="otp_code"
                            value={data.otp_code}
                            className="mt-1 block w-full text-center text-2xl tracking-widest"
                            maxLength="6"
                            isFocused={true}
                            onChange={(e) =>
                                setData(
                                    "otp_code",
                                    e.target.value.replace(/\D/g, "")
                                )
                            }
                            placeholder="000000"
                            required
                        />
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleBackToForm}
                            className="text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            ← Back to Form
                        </button>

                        <PrimaryButton
                            disabled={loading || data.otp_code.length !== 6}
                        >
                            {loading ? "Verifying..." : "Complete Registration"}
                        </PrimaryButton>
                    </div>
                </form>
            )}
        </GuestLayout>
    );
}
