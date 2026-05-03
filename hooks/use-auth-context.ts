"use client";

// Re-export from the provider for backwards compat with existing admin pages
export { useAuth as useAuthContext } from "@/contexts/auth-context";
export type { AuthUser as AuthContextDto } from "@/contexts/auth-context";
