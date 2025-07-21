/**
 * Test Backend API Endpoints
 * Run this in browser console or Node.js to test backend integration
 */

const API_BASE = 'http://localhost:3002';

// Test 1: Health Check
async function testHealthCheck() {
  console.log('🔍 Testing health check...');
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    console.log('✅ Health check passed:', data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return false;
  }
}

// Test 2: Create Payment Intent (requires valid Stripe keys)
async function testCreatePaymentIntent() {
  console.log('🔍 Testing create payment intent...');
  try {
    const response = await fetch(`${API_BASE}/api/payments/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: 'price_1RmsJyA1DFzFV9pRZIX920UB',
        customerEmail: 'test@example.com',
        trialDays: 3
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Payment intent failed:', data);
      return false;
    }
    
    console.log('✅ Payment intent created:', data);
    return data;
  } catch (error) {
    console.error('❌ Payment intent error:', error);
    return false;
  }
}

// Test 3: CORS Check
async function testCORS() {
  console.log('🔍 Testing CORS...');
  try {
    const response = await fetch(`${API_BASE}/api/payments/create-payment-intent`, {
      method: 'OPTIONS'
    });
    console.log('✅ CORS check passed:', response.status);
    return true;
  } catch (error) {
    console.error('❌ CORS check failed:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Backend API Tests...\n');
  
  const results = {
    health: await testHealthCheck(),
    cors: await testCORS(),
    paymentIntent: await testCreatePaymentIntent()
  };
  
  console.log('\n📊 Test Results:');
  console.log('Health Check:', results.health ? '✅ PASS' : '❌ FAIL');
  console.log('CORS:', results.cors ? '✅ PASS' : '❌ FAIL');
  console.log('Payment Intent:', results.paymentIntent ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = Object.values(results).every(result => result);
  console.log('\n🎯 Overall:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  
  if (!allPassed) {
    console.log('\n🔧 Troubleshooting:');
    if (!results.health) {
      console.log('- Check if backend server is running: npm run dev');
      console.log('- Verify server is accessible at http://localhost:3002');
    }
    if (!results.cors) {
      console.log('- Check ALLOWED_ORIGINS in .env file');
      console.log('- Make sure your domain is included');
    }
    if (!results.paymentIntent) {
      console.log('- Verify Stripe secret key in .env file');
      console.log('- Check if price ID exists in Stripe Dashboard');
    }
  }
  
  return results;
}

// Export for browser console use
if (typeof window !== 'undefined') {
  window.testBackend = {
    health: testHealthCheck,
    paymentIntent: testCreatePaymentIntent,
    cors: testCORS,
    runAll: runAllTests
  };
  
  console.log('Backend test functions loaded! Run: testBackend.runAll()');
}

// Auto-run if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testHealthCheck, testCreatePaymentIntent, testCORS, runAllTests };
}
