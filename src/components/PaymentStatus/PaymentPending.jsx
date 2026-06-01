import { useNavigate } from "react-router-dom";

export default function PaymentPending() {
  const navigate = useNavigate();

  return (
    <div className="flex-grow flex items-center justify-center p-4 md:p-margin-desktop min-h-[80vh] relative overflow-hidden select-none text-on-surface">
      
      {/* Background atmospheric amber spots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-radial-gradient from-tertiary-container/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="glass-card max-w-lg w-full p-8 md:p-10 rounded-2xl border border-outline-variant/30 text-center space-y-8 shadow-2xl relative">
        
        {/* Animated Hourglass Icon */}
        <div className="relative mx-auto w-24 h-24 rounded-full border-4 border-tertiary-container/20 p-2 flex items-center justify-center bg-[#0A0A0F]/80 shadow-[0_0_30px_rgba(199,169,82,0.15)]">
          <span className="material-symbols-outlined text-[54px] text-tertiary animate-spin" style={{ animationDuration: "3s" }}>
            hourglass_top
          </span>
        </div>

        {/* Header Title */}
        <div className="space-y-2">
          <h1 className="font-display-lg text-headline-lg text-white font-extrabold tracking-tight">
            Transacción Pendiente
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed px-2">
            Mercado Pago se encuentra validando tu depósito. Tus fichas se acreditarán de manera automática tan pronto como recibamos la señal del servidor.
          </p>
        </div>

        {/* Transaction Detail Card */}
        <div className="bg-[#0A0A0F]/60 border border-outline-variant/20 rounded-xl p-5 text-left space-y-4">
          <div className="flex justify-between items-center text-sm pb-3 border-b border-outline-variant/10">
            <span className="text-on-surface-variant">Estado del Depósito</span>
            <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-tertiary text-[10px] font-bold uppercase tracking-wider">
              Verificando Fondos
            </span>
          </div>
          <div className="flex justify-between items-center text-sm pb-3 border-b border-outline-variant/10">
            <span className="text-on-surface-variant">Plataforma</span>
            <span className="text-white font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-tertiary">pending_actions</span>
              Mercado Pago API
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-on-surface-variant">Tiempo Estimado</span>
            <span className="text-white font-bold">
              De 5 a 15 minutos
            </span>
          </div>
        </div>

        {/* Interactive Action CTA Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => navigate("/")}
            className="royal-gold-gradient py-4 rounded-xl text-[#0A0A0F] font-bold text-sm uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-lg royal-gold-glow cursor-pointer border-0"
          >
            Ir al Lobby
          </button>
          
          <button
            onClick={() => navigate("/chips")}
            className="py-4 rounded-xl border border-primary/20 text-primary font-bold text-sm uppercase tracking-wider hover:bg-primary/5 active:scale-[0.98] transition-all cursor-pointer bg-transparent"
          >
            Ver Mi Billetera
          </button>
        </div>

        {/* SSL Encryption lock */}
        <div className="flex items-center justify-center gap-2 opacity-30 text-xs">
          <span className="material-symbols-outlined text-sm">update</span>
          <span>Actualización automática activada</span>
        </div>

      </div>
    </div>
  );
}
