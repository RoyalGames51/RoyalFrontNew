import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="w-full py-12 bg-surface-container-low border-t border-outline-variant/10 text-on-surface">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        
        {/* Col 1: Brand & Info */}
        <div className="flex flex-col gap-4">
          <span className="text-headline-sm font-headline-sm text-primary font-bold">RGAMES</span>
          <p className="text-on-surface-variant font-body-sm max-w-xs">
            El destino de élite para el juego en línea. Ofrecemos una plataforma segura, justa y lujosa para jugadores de todo el mundo.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="mailto:royalgames2025@gmail.com" className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-xl">mail</span>
              <span className="text-xs">royalgames2025@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <h5 className="text-white font-bold mb-1">Compañía</h5>
            <Link className="text-on-surface-variant hover:text-primary transition-colors font-body-sm" to="/about">Sobre Nosotros</Link>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-sm" href="#">Juego Responsable</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-sm" href="#">Afiliados</a>
          </div>
          <div className="flex flex-col gap-3">
            <h5 className="text-white font-bold mb-1">Legal</h5>
            <Link className="text-on-surface-variant hover:text-primary transition-colors font-body-sm" to="/terminos-y-condiciones">Términos y Condiciones</Link>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-sm" href="#">Política de Privacidad</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-sm" href="#">Reglas de Juego</a>
          </div>
        </div>

        {/* Col 3: Payment Methods & Copyright */}
        <div className="flex flex-col gap-4">
          <h5 className="text-white font-bold mb-1">Métodos de Pago</h5>
          <div className="flex flex-wrap gap-3 opacity-50">
            <div className="w-12 h-8 bg-surface-variant rounded flex items-center justify-center font-bold text-[10px] text-white">VISA</div>
            <div className="w-12 h-8 bg-surface-variant rounded flex items-center justify-center font-bold text-[10px] text-white">MC</div>
            <div className="w-12 h-8 bg-surface-variant rounded flex items-center justify-center font-bold text-[10px] text-white">BTC</div>
            <div className="w-12 h-8 bg-surface-variant rounded flex items-center justify-center font-bold text-[10px] text-white">ETH</div>
          </div>
          <p className="text-on-surface-variant font-body-sm mt-4">
            © 2024 RGAMES. Todos los derechos reservados. Licenciado y regulado.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
