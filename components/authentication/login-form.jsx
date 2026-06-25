"use client";

import Link from 'next/link';
import {
  submitUserLogin,
  loginGoogle,
} from '../../actions/actions';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import { useSearchParams } from 'next/navigation';



export function LoginForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { uid, isLoggedIn } = useAuth();

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if(uid && isLoggedIn){
      router.push(redirect || 'dashboard');
    }
  }, [uid, isLoggedIn, router])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.target); // 👈 Grab all form fields

    try {
      await submitUserLogin(formData);
      router.push('/dashboard');
    }
    catch (error) {
      setError(error.mesaage);
    }
    finally {
      setLoading(false);
    }
  }

  const siginGoogle = async (e) => {
    await loginGoogle();
  }

  return (
    <div>
      {!uid &&
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 rounded-2xl px-8 py-10 w-full max-w-sm mx-auto shadow-sm dark:shadow-black/30">
          <p className="font-sans text-[11px] font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-3">
            Welcome back
          </p>
          <h1
            className="text-[28px] font-normal text-gray-900 dark:text-gray-100 mb-2 leading-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Login to your account
          </h1>
          {/* <p className="font-sans text-[13px] text-gray-500 dark:text-gray-400 mb-8">
            Enter your email below to continue
          </p> */}

          {/* Show error if any */}
          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm mb-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5 mb-5">
              <label className="font-sans text-[13px] font-medium text-gray-900 dark:text-gray-300" htmlFor="email">
                Email
              </label>
              <input
                className="font-sans text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-2.5 outline-none w-full transition-all duration-150 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-gray-400 dark:focus:border-teal-500 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] dark:focus:shadow-[0_0_0_3px_rgba(45,168,168,0.15)]"
                id="email" type="email" name="email" placeholder="m@example.com" required
              />
            </div>

            <div className="flex flex-col gap-1.5 mb-5">
              <div className="flex items-center justify-between">
                <label
                  className="font-sans text-[13px] font-medium text-gray-900 dark:text-gray-300"
                  htmlFor="password"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="font-sans text-xs text-gray-500 dark:text-gray-400 border-b border-gray-300 dark:border-gray-600 pb-px no-underline hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-150"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  className="font-sans text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-2.5 pr-10 outline-none w-full transition-all duration-150 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-gray-400 dark:focus:border-teal-500 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] dark:focus:shadow-[0_0_0_3px_rgba(45,168,168,0.15)]"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="font-sans text-sm font-medium text-white bg-gray-900 dark:bg-gradient-to-r dark:from-teal-600 dark:to-blue-600 dark:hover:from-teal-500 dark:hover:to-blue-500 border-none rounded-lg py-3 w-full cursor-pointer mt-2 transition-all duration-150 hover:opacity-85 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="flex items-center gap-2.5 my-6">
              <span className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
              <span className="font-sans text-xs text-gray-300 dark:text-gray-600">or</span>
              <span className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
            </div>

            <button
              onClick={siginGoogle}
              type="button"
              className="font-sans text-sm text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-3 w-full cursor-pointer flex items-center justify-center gap-2 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Login with Google
            </button>
          </form>

          <p className="font-sans text-[13px] text-gray-500 dark:text-gray-400 text-center mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-gray-900 dark:text-teal-400 underline underline-offset-[3px] hover:dark:text-teal-300">Sign up</Link>
          </p>
        </div>
      }
    </div>
  );
}