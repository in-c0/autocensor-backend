// server/stripe.js
import Stripe from 'stripe';
import logger from './logger.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

/**
 * createCheckoutSession - Creates a Stripe checkout session for credit purchase.
 * @param {Object} params - { userId, amount, currency }
 * @returns {Promise<Object>} - The checkout session.
 */
export async function createCheckoutSession({ userId, amount, currency = 'usd' }) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'Credit Purchase',
              description: 'Purchase credits for AutoCensor analyses.',
            },
            unit_amount: amount, // in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/profile?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout-cancelled`,
      metadata: { userId },
    });
    return session;
  } catch (error) {
    logger.error('Error creating Stripe checkout session:', error);
    throw error;
  }
}
