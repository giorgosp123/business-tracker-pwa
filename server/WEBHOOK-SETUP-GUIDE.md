# 🔗 Stripe Webhook Setup Guide

## Βήμα 1: Δημιουργία Webhook στο Stripe Dashboard

### 1.1 Πήγαινε στο Stripe Dashboard
- URL: https://dashboard.stripe.com
- Συνδέσου με το λογαριασμό σου

### 1.2 Navigate to Webhooks
1. **Developers** (αριστερό menu)
2. **Webhooks**
3. **"+ Add endpoint"** (κουμπί στο πάνω δεξιά)

### 1.3 Ρύθμιση του Webhook
**Endpoint URL:** `http://localhost:3002/api/webhooks/stripe`

**⚠️ Για production χρησιμοποίησε:** `https://yourdomain.com/api/webhooks/stripe`

**Events to send:** Επίλεξε αυτά τα events:
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated` 
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`
- ✅ `customer.subscription.trial_will_end`

### 1.4 Αποθήκευση
Κάνε κλικ **"Add endpoint"**

## Βήμα 2: Βρες το Webhook Secret

### 2.1 Στη λίστα Webhooks
1. Κάνε κλικ στο webhook που μόλις δημιούργησες
2. Θα δεις τις λεπτομέρειες του webhook

### 2.2 Βρες το Secret
1. Κάτω από **"Signing secret"**
2. Κάνε κλικ **"Click to reveal"**
3. Αντέγραψε το string που αρχίζει με `whsec_...`

### 2.3 Ενημέρωσε το .env
Στο αρχείο `.env` βάλε:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret_here
```

## Βήμα 3: Test το Webhook

### 3.1 Stripe CLI (προαιρετικό)
```bash
# Install Stripe CLI
npm install -g stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3002/api/webhooks/stripe
```

### 3.2 Manual Test
1. Στο Stripe Dashboard → Webhooks
2. Κλικ στο webhook σου
3. **"Send test webhook"**
4. Επίλεξε event type (π.χ. `customer.subscription.created`)
5. Κλικ **"Send test webhook"**

## 🚨 Σημαντικές Σημειώσεις:

### Για Development (τώρα):
- Webhook URL: `http://localhost:3002/api/webhooks/stripe`
- Θα δουλεύει μόνο όταν ο server τρέχει τοπικά

### Για Production (μελλοντικά):
- Χρειάζεσαι public URL (π.χ. με ngrok ή deployment)
- Webhook URL: `https://yourdomain.com/api/webhooks/stripe`
- HTTPS απαιτείται για production webhooks

## 🔧 Troubleshooting:

### Αν δεν μπορείς να δημιουργήσεις webhook:
1. Βεβαιώσου ότι είσαι σε **Live mode** ή **Test mode**
2. Έλεγξε αν έχεις δικαιώματα στο account

### Αν το webhook δε δουλεύει:
1. Έλεγξε ότι ο server τρέχει στο port 3002
2. Δοκίμασε: http://localhost:3002/health
3. Δες τα logs στο terminal του backend

### Test commands:
```bash
# Test health
curl http://localhost:3002/health

# Test webhook endpoint
curl -X POST http://localhost:3002/api/webhooks/stripe
```
