"use client";

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
