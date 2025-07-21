import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

// Stripe webhook endpoint
router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !endpointSecret) {
    console.error('Missing stripe signature or webhook secret');
    return res.status(400).send('Missing webhook signature or secret');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('✅ Webhook signature verified:', event.type);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
        const createdSubscription = event.data.object as Stripe.Subscription;
        console.log('🎉 Subscription created:', createdSubscription.id);
        await handleSubscriptionCreated(createdSubscription);
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        console.log('📝 Subscription updated:', updatedSubscription.id, 'Status:', updatedSubscription.status);
        await handleSubscriptionUpdated(updatedSubscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        console.log('❌ Subscription deleted:', deletedSubscription.id);
        await handleSubscriptionDeleted(deletedSubscription);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        console.log('💰 Payment succeeded for invoice:', invoice.id);
        await handleInvoicePaymentSucceeded(invoice);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log('❌ Payment failed for invoice:', failedInvoice.id);
        await handleInvoicePaymentFailed(failedInvoice);
        break;

      case 'customer.subscription.trial_will_end':
        const trialEndingSubscription = event.data.object as Stripe.Subscription;
        console.log('⏰ Trial ending soon for subscription:', trialEndingSubscription.id);
        await handleTrialWillEnd(trialEndingSubscription);
        break;

      default:
        console.log('ℹ️ Unhandled event type:', event.type);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Webhook handler functions
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Processing subscription creation...');
  
  // Here you would typically:
  // 1. Store subscription details in your database
  // 2. Set up user permissions/features
  // 3. Send welcome email
  
  const subscriptionData = {
    id: subscription.id,
    customerId: subscription.customer as string,
    status: subscription.status,
    currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    priceId: subscription.items.data[0]?.price.id,
    amount: (subscription.items.data[0]?.price as any)?.unit_amount,
    currency: subscription.items.data[0]?.price.currency,
  };

  console.log('Subscription data to store:', subscriptionData);
  
  // TODO: Store in database
  // await database.subscriptions.create(subscriptionData);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing subscription update...');
  
  const subscriptionData = {
    id: subscription.id,
    status: subscription.status,
    currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
  };

  console.log('Subscription update data:', subscriptionData);
  
  // TODO: Update in database
  // await database.subscriptions.update(subscription.id, subscriptionData);
  
  // Handle status changes
  if (subscription.status === 'active') {
    console.log('✅ Subscription is now active - enabling premium features');
    // Enable premium features for user
  } else if (subscription.status === 'canceled') {
    console.log('❌ Subscription canceled - disabling premium features');
    // Disable premium features for user
  } else if (subscription.status === 'past_due') {
    console.log('⚠️ Subscription past due - sending notification');
    // Send payment retry notification
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing subscription deletion...');
  
  // TODO: Update database to mark subscription as deleted
  // await database.subscriptions.delete(subscription.id);
  
  // Disable premium features
  console.log('🔒 Disabling premium features for customer:', subscription.customer);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Processing successful payment...');
  
  const subscriptionId = (invoice as any).subscription as string;
  
  if (subscriptionId) {
    console.log('💰 Payment successful for subscription:', subscriptionId);
    
    // TODO: Record payment in database
    // TODO: Send payment confirmation email
    // TODO: Ensure premium features are enabled
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing failed payment...');
  
  const subscriptionId = (invoice as any).subscription as string;
  
  if (subscriptionId) {
    console.log('❌ Payment failed for subscription:', subscriptionId);
    
    // TODO: Record failed payment attempt
    // TODO: Send payment failed email with retry instructions
    // TODO: Consider suspending premium features if multiple failures
  }
}

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  console.log('Processing trial ending notification...');
  
  // TODO: Send trial ending email to customer
  // TODO: Show in-app notifications about trial ending
  
  console.log('⏰ Trial ending in 3 days for subscription:', subscription.id);
}

export default router;
