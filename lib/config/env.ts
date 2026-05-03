// NOTE: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be added to your .env.local
// It is the publishable key from your Stripe dashboard (starts with pk_test_ or pk_live_)
// This is safe to expose publicly - it's designed to be used in the browser.

const publicEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
] as const;

const serverEnvVars = [
    "SUPABASE_SERVICE_ROLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
] as const;

type PublicEnvVar = (typeof publicEnvVars)[number];
type ServerEnvVar = (typeof serverEnvVars)[number];

function getEnvVar(name: PublicEnvVar | ServerEnvVar): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

export function getSupabaseConfig() {
    return {
        url: getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
        anonKey: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    };
}

export function getServerConfig() {
    return {
        supabaseServiceRoleKey: getEnvVar("SUPABASE_SERVICE_ROLE_KEY"),
        stripeSecretKey: getEnvVar("STRIPE_SECRET_KEY"),
        stripeWebhookSecret: getEnvVar("STRIPE_WEBHOOK_SECRET"),
    };
}

export function isSupabaseConfigured() {
    return ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"].every(
        (key) => Boolean(process.env[key])
    );
}

export function isServerConfigured() {
    return serverEnvVars.every((key) => Boolean(process.env[key]));
}
