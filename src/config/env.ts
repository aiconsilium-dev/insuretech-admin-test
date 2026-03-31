/**
 * Environment variable access
 * All VITE_* env vars are accessed through this module.
 */

export const ENV = {
  API_BASE_URL: (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8080',
  BASE_URL: import.meta.env.BASE_URL as string,
} as const;
