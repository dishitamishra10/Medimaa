"use client";

import Link from 'next/link';
import { submitUserSignUp } from '../../actions/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function SignupForm() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.target); // 👈 Grab all form fields

        const password = formData.get('password');
        const confirmPassword = formData.get('confirm-password');

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            alert(
                "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character."
            );
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            alert("Password and Confirm Password should be the same");
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            alert("Password must be at least 8 characters long");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            alert("Password and Confirm Password must be the same");
            setLoading(false);
            return;
        }

        try {
            await submitUserSignUp(formData);
            router.push('/check-email');
        }
        catch (error) {
            setError(error.mesaage);
        }
        finally {
            setLoading(false);
        }
    }


    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-sm dark:shadow-black/30">
                {/* Header */}
                <div className="flex flex-col items-center gap-1.5 p-6 text-center">
                    <h2 className="text-xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-gray-100">
                        Create your account
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enter your email below to create your account
                    </p>
                </div>

                {/* Body */}
                <div className="p-6 pt-0">
                    {error && (
                        <p className="text-red-500 dark:text-red-400 text-sm mb-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4">

                            {/* Full Name */}
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                    Full Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    required
                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-800
            px-3.5 py-2.5
            text-sm text-gray-900 dark:text-gray-100
            outline-none
            placeholder:text-gray-300 dark:placeholder:text-gray-600
            transition-all duration-150
            focus:border-gray-400 dark:focus:border-teal-500
            focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]
            dark:focus:shadow-[0_0_0_3px_rgba(45,168,168,0.15)]"
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="m@example.com"
                                    required
                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-800
            px-3.5 py-2.5
            text-sm text-gray-900 dark:text-gray-100
            outline-none
            placeholder:text-gray-300 dark:placeholder:text-gray-600
            transition-all duration-150
            focus:border-gray-400 dark:focus:border-teal-500
            focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]
            dark:focus:shadow-[0_0_0_3px_rgba(45,168,168,0.15)]"
                                />
                            </div>

                            {/* Password row */}
                            <div className="flex flex-col gap-1.5">
                                <div className="grid grid-cols-2 gap-4">

                                    {/* Password */}
                                    <div className="flex flex-col gap-1.5">
                                        <label
                                            htmlFor="password"
                                            className="text-sm font-medium text-gray-900 dark:text-gray-300"
                                        >
                                            Password
                                        </label>

                                        <div className="relative">
                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="••••••••"
                                                required
                                                className="w-full rounded-lg border border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-800
            px-3.5 py-2.5 pr-10
            text-sm text-gray-900 dark:text-gray-100
            outline-none
            placeholder:text-gray-300 dark:placeholder:text-gray-600
            transition-all duration-150
            focus:border-gray-400 dark:focus:border-teal-500
            focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]
            dark:focus:shadow-[0_0_0_3px_rgba(45,168,168,0.15)]"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:cursor-pointer"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="flex flex-col gap-1.5">
                                        <label
                                            htmlFor="confirm-password"
                                            className="text-sm font-medium text-gray-900 dark:text-gray-300"
                                        >
                                            Confirm Password
                                        </label>

                                        <div className="relative">
                                            <input
                                                id="confirm-password"
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirm-password"
                                                placeholder="••••••••"
                                                required
                                                className="w-full rounded-lg border border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-800
            px-3.5 py-2.5 pr-10
            text-sm text-gray-900 dark:text-gray-100
            outline-none
            placeholder:text-gray-300 dark:placeholder:text-gray-600
            transition-all duration-150
            focus:border-gray-400 dark:focus:border-teal-500
            focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]
            dark:focus:shadow-[0_0_0_3px_rgba(45,168,168,0.15)]"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:cursor-pointer"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                </div> {/* ✅ grid closes here */}

                                {/* ✅ Hint moved outside grid, still inside password row wrapper */}
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                    Must be at least 8 characters and include uppercase, lowercase, number, and special character.
                                </p>
                            </div> {/* ✅ Password row closes here */}

                            {/* Submit */}
                            <div className="flex flex-col gap-3 pt-1">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-lg
            bg-gray-900
            dark:bg-gradient-to-r
            dark:from-teal-600
            dark:to-blue-600
            dark:hover:from-teal-500
            dark:hover:to-blue-500
            px-4 py-2.5
            text-sm font-medium text-white
            transition-all duration-150
            hover:opacity-85
            active:scale-[0.98]
            cursor-pointer
            disabled:opacity-50"
                                >
                                    {loading ? "Creating account..." : "Create Account"}
                                </button>

                                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                                    Already have an account?{" "}
                                    <Link
                                        href="/signin"
                                        className="text-gray-900 dark:text-teal-400 underline underline-offset-[3px] hover:dark:text-teal-300"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div> {/* ✅ Submit block closes here */}

                        </div> {/* ✅ flex flex-col gap-4 closes here */}
                    </form>
                </div> {/* ✅ Body closes here */}
            </div>

            {/* Footer */}
            <p className="px-6 text-center text-xs text-gray-400 dark:text-gray-500">
                By clicking continue, you agree to our{" "}
                <Link
                    href="#"
                    className="text-gray-700 dark:text-gray-300 underline underline-offset-[3px]"
                >
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                    href="#"
                    className="text-gray-700 dark:text-gray-300 underline underline-offset-[3px]"
                >
                    Privacy Policy
                </Link>.
            </p>
        </div>
    );
}