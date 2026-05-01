export type CheckoutValidationDto = {
    cartId: string;
    items: unknown[];
};

export type CreateOrderDto = {
    orderId: string;
    status: string;
};

export type CreatePaymentIntentDto = {
    orderId: string;
    paymentIntentId: string;
    clientSecret: string | null;
};
