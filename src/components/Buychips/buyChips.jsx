import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import API_URL from '../../api/rutaApi';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";
import RankBadge from "../ui/RankBadge/rankBadge";
import { getRankMeta, getNextRank } from "../../utils/rank";

// Import local image assets representing chip packages
import quinientosmil from "../../assets/500000.jpg";
import millon from "../../assets/millon.jpg";
import cincomillones from "../../assets/5millones.jpg";
import quincemillones from "../../assets/15millones.jpg";
import cincuentamillones from "../../assets/50millones.jpg";
import doscincuenta from "../../assets/250millones.jpg";
import billon from "../../assets/1billon.jpg";
import veinticeisb from "../../assets/26billones.jpg";

// Configuración estática de precios y monedas por país
const countryConfig = {
  argentina: { name: "Argentina", currency: "ARS", exchangeRate: 1000, symbol: "$" },
  brasil: { name: "Brasil", currency: "BRL", exchangeRate: 5, symbol: "R$" },
  colombia: { name: "Colombia", currency: "COP", exchangeRate: 5200, symbol: "$" },
  "Estados Unidos": { name: "Estados Unidos (USD)", currency: "USD", exchangeRate: 1, symbol: "$" },
  espana: { name: "España (EUR)", currency: "EUR", exchangeRate: 0.9, symbol: "€" },
  mexico: { name: "México (MXN)", currency: "MXN", exchangeRate: 20, symbol: "$" },
  "resto del mundo": { name: "Resto del Mundo (USD)", currency: "USD", exchangeRate: 1, symbol: "$" },
};

// Opciones de fichas disponibles
const chipOptions = [
  { id: 1, basePrice: 1, amount: 500000, image: quinientosmil },
  { id: 2, basePrice: 2, amount: 1000000, image: millon },
  { id: 3, basePrice: 6, amount: 5000000, image: cincomillones },
  { id: 4, basePrice: 15, amount: 15000000, image: quincemillones },
  { id: 5, basePrice: 50, amount: 50000000, image: cincuentamillones },
  { id: 6, basePrice: 200, amount: 250000000, image: doscincuenta },
  { id: 7, basePrice: 500, amount: 1000000000, image: billon },
  { id: 8, basePrice: 1000, amount: 2600000000, image: veinticeisb },
];

