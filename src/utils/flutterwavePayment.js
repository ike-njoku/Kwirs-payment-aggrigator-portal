import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

export const initiateFlutterwavePayment = ({
  publicKey,
  email,
  phoneNumber,
  firstName,
  lastName,
  setPaymentResponse,
  submitPaymentInfo,
  setPaymentDenied,
  setCanceledPay,
}) => {
  const config = {
    public_key: publicKey,
    tx_ref: Date.now(),
    amount: 2000,
    currency: "NGN",
    payment_options: "card",
    customer: {
      email,
      phone_number: phoneNumber,
      name: `${firstName} ${lastName}`,
    },
    customizations: {
      title: "Payment",
      description: "Payment Information",
      logo: "https://media.istockphoto.com/id/1465234647/vector/bank-with-dollar-sign-icon-with-reflection-on-white-background.jpg?s=612x612&w=0&k=20&c=DuhyPpxbBNsLjScU5D_l1VeuSJ5FkddFRskeromDJys=",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  handleFlutterPayment({
    callback: (response) => {
      console.log(response);
      if (response.status === "completed") {
        const PaymentFlw_ref = response.flw_ref;
        setPaymentResponse(PaymentFlw_ref);
        submitPaymentInfo(response);
      } else {
        setPaymentDenied(true);
      }
      closePaymentModal();
    },
    onClose: () => {
      setCanceledPay(true);
    },
  });
};
