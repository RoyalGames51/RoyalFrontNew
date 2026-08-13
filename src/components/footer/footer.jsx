import { Link } from 'react-router-dom';
import rgamesLogo from '../../assets/rgames.png';

function Footer() {
  return (
    <footer className="bg-surface py-20 px-6 border-t border-white/5 text-on-surface select-none">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between gap-12 text-left">
        {/* Left column: Brand information */}
        <div className="max-w-xs">
          <img
            alt="RGAMES"
            className="h-10 w-auto mb-8 grayscale brightness-200 object-contain"
            src={rgamesLogo}
          />
          <p className="text-on-surface-variant text-sm font-light leading-relaxed mb-6">
            La cúspide del juego de lujo digital. Ofrecemos una plataforma segura, justa y sofisticada para los jugadores más exigentes del mundo.
          </p>
          <div className="flex gap-4">
            <a
              className="w-10 h-10 rounded border border-white/10 flex items-center justify-center hover:bg-white/5 hover:text-primary transition-all"
              href="#"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-lg">public</span>
            </a>
            <a
              className="w-10 h-10 rounded border border-white/10 flex items-center justify-center hover:bg-white/5 hover:text-primary transition-all"
              href="#"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-lg">share</span>
            </a>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm uppercase tracking-widest font-bold">
          <div className="flex flex-col gap-4">
            <h5 className="text-white mb-2 font-black">Legado</h5>
            <Link className="text-on-surface-variant hover:text-primary transition-colors normal-case font-normal" to="/about">
              Nuestra Historia
            </Link>
            <a className="text-on-surface-variant hover:text-primary transition-colors normal-case font-normal" href="#">
              Juego Responsable
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors normal-case font-normal" href="#">
              Lounge VIP
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="text-white mb-2 font-black">Conserjería</h5>
            <a className="text-on-surface-variant hover:text-primary transition-colors normal-case font-normal" href="mailto:royalgames2025@gmail.com">
              Contacto
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors normal-case font-normal" href="#">
              Preguntas Frecuentes
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors normal-case font-normal" href="#">
              Mesa de Ayuda
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="text-white mb-2 font-black">Protocolo</h5>
            <Link className="text-on-surface-variant hover:text-primary transition-colors normal-case font-normal" to="/terminos-y-condiciones">
              Privacidad
            </Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors normal-case font-normal" to="/terminos-y-condiciones">
              Términos
            </Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors normal-case font-normal" to="/terminos-y-condiciones">
              Cumplimiento
            </Link>
          </div>
        </div>
      </div>

      {/* Footer bottom bar */}
      <div className="max-w-container-max mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-on-surface-variant font-bold tracking-widest uppercase">
        <p>© 2026 RGAMES. Todos los Derechos Reservados.</p>
        <div className="flex gap-8 items-center opacity-50">
          <span>Verificado por eCOGRA</span>
          <span>Licenciado en Curazao</span>
          <span>Seguridad SSL</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
