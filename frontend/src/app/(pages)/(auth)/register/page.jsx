"use client";

import { authAPI } from "@/lib/api/api";
import { registerFormSchema } from "@/validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";

const initialFormState = {
    name: "",
    email: "",
    password: "",
};

export default function RegisterPage() {
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerFormSchema),
        defaultValues: initialFormState,
    });


    const registerMutation = useMutation({
        mutationFn: authAPI.register,
        onSuccess: () => {
            setSuccessMessage("Account created successfully!");
            reset(initialFormState);
            router.push("/dashboard/services");
        },
        onError: () => {
            setSuccessMessage("");
        },
    });

    const onSubmit = (data) => {
        setSuccessMessage("");
        registerMutation.mutate({
            name: data.name.trim(),
            email: data.email.trim(),
            password: data.password,
        });
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-page px-4 py-10">
            {/* Subtle grid pattern instead of gradients */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-12 opacity-20">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="border-r border-border" />
                ))}
            </div>

            <section className="relative z-10 w-full max-w-md border border-border bg-surface-1">
                {/* Header with dashed border */}
                <div className="border-b border-border p-7">
                    <div className="inline-flex items-center gap-2 border border-border bg-surface-2 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-primary">
                        Create account
                    </div>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-heading">
                        Register to Spectrix
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
                                Full name
                            </label>
                            <input
                                type="text"
                                {...register("name")}
                                placeholder="Jane Doe"
                                className="w-full border border-border bg-surface-2 px-4 py-3 text-sm text-heading outline-none transition focus:border-primary focus:bg-surface-2"
                            />
                            {errors.name ? (
                                <p className="text-xs text-red-400">{errors.name.message}</p>
                            ) : null}
                        </div>

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
                                placeholder="At least 6 characters"
                                className="w-full border border-border bg-surface-2 px-4 py-3 text-sm text-heading outline-none transition focus:border-primary focus:bg-surface-2"
                            />
                            {errors.password ? (
                                <p className="text-xs text-red-400">{errors.password.message}</p>
                            ) : null}
                        </div>

                        {registerMutation.isError && (
                            <div className="border border-red-500/40 bg-red-500/5 px-3 py-2">
                                <p className="text-sm text-red-400">
                                    {registerMutation.error?.response?.data?.message ||
                                        "Could not register. Please try again."}
                                </p>
                            </div>
                        )}

                        {successMessage && (
                            <div className="border border-primary/40 bg-primary-soft px-3 py-2">
                                <p className="text-sm text-primary">
                                    {successMessage}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={registerMutation.isPending}
                            className="mt-4 w-full border border-border bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {registerMutation.isPending ? "Creating account..." : "Register"}
                        </button>
                    </form>

                    <div className="mt-6 border-t border-border pt-6 text-center">
                        <p className="text-sm text-muted">
                            Already have an account?{" "}
                            <Link
                                className="font-medium text-primary transition-colors hover:text-primary-strong"
                                href="/login"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}