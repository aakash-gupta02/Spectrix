import type { CookieOptions, Response } from "express";
import { env } from "../config/env.js";

const expiresInToMs = (expiresIn: string): number => {
    if (/^\d+$/.test(expiresIn)) {
        return Number(expiresIn) * 1000;
    }

    const match = expiresIn.match(/^(\d+)([smhdw])$/i);
    if (!match) {
        return 24 * 60 * 60 * 1000;
    }

    const value = Number(match[1]);
    const unit = match[2].toLowerCase();

    const unitToMs: Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
        w: 7 * 24 * 60 * 60 * 1000,
    };

    return value * unitToMs[unit];
};

export const setCookie = (
    res: Response,
    name: string,
    value: string,
    options: CookieOptions = {}
): void => {
    const defaultOptions: CookieOptions = {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: expiresInToMs(env.JWT_ACCESS_EXPIRES_IN),
    };

    const cookieOptions: CookieOptions = { ...defaultOptions, ...options };
    res.cookie(name, value, cookieOptions);
};

export const clearCookie = (
    res: Response,
    name: string,
    options: CookieOptions = {}
): void => {
    const defaultOptions: CookieOptions = {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    };

    const cookieOptions: CookieOptions = { ...defaultOptions, ...options };
    res.clearCookie(name, cookieOptions);
};