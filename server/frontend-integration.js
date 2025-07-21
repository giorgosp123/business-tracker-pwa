/**
 * Frontend Integration Guide
 * 
 * This file contains the JavaScript code to integrate the existing subscription.html
 * frontend with the backend server running on http://localhost:3002
 */

// Backend API Configuration
const BACKEND_CONFIG = {
  baseUrl: 'http://localhost:3002/api',
  endpoints: {
    createPaymentIntent: '/payments/create-payment-intent',
    getSubscription: '/payments/subscription',
    cancelSubscription: '/payments/subscription/{id}/cancel',
    reactivateSubscription: '/payments/subscription/{id}/reactivate',
    getCustomerSubscriptions: '/payments/customer/{id}/subscriptions'
  }
};

/**
 * Replace the existing initializeStripePayment function in subscription.html
 * with this enhanced version that connects to the backend
 */
async function initializeStripePaymentWithBackend(lang) {
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
    const healthCheck = await fetch(`${BACKEND_CONFIG.baseUrl.replace('/api', '')}/health`);
    
    if (!healthCheck.ok) {
      throw new Error(`Backend server δεν είναι διαθέσιμος (${healthCheck.status})`);
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
    paymentElement.innerHTML = `
      <div class="payment-header">
        <div style="font-size: 48px; margin-bottom: 15px;">💳</div>
        <h3 class="payment-title">${lang === 'el' ? 'Ασφαλής Πληρωμή' : 'Secure Payment'}</h3>
        <p class="payment-subtitle">
          ${lang === 'el' ? 'Συνδέθηκε με backend server για live πληρωμές' : 'Connected to backend server for live payments'}
        </p>
      </div>
      <div id="payment-element-container"></div>
      <div class="payment-buttons">
        <button type="submit" id="payment-submit" class="payment-submit">
          <span id="button-text">
            ${lang === 'el' ? '🔒 Ασφαλής Πληρωμή €12.99' : '🔒 Secure Payment €12.99'}
          </span>
        </button>
      </div>
    `;

    // Mount Stripe Elements
    paymentElement.mount('#payment-element-container');

    // Handle form submission
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', handleBackendPaymentSubmit);

  } catch (error) {
    console.error('❌ Backend integration error:', error);
    
    // Show error message
    const paymentElement = document.getElementById('payment-element');
    paymentElement.innerHTML = `
      <div style="padding: 30px; text-align: center; background: linear-gradient(135deg, #fee, #fdd); border-radius: 12px; border: 2px solid #e74c3c;">
        <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
        <h3 style="color: #c0392b; margin-bottom: 10px;">Σφάλμα Σύνδεσης</h3>
        <p style="color: #6c757d; font-size: 14px; margin-bottom: 15px;">
          ${error.message}
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
    `;
  }
}

/**
 * Enhanced payment submission handler that communicates with backend
 */
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
    const paymentResponse = await fetch(`${BACKEND_CONFIG.baseUrl}/payments/create-payment-intent`, {
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
      throw new Error(errorData.message || `HTTP ${paymentResponse.status}`);
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
      showBackendSuccessMessage();
      
      // Broadcast to other tabs
      broadcastSubscriptionUpdate();
    }

  } catch (error) {
    console.error('❌ Payment error:', error);
    
    // Show error notification
    showNotification(
      `Σφάλμα πληρωμής: ${error.message}`, 
      'error', 
      5000
    );
    
  } finally {
    // Reset button
    submitButton.disabled = false;
    buttonText.innerHTML = '🔒 Ασφαλής Πληρωμή €12.99';
  }
}

/**
 * Enhanced success message with backend integration info
 */
function showBackendSuccessMessage() {
  const currentLang = localStorage.getItem('language') || 'el';
  
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    animation: fadeIn 0.5s ease;
  `;
  
  overlay.innerHTML = `
    <div class="success-dialog" style="
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      padding: 50px;
      border-radius: 25px;
      text-align: center;
      max-width: 500px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    ">
      <div style="
        font-size: 80px; 
        margin-bottom: 25px; 
        animation: bounce 1.5s ease infinite;
        filter: drop-shadow(0 5px 15px rgba(0,0,0,0.1));
      ">🎉</div>
      <h2 style="
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 20px; 
        font-size: 28px;
        font-weight: 800;
      ">${currentLang === 'el' ? 'Πληρωμή Επιτυχής!' : 'Payment Successful!'}</h2>
      <p style="
        color: #7f8c8d; 
        margin-bottom: 20px; 
        font-size: 16px;
        line-height: 1.6;
      ">
        ${currentLang === 'el' ? 
          'Η συνδρομή σας ενεργοποιήθηκε επιτυχώς μέσω του backend server!' : 
          'Your subscription has been activated successfully via backend server!'}
      </p>
      <div style="background: #d4edda; padding: 15px; border-radius: 12px; margin-bottom: 30px; border: 2px solid #28a745;">
        <small style="color: #155724; font-weight: 600;">
          ✅ Backend: Connected<br>
          ✅ Stripe: Payment Processed<br>
          ✅ Trial: 3 Days Active<br>
          ✅ Features: Unlocked
        </small>
      </div>
      <button onclick="this.parentElement.parentElement.remove(); window.location.href='dashboard.html';" style="
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 15px 40px;
        border-radius: 50px;
        cursor: pointer;
        font-weight: 700;
        font-size: 16px;
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
      ">
        ${currentLang === 'el' ? '🚀 Μετάβαση στο Dashboard' : '🚀 Go to Dashboard'}
      </button>
    </div>
  `;
  
  document.body.appendChild(overlay);
  createConfetti();
}

/**
 * Check subscription status via backend
 */
async function checkSubscriptionStatus(subscriptionId) {
  try {
    const response = await fetch(`${BACKEND_CONFIG.baseUrl}/payments/subscription/${subscriptionId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to check subscription: ${response.status}`);
    }
    
    const subscription = await response.json();
    console.log('📊 Subscription status:', subscription);
    
    return subscription;
  } catch (error) {
    console.error('❌ Error checking subscription:', error);
    return null;
  }
}

/**
 * Cancel subscription via backend
 */
async function cancelSubscriptionViaBackend(subscriptionId, immediate = false) {
  try {
    const response = await fetch(`${BACKEND_CONFIG.baseUrl}/payments/subscription/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cancelImmediately: immediate
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to cancel subscription: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Subscription cancelled:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Error cancelling subscription:', error);
    throw error;
  }
}

// Export for use in subscription.html
if (typeof window !== 'undefined') {
  window.BACKEND_CONFIG = BACKEND_CONFIG;
  window.initializeStripePaymentWithBackend = initializeStripePaymentWithBackend;
  window.handleBackendPaymentSubmit = handleBackendPaymentSubmit;
  window.showBackendSuccessMessage = showBackendSuccessMessage;
  window.checkSubscriptionStatus = checkSubscriptionStatus;
  window.cancelSubscriptionViaBackend = cancelSubscriptionViaBackend;
}
