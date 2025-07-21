# 🔗 Οδηγίες Σύνδεσης Frontend με Backend

## Βήμα 1: Ενημέρωση subscription.html

Στο αρχείο `../subscription.html`, κάνε τις παρακάτω αλλαγές:

### 1.1 Πρόσθεσε το backend configuration (γύρω από γραμμή 2340):

```javascript
// Backend API Configuration - ΠΡΟΣΘΗΚΗ
const BACKEND_CONFIG = {
  baseUrl: 'http://localhost:3002/api',
  endpoints: {
    createPaymentIntent: '/payments/create-payment-intent',
    getSubscription: '/payments/subscription',
    cancelSubscription: '/payments/subscription/{id}/cancel'
  }
};
```

### 1.2 Αντικατάστησε την υπάρχουσα initializeStripePayment function:

**Παλιά function (γύρω από γραμμή 2780):**
```javascript
async function initializeStripePayment(lang) {
  try {
    // Check if we have real Price ID
    const hasRealPriceId = !STRIPE_CONFIG.priceId.includes('PLACEHOLDER');
    
    if (!hasRealPriceId) {
      // ... existing code
    } else {
      // Show ready for backend integration message
      const paymentElement = document.getElementById('payment-element');
      paymentElement.innerHTML = `...`;
    }
  } catch (error) {
    // ... existing error handling
  }
}
```

**ΝΕΑ function (αντικατάστησε την παλιά):**
```javascript
async function initializeStripePayment(lang) {
  try {
    console.log('🚀 Initializing Stripe payment with backend integration...');
    
    // Show loading state
    const paymentElement = document.getElementById('payment-element');
    paymentElement.innerHTML = `
      <div style="padding: 30px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 15px;">🔄</div>
        <h3 style="color: #667eea; margin-bottom: 10px;">Σύνδεση με server...</h3>
        <p style="color: #6c757d; font-size: 14px;">Επικοινωνία με backend για ασφαλή πληρωμή</p>
      </div>
    `;

    // Test backend connection
    const healthCheck = await fetch(\`\${BACKEND_CONFIG.baseUrl.replace('/api', '')}/health\`);
    
    if (!healthCheck.ok) {
      throw new Error(\`Backend server δεν είναι διαθέσιμος (\${healthCheck.status})\`);
    }

    const healthData = await healthCheck.json();
    console.log('✅ Backend server connected:', healthData);

    // Initialize real Stripe Elements
    const appearance = {
      theme: document.body.classList.contains('dark-mode') ? 'night' : 'stripe',
      variables: {
        colorPrimary: '#667eea',
        colorBackground: document.body.classList.contains('dark-mode') ? '#34495e' : '#ffffff',
        colorText: document.body.classList.contains('dark-mode') ? '#ffffff' : '#30313d',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        spacingUnit: '4px',
        borderRadius: '12px'
      }
    };

    // Create Stripe Elements
    elements = stripe.elements({ appearance });
    paymentElement = elements.create('payment');

    // Show real payment form
    paymentElement.innerHTML = \`
      <div class="payment-header">
        <div style="font-size: 48px; margin-bottom: 15px;">💳</div>
        <h3 class="payment-title">\${lang === 'el' ? 'Ασφαλής Πληρωμή' : 'Secure Payment'}</h3>
        <p class="payment-subtitle">
          \${lang === 'el' ? 'Συνδέθηκε με backend server για live πληρωμές' : 'Connected to backend server for live payments'}
        </p>
      </div>
      <div id="payment-element-container"></div>
      <div class="payment-buttons">
        <button type="submit" id="payment-submit" class="payment-submit">
          <span id="button-text">
            \${lang === 'el' ? '🔒 Ασφαλής Πληρωμή €12.99' : '🔒 Secure Payment €12.99'}
          </span>
        </button>
      </div>
    \`;

    // Mount Stripe Elements
    paymentElement.mount('#payment-element-container');

    // Handle form submission
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', handleBackendPaymentSubmit);

  } catch (error) {
    console.error('❌ Backend integration error:', error);
    
    // Show error message
    const paymentElement = document.getElementById('payment-element');
    paymentElement.innerHTML = \`
      <div style="padding: 30px; text-align: center; background: linear-gradient(135deg, #fee, #fdd); border-radius: 12px; border: 2px solid #e74c3c;">
        <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
        <h3 style="color: #c0392b; margin-bottom: 10px;">Σφάλμα Σύνδεσης</h3>
        <p style="color: #6c757d; font-size: 14px; margin-bottom: 15px;">
          \${error.message}
        </p>
        <div style="background: #e74c3c; color: white; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
          <small style="font-weight: 600;">
            🔧 Βεβαιωθείτε ότι ο backend server τρέχει στο http://localhost:3002
          </small>
        </div>
        <button onclick="location.reload()" style="background: #3498db; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
          🔄 Δοκιμή Ξανά
        </button>
      </div>
    \`;
  }
}
```

