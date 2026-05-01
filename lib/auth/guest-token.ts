const GUEST_TOKEN_KEY = "guest_cart_token";

export function generateGuestToken() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getGuestToken() {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(GUEST_TOKEN_KEY);
}

export function setGuestToken(token: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(GUEST_TOKEN_KEY, token);
}

export function ensureGuestToken() {
    let token = getGuestToken();

    if (!token) {
        token = generateGuestToken();
        setGuestToken(token);
    }

    return token;
}

export function clearGuestToken() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(GUEST_TOKEN_KEY);
}