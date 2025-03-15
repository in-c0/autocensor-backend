// server/stripe.js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });
const FRONTEND_URL = process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_URL
  : 'http://localhost:3000';

export async function createCheckoutSession({ userId, amount }) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Analysis Credits',
            description: 'Purchase additional analysis credits for AutoCensor.',
          },
          unit_amount: amount, // in cents
        },
        quantity: 1,
      },
    ],
    success_url: `${FRONTEND_URL}/success`,
    cancel_url: `${FRONTEND_URL}/cancel`,
    metadata: { userId },
  });
  return session;
}
