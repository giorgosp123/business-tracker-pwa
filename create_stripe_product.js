/*
🚀 ΓΡΗΓΟΡΟΣ ΤΡΟΠΟΣ: Δημιουργία Stripe Product με Free Trial

ΠΡΟΑΠΑΙΤΟΥΜΕΝΑ:
1. Εγκαταστήστε Node.js από https://nodejs.org
2. Πάρτε το Secret Key σας από https://dashboard.stripe.com/apikeys (ξεκινάει με sk_live_)
3. Τρέξτε: npm install stripe

ΟΔΗΓΙΕΣ:
1. Βάλτε το Secret Key σας στη γραμμή 15
2. Τρέξτε: node create_stripe_product.js
3. Αντιγράψτε το Price ID που θα εμφανιστεί
*/

const stripe = require('stripe')('sk_live_ΤΟ_ΔΙΚΟ_ΣΑΣ_SECRET_KEY'); // 🚨 ΒΑΛΤΕ ΕΔΩ ΤΟ SECRET KEY

async function createBusinessProWithTrial() {
  try {
    console.log('🚀 Δημιουργία Business Pro Subscription με 3-day trial...\n');

    // ✅ ΧΡΗΣΙΜΟΠΟΙΟΥΜΕ ΤΟ ΥΠΑΡΧΟΝ PRODUCT ID
    const existingProductId = 'prod_SiIvVTKYkWwcCu';
    console.log('✅ Χρησιμοποιώ υπάρχον προϊόν:', existingProductId);

    // 2. Δημιουργία τιμολόγησης με free trial (χρησιμοποιώ το υπάρχον Product ID)
    const price = await stripe.prices.create({
      unit_amount: 1299, // €12.99 σε cents
      currency: 'eur',
      recurring: {
        interval: 'month',
        trial_period_days: 3 // 🎁 3 ΗΜΕΡΕΣ ΔΩΡΕΑΝ!
      },
      product: existingProductId, // ✅ Χρησιμοποιώ το υπάρχον Product ID
      nickname: 'Business Pro Monthly with 3-day trial',
      metadata: {
        plan_name: 'Business Pro',
        trial_days: '3',
        features: 'All premium features included'
      }
    });

    console.log('\n🎉 ΕΠΙΤΥΧΙΑ! Τιμολόγηση με free trial δημιουργήθηκε:');
    console.log('   Price ID:', price.id);
    console.log('   Amount: €12.99/month');
    console.log('   Trial: 3 days FREE');
    console.log('   Currency: EUR');

    console.log('\n🔥 ΑΝΤΙΓΡΑΨΤΕ ΑΥΤΟ ΤΟ PRICE ID:');
    console.log('   ', price.id);
    
    console.log('\n📋 Επόμενα βήματα:');
    console.log('   1. Αντιγράψτε το Price ID παραπάνω');
    console.log('   2. Βάλτε το στον κώδικα σας στη θέση YOUR_PRICE_ID');
    console.log('   3. Το free trial είναι πλέον ενεργό! 🎯');

    return {
      productId: existingProductId,
      priceId: price.id
    };

  } catch (error) {
    console.error('❌ Σφάλμα:', error.message);
    
    if (error.code === 'api_key_invalid') {
      console.log('\n🚨 ΣΦΑΛΜΑ: Μη έγκυρο Secret Key');
      console.log('   Βεβαιωθείτε ότι βάλατε το σωστό sk_live_ ή sk_test_ key');
    }
  }
}

// Τρέξτε τη συνάρτηση
createBusinessProWithTrial();
