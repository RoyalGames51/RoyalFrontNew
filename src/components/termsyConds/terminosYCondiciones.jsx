import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Uso de fichas ficticias",
      content: "Los juegos en ROYALGAMES.ME están diseñados para ser disfrutados exclusivamente con fichas ficticias. Estas fichas no tienen valor monetario y no pueden ser canjeadas por dinero u otros bienes o servicios."
    },
    {
      title: "2. Registro y seguridad de la cuenta",
      content: "Para participar en los juegos, es necesario registrarse y crear una cuenta. Al hacerlo, te comprometes a proporcionar información precisa, actualizada y completa."
    },
    {
      title: "3. Uso permitido",
      content: "La página está destinada exclusivamente para entretenimiento personal y no puede ser utilizada para actividades ilegales, apuestas, o cualquier propósito no autorizado."
    },
    {
      title: "4. Normas de conducta",
      content: "Nos esforzamos por mantener un entorno amigable y seguro. No se tolerarán comportamientos abusivos, lenguaje ofensivo, ni actos de acoso hacia otros usuarios."
    },
    {
      title: "5. Compra y uso de fichas",
      content: "ROYALGAMES.ME puede ofrecer la opción de adquirir fichas adicionales mediante compras en la plataforma. Al realizar una compra, aceptas que las fichas adquiridas no tienen valor monetario y no son reembolsables."
    },
    {
      title: "6. Privacidad y manejo de datos personales",
      content: "La privacidad de nuestros usuarios es una prioridad para nosotros. Consulta nuestra Política de Privacidad para entender cómo recopilamos, usamos y protegemos tu información personal."
    },
    {
      title: "7. Limitación de responsabilidad",
      content: "ROYALGAMES.ME no se hace responsable de ningún daño directo o indirecto derivado del uso de nuestra plataforma."
    },
    {
      title: "8. Propiedad intelectual",
      content: "Todo el contenido de ROYALGAMES.ME está protegido por leyes de propiedad intelectual. No se permite la copia, reproducción o modificación de ningún material sin nuestro consentimiento previo."
    },
    {
      title: "9. Modificaciones de los Términos y Condiciones",
      content: "Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios se notificarán mediante una actualización en esta sección."
    },
    {
      title: "10. Jurisdicción y ley aplicable",
      content: "Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes del país correspondiente al usuario."
    },
  ];

  return (
    <div className="bg-background text-on-background min-h-screen pt-8 pb-24 md:pb-12 px-4 md:px-margin-desktop">
      <div className="max-w-container-max mx-auto space-y-8">
        {/* Título Principal */}
        <div className="text-center mb-12">
          <h1 className="text-display-lg md:text-display-lg font-headline-lg text-primary mb-3">
            Términos y Condiciones de Uso
          </h1>
          <p className="text-on-surface-variant text-body-md">
            Última actualización: 13/11/2024
          </p>
        </div>

        {/* Introducción */}
        <section className="bg-surface-container rounded-xl border border-outline-variant/20 p-6 md:p-8">
          <p className="text-body-lg text-on-surface leading-relaxed">
            Bienvenido a Royal Casino. Al acceder a esta plataforma y utilizar nuestros servicios,
            aceptas los siguientes Términos y Condiciones de uso. Si no estás de acuerdo con alguna
            de las disposiciones, te pedimos que no utilices nuestros servicios.
          </p>
        </section>

        {/* Secciones */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <section
              key={index}
              className="bg-surface-container rounded-xl border border-outline-variant/20 p-6 hover:border-outline-variant/40 transition-colors"
            >
              <h2 className="font-headline-sm text-headline-sm text-primary mb-3">
                {section.title}
              </h2>
              <p className="text-body-md text-on-surface leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        {/* Botones de Acción */}
        <div className="bg-surface-container-high rounded-xl border border-outline-variant/20 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-primary text-on-primary font-label-lg px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Aceptar y Volver
            </button>
            <button
              onClick={() => navigate("/")}
              className="border border-primary text-primary font-label-lg px-8 py-3 rounded-xl hover:bg-primary/10 transition-colors"
            >
              Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
