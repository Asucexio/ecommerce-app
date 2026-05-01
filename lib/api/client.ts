export type ApiErrorPayload = {
    data: null;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
};

export class ApiClientError extends Error {
    status: number;
    code: string;
    details?: unknown;

    constructor(status: number, code: string, message: string, details?: unknown) {
        super(message);
        this.name = "ApiClientError";
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

type RequestOptions = {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string | null;
    headers?: HeadersInit;
    signal?: AbortSignal;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, token, headers, signal } = options;

    const response = await fetch(path, {
        method,
        headers: {
            "content-type": "application/json",
            ...(token ? { authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal,
    });

    const json = (await response.json().catch(() => null)) as { data?: T; error?: ApiErrorPayload["error"] } | null;

    if (!response.ok) {
        const error = json?.error;
        throw new ApiClientError(response.status, error?.code ?? "HTTP_ERROR", error?.message ?? "Request failed", error?.details);
    }

    return (json?.data ?? null) as T;
}