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
            Jugá, subí de rango y disfrutá con fichas virtuales en un lugar pensado para pasarla bien y divertirse con tus amigos.
          </p>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-sm uppercase tracking-widest font-bold">
          <div className="flex flex-col gap-4">
            <h5 className="text-white mb-2 font-black">Conserjería</h5>
            <Link className="text-on-surface-variant hover:text-primary transition-colors normal-case font-normal" to="/contacto">
              Contacto
            </Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors normal-case font-normal" to="/preguntas-frecuentes">
              Preguntas Frecuentes
            </Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors normal-case font-normal" to="/ayuda">
              Mesa de Ayuda
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="text-white mb-2 font-black">Protocolo</h5>
            <Link className="text-on-surface-variant hover:text-primary transition-colors normal-case font-normal" to="/privacidad">
              Privacidad
            </Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors normal-case font-normal" to="/terminos-y-condiciones">
              Términos
            </Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors normal-case font-normal" to="/cumplimiento">
              Cumplimiento
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="text-white mb-2 font-black">Empresa</h5>
            <Link className="text-on-surface-variant hover:text-primary transition-colors normal-case font-normal" to="/trabaja-con-nosotros">
              Trabaja con Nosotros
            </Link>
          </div>
        </div>
      </div>

      {/* Footer bottom bar */}
      <div className="max-w-container-max mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-on-surface-variant font-bold tracking-widest uppercase">
        <p>© 2026 RGAMES. Todos los Derechos Reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
