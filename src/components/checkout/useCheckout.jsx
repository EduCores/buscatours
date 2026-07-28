import { useState } from "react";
import { useTranslation } from '../../i18n/LanguageContext';
import { formatPrice } from "../../data/translations";

export const crossSellingOptions = [
  { id: "poles", name: "Alquiler de Bastones de Trekking", price: 10, description: "Evita lesiones e incrementa tu estabilidad en senderos." },
  { id: "transfer", name: "Transfer Privado Aeropuerto-Hotel", price: 30, description: "Viaja cómodo desde el aeropuerto hasta tu hotel." },
  { id: "insurance", name: "Seguro de Cancelación Flexible", price: 15, description: "Cancela sin costo hasta 2 horas antes de salir." }
];

export function useCheckout({ tour, guests, t }) {
  const [step, setStep] = useState(1); // 1: Cross-selling, 2: Payment forms, 3: Success
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // B2C: Carbon offset and Split Payment states
  const [carbonOffset, setCarbonOffset] = useState(false);
  const [splitPayment, setSplitPayment] = useState(false);
  const [successBookingId, setSuccessBookingId] = useState("");
  const [pixCopied, setPixCopied] = useState(false);

  // Determine local vs international gateway
  const isChileTour = tour.location.toLowerCase().includes("chile");
  const isLocalTour = isChileTour || tour.location.toLowerCase().includes("patagonia") || tour.location.toLowerCase().includes("argentina");
  const defaultPaymentMethod = isChileTour ? "webpay" : isLocalTour ? "mercadopago" : "card";
  const [paymentMethod, setPaymentMethod] = useState(defaultPaymentMethod);

  const basePriceConverted = tour.price * guests;
  const addonsTotal = selectedAddons.reduce((acc, id) => {
    const opt = crossSellingOptions.find((o) => o.id === id);
    return acc + (opt ? opt.price : 0);
  }, 0);

  const carbonOffsetCost = carbonOffset ? 1.50 * guests : 0;
  const finalPriceUSD = basePriceConverted + addonsTotal + carbonOffsetCost;

  // PIX mock (local only): amount in BRL + simulated EMV brcode + copy handler
  const pixRate = 5.4;
  const pixBRL = Math.round(finalPriceUSD * pixRate * 100) / 100;
  const pixBRLStr = `R$ ${pixBRL.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const pixAmountStr = pixBRL.toFixed(2);
  const pixBrcode = `00020126360014BR.GOV.BCB.PIX0114+551198765432152040000530398654${String(pixAmountStr.length).padStart(2, "0")}${pixAmountStr}5802BR5910BuscaTours6009SaoPaulo62070503***6304SIMU`;
  const copyPix = async () => {
    try { await navigator.clipboard.writeText(pixBrcode); } catch (e) { /* mock: ignore */ }
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  const toggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePaymentSubmit = (e, onBookingSuccess) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setErrorMessage(t("checkoutErrNameEmail", "Por favor ingresa tu nombre y correo."));
      return;
    }

    if (paymentMethod === "card" && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim())) {
      setErrorMessage(t("checkoutErrCard", "Por favor completa los datos de tu tarjeta."));
      return;
    }

    setErrorMessage("");
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
      const generatedId = "BT-" + Math.floor(10000 + Math.random() * 90000);
      setSuccessBookingId(generatedId);

      const paymentLabels = {
        card: "Stripe Credit Card",
        webpay: "Webpay / Transbank",
        mercadopago: splitPayment ? "MercadoPago (Split Dividido)" : "MercadoPago",
        paypal: "PayPal",
        applepay: "Apple Pay",
        googlepay: "Google Pay",
        pix: "PIX (Banco Central do Brasil)"
      };

      const bookingData = {
        bookingId: generatedId,
        tourId: tour.id,
        tourTitle: tour.title,
        tourImage: tour.image,
        date: tour.date,
        guests: guests,
        totalPriceUSD: finalPriceUSD,
        fullName: fullName,
        email: email,
        addons: [
          ...selectedAddons.map((id) => crossSellingOptions.find((o) => o.id === id).name),
          ...(carbonOffset ? ["Compensación CO₂ (Reforestación)"] : []),
          ...(splitPayment ? ["Split-Payment Activo"] : [])
        ],
        gateway: paymentLabels[paymentMethod],
        status: "Confirmada",
        createdAt: new Date().toLocaleDateString(),
        isSplit: splitPayment,
        splitShareUSD: splitPayment ? Math.round(finalPriceUSD / guests) : 0,
        paidAmountUSD: splitPayment ? Math.round(finalPriceUSD / guests) : finalPriceUSD,
        friendsPaid: []
      };
      onBookingSuccess(bookingData);
    }, 2500);
  };

  return {
    step, setStep,
    selectedAddons, toggleAddon,
    fullName, setFullName,
    email, setEmail,
    cardNumber, setCardNumber,
    cardExpiry, setCardExpiry,
    cardCvc, setCardCvc,
    isProcessing,
    errorMessage, setErrorMessage,
    carbonOffset, setCarbonOffset,
    splitPayment, setSplitPayment,
    successBookingId,
    pixCopied, copyPix,
    isChileTour,
    paymentMethod, setPaymentMethod,
    basePriceConverted, addonsTotal, finalPriceUSD,
    pixBRLStr, pixBrcode,
    handlePaymentSubmit
  };
}
