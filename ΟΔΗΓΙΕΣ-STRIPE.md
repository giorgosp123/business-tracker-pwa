# ΑΚΡΙΒΕΣ ΟΔΗΓΙΕΣ ΓΙΑ STRIPE PAYMENTS

## 🚀 Βήμα 1: Ξεκίνα τον Server

### Άνοιξε PowerShell και τρέξε:

```powershell
cd C:\Users\giorg\Desktop\test\server
npm start
```

**Θα δεις:**
```
🚀 Payment server started on port 3001
✅ Environment: production  
✅ Stripe: Live mode enabled
```

---

## 🔧 Βήμα 2: Έλεγξε ότι δουλεύει

### Άνοιξε browser → πήγαινε στο:
```
http://localhost:3001/health
```

**Θα δεις:**
```json
{
  "status": "OK",
  "timestamp": "...",
  "environment": "production"
}
```

---

## 💳 Βήμα 3: Δοκίμασε το Stripe

### Άνοιξε το subscription.html
### Κάνε click: "💳 Πληρώστε Τώρα €12.99"

**Θα ανοίξει:**
- Stripe φόρμα πληρωμής
- Πεδία για κάρτα (Visa, Mastercard κλπ)
- Πεδία για email

---

## ⚡ Τι έχω ρυθμίσει:

✅ **Live Stripe Keys** - Πραγματικές πληρωμές  
✅ **€12.99/μήνα** - Σωστό ποσό  
✅ **Άμεση χρέωση** - Χωρίς δωρεάν δοκιμή  
✅ **Production mode** - Έτοιμο για χρήση  

---

## 🚨 ΣΗΜΑΝΤΙΚΟ:

**Ο server ΠΡΕΠΕΙ να τρέχει** πριν ανοίξεις το subscription.html!

**Αν δεν δουλεύει:**
1. Έλεγξε ότι ο server τρέχει στο localhost:3001
2. Δες στο console (F12) για errors
3. Κάνε click "🔧 Debug" στο subscription.html για logs

---

## 🎯 ΣΥΝΤΟΜΑ:

1. `cd C:\Users\giorg\Desktop\test\server`
2. `npm start`  
3. Άνοιξε `subscription.html`
4. Κάνε click το μπλε κουμπί
5. **Θα δουλέψει η Stripe φόρμα!** 💳
