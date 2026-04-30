# Backend Handoff (Ecommerce App)

## 1) Status
Backend implementation is complete for core commerce flows:
- Cart CRUD + cart merge
- Checkout validate + create-order + create-payment-intent
- Stripe webhook processing (including duplicate delivery guard)
- User/admin access-control on order endpoints

## 2) Environment Variables
Required server variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## 3) API Endpoints (Core)

### Cart
- `GET /api/cart`
- `POST /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:itemId`
- `DELETE /api/cart/items/:itemId`
- `POST /api/cart/merge`

### Checkout
- `POST /api/checkout/validate`
- `POST /api/checkout/create-order`
- `POST /api/checkout/create-payment-intent`

### Orders
- `GET /api/order`
- `GET /api/order/:orderId`

### Admin
- `PATCH /api/admin/order/:orderId/status`

### Payments
- `POST /api/payment/webhook`

## 4) Auth / Access Rules
- User token required for user order/cart operations where applicable.
- Admin token required for admin status update endpoint.
- Webhook requires valid `stripe-signature` header.

## 5) Known Error Contracts
- Validation errors: `400` with `code: VALIDATION_ERROR`
- Unauthorized: `401` with `code: UNAUTHORIZED`
- Forbidden: `403` with `code: FORBIDDEN`
- Not found: `404` with `code: NOT_FOUND`
- Internal: `500` with `code: INTERNAL_ERROR`

## 6) Critical Integration Test Checklist
1. Cart CRUD + merge
2. Checkout validate -> create-order
3. Webhook duplicate delivery handling
4. User/admin access-control scenarios

## 7) Release Checklist
- [ ] Run lint/build/tests in CI
- [ ] Confirm DB migrations/seeds are applied
- [ ] Confirm all secrets are configured in staging/prod
- [ ] Run one end-to-end staging smoke test
- [ ] Verify Stripe webhook endpoint from Stripe CLI/dashboard

## 8) Rollback Plan
- Revert deployment to previous stable image/version.
- Disable webhook processing temporarily if payment event ingestion regresses.
- Re-run migration rollback only if schema-related issues are confirmed.
