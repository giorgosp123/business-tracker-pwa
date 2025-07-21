import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

// Create Payment Intent for subscription
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { priceId, customerId, trialDays = 3, customerEmail } = req.body;

    console.log('Creating payment intent with:', { priceId, customerId, trialDays, customerEmail });

    // Validate required fields
    if (!priceId) {
      return res.status(400).json({ 
        error: 'Missing required field: priceId' 
      });
    }

    let customer;
    
    // Create or retrieve customer
    if (customerId) {
      try {
        customer = await stripe.customers.retrieve(customerId);
      } catch (error) {
        console.log('Customer not found, creating new one');
        customer = null;
      }
    }

    if (!customer || customer.deleted) {
      const customerData: Stripe.CustomerCreateParams = {};
      
      if (customerEmail) {
        customerData.email = customerEmail;
      }

      customer = await stripe.customers.create(customerData);
      console.log('Created new customer:', customer.id);
    }

    // Get price information
    const price = await stripe.prices.retrieve(priceId);
    
    // Create subscription with trial
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price: priceId,
      }],
      trial_period_days: trialDays,
      payment_behavior: 'default_incomplete',
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        source: 'business-tracker-pwa'
      }
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = (invoice as any).payment_intent as Stripe.PaymentIntent;

    console.log('Created subscription:', subscription.id);
    console.log('Payment intent:', paymentIntent?.id);

    res.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret,
      customerId: customer.id,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      amount: price.unit_amount,
      currency: price.currency,
    });

  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      message: error.message 
    });
  }
});

// Get subscription status
router.get('/subscription/:subscriptionId', async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['latest_invoice.payment_intent']
    });

    res.json({
      id: subscription.id,
      status: subscription.status,
      customerId: subscription.customer,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      items: subscription.items.data.map(item => ({
        priceId: item.price.id,
        quantity: item.quantity,
        amount: (item.price as any).unit_amount,
        currency: item.price.currency,
      })),
    });

  } catch (error: any) {
    console.error('Error fetching subscription:', error);
    res.status(404).json({ 
      error: 'Subscription not found',
      message: error.message 
    });
  }
});

// Cancel subscription
router.post('/subscription/:subscriptionId/cancel', async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { cancelImmediately = false } = req.body;

    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: !cancelImmediately,
      ...(cancelImmediately && { cancel_at: 'now' })
    });

    console.log(`Subscription ${subscriptionId} ${cancelImmediately ? 'cancelled immediately' : 'set to cancel at period end'}`);

    res.json({
      id: subscription.id,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    });

  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ 
      error: 'Failed to cancel subscription',
      message: error.message 
    });
  }
});

// Reactivate subscription
router.post('/subscription/:subscriptionId/reactivate', async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
      cancel_at: null
    });

    console.log(`Subscription ${subscriptionId} reactivated`);

    res.json({
      id: subscription.id,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    });

  } catch (error: any) {
    console.error('Error reactivating subscription:', error);
    res.status(500).json({ 
      error: 'Failed to reactivate subscription',
      message: error.message 
    });
  }
});

// Get customer's subscriptions
router.get('/customer/:customerId/subscriptions', async (req, res) => {
  try {
    const { customerId } = req.params;

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      expand: ['data.items.data.price']
    });

    res.json({
      subscriptions: subscriptions.data.map(sub => ({
        id: sub.id,
        status: sub.status,
        currentPeriodStart: new Date((sub as any).current_period_start * 1000),
        currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
        trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        items: sub.items.data.map(item => ({
          priceId: item.price.id,
          amount: (item.price as any).unit_amount,
          currency: item.price.currency,
          interval: (item.price.recurring as any)?.interval,
        }))
      }))
    });

  } catch (error: any) {
    console.error('Error fetching customer subscriptions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch subscriptions',
      message: error.message 
    });
  }
});

export default router;
