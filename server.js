const express = require("express");
const app = express();
const { resolve } = require("path");
const port = process.env.PORT || 3000;

// Importing the dotenv module to use environment variables:
require("dotenv").config();

// Setting up the static folder:
const staticDir = process.env.STATIC_DIR || "client";
app.use(express.static(resolve(__dirname, staticDir)));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  const indexPath = resolve(__dirname, staticDir, "index.html");
  res.sendFile(indexPath);
});

// Other routes...

const domainURL = process.env.DOMAIN || `http://localhost:${port}`;
app.post("/create-checkout-session/:pid", async (req, res) => {
  const priceId = req.params.pid;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${domainURL}/success?id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainURL}/cancel`,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
  });
  res.json({
    id: session.id,
  });
});

// Server listening:
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
  console.log(`You may access your app at: ${domainURL}`);
});
