// server/routes/stripeRoutes.js
import express from 'express';
import { createCheckoutSession } from '../stripe.js';

const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const session = await createCheckoutSession({ userId, amount });
    res.json({ sessionId: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
