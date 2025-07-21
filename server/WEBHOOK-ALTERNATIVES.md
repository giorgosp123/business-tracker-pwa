# 🔧 Stripe Webhook - Εναλλακτικές Λύσεις

## Αν δεν μπορείς να δημιουργήσεις webhook στο Stripe Dashboard:

### 🎯 Λύση 1: Χωρίς Webhooks (για development)

Το σύστημα θα δουλεύει χωρίς webhooks! Τα payments θα επεξεργάζονται κανονικά.

**Τι δεν θα έχεις χωρίς webhooks:**
- ❌ Automatic subscription status updates
- ❌ Real-time payment failure notifications  
- ❌ Trial ending notifications

**Τι ΘΑ δουλεύει κανονικά:**
- ✅ Payment processing
- ✅ Subscription creation
- ✅ Trial periods
- ✅ Payment confirmation

### 🎯 Λύση 2: Manual Webhook Creation

#### Στο Stripe Dashboard:

1. **Πήγαινε στο**: https://dashboard.stripe.com/test/webhooks
   
2. **Direct URL για Test mode**: https://dashboard.stripe.com/test/webhooks/create

3. **Aν δεν δουλεύει, δοκίμασε:**
   - Αλλαγή browser (Chrome, Firefox, Safari)
   - Incognito/Private mode
   - Διαφορετική συσκευή

#### Webhook Details:
```
Endpoint URL: http://localhost:3002/api/webhooks/stripe
Description: Business Tracker Subscriptions
Events: customer.subscription.created, customer.subscription.updated, customer.subscription.deleted, invoice.payment_succeeded, invoice.payment_failed
```

### 🎯 Λύση 3: Stripe CLI (Recommended για Development)

#### Download Stripe CLI:
- **Windows**: https://github.com/stripe/stripe-cli/releases/latest
- Κατέβασε το `stripe_X.X.X_windows_x86_64.zip`
- Εξέταξε σε φάκελο (π.χ. `C:\stripe\`)
- Πρόσθεσε στο PATH ή τρέξε από τον φάκελο

#### Setup:
```bash
# Login to Stripe
stripe login

# Forward events to local server  
stripe listen --forward-to localhost:3002/api/webhooks/stripe
```

### 🎯 Λύση 4: Test χωρίς Webhook Secret

Μπορείς να δοκιμάσεις τα payments αμέσως! Απλά άφησε το temp secret:

```env
STRIPE_WEBHOOK_SECRET=whsec_temp_webhook_secret_for_development
```

## 🚀 Προτεινόμενη σειρά:

1. **Πρώτα**: Δοκίμασε τα payments χωρίς webhooks
2. **Μετά**: Προσπάθησε να δημιουργήσεις webhook 
3. **Τέλος**: Setup Stripe CLI αν θέλεις full testing

## ✅ Πώς να δοκιμάσεις ότι δουλεύει:

1. **Άνοιξε**: http://localhost:3002/health
2. **Δοκίμασε payment** στο subscription.html
3. **Έλεγξε logs** στο terminal

**Το σύστημα είναι έτοιμο για payments ακόμα και χωρίς webhooks!** 🎉