### 1.3 Πρόσθεσε τη νέα handleBackendPaymentSubmit function:

```javascript
async function handleBackendPaymentSubmit(event) {
  event.preventDefault();
  
  const submitButton = document.getElementById('payment-submit');
  const buttonText = document.getElementById('button-text');
  
  // Show loading state
  submitButton.disabled = true;
  buttonText.innerHTML = '🔄 Επεξεργασία...';
  
  try {
    console.log('💳 Creating payment intent via backend...');
    
    // Step 1: Create payment intent through backend
    const paymentResponse = await fetch(\`\${BACKEND_CONFIG.baseUrl}/payments/create-payment-intent\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: 'price_1RmsJyA1DFzFV9pRZIX920UB', // Your price ID
        customerEmail: localStorage.getItem('userEmail') || 'customer@example.com',
        trialDays: 3
      })
    });

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json();
      throw new Error(errorData.message || \`HTTP \${paymentResponse.status}\`);
    }

    const paymentData = await paymentResponse.json();
    console.log('✅ Payment intent created:', paymentData);

    // Step 2: Confirm payment with Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret: paymentData.clientSecret,
      confirmParams: {
        return_url: window.location.origin + '/success.html',
      },
      redirect: 'if_required' // Stay on page if possible
    });

    if (error) {
      throw new Error(error.message);
    }

    // Step 3: Handle successful payment
    if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_action') {
      console.log('🎉 Payment successful!');
      
      // Store subscription data
      localStorage.setItem('subscription', JSON.stringify({
        id: paymentData.subscriptionId,
        customerId: paymentData.customerId,
        status: 'active',
        trialEnd: paymentData.trialEnd,
        amount: paymentData.amount,
        currency: paymentData.currency
      }));
      
      localStorage.setItem('subscriptionExpiry', paymentData.trialEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
      
      // Show success message
      showSuccessMessage();
      
      // Broadcast to other tabs
      broadcastSubscriptionUpdate();
    }

  } catch (error) {
    console.error('❌ Payment error:', error);
    
    // Show error notification
    showNotification(
      \`Σφάλμα πληρωμής: \${error.message}\`, 
      'error', 
      5000
    );
    
  } finally {
    // Reset button
    submitButton.disabled = false;
    buttonText.innerHTML = '🔒 Ασφαλής Πληρωμή €12.99';
  }
}
```

## Βήμα 2: Ενημέρωση Environment Variables

Στο αρχείο `.env`, βάλε τα πραγματικά Stripe keys:

```env
NODE_ENV=development
PORT=3002

# Αντικατάστησε με τα πραγματικά keys από το Stripe Dashboard
STRIPE_SECRET_KEY=sk_live_your_actual_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here

# Frontend origins
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:5500,http://localhost:5500,file://
```

## Βήμα 3: Έλεγχος Λειτουργίας

### 3.1 Βεβαιώσου ότι το backend τρέχει:
```bash
npm run dev
```

### 3.2 Άνοιξε το subscription.html στον browser

### 3.3 Άνοιξε Developer Tools (F12) και δες το console

### 3.4 Δοκίμασε την πληρωμή - θα πρέπει να δεις:
- ✅ "Backend server connected"
- ✅ "Payment intent created"  
- ✅ Real Stripe payment form

## 🎯 Τι θα συμβεί:

1. **Frontend** θα συνδεθεί στο **Backend** (localhost:3002)
2. **Backend** θα δημιουργήσει payment intent με Stripe
3. **Frontend** θα εμφανίσει το πραγματικό Stripe form
4. **Πληρωμή** θα επεξεργαστεί μέσω Stripe
5. **Webhooks** θα ενημερώσουν για το subscription status

## 🔧 Troubleshooting:

### CORS Error:
- Βεβαιώσου ότι το frontend origin είναι στο `ALLOWED_ORIGINS`

### Backend δεν συνδέεται:
- Έλεγξε ότι τρέχει στο http://localhost:3002
- Δοκίμασε: http://localhost:3002/health

### Stripe Error:
- Βεβαιώσου ότι έχεις βάλει τα σωστά keys στο `.env`
- Έλεγξε ότι το Price ID υπάρχει στο Stripe Dashboard
