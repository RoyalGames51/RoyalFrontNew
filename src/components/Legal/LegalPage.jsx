import { useNavigate } from "react-router-dom";

export default function LegalPage({ title, updatedAt, intro, sections }) {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-background min-h-screen pt-8 pb-24 md:pb-12 px-4 md:px-margin-desktop">
      <div className="max-w-container-max mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-display-lg md:text-display-lg font-headline-lg text-primary mb-3">
            {title}
          </h1>
          <p className="text-on-surface-variant text-body-md">Última actualización: {updatedAt}</p>
        </div>

        <section className="bg-surface-container rounded-xl border border-outline-variant/20 p-6 md:p-8">
          <p className="text-body-lg text-on-surface leading-relaxed">{intro}</p>
        </section>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <section
              key={index}
              className="bg-surface-container rounded-xl border border-outline-variant/20 p-6 hover:border-outline-variant/40 transition-colors"
            >
              <h2 className="font-headline-sm text-headline-sm text-primary mb-3">{section.title}</h2>
              <p className="text-body-md text-on-surface leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>

        <div className="bg-surface-container-high rounded-xl border border-outline-variant/20 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-primary text-on-primary font-label-lg px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Volver
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
}
