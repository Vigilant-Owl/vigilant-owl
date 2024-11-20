const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = {
  checkout: async (req, res) => {
    try {
      const { priceId } = req.body;
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.SERVER_URL}/billing`,
        cancel_url: `${process.env.SERVER_URL}/billing`,
        metadata: {
          userId: req.userId,
          priceId,
        },
      });
      return res.json({
        data: {
          result: checkoutSession,
        },
        status: "success",
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }
  },
  webhook: async (req, res) => {
    try {
      const sig = req.headers["stripe-signature"];
      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err) {
        // On error, log and return the error message
        console.log(`❌ Error message: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      // Successfully constructed event
      console.log("✅ Success:", event.id);

      // Cast event data to Stripe object
      if (event.type === "payment_intent.succeeded") {
        const stripeObject = event.data.object;
        console.log(`💰 PaymentIntent status: ${stripeObject.status}`);
      } else if (event.type === "charge.succeeded") {
        const charge = event.data.object;
        console.log(`💵 Charge id: ${charge.id}`);
      } else {
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
      }

      res.json({
        received: true,
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }
  },
};
