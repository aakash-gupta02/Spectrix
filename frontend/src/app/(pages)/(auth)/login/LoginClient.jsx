"use client";

import { baseUrl } from "@/lib/api/client";
import { authAPI } from "@/lib/api/api";
import { useAuth } from "@/contexts/AuthContext";
import { loginFormSchema } from "@/validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";

const initialFormState = {
  email: "",
  password: "",
};

export default function LoginClient({
  autoFillDemo = false,
  loginDemoFlag = false,
}) {
  const [successMessage, setSuccessMessage] = useState("");
  const hasTriggeredDemoLogin = useRef(false);
  const demoLoginTimerRef = useRef(null);
  const router = useRouter();
  const { applyLoginResponse } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: initialFormState,
  });

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      const payload = applyLoginResponse(data);
      setSuccessMessage(
        payload?.message || "Login successful. Redirecting to dashboard...",
      );
      reset(initialFormState);
      router.push("/dashboard");
    },
    onError: () => {
      setSuccessMessage("");
    },
  });

  const onSubmit = useCallback(
    (data) => {
      setSuccessMessage("");
      loginMutation.mutate({
        email: data.email.trim(),
        password: data.password,
      });
    },
    [loginMutation],
  );

  const demoFormFill = useCallback(() => {
    setValue("email", "spectrixdemo@gmail.com");
    setValue("password", "spectruxdemo");
  }, [setValue]);

  // Effect to handle auto-filling and auto-submitting demo credentials based on props
  useEffect(() => {
    if (autoFillDemo) {
      demoFormFill();
    }

    if (!loginDemoFlag || hasTriggeredDemoLogin.current) return;

    demoFormFill();

    if (demoLoginTimerRef.current) {
      clearTimeout(demoLoginTimerRef.current);
    }

    demoLoginTimerRef.current = setTimeout(() => {
      hasTriggeredDemoLogin.current = true;
      demoLoginTimerRef.current = null;
      handleSubmit(onSubmit)();
    }, 500); // Delay to allow form to update before submission

    return () => {
      if (demoLoginTimerRef.current) {
        clearTimeout(demoLoginTimerRef.current);
        demoLoginTimerRef.current = null;
      }
    };
  }, [autoFillDemo, loginDemoFlag, demoFormFill, handleSubmit, onSubmit]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-page px-4 py-10">
      {/* Subtle grid pattern */}
      <div className="pointer-events-none absolute inset-0 grid grid-cols-12 opacity-20">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="border-r border-border" />
        ))}
      </div>

      <section className="relative z-10 w-full max-w-md border border-border bg-surface-1">
        {/* Header with dashed border */}
        <div className="border-b border-border p-7">
          <div className="inline-flex items-center gap-2 border border-border bg-surface-2 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-primary">
            Welcome back
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-heading">
            Login to Spectrix
          </h1>
          <p className="mt-2 text-sm text-body">
            Monitor your APIs in one place and catch issues before users do.
          </p>
        </div>

        {/* Form Section */}
        <div className="p-7">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-muted">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="you@example.com"
                className="w-full border border-border bg-surface-2 px-4 py-3 text-sm text-heading outline-none transition focus:border-primary focus:bg-surface-2"
              />
              {errors.email ? (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-muted">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="Enter your password"
                className="w-full border border-border bg-surface-2 px-4 py-3 text-sm text-heading outline-none transition focus:border-primary focus:bg-surface-2"
              />
              {errors.password ? (
                <p className="text-xs text-red-400">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            {loginMutation.isError && (
              <div className="border border-red-500/40 bg-red-500/5 px-3 py-2">
                <p className="text-sm text-red-400">
                  {loginMutation.error?.response?.data?.message ||
                    "Could not login. Please try again."}
                </p>
              </div>
            )}

            {successMessage && (
              <div className="border border-primary/40 bg-primary-soft px-3 py-2">
                <p className="text-sm text-primary">{successMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="mt-4 w-full border border-border bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface-1 px-2 text-muted uppercase">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.location.href = `${baseUrl}/auth/google`}
            className="mt-6 w-full flex items-center justify-center gap-2 border border-border bg-surface-2 px-4 py-3 text-sm font-semibold text-heading transition hover:bg-surface-3"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <div className="mt-6 border-t border-border pt-6 text-center">
            <p className="text-sm text-muted">
              Don&apos;t have an account?{" "}
              <Link
                className="font-medium text-primary transition-colors hover:text-primary-strong"
                href="/register"
              >
                Register
              </Link>{" "}
              or try{" "}
              <span
                className="font-medium text-primary transition-colors hover:text-primary-strong cursor-pointer"
                onClick={demoFormFill}
              >
                Demo Account
              </span>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
