# Business Tracker Stripe Server

Backend server for handling Stripe payments and subscriptions for the Business Tracker PWA.

## Features

- ✅ **Stripe Integration**: Full payment processing with subscriptions
- ✅ **Webhook Handling**: Real-time subscription event processing
- ✅ **Security**: CORS protection, rate limiting, input validation
- ✅ **TypeScript**: Type-safe development with strict mode
- ✅ **Trial Support**: 3-day free trial for new subscriptions
- ✅ **Real-time Events**: Webhook handlers for all subscription lifecycle events

## Quick Start

### Prerequisites
- Node.js 16+ installed
- Stripe account with live keys
- Frontend running (subscription.html)

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file from the example:
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```env
NODE_ENV=development
PORT=3001

# Replace with your actual Stripe keys
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Update origins based on your frontend URL
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:5500,http://localhost:5500
```

### 3. Development
```bash
npm run dev
```

### 4. Production
```bash
npm run build
npm start
```

## API Endpoints

### Payment Endpoints (`/api/payments`)

#### Create Payment Intent
```http
POST /api/payments/create-payment-intent
Content-Type: application/json

{
  "priceId": "price_1RmsJyA1DFzFV9pRZIX920UB",
  "customerEmail": "user@example.com",
  "trialDays": 3
}
```

Response:
```json
{
  "subscriptionId": "sub_1234567890",
  "clientSecret": "pi_1234567890_secret_...",
  "customerId": "cus_1234567890",
  "trialEnd": "2025-01-24T12:00:00.000Z",
  "amount": 1299,
  "currency": "eur"
}
```

#### Get Subscription Status
```http
GET /api/payments/subscription/:subscriptionId
```

#### Cancel Subscription
```http
POST /api/payments/subscription/:subscriptionId/cancel
Content-Type: application/json

{
  "cancelImmediately": false
}
```

#### Reactivate Subscription
```http
POST /api/payments/subscription/:subscriptionId/reactivate
```

### Webhook Endpoint (`/api/webhooks`)

#### Stripe Webhook
```http
POST /api/webhooks/stripe
```

Handles these events:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.trial_will_end`

## Frontend Integration

🎯 **Το backend είναι έτοιμο και τρέχει στο http://localhost:3002!**

### Γρήγορη Σύνδεση:

1. **Ανάγνωση οδηγιών**: Διάβασε το `FRONTEND-INTEGRATION-GUIDE.md`
2. **Τεστ backend**: Άνοιξε `test-backend.js` στο browser console
3. **Ενημέρωση frontend**: Ακολούθησε τις οδηγίες στο guide

### Αρχεία Βοήθειας:
- 📋 `FRONTEND-INTEGRATION-GUIDE.md` - Αναλυτικές οδηγίες 
- 🧪 `test-backend.js` - Test functions για το API
- 🔗 `frontend-integration.js` - Έτοιμος κώδικας για το frontend

### Γρήγορο Test:
```bash
# Στο browser console (με το subscription.html ανοιχτό):
fetch('http://localhost:3002/health').then(r=>r.json()).then(console.log)
```

The server is designed to work with the existing `subscription.html` frontend. **Δες τις αναλυτικές οδηγίες στο FRONTEND-INTEGRATION-GUIDE.md**

```javascript
// In subscription.html, update the API base URL
const API_BASE_URL = 'http://localhost:3001/api';

// Example API call
const response = await fetch(`${API_BASE_URL}/payments/create-payment-intent`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    priceId: 'price_1RmsJyA1DFzFV9pRZIX920UB',
    customerEmail: 'user@example.com',
    trialDays: 3
  })
});
```

## Stripe Dashboard Configuration

### 1. Webhook Setup
1. Go to Stripe Dashboard → Developers → Webhooks
2. Create endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select these events:
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed
   - customer.subscription.trial_will_end

4. Copy the webhook secret to your `.env` file

### 2. Price Configuration
The frontend uses price ID: `price_1RmsJyA1DFzFV9pRZIX920UB`
Make sure this price exists in your Stripe dashboard and is active.

## Project Structure

```
server/
├── src/
│   ├── routes/
│   │   ├── payments.ts     # Payment API endpoints
│   │   └── webhooks.ts     # Stripe webhook handlers
│   └── server.ts           # Main server setup
├── .env.example            # Environment variables template
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Security Considerations

- ✅ Environment variables for sensitive data
- ✅ CORS protection with specific origins
- ✅ Rate limiting on API endpoints
- ✅ Webhook signature verification
- ✅ Input validation and sanitization
- ✅ Error handling without exposing internals

## Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run test` - Run tests (placeholder)

### Health Check
```http
GET /health
```

Returns server status and configuration info.

## Deployment

1. Set `NODE_ENV=production` in your environment
2. Configure proper `ALLOWED_ORIGINS` for your domain
3. Set up SSL/HTTPS (required for webhooks)
4. Configure your Stripe webhook endpoint URL
5. Build and start: `npm run build && npm start`

## Troubleshooting

### Common Issues

1. **CORS Errors**: Update `ALLOWED_ORIGINS` in `.env`
2. **Webhook Failures**: Verify webhook secret and endpoint URL
3. **Payment Intent Errors**: Check Stripe keys and price ID
4. **TypeScript Errors**: Run `npm run build` to check for issues

### Logs
The server provides detailed logging for:
- Payment processing
- Webhook events
- Subscription changes
- Error conditions

Check the console output for debugging information.

## Support

- Frontend file: `../subscription.html`
- Stripe Dashboard: https://dashboard.stripe.com
- Stripe Documentation: https://stripe.com/docs

## License

ISC
