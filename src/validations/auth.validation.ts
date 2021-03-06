import { z } from "zod";
import isJWT from "validator/lib/isJWT";
import { isPasswordStrongEnough } from "./password.validation";

export const register = z.object({
  body: z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .max(300)
      .refine(async (val) => isPasswordStrongEnough(val)),
  }),
});

export const login = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(300),
  }),
});

export const logout = z.object({
  cookies: z.object({
    refreshCookie: z.string().refine((val) => isJWT(val), {
      message: "Refresh token is not a valid JWT.",
    }),
  }),
});

export const refreshTokens = z.object({
  cookies: z.object({
    refreshCookie: z.string().refine((val) => isJWT(val), {
      message: "Refresh token is not a valid JWT.",
    }),
  }),
});

export const forgotPassword = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const resetPassword = z.object({
  body: z.object({
    token: z.string().refine((val) => isJWT(val), {
      message: "Token is not a valid JWT.",
    }),
    password: z
      .string()
      .min(8)
      .max(300)
      .refine(async (val) => isPasswordStrongEnough(val)),
  }),
});

export const verifyEmail = z.object({
  body: z.object({
    token: z.string().refine((val) => isJWT(val), {
      message: "Token is not a valid JWT.",
    }),
  }),
});
