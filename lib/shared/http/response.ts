export interface ApiErrorPayload {
    code: string;
    message: string;
    details?: unknown;
}

export function apiSuccess<T>(data: T, init?: ResponseInit) {
    return Response.json(
        {
            data,
            error: null,
        },
        init,
    );
}

export function apiError(error: ApiErrorPayload, status = 400) {
    return Response.json(
        {
            data: null,
            error,
        },
        { status },
    );
}
