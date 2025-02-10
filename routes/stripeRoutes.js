// server/routes/stripeRoutes.js
import express from 'express';
import bodyParser from 'body-parser';
import Stripe from 'stripe';
import { createCheckoutSession } from '../stripe.js';
import User from '../models/User.js';
import logger from '../logger.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

// Create a checkout session.
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount) return res.status(400).json({ error: 'userId and amount required.' });
    const session = await createCheckoutSession({ userId, amount });
    res.json({ sessionId: session.id });
  } catch (error) {
    logger.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session.' });
  }
});

// Secure Stripe webhook endpoint.
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Stripe webhook signature error:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Process the event.
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    // For example, add 10 credits upon successful purchase.
    User.findByIdAndUpdate(userId, { $inc: { credits: 10 } }, { new: true })
      .then((user) => logger.info(`Credits added to user ${user.email}`))
      .catch((error) => logger.error('Error updating credits:', error));
  }
  
  res.json({ received: true });
});

export default router;
