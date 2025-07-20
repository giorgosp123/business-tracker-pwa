# 🎯 ΟΔΗΓΟΣ: Πώς να βρείτε το Price ID στο Stripe

## 📍 **ΒΗΜΑ 1: Πηγαίνετε στο Stripe Dashboard**
🔗 **Link**: https://dashboard.stripe.com

## 📍 **ΒΗΜΑ 2: Μεταβείτε στα Products**
1. Στην αριστερή μπάρα κάντε κλικ στο **"Products"**
2. Αν δεν έχετε προϊόν, κάντε κλικ **"+ Add Product"**

## 📍 **ΒΗΜΑ 3: Δημιουργήστε το Προϊόν (αν δεν υπάρχει)**

### Στοιχεία Προϊόντος:
- **Name**: `Business Pro Subscription`
- **Description**: `Premium subscription with 3-day free trial`

### Στοιχεία Τιμολόγησης:
- **Pricing model**: `Standard pricing`
- **Price**: `€12.99` (ή όσο θέλετε)
- **Billing period**: `Monthly`
- **Currency**: `EUR`

### ⚠️ **ΣΗΜΑΝΤΙΚΟ - Free Trial**:
- **Κάντε κλικ στο "Add trial period"**
- **Trial period**: `3 days`
- **Βεβαιωθείτε ότι είναι ενεργοποιημένο!**

## 📍 **ΒΗΜΑ 4: Αντιγράψτε το Price ID**

Μόλις δημιουργήσετε το προϊόν:

1. **Βρείτε το προϊόν** στη λίστα Products
2. **Κάντε κλικ** πάνω στο προϊόν
3. **Στην ενότητα "Pricing"** θα δείτε:
   ```
   Price ID: price_1234567890abcdef
   ```
4. **Αντιγράψτε** αυτό το Price ID

## 🎯 **ΒΗΜΑ 5: Βάλτε το Price ID στον κώδικα**

Στο αρχείο `subscription.html`, γραμμή περίπου 1160, βρείτε:

```javascript
const STRIPE_CONFIG = {
    publishableKey: 'pk_live_51NsMhxA1DFzFV9pRzlkLOHee4j7cyeDGQZJfolnsTVH0givjHlcWyP9PYYXrQM7WFnYV8tdkAgrkoyfLnaCMJysB003TUxSuBN',
    priceId: 'PRICE_ID_PLACEHOLDER', // 👈 ΑΛΛΑΞΤΕ ΑΥΤΟ
    currency: 'eur',
    amount: 1299,
    trialDays: 3,
    isProduction: true
};
```

**Αντικαταστήστε** το `PRICE_ID_PLACEHOLDER` με το δικό σας Price ID:

```javascript
priceId: 'price_1234567890abcdef', // 👈 ΤΟ ΔΙΚΟ ΣΑΣ PRICE ID
```

## 🚀 **ΕΝΑΛΛΑΚΤΙΚΟΣ ΤΡΟΠΟΣ - Αυτόματη Δημιουργία**

Αν προτιμάτε, μπορείτε να χρησιμοποιήσετε το Node.js script:

1. **Ανοίξτε** το αρχείο `create_stripe_product.js`
2. **Βάλτε το Secret Key σας** (γραμμή 15):
   ```javascript
   const stripe = require('stripe')('sk_live_ΤΟ_ΔΙΚΟ_ΣΑΣ_SECRET_KEY');
   ```
3. **Τρέξτε το script**:
   ```bash
   npm install stripe
   node create_stripe_product.js
   ```
4. **Αντιγράψτε** το Price ID που θα εμφανιστεί

## 📱 **Πώς θα ξέρετε ότι δουλεύει**

Όταν βάλετε το σωστό Price ID:
- ✅ Το payment modal θα δείχνει Stripe Elements (κάρτα, CVC, κλπ)
- ✅ Δεν θα βλέπετε μήνυμα "Απαιτείται Price ID"
- ✅ Τα payments θα λειτουργούν live!

---

## 🆘 **Χρειάζεστε Βοήθεια;**

**Πείτε μου το Price ID που βρήκατε και θα το βάλω στον κώδικα!**
