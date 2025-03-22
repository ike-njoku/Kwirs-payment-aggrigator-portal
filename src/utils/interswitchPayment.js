import { sha512 } from "js-sha512";

export const generateHash = (invoiceData) => {
  if (!invoiceData) return "";
  const hashString = `${invoiceData.PRN}22220000566https://example.com/payment-response${invoiceData.PRN}99999kenny`;
  return sha512(hashString).toUpperCase();
};

export const handleInterswitchPayment = (invoiceData) => {
  if (!invoiceData) return console.error("Invoice data is not available");

  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://newwebpay.qa.interswitchng.com/collections/w/pay";

  const fields = [
    { name: "merchant_code", value: "MX6072" },
    { name: "pay_item_id", value: "9405967" },
    { name: "site_redirect_url", value: "" },
    { name: "txn_ref", value: invoiceData.PRN },
    {
      name: "amount",
      value: invoiceData.amount ? invoiceData.amount * 100 : 0,
    },
    { name: "product_id", value: "566" },
    { name: "cust_name", value: invoiceData.payerName },
    { name: "cust_id", value: invoiceData.payerEmail },
    { name: "currency", value: "566" },
    { name: "hash", value: generateHash(invoiceData) },
  ];

  fields.forEach(({ name, value }) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};
