import { Wallet } from "@mercadopago/sdk-react";
import Swal from "sweetalert2";
import axios from "axios";
import API_URL from '../../api/rutaApi';

export default function MercadoPagoWallet({ preferenceId, currentUser, selectedChip, exchangeRate, symbol, currency }) {
  
  // Opcionalmente, puedes generar la preferencia aquí
  const handleCreatePreference = async () => {
    if (!currentUser?.id) {
      Swal.fire({
        icon: "warning",
        title: "Sesión requerida",
        text: "Debes iniciar sesión para comprar fichas.",
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

    const formattedPrice = (selectedChip.basePrice * exchangeRate).toFixed(2);

    const payload = {
      userId: currentUser.id,
      chips: parseInt(selectedChip.amount, 10),
      price: formattedPrice,
      currency,
    };

    try {
      Swal.fire({
        title: "Creando orden en Mercado Pago...",
        text: "Por favor espera mientras generamos tu preferencia de pago.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await axios.post(`${API_URL}/mepago/create-preference`, payload);
      
      if (response.data && response.data.preferenceId) {
        // La preferencia se ha creado exitosamente
        // El componente Wallet la utilizará automáticamente
        Swal.close();
        return response.data.preferenceId;
      } else {
        throw new Error("No preferenceId returned from backend");
      }
    } catch (error) {
      console.error("Error al crear la preferencia de Mercado Pago:", error);
      Swal.fire({
        icon: "error",
        title: "Error de Pasarela",
        text: "Hubo un error al generar tu preferencia de pago. Inténtalo de nuevo.",
        confirmButtonColor: "#C9A84C",
      });
    }
  };

  return (
    <div className="w-full">
      {preferenceId ? (
        <Wallet initialization={{ preferenceId }} />
      ) : (
        <button
          onClick={handleCreatePreference}
          className="w-full royal-gold-gradient py-4 rounded-xl text-[#0A0A0F] font-bold text-md uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-lg royal-gold-glow flex items-center justify-center gap-2 cursor-pointer border-0"
        >
          <span className="material-symbols-outlined text-[20px] font-bold">qr_code_scanner</span>
          Crear Preferencia de Pago
        </button>
      )}
    </div>
  );
}
