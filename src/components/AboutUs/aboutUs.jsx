import EditableText from "../ui/EditableText";

const AboutUs = () => {
  return (
    <div className="bg-background text-on-background min-h-screen pt-8 pb-24 md:pb-12 px-4 md:px-margin-desktop">
      <div className="max-w-container-max mx-auto space-y-8">
        {/* Título Principal */}
        <div className="text-center mb-12">
          <EditableText contentKey="aboutus.title" as="h1" className="text-display-lg md:text-display-lg font-headline-lg text-primary mb-3">
            Sobre Nosotros
          </EditableText>
          <EditableText contentKey="aboutus.subtitle" className="text-on-surface-variant text-body-lg">
            Conoce la historia y valores de RoyalGames
          </EditableText>
        </div>

        {/* Sección Introducción */}
        <section className="bg-surface-container rounded-xl border border-outline-variant/20 p-6 md:p-8 space-y-4">
          <EditableText contentKey="aboutus.intro.title" as="h2" className="font-headline-md text-headline-md text-primary">
            Bienvenido a RoyalGames
          </EditableText>
          <EditableText contentKey="aboutus.intro.p1" className="text-body-lg text-on-surface leading-relaxed">
            RoyalGames es la plataforma de entretenimiento más emocionante y segura de Latinoamérica.
            Desde nuestros inicios, nos hemos dedicado a ofrecer la mejor experiencia de juego online a
            millones de jugadores en toda la región.
          </EditableText>
          <EditableText contentKey="aboutus.intro.p2" className="text-body-lg text-on-surface leading-relaxed">
            Nuestra misión es proporcionar entretenimiento responsable, seguro y de clase mundial,
            con los mejores juegos y promociones del mercado.
          </EditableText>
        </section>

        {/* Sección Misión */}
        <section className="bg-surface-container rounded-xl border border-outline-variant/20 p-6 md:p-8 space-y-4">
          <EditableText contentKey="aboutus.mision.title" as="h2" className="font-headline-md text-headline-md text-primary">
            Nuestra Misión
          </EditableText>
          <EditableText contentKey="aboutus.mision.p1" className="text-body-lg text-on-surface leading-relaxed">
            En RoyalGames, nos comprometemos a ser la plataforma de juegos online líder, ofreciendo
            entretenimiento responsable y seguro. Creemos en la transparencia, la integridad y el
            respeto hacia nuestros jugadores. Cada día trabajamos para mejorar y ofrecer la mejor
            experiencia posible.
          </EditableText>
        </section>

        {/* Sección Valores */}
        <section className="space-y-4">
          <EditableText contentKey="aboutus.valores.title" as="h2" className="font-headline-md text-headline-md text-primary">
            Nuestros Valores
          </EditableText>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container rounded-xl border border-outline-variant/20 p-6 space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-primary text-2xl font-bold">🔐</span>
                <div className="space-y-2 flex-1">
                  <EditableText contentKey="aboutus.valores.seguridad.title" as="h3" className="font-headline-sm text-headline-sm text-on-surface">
                    Seguridad
                  </EditableText>
                  <EditableText contentKey="aboutus.valores.seguridad.text" className="text-body-sm text-on-surface-variant">
                    Tu seguridad es nuestra prioridad. Utilizamos tecnología de encriptación de última generación para proteger tus datos.
                  </EditableText>
                </div>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl border border-outline-variant/20 p-6 space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-primary text-2xl font-bold">👁️</span>
                <div className="space-y-2 flex-1">
                  <EditableText contentKey="aboutus.valores.transparencia.title" as="h3" className="font-headline-sm text-headline-sm text-on-surface">
                    Transparencia
                  </EditableText>
                  <EditableText contentKey="aboutus.valores.transparencia.text" className="text-body-sm text-on-surface-variant">
                    Operamos con total transparencia y todas nuestras acciones están reguladas por organismos independientes.
                  </EditableText>
                </div>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl border border-outline-variant/20 p-6 space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-primary text-2xl font-bold">🎮</span>
                <div className="space-y-2 flex-1">
                  <EditableText contentKey="aboutus.valores.diversidad.title" as="h3" className="font-headline-sm text-headline-sm text-on-surface">
                    Diversidad de Juegos
                  </EditableText>
                  <EditableText contentKey="aboutus.valores.diversidad.text" className="text-body-sm text-on-surface-variant">
                    Ofrecemos una amplia variedad de juegos emocionantes y entretenidos para todos los gustos.
                  </EditableText>
                </div>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl border border-outline-variant/20 p-6 space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-primary text-2xl font-bold">🎧</span>
                <div className="space-y-2 flex-1">
                  <EditableText contentKey="aboutus.valores.servicio.title" as="h3" className="font-headline-sm text-headline-sm text-on-surface">
                    Servicio al Cliente
                  </EditableText>
                  <EditableText contentKey="aboutus.valores.servicio.text" className="text-body-sm text-on-surface-variant">
                    Nuestro equipo está disponible 24/7 para resolver cualquier duda o problema que puedas tener.
                  </EditableText>
                </div>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl border border-outline-variant/20 p-6 space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-primary text-2xl font-bold">🛡️</span>
                <div className="space-y-2 flex-1">
                  <EditableText contentKey="aboutus.valores.responsable.title" as="h3" className="font-headline-sm text-headline-sm text-on-surface">
                    Juego Responsable
                  </EditableText>
                  <EditableText contentKey="aboutus.valores.responsable.text" className="text-body-sm text-on-surface-variant">
                    Promovemos el juego responsable y ofrecemos herramientas para mantener el control.
                  </EditableText>
                </div>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl border border-outline-variant/20 p-6 space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-primary text-2xl font-bold">⭐</span>
                <div className="space-y-2 flex-1">
                  <EditableText contentKey="aboutus.valores.excelencia.title" as="h3" className="font-headline-sm text-headline-sm text-on-surface">
                    Excelencia
                  </EditableText>
                  <EditableText contentKey="aboutus.valores.excelencia.text" className="text-body-sm text-on-surface-variant">
                    Nos comprometemos con la máxima calidad en cada aspecto de nuestro servicio.
                  </EditableText>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Por Qué Elegirnos */}
        <section className="space-y-6">
          <EditableText contentKey="aboutus.elegirnos.title" as="h2" className="font-headline-md text-headline-md text-primary">
            Por Qué Elegirnos
          </EditableText>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-container rounded-xl border border-primary/30 p-6 text-center space-y-3 hover:border-primary/60 transition-colors">
              <div className="text-5xl">🎲</div>
              <EditableText contentKey="aboutus.elegirnos.juegos.title" as="h3" className="font-headline-sm text-headline-sm text-on-surface">
                +1000 Juegos
              </EditableText>
              <EditableText contentKey="aboutus.elegirnos.juegos.text" className="text-body-sm text-on-surface-variant">
                La colección más grande de juegos emocionantes y variados.
              </EditableText>
            </div>

            <div className="bg-surface-container rounded-xl border border-primary/30 p-6 text-center space-y-3 hover:border-primary/60 transition-colors">
              <div className="text-5xl">💰</div>
              <EditableText contentKey="aboutus.elegirnos.bonos.title" as="h3" className="font-headline-sm text-headline-sm text-on-surface">
                Bonificaciones Generosas
              </EditableText>
              <EditableText contentKey="aboutus.elegirnos.bonos.text" className="text-body-sm text-on-surface-variant">
                Bienvenida, promociones semanales y recompensas exclusivas.
              </EditableText>
            </div>

            <div className="bg-surface-container rounded-xl border border-primary/30 p-6 text-center space-y-3 hover:border-primary/60 transition-colors">
              <div className="text-5xl">🔒</div>
              <EditableText contentKey="aboutus.elegirnos.seguro.title" as="h3" className="font-headline-sm text-headline-sm text-on-surface">
                100% Seguro
              </EditableText>
              <EditableText contentKey="aboutus.elegirnos.seguro.text" className="text-body-sm text-on-surface-variant">
                Licencia oficial y protección de datos garantizada.
              </EditableText>
            </div>
          </div>
        </section>

        {/* Sección Historia */}
        <section className="bg-surface-container rounded-xl border border-outline-variant/20 p-6 md:p-8 space-y-4">
          <EditableText contentKey="aboutus.historia.title" as="h2" className="font-headline-md text-headline-md text-primary">
            Nuestra Historia
          </EditableText>
          <EditableText contentKey="aboutus.historia.p1" className="text-body-lg text-on-surface leading-relaxed">
            RoyalGames fue fundada con la visión de revolucionar la industria de los juegos online.
            Desde nuestros humildes comienzos hace más de una década, hemos crecido para servir a
            millones de jugadores satisfechos en toda Latinoamérica.
          </EditableText>
          <EditableText contentKey="aboutus.historia.p2" className="text-body-lg text-on-surface leading-relaxed">
            Cada año, continuamos innovando y mejorando nuestra plataforma, siempre manteniendo
            nuestro compromiso con la seguridad, la calidad y la excelencia en el servicio.
          </EditableText>
          <EditableText contentKey="aboutus.historia.p3" className="text-body-lg text-on-surface leading-relaxed">
            Gracias a la confianza de nuestros jugadores, hemos ganado numerosos premios y
            reconocimientos en la industria. Pero el mayor premio es tu satisfacción.
          </EditableText>
        </section>

        {/* Call to Action */}
        <section className="bg-surface-container-high rounded-xl border border-primary/40 p-6 md:p-8 text-center space-y-4">
          <EditableText contentKey="aboutus.cta.title" as="h2" className="font-headline-md text-headline-md text-primary">
            ¿Listo para comenzar?
          </EditableText>
          <EditableText contentKey="aboutus.cta.text" className="text-body-lg text-on-surface">
            Únete a miles de jugadores que disfrutan de la mejor experiencia en juegos online.
          </EditableText>
          <button className="bg-primary text-on-primary font-label-lg px-8 py-3 rounded-xl hover:opacity-90 transition-opacity inline-block">
            Jugar Ahora
          </button>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
