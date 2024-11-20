const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = require("../config/supabase");

module.exports = {
  checkout: async (req, res) => {
    try {
      const { priceId } = req.body;
      console.log("User Id", req.userId);
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.SERVER_URL}/billing?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.SERVER_URL}/settings`,
        metadata: {
          userId: req.userId,
          priceId,
        },
        customer_email: req.email,
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
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_SECRET_WEBHOOK_KEY
        );
      } catch (err) {
        // On error, log and return the error message
        console.log(`❌ Error message: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      console.log("Event type:", event.type);
      console.log(
        "Full event data:",
        JSON.stringify(event.data.object, null, 2)
      );

      // Successfully constructed event
      console.log("✅ Success:", event.id);

      // Cast event data to Stripe object
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const priceId = session.metadata.priceId;

        // Update user's subscription status in Supabase
        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            current_price_id: priceId,
            subscription_date: new Date(),
          })
          .eq("id", userId);

        if (error) {
          console.error("Error updating user subscription:", error);
        }
        console.log(userId, priceId);
      } else if (event.type === "invoice.payment_succeeded") {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        // Optional: Handle recurring payment confirmations
        const { data: subscriptionData, error: subscriptionError } =
          await supabase
            .from("profiles")
            .select("*")
            .eq("stripe_subscription_id", subscriptionId)
            .single();

        if (subscriptionError) {
          console.error("Error finding subscription:", subscriptionError);
        }
      } else if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object;

        // Update user's subscription status when cancelled
        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_status: "cancelled",
            stripe_subscription_id: null,
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error("Error updating cancelled subscription:", error);
        }
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
  cancelSubscription: async (req, res) => {
    try {
      const { subscriptionId } = req.body;
      const canceledSubscription = await stripe.subscriptions.del(
        subscriptionId
      );
      res.json({
        status: "success",
        message: "Subscription canceled successfully",
        canceledSubscription,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to retrieve session details",
        error: error.message,
      });
    }
  },
  getSessionDetail: async (req, res) => {
    const { sessionId } = req.params;

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      res.json({
        id: session.id,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
      });
    } catch (error) {
      console.error("Error fetching session details:", error);
      res.status(500).json({
        message: "Failed to retrieve session details",
        error: error.message,
      });
    }
  },
};
