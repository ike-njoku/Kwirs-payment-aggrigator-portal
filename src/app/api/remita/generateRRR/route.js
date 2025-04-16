// pages/api/remita/generateRRR.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    serviceTypeId,
    amount,
    orderId,
    payerName,
    payerEmail,
    payerPhone,
    description,
  } = req.body;

  const url =
    "https://remitademo.net/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit";

  const remitaConsumerKey = process.env.REMITA_CONSUMER_KEY;
  const remitaConsumerToken = process.env.REMITA_CONSUMER_TOKEN;

  const authHeader = `remitaConsumerKey=${remitaConsumerKey},remitaConsumerToken=${remitaConsumerToken}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        serviceTypeId,
        amount,
        orderId,
        payerName,
        payerEmail,
        payerPhone,
        description,
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("RRR generation failed:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
