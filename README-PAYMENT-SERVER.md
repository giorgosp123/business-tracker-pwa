# 🚀 Business Tracker - Live Payment Server

✅ **Δημιουργήθηκε πλήρης backend server για live payments με Stripe!**

## 📋 Τι Δημιουργήθηκε

### 🔧 Backend Server (`/server/`)
- Complete **Node.js/Express server**
- **Stripe integration** για payments & subscriptions
- **Secure webhooks** για event handling
- **API endpoints** για όλες τις λειτουργίες
- **Security features** (CORS, rate limiting, validation)
- **Error handling** και logging

### 🌐 Frontend Integration
- **subscription-simple.html** - Clean implementation
- Updated **subscription.html** με backend connectivity
- **Stripe Elements** integration
- **Real-time payment processing**

## 🎯 Επόμενα Βήματα

### 1. Εγκατάσταση Node.js
```
1. Κατεβάστε από: https://nodejs.org/
2. Εγκαταστήστε την LTS έκδοση
3. Restart terminal/PowerShell
```

### 2. Εκκίνηση Server
```bash
cd server
npm install         # Εγκατάσταση dependencies
./start-server.bat  # Windows startup script
# ή
npm run dev        # Manual start
```

### 3. Stripe Setup
```
1. Λογαριασμός: https://stripe.com
2. API Keys: Dashboard > Developers > API Keys
3. Product: Dashboard > Products (Create "Premium Plan")
4. Webhook: Dashboard > Webhooks (Add endpoint)
5. Ενημέρωση .env αρχείου
```

### 4. Configuration
Ενημερώστε τα αρχεία:
- **server/.env** - Stripe keys & settings
- **subscription-simple.html** - Frontend config

## 📁 File Structure

```
server/
├── 📄 server.js              # Main server
├── 📄 package.json           # Dependencies
├── 📄 .env.example          # Config template
├── 📄 start-server.bat      # Windows launcher
├── 📄 README.md             # Full docs
├── 📄 SETUP.md              # Setup guide
├── 📁 routes/               # API endpoints
│   ├── payments.js          # Payment handling
│   ├── subscriptions.js     # Subscription mgmt
│   └── webhooks.js          # Stripe events
├── 📁 middleware/           # Express middleware
└── 📁 utils/               # Helper functions

Frontend:
├── 📄 subscription.html         # Original (enhanced)
├── 📄 subscription-simple.html  # Clean version
```

## ✨ Key Features

### 💳 Payments
- Payment Intent creation
- Subscription management  
- Payment method handling
- Refund processing
- Multi-currency support

### 🔐 Security
- Webhook signature verification
- Input validation & sanitization
- Rate limiting protection
- CORS configuration
- Error handling

### 📊 Subscriptions
- Customer creation
- Trial periods (7 days free)
- Subscription lifecycle
- Payment failures handling
- Cancellation management

### 📡 Webhooks
- Real-time event processing
- Subscription updates
- Payment confirmations
- Trial ending notifications
- Invoice processing

## 🧪 Testing

### Test Cards (Development):
- **Success**: `4242424242424242`
- **Declined**: `4000000000000002`  
- **3D Secure**: `4000002500003155`

### API Testing:
```bash
# Health check
curl http://localhost:3001/health

# Create customer
curl -X POST http://localhost:3001/api/subscriptions/create-customer \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

## 🌐 URLs

Όταν τρέχει ο server:
- **Health Check**: http://localhost:3001/health
- **API Base**: http://localhost:3001/api
- **Frontend**: Ανοίξτε το subscription-simple.html σε browser

## ⚙️ Configuration Files

### server/.env (Create από .env.example):
```env
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
PREMIUM_PRICE_ID=price_your_price_id_here
PORT=3001
NODE_ENV=development
```

### Frontend Config:
```javascript
const CONFIG = {
    stripePublicKey: 'pk_test_your_key_here',
    apiBaseUrl: 'http://localhost:3001/api',
    priceId: 'price_your_price_id_here'
};
```

## 🚀 Production Ready

Για production:
- SSL certificate (HTTPS)
- Live Stripe keys
- Database integration
- User authentication
- Monitoring & logging
- Deploy to cloud service

## 📞 Support

Για βοήθεια:
1. Ελέγξτε το SETUP.md
2. Δείτε τα logs στο terminal
3. Test με /health endpoint
4. Χρησιμοποιήστε Stripe Dashboard

---

**🎉 Ο server είναι έτοιμος για live payments! Ακολουθήστε τα βήματα και θα έχετε πλήρες payment system.** 

**Προτεραιότητα: Εγκαταστήστε Node.js και εκτελέστε `npm install` στον server φάκελο.**