export default function BuyChips() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useSelector((state) => state);
  // Country is taken from the user's profile; if missing, purchases are blocked
  const userCountry = currentUser?.country || null;
  const totalChipsDeposited = Number(currentUser?.totalChipsDeposited || 0);
  const rankMeta = getRankMeta(currentUser?.rank);
  const nextRank = getNextRank(currentUser?.rank);
  const rankProgressPercentage = nextRank
    ? Math.min(Math.round((totalChipsDeposited / nextRank.threshold) * 100), 100)
    : 100;
  const [selectedChip, setSelectedChip] = useState(chipOptions[0]);
  
  // Navigation tabs state: "deposit", "withdraw", "history"
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") === "history" ? "history" : "deposit");
  
  // Active payment method: "paypal", "mercadopago", "visa", "crypto"
  const [paymentMethod, setPaymentMethod] = useState("paypal");

  // Selected bonus state
  const [selectedBonus, setSelectedBonus] = useState("welcome");

  // Real payment history from database
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Simulated withdrawal form state
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState("bank");
  const [withdrawalDetails, setWithdrawalDetails] = useState("");

  // Simulated credit card form state
  const [ccNumber, setCcNumber] = useState("");
  const [ccName, setCcName] = useState("");
  const [ccExpiry, setCcExpiry] = useState("");
  const [ccCvv, setCcCvv] = useState("");

  // Resolve currency/exchange/symbol from user's profile country
  const resolvedKeyForUser = Object.keys(countryConfig).find((k) => {
    if (!userCountry) return false;
    return (
      k.toLowerCase() === userCountry.toLowerCase() ||
      countryConfig[k].name.toLowerCase().startsWith(userCountry.toLowerCase())
    );
  });
  const resolvedConfigForUser = resolvedKeyForUser ? countryConfig[resolvedKeyForUser] : null;
  const { currency, exchangeRate, symbol } = resolvedConfigForUser || countryConfig["Estados Unidos"];

  // Automatically update active payment methods based on country/currency configuration
  useEffect(() => {
    if (!resolvedConfigForUser) return; // can't decide gateway without country
    if (resolvedConfigForUser.currency === "MXN" || resolvedConfigForUser.currency === "ARS" || resolvedConfigForUser.currency === "COP") {
      setPaymentMethod("mercadopago");
    } else {
      setPaymentMethod("paypal");
    }
  }, [resolvedConfigForUser]);

  // Fetch real transaction history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      if (activeTab === "history" && currentUser?.id) {
        setLoadingHistory(true);
        try {
          // Unified movement history: deposits + non-gameplay chip adjustments (already
          // sorted newest-first by the backend).
          const response = await axios.get(`${API_URL}/chips/history`);
          setPaymentHistory(response.data);
        } catch (error) {
        } finally {
          setLoadingHistory(false);
        }
      }
    };
    fetchHistory();
  }, [activeTab, currentUser]);

  // country selection removed — country must be set in user profile
  const handleCountryChange = (e) => {
    // no-op: kept for compatibility
  };

  // Mercado Pago order checkout redirection
  const createOrder = async (method) => {
    if (!currentUser?.id) {
      Swal.fire({
        icon: "warning",
        title: "Sesión requerida",
        text: "Debes iniciar sesión para comprar fichas.",
        confirmButtonColor: "#C9A84C",
      });
      return;
    }

    // Block purchases if user hasn't set country in profile
    if (!userCountry) {
      Swal.fire({
        icon: "warning",
        title: "País no configurado",
        text: "Debes configurar tu país en tu perfil antes de realizar compras.",
        confirmButtonColor: "#C9A84C",
      });
      return;
    }

    if (!selectedChip) {
      Swal.fire({
        icon: "warning",
        title: "Paquete no seleccionado",
        text: "Por favor, selecciona un paquete de fichas primero.",
        confirmButtonColor: "#C9A84C",
      });
      return;
    }

    // Spec Requirement: price must be a string formatted with 2 decimal places
    const formattedPrice = (selectedChip.basePrice * exchangeRate).toFixed(2);

    const payload = {
      userId: currentUser.id,
      chips: parseInt(selectedChip.amount, 10), // Spec Requirement: integer
      price: formattedPrice, // Spec Requirement: string formatted
      currency,
    };

    try {
      Swal.fire({
        title: "Creando orden en Mercado Pago...",
        text: "Por favor espera mientras te redirigimos al portal seguro.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      const response = await axios.post(`${API_URL}/mepago/create-order`, payload);
      
      // Spec Requirement: redirect frontend user to initPoint
      if (response.data && response.data.initPoint) {
        window.location.href = response.data.initPoint;
      } else {
        throw new Error("No initPoint returned from backend");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de Pasarela",
        text: "Hubo un error al generar tu orden de pago. Inténtalo de nuevo.",
        confirmButtonColor: "#C9A84C",
      });
    }
  };

  // Simulated Credit Card checkout flow (offline / mock)
  const handleCreditCardPay = (e) => {
    e.preventDefault();
    if (!ccNumber || !ccName || !ccExpiry || !ccCvv) {
      Swal.fire({
        icon: "error",
        title: "Formulario Incompleto",
        text: "Por favor, llena todos los campos de la tarjeta.",
        confirmButtonColor: "#C9A84C",
      });
      return;
    }

    Swal.fire({
      title: "Procesando pago de tarjeta...",
      text: "Verificando con tu banco emisor...",
      allowOutsideClick: false,
      timer: 2000,
      didOpen: () => {
        Swal.showLoading();
      }
    }).then(async () => {
      Swal.fire({
        icon: "info",
        title: "Pasarela Simulada",
        text: "Las tarjetas simuladas sirven con fines visuales de testeo. Por favor usa Mercado Pago o PayPal para adquirir saldo real.",
        confirmButtonColor: "#C9A84C",
      });
      setCcNumber("");
      setCcName("");
      setCcExpiry("");
      setCcCvv("");
    });
  };

  // Simulated withdrawal submission
  const handleWithdrawalSubmit = (e) => {
    e.preventDefault();
    const amountVal = parseFloat(withdrawalAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      Swal.fire({
        icon: "error",
        title: "Monto Inválido",
        text: "Por favor ingresa un monto válido para retirar.",
        confirmButtonColor: "#C9A84C",
      });
      return;
    }

    if (!withdrawalDetails) {
      Swal.fire({
        icon: "error",
        title: "Datos Faltantes",
        text: "Por favor ingresa la información de cuenta/wallet.",
        confirmButtonColor: "#C9A84C",
      });
      return;
    }

    // Verify chips requirement (1,000 chips = $1.00 USD)
    const chipsRequired = amountVal * 1000;
    if (currentUser && (currentUser.chips || 0) < chipsRequired) {
      Swal.fire({
        icon: "warning",
        title: "Saldo Insuficiente",
        text: `No tienes suficientes fichas. Requieres al menos ${new Intl.NumberFormat('es-ES').format(chipsRequired)} fichas para este retiro.`,
        confirmButtonColor: "#C9A84C",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Solicitud Recibida",
      text: `Tu solicitud de retiro por ${symbol}${amountVal.toFixed(2)} ha sido registrada con éxito. VIP Express: de 2 a 12 horas.`,
      confirmButtonColor: "#C9A84C",
    });

    setWithdrawalAmount("");
    setWithdrawalDetails("");
  };

  // Helper formatting for platform name
  const formatPlatformName = (platform) => {
    if (!platform) return "Sistema";
    switch (platform.toLowerCase()) {
      case "paypal":
        return "PayPal Gateway";
      case "mepago":
        return "Mercado Pago (USD)";
      case "mepago_mx":
        return "Mercado Pago (MXN)";
      case "credit_card":
        return "Tarjeta de Crédito";
      default:
        return platform;
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "Ae36OchhdN8RQxByUJu4LH2G8wKlT0Ps3Id2Eky_7KdMk3ADh1aTzEuqzLowplxWkXMFVNumhm7TUMOC",
        currency: "USD",
      }}
    >
      <main className="flex-grow p-4 md:p-margin-desktop max-w-container-max mx-auto w-full select-none text-on-surface min-h-[85vh] pt-20 md:pt-24 relative">
        
        {/* Step 0: Authentication Shield Overlay if not logged in */}
        {!currentUser?.id && (
          <div className="absolute inset-0 z-50 bg-[#16130d]/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-8 text-center my-6">
            <div className="glass-card max-w-md w-full p-8 rounded-2xl border border-outline-variant/30 space-y-6 shadow-2xl relative">
              <span className="material-symbols-outlined text-[72px] text-primary animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock
              </span>
              <h2 className="font-headline-md text-headline-md text-white font-bold">Sesión Requerida</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Debes iniciar sesión con tu cuenta para acceder a la billetera, depositar fichas y gestionar retiros de forma segura.
              </p>
              <button
                onClick={() => navigate("/")}
                className="w-full royal-gold-gradient py-4 rounded-xl text-[#0A0A0F] font-bold text-md uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg royal-gold-glow cursor-pointer border-0"
              >
                Ir al Lobby / Iniciar Sesión
              </button>
            </div>
          </div>
        )}

        {/* Page Header */}
        <header className="mb-8">
          <h1 className="font-display-lg text-display-lg text-primary tracking-tight mb-2 flex items-center gap-3">
            <span className="material-symbols-outlined text-[40px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance_wallet
            </span>
            Billetera Royal
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Administra tus fondos, adquiere fichas del casino de élite y gestiona tus transacciones seguras.
          </p>
        </header>

        {/* Metric Cards Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* Card 1: Real Chips Balance */}
          <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[72px]">monetization_on</span>
            </div>
            <p className="font-label-md text-label-md text-on-surface-variant mb-2 uppercase tracking-wider">Mi Balance de Fichas</p>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg text-white">
                {new Intl.NumberFormat('es-ES').format(currentUser?.chips || 0)}
              </span>
              <span className="text-primary font-bold text-xs">CHIPS</span>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-400">
              <span className="material-symbols-outlined text-[14px] mr-1">check_circle</span>
              Acreditado y disponible para jugar
            </div>
          </div>

          {/* Card 2: Real Rank */}
          <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[72px]">{rankMeta.icon}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Mi Rango</p>
              <RankBadge tier={currentUser?.rank} size="sm" />
            </div>
            {nextRank ? (
              <>
                <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-full h-2 w-full overflow-hidden mt-4">
                  <div className="royal-gold-gradient h-full rounded-full" style={{ width: `${rankProgressPercentage}%` }}></div>
                </div>
                <p className="mt-2 text-[10px] text-on-surface-variant uppercase tracking-wider">
                  {new Intl.NumberFormat('es-ES').format(totalChipsDeposited)} / {new Intl.NumberFormat('es-ES').format(nextRank.threshold)} hacia {nextRank.label} ({rankProgressPercentage}%)
                </p>
              </>
            ) : (
              <div className="mt-4 flex items-center text-xs text-primary">
                <span className="material-symbols-outlined text-[14px] mr-1">workspace_premium</span>
                Rango máximo alcanzado
              </div>
            )}
          </div>

        </section>

        {/* Interactive Workspace Panel */}
        <div className="glass-card rounded-2xl overflow-hidden mb-12 shadow-2xl">
          
          {/* Navigation Tabs */}
          <div className="flex border-b border-outline-variant/10 bg-[#12121A]/80">
            <button
              onClick={() => setActiveTab("deposit")}
              className={`flex-1 py-4 font-label-lg text-label-lg transition-all border-b-2 font-bold ${
                activeTab === "deposit"
                  ? "text-primary border-primary bg-primary/5"
                  : "text-on-surface-variant hover:text-on-surface border-transparent"
              }`}
            >
              Depositar Fondos
            </button>
            <button
              onClick={() => setActiveTab("withdraw")}
              className={`flex-1 py-4 font-label-lg text-label-lg transition-all border-b-2 font-bold ${
                activeTab === "withdraw"
                  ? "text-primary border-primary bg-primary/5"
                  : "text-on-surface-variant hover:text-on-surface border-transparent"
              }`}
            >
              Retirar Ganancias
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-4 font-label-lg text-label-lg transition-all border-b-2 font-bold ${
                activeTab === "history"
                  ? "text-primary border-primary bg-primary/5"
                  : "text-on-surface-variant hover:text-on-surface border-transparent"
              }`}
            >
              Historial de Transacciones
            </button>
          </div>

          <div className="p-6 md:p-10">
            
            {/* VIEW 1: DEPOSIT & CHEKOUT */}
            {activeTab === "deposit" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Side: Configuration & Grid (Col-Span 7) */}
                <div className="lg:col-span-7 space-y-8 text-left">
                  
                  {/* Step 1: Select Chip Package */}
                  <div>
                    <label className="font-label-lg text-label-lg text-primary mb-3 block uppercase tracking-wider">
                      1. Selecciona un Paquete de Fichas
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {chipOptions.map((chip) => {
                        const isSelected = selectedChip?.id === chip.id;
                        const formattedPrice = (chip.basePrice * exchangeRate).toFixed(2);
                        return (
                          <button
                            key={chip.id}
                            onClick={() => setSelectedChip(chip)}
                            className={`glass-card rounded-xl p-3 flex flex-col items-center justify-between text-center transition-all cursor-pointer select-none group relative overflow-hidden active:scale-95 border ${
                              isSelected
                                ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(201,168,76,0.25)]"
                                : "border-outline-variant/20 hover:border-primary/50"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 bg-primary rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                                <span className="material-symbols-outlined text-[12px] text-[#0A0A0F] font-bold">check</span>
                              </div>
                            )}
                            <div className="w-full aspect-square rounded-lg overflow-hidden mb-3">
                              <img
                                src={chip.image}
                                alt={`Fichas ${chip.amount}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="space-y-1 w-full">
                              <p className="text-xs font-bold text-white uppercase tracking-tighter truncate">
                                {new Intl.NumberFormat('es-ES').format(chip.amount)}
                              </p>
                              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider block">FICHAS</p>
                              <div className="bg-[#0A0A0F] py-1 px-2 rounded-full border border-outline-variant/10 mt-1">
                                <span className="text-xs font-bold text-primary">
                                  {symbol} {new Intl.NumberFormat('es-ES').format(formattedPrice)}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Select Payment Method */}
                  <div>
                    <label className="font-label-lg text-label-lg text-primary mb-3 block uppercase tracking-wider">
                      2. Método de Pago Disponible
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      
                      {/* PayPal Button */}
                      {currency !== "MXN" && (
                        <button
                          onClick={() => setPaymentMethod("paypal")}
                          className={`glass-card p-4 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all ${
                            paymentMethod === "paypal"
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-outline-variant/30 hover:border-primary/45"
                          }`}
                        >
                          <span className="material-symbols-outlined text-primary text-[28px]">payments</span>
                          <span className="text-xs font-bold text-white">PayPal</span>
                        </button>
                      )}

                      {/* Mercado Pago Button */}
                      <button
                        onClick={() => setPaymentMethod("mercadopago")}
                        className={`glass-card p-4 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all ${
                          paymentMethod === "mercadopago"
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-outline-variant/30 hover:border-primary/45"
                        }`}
                      >
                        <span className="material-symbols-outlined text-primary text-[28px]">qr_code_scanner</span>
                        <span className="text-xs font-bold text-white">Mercado Pago</span>
                      </button>

                      {/* Visa / MasterCard */}
                      <button
                        onClick={() => setPaymentMethod("visa")}
                        className={`glass-card p-4 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all ${
                          paymentMethod === "visa"
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-outline-variant/30 hover:border-primary/45"
                        }`}
                      >
                        <span className="material-symbols-outlined text-primary text-[28px]">credit_card</span>
                        <span className="text-xs font-bold text-white">Tarjeta de Crédito</span>
                      </button>

                      {/* Crypto Options */}
                      <button
                        onClick={() => setPaymentMethod("crypto")}
                        className={`glass-card p-4 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all ${
                          paymentMethod === "crypto"
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-outline-variant/30 hover:border-primary/45"
                        }`}
                      >
                        <span className="material-symbols-outlined text-primary text-[28px]">currency_bitcoin</span>
                        <span className="text-xs font-bold text-white">Criptomonedas</span>
                      </button>

                    </div>

                    <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20 flex gap-3 text-left">
                      <span className="material-symbols-outlined text-primary">info</span>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {paymentMethod === "paypal" && "Los depósitos a través de PayPal se acreditan instantáneamente tras la confirmación de la venta en nuestro backend."}
                        {paymentMethod === "mercadopago" && "Mediante Mercado Pago redirigiremos tu sesión de forma segura para completar el pago. Recibimos USD y MXN locales."}
                        {paymentMethod === "visa" && "Las tarjetas se manejan de forma segura. Esta opción simula los flujos del banco emisor."}
                        {paymentMethod === "crypto" && "Recibe un bono del 10% adicional al depositar con criptomonedas (BTC / USDT)."}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Right Side: Checkout summary & Actions (Col-Span 5) */}
                <div className="lg:col-span-5">
                  <div className="glass-card p-6 rounded-2xl border border-outline-variant/20 relative overflow-hidden bg-[#12121A]/60 flex flex-col h-full justify-between">
                    
                    {/* Atmospheric gold glow */}
                    <div className="absolute inset-0 royal-gold-gradient opacity-[0.02] blur-3xl pointer-events-none"></div>

                    <div className="space-y-6 text-left relative z-10">
                      <h3 className="font-headline-sm text-headline-sm text-white border-b border-outline-variant/10 pb-4">
                        Resumen del Depósito
                      </h3>

                      {/* Selected package detail */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-on-surface-variant">Paquete Seleccionado</span>
                          <span className="text-white font-bold">
                            {selectedChip ? new Intl.NumberFormat('es-ES').format(selectedChip.amount) : "0"} Fichas
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-on-surface-variant">Moneda / Divisa</span>
                          <span className="text-primary font-bold">{currency}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-outline-variant/10 pb-4">
                          <span className="text-on-surface-variant">Bono Adicional</span>
                          <span className="text-green-400 font-bold">
                            {selectedBonus === "welcome" && "+100% de Recarga"}
                            {selectedBonus === "crypto" && "+10% Bono Cripto"}
                            {selectedBonus === "weekly" && "+25 Giros Gratis"}
                            {selectedBonus === "none" && "Ninguno"}
                          </span>
                        </div>
                        <div className="flex justify-between items-end pt-2">
                          <span className="font-label-lg text-label-lg text-white">Total a Pagar:</span>
                          <span className="font-headline-lg text-headline-lg text-primary">
                            {symbol} {selectedChip ? new Intl.NumberFormat('es-ES').format((selectedChip.basePrice * exchangeRate).toFixed(2)) : "0.00"}
                          </span>
                        </div>
                      </div>

                      {/* Available Bonuses Selector */}
                      <div className="space-y-2">
                        <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">
                          Bonos Disponibles
                        </label>
                        <div className="relative">
                          <select
                            value={selectedBonus}
                            onChange={(e) => setSelectedBonus(e.target.value)}
                            className="w-full bg-[#0A0A0F] border border-outline-variant/30 rounded-xl py-3 px-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer appearance-none"
                          >
                            <option value="none">Sin Bono (Continuar sin bono)</option>
                            <option value="welcome">100% de Recarga (Hasta $500)</option>
                            <option value="crypto">10% de Reembolso Cripto</option>
                            <option value="weekly">Guerrero del Fin de Semana (25 Giros Gratis)</option>
                          </select>
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-primary">
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* GATEWAYS ACTIVE REGION */}
                    <div className="mt-8 pt-6 border-t border-outline-variant/10 relative z-10 space-y-4">
                      
                      {/* PAYPAL ACTIVE RENDER */}
                      {paymentMethod === "paypal" && (
                        <div className="w-full">
                          <PayPalButtons
                            style={{ layout: "vertical", shape: "pill", label: "pay" }}
                            createOrder={async (data, actions) => {
                              // Spec Requirement: price must be a string ("10.00"), chips must be integer, real userId
                              const priceStr = (selectedChip.basePrice * exchangeRate).toFixed(2);
                              const chipsInt = parseInt(selectedChip.amount, 10);
                              
                              try {
                                const response = await axios.post(`${API_URL}/paypal/create-order`, {
                                  userId: currentUser?.id,
                                  price: priceStr,
                                  chips: chipsInt,
                                });
                                return response.data.orderId; // Return orderId to PayPal SDK
                              } catch (err) {
                                Swal.fire({
                                  icon: "error",
                                  title: "Error de PayPal",
                                  text: "No se pudo iniciar el pago en los servidores de PayPal.",
                                  confirmButtonColor: "#C9A84C",
                                });
                                throw err;
                              }
                            }}
                            onApprove={async (data, actions) => {
                              // Spec Requirement: Call /capture-paypal-order to close sale and credit chips
                              const priceStr = (selectedChip.basePrice * exchangeRate).toFixed(2);
                              const chipsInt = parseInt(selectedChip.amount, 10);

                              Swal.fire({
                                title: "Capturando Pago...",
                                text: "Confirmando tu depósito con los servidores de PayPal.",
                                allowOutsideClick: false,
                                didOpen: () => {
                                  Swal.showLoading();
                                }
                              });

                              try {
                                const response = await axios.post(`${API_URL}/capture-paypal-order`, {
                                  orderId: data.orderID,
                                  userId: currentUser?.id,
                                  chips: chipsInt,
                                  price: priceStr,
                                });

                                Swal.fire({
                                  icon: "success",
                                  title: "¡Depósito Exitoso!",
                                  text: `¡Pago completado! Se han acreditado ${new Intl.NumberFormat('es-ES').format(selectedChip.amount)} fichas en tu cuenta.`,
                                  confirmButtonColor: "#C9A84C",
                                }).then(() => {
                                  // Refresh browser state or redirect
                                  window.location.reload();
                                });
                              } catch (err) {
                                Swal.fire({
                                  icon: "error",
                                  title: "Error de Captura",
                                  text: "No se pudo completar la captura del pago. Por favor contacta al soporte técnico.",
                                  confirmButtonColor: "#C9A84C",
                                });
                              }
                            }}
                            onError={(err) => {
                              Swal.fire({
                                icon: "error",
                                  title: "Transacción Fallida",
                                  text: "Hubo un error con la pasarela de PayPal.",
                                  confirmButtonColor: "#C9A84C",
                              });
                            }}
                          />
                        </div>
                      )}

                      {/* MERCADO PAGO ACTIVE RENDER */}
                      {paymentMethod === "mercadopago" && (
                        <button
                          onClick={createOrder}
                          className="w-full royal-gold-gradient py-4 rounded-xl text-[#0A0A0F] font-bold text-md uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-lg royal-gold-glow flex items-center justify-center gap-2 cursor-pointer border-0"
                        >
                          <span className="material-symbols-outlined text-[20px] font-bold">qr_code_scanner</span>
                          Proceder con Mercado Pago
                        </button>
                      )}

                      {/* CREDIT CARD ACTIVE RENDER (SIMULATED FORM) */}
                      {paymentMethod === "visa" && (
                        <form onSubmit={handleCreditCardPay} className="space-y-3 text-left">
                          <div>
                            <input
                              type="text"
                              placeholder="Número de Tarjeta"
                              value={ccNumber}
                              onChange={(e) => setCcNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                              className="w-full bg-[#0A0A0F] border border-outline-variant/30 rounded-xl py-3 px-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Exp (MM/AA)"
                              value={ccExpiry}
                              onChange={(e) => setCcExpiry(e.target.value.slice(0, 5))}
                              className="bg-[#0A0A0F] border border-outline-variant/30 rounded-xl py-3 px-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                            <input
                              type="password"
                              placeholder="CVV"
                              value={ccCvv}
                              onChange={(e) => setCcCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                              className="bg-[#0A0A0F] border border-outline-variant/30 rounded-xl py-3 px-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="Nombre del Tarjetahabiente"
                              value={ccName}
                              onChange={(e) => setCcName(e.target.value.toUpperCase())}
                              className="w-full bg-[#0A0A0F] border border-outline-variant/30 rounded-xl py-3 px-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full royal-gold-gradient py-4 rounded-xl text-[#0A0A0F] font-bold text-md uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-lg royal-gold-glow flex items-center justify-center gap-2 cursor-pointer border-0 mt-2"
                          >
                            <span className="material-symbols-outlined text-[20px] font-bold">shield</span>
                            Depositar Ahora
                          </button>
                        </form>
                      )}

                      {/* CRYPTO ACTIVE RENDER (SIMULATED ADDRESS) */}
                      {paymentMethod === "crypto" && (
                        <div className="space-y-4 text-left p-4 border border-[#2A2A36] rounded-xl bg-[#0A0A0F]">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-white">Depósito BTC / USDT (TRC20)</span>
                            <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold">+10% BONO</span>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Dirección de depósito de red</p>
                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                readOnly
                                value="TY51c7t1e6Z9P1eZ98pP1eA918hC9A84CF"
                                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface-variant select-all outline-none font-mono"
                              />
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText("TY51c7t1e6Z9P1eZ98pP1eA918hC9A84CF");
                                  Swal.fire({
                                    toast: true,
                                    position: 'top-end',
                                    icon: 'success',
                                    title: 'Dirección copiada al portapapeles',
                                    showConfirmButton: false,
                                    timer: 1500
                                  });
                                }}
                                className="p-2 border border-outline-variant/30 rounded-lg hover:bg-surface-variant/50 transition-colors text-primary flex items-center justify-center bg-transparent"
                              >
                                <span className="material-symbols-outlined text-sm">content_copy</span>
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-[10px] text-on-surface-variant leading-relaxed">
                            Envía tus fondos a la dirección anterior y se acreditarán automáticamente tras 2 confirmaciones en el blockchain.
                          </p>
                        </div>
                      )}

                      {/* SSL Security badges */}
                      <div className="flex justify-center items-center gap-6 opacity-30 pt-2">
                        <span className="material-symbols-outlined text-[28px] text-white">shield_lock</span>
                        <span className="material-symbols-outlined text-[28px] text-white">verified_user</span>
                        <span className="material-symbols-outlined text-[28px] text-white">lock_reset</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* VIEW 2: WITHDRAWAL FORM */}
            {activeTab === "withdraw" && (
              <div className="max-w-3xl mx-auto text-left space-y-8">
                
                {/* VIP Rule warning */}
                <div className="glass-card p-6 rounded-2xl border-l-4 border-l-primary flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary text-3xl">info</span>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-white mb-2">Retiros de Casino VIP Express</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Como miembro VIP activo, disfrutas de retiros con verificación automatizada en un plazo máximo de 12 horas.
                      Por favor, ten en cuenta que las fichas ganadas en partidas promocionales de bienvenida deben cumplir con un volumen de juego mínimo.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleWithdrawalSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Amount to withdraw */}
                    <div className="space-y-2">
                      <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">
                        Monto del Retiro ({currency})
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary font-bold">
                          {symbol}
                        </div>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={withdrawalAmount}
                          onChange={(e) => setWithdrawalAmount(e.target.value)}
                          className="w-full bg-[#0A0A0F] border border-outline-variant/30 rounded-xl py-4 pl-10 pr-4 text-lg font-bold text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                      </div>
                      <span className="text-[10px] text-on-surface-variant">Tasa de equivalencia: 1,000 fichas = 1.00 USD</span>
                    </div>

                    {/* Withdrawal Method */}
                    <div className="space-y-2">
                      <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">
                        Método de Retiro
                      </label>
                      <div className="relative">
                        <select
                          value={withdrawalMethod}
                          onChange={(e) => setWithdrawalMethod(e.target.value)}
                          className="w-full bg-[#0A0A0F] border border-outline-variant/30 rounded-xl py-4 px-4 text-body-md text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer appearance-none"
                        >
                          <option value="bank">Transferencia Bancaria Local</option>
                          <option value="paypal">PayPal Express Checkout</option>
                          <option value="btc">Bitcoin Wallet</option>
                          <option value="usdt">USDT Wallet (TRC20)</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-primary">
                          <span className="material-symbols-outlined">expand_more</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transfer details / wallets */}
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-wider">
                      Datos de la Cuenta / Wallet de Destino
                    </label>
                    <textarea
                      rows="3"
                      placeholder={
                        withdrawalMethod === "bank"
                          ? "Escribe tu Banco, CBU, CVU, Alias o Número de cuenta con titular..."
                          : withdrawalMethod === "paypal"
                          ? "Escribe tu correo electrónico de PayPal..."
                          : "Escribe tu dirección de Wallet criptomonedas..."
                      }
                      value={withdrawalDetails}
                      onChange={(e) => setWithdrawalDetails(e.target.value)}
                      className="w-full bg-[#0A0A0F] border border-outline-variant/30 rounded-xl py-4 px-4 text-body-md text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full royal-gold-gradient py-5 rounded-xl text-[#0A0A0F] font-bold text-md uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-lg royal-gold-glow flex items-center justify-center gap-2 cursor-pointer border-0 mt-4"
                  >
                    <span className="material-symbols-outlined text-[20px] font-bold">outbox</span>
                    Enviar Solicitud de Retiro Express
                  </button>

                </form>

              </div>
            )}

            {/* VIEW 3: TRANSACTION LOGS */}
            {activeTab === "history" && (
              <div className="space-y-6">
                
                <div className="flex justify-between items-center text-left">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-white mb-1">Registro de Auditoría Financiera</h3>
                    <p className="text-body-sm text-on-surface-variant">Tus últimos movimientos, depósitos y retiros en el casino.</p>
                  </div>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden border border-outline-variant/10">
                  <div className="overflow-x-auto no-scrollbar">
                    {loadingHistory ? (
                      <div className="flex flex-col items-center justify-center p-12 gap-3 bg-[#12121A]">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-on-surface-variant">Cargando transacciones reales...</span>
                      </div>
                    ) : paymentHistory.length > 0 ? (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-variant/20 border-b border-outline-variant/10">
                            <th className="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Fecha / Hora</th>
                            <th className="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Método</th>
                            <th className="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-right">Monto</th>
                            <th className="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-center">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10 text-sm">
                          {paymentHistory.map((item) => {
                            const typeMeta = {
                              deposit: { icon: "south_west", color: "text-green-400", label: "Depósito" },
                              welcome: { icon: "redeem", color: "text-primary", label: "Bono de Bienvenida" },
                              admin_adjustment: {
                                icon: item.chips >= 0 ? "add_circle" : "remove_circle",
                                color: item.chips >= 0 ? "text-green-400" : "text-error",
                                label: "Ajuste Administrativo",
                              },
                            }[item.type];

                            const statusMeta = {
                              approved: { label: "Completado", className: "bg-green-500/10 text-green-400" },
                              pending: { label: "Pendiente", className: "bg-amber-500/10 text-amber-400" },
                              rejected: { label: "Rechazado", className: "bg-error/10 text-error" },
                              cancelled: { label: "Cancelado", className: "bg-gray-500/10 text-gray-400" },
                              refunded: { label: "Reembolsado", className: "bg-gray-500/10 text-gray-400" },
                            }[item.status] || { label: item.status, className: "bg-gray-500/10 text-gray-400" };

                            return (
                              <tr key={item.id} className="hover:bg-surface-variant/10 transition-colors">
                                <td className="px-6 py-4 text-on-surface">
                                  {new Date(item.date).toLocaleString('es-ES', {
                                    day: '2-digit', month: 'short', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                  })}
                                </td>
                                <td className="px-6 py-4">
                                  <div className={`flex items-center gap-2 ${typeMeta.color}`}>
                                    <span className="material-symbols-outlined text-sm">{typeMeta.icon}</span>
                                    <span className="font-bold">{typeMeta.label}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-on-surface-variant">
                                  {formatPlatformName(item.paymentPlatform)}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-white">
                                  {item.type === "deposit" ? (
                                    <>
                                      + {symbol} {new Intl.NumberFormat('es-ES').format(parseFloat(item.price).toFixed(2))}
                                      <span className="block text-[11px] font-normal text-on-surface-variant">
                                        {new Intl.NumberFormat('es-ES').format(item.chips)} fichas
                                      </span>
                                    </>
                                  ) : (
                                    <span className={typeMeta.color}>
                                      {item.chips >= 0 ? "+" : ""}{new Intl.NumberFormat('es-ES').format(item.chips)} fichas
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusMeta.className}`}>
                                    {statusMeta.label}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-12 text-center text-on-surface-variant bg-[#12121A]">
                        <span className="material-symbols-outlined text-[48px] text-outline mb-2">history</span>
                        <p className="font-body-md text-body-md">No tienes transacciones registradas aún.</p>
                        <p className="text-xs text-outline mt-1">Los depósitos aprobados se mostrarán en esta lista en tiempo real.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </main>
    </PayPalScriptProvider>
  );
}
