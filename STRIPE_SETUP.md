# 🔧 Οδηγός Ρύθμισης Stripe

## 1. Δημιουργία Λογαριασμού Stripe

1. Πηγαίνετε στο https://stripe.com και δημιουργήστε λογαριασμό
2. Επιβεβαιώστε το email σας
3. Συμπληρώστε τα στοιχεία της επιχείρησής σας

## 2. Λήψη API Keys

1. Πηγαίνετε στο [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Αντιγράψτε το **Publishable key** (το κλειδί που ξεκινάει με `pk_test_` ή `pk_live_`)
3. Κρατήστε και το **Secret key** για το backend σας (ξεκινάει με `sk_test_` ή `sk_live_`)

## 3. Δημιουργία Προϊόντος

1. Πηγαίνετε στο [Stripe Products](https://dashboard.stripe.com/products)
2. Κάντε κλικ **"Add product"**
3. Συμπληρώστε:
   - **Name**: Business Pro Subscription
   - **Description**: Premium subscription with AI features
   - **Pricing**: Recurring - Monthly - €12.99
   - **Trial period**: 3 days
4. Αποθηκεύστε και αντιγράψτε το **Price ID** (ξεκινάει με `price_`)

## 4. Ενημέρωση Κώδικα

Στο αρχείο `subscription.html`, αντικαταστήστε:

```javascript
// Βρείτε αυτές τις γραμμές:
const stripe = Stripe('YOUR_PUBLISHABLE_KEY');

const STRIPE_CONFIG = {
    publishableKey: 'YOUR_PUBLISHABLE_KEY',
    priceId: 'YOUR_PRICE_ID',
    // ...
};
```

Και βάλτε τα δικά σας κλειδιά:

```javascript
// Παράδειγμα:
const stripe = Stripe('pk_test_51H...'); // Το δικό σας publishable key

const STRIPE_CONFIG = {
    publishableKey: 'pk_test_51H...', // Το ίδιο publishable key
    priceId: 'price_1J...', // Το δικό σας price ID
    // ...
};
```

## 5. Δοκιμή (Test Mode)

1. Χρησιμοποιήστε τα test keys (που ξεκινούν με `pk_test_` και `sk_test_`)
2. Για δοκιμή πληρωμών χρησιμοποιήστε τις Stripe test κάρτες:
   - **Επιτυχής πληρωμή**: `4242 4242 4242 4242`
   - **Απόρριψη κάρτας**: `4000 0000 0000 0002`
   - **Ανεπαρκές υπόλοιπο**: `4000 0000 0000 9995`
   - **Οποιαδήποτε ημερομηνία λήξης στο μέλλον και οποιοσδήποτε CVC**

## 6. Backend (Απαιτείται)

Για να λειτουργήσει πλήρως το Stripe, χρειάζεστε backend server που θα:

1. **Δημιουργεί PaymentIntent**: 
   ```javascript
   // POST /create-payment-intent
   const paymentIntent = await stripe.paymentIntents.create({
     amount: 1299, // €12.99 in cents
     currency: 'eur',
     setup_future_usage: 'off_session'
   });
   ```

2. **Χειρίζεται Webhooks**:
   - Πηγαίνετε στο [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
   - Προσθέστε endpoint: `https://yourdomain.com/stripe-webhook`
   - Επιλέξτε events: `payment_intent.succeeded`, `subscription.created`, κλπ.

## 7. Production Mode

Όταν είστε έτοιμοι για production:

1. Αλλάξτε τα test keys με live keys (`pk_live_` και `sk_live_`)
2. Ενεργοποιήστε το λογαριασμό σας στο Stripe
3. Ρυθμίστε HTTPS στην ιστοσελίδα σας
4. Δοκιμάστε με πραγματικές κάρτες (χαμηλά ποσά)

## 📞 Βοήθεια

- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Test Cards: https://stripe.com/docs/testing

## 🔐 Ασφάλεια

- **ΠΟΤΕ** μην βάλετε το Secret Key στο frontend
- Χρησιμοποιήστε HTTPS στην production
- Επιβεβαιώστε πληρωμές στο backend
- Χρησιμοποιήστε webhooks για αξιοπιστία
