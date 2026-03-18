import express from 'express';
import Stripe from 'stripe';
import auth from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_4eC39HqLyjWDarjtT1zdp7dc');

router.post('/create-checkout-session', auth, async (req, res) => {
  const { planName, price, billingCycle } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: planName,
              description: `FarmLens ${planName} Plan (${billingCycle})`,
            },
            unit_amount: price * 100, // Stripe expects amount in paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/membership`,
      metadata: {
        userId: req.userId,
        planName,
        billingCycle
      }
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify session and update user status
router.get('/verify-session', auth, async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === 'paid') {
      const { planName, billingCycle } = session.metadata;
      
      const User = (await import('../models/User.js')).default;
      const Payment = (await import('../models/Payment.js')).default;

      // Update user status
      await User.findByIdAndUpdate(req.userId, {
        isPremium: true,
        membership: planName || 'Pro'
      });

      // Save payment record for admin tracking
      try {
        await Payment.findOneAndUpdate(
          { sessionId: session.id },
          {
            user: req.userId,
            amount: session.amount_total / 100, // back to original currency units
            currency: session.currency,
            planName: planName || 'Pro',
            billingCycle: billingCycle || 'monthly',
            paymentStatus: session.payment_status,
            sessionId: session.id
          },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.error('Error saving payment record:', err);
      }

      res.json({ success: true, plan: planName });
    } else {
      res.json({ success: false, message: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
