const { useEffect, useState } = React;

function HeroCarousel({ photos }) {
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % photos.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [photos.length]);

  return (
    <div className="hero-carousel" aria-label="Carrousel photos de Lyséa">
      <div className="hero-carousel-track">
        {photos.map((src, index) => (
          <figure
            key={`hero-${src}`}
            className={`hero-carousel-slide ${heroSlide === index ? "is-active" : ""}`}
            aria-hidden={heroSlide !== index}
          >
            <img src={src} alt={`Lyséa - photo ${index + 1}`} />
          </figure>
        ))}
      </div>
      <div className="hero-carousel-dots" role="tablist" aria-label="Choisir une photo">
        {photos.map((_, index) => (
          <button
            key={`hero-dot-${index}`}
            className={heroSlide === index ? "is-active" : ""}
            onClick={() => setHeroSlide(index)}
            aria-label={`Afficher la photo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  const DONATION_URL =
    "https://lys-espoir-unis-contre-le-neuroblastome.s2.yapla.com/fr/faire-un-don/detail/un-espoir-pour-lysea-a-rome/15342#don-details";
  const photos = ["lysea1.png", "lysea2.png", "photo1.jpg", "photo4.jpg", "photo5.jpg"];
  const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61587588269464";
  const INSTAGRAM_URL = "https://www.instagram.com/lys.espoir";
  const KLYON_URL = "https://klykohen.fr";
  const [navOpen, setNavOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const items = document.querySelectorAll("[data-animate]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % photos.length);
    }, 3400);
    return () => window.clearInterval(id);
  }, [photos.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % photos.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + photos.length) % photos.length);

  return (
    <>
      <header className="site-header">
        <div className="container header-shell">
          <a href="#hero" className="brand">
            <img src="logo.png" alt="Logo Lys’Espoir" />
            <span>
              <strong>LYS’ESPOIR</strong>
              <small>Association de soutien à Lyséa</small>
            </span>
          </a>

          <button className="nav-toggle" aria-expanded={navOpen} aria-label="Ouvrir le menu" onClick={() => setNavOpen(!navOpen)}>
            <span></span><span></span>
          </button>

          <nav className={`main-nav ${navOpen ? "show" : ""}`} aria-label="Navigation principale">
            <a href="#hero">Accueil</a>
            <a href="#histoire">Le combat de Lyséa</a>
            <a href={DONATION_URL} target="_blank" rel="noreferrer">Faire un don</a>
            <a href="#contact">Contact</a>
          </nav>
          <a href={DONATION_URL} className="btn btn-primary header-donate" target="_blank" rel="noreferrer">Faire un don</a>
        </div>
      </header>

      <main id="main">
        <section id="hero" className="hero">
          <div className="container hero-grid">
            <div className="hero-copy" data-animate>
              <p className="kicker">Pour Lyséa, à Rome</p>
              <h1>Un espoir pour Lyséa à Rome</h1>
              <p>Lyséa est une petite fille courageuse, pleine de vie et d’une force incroyable. Aujourd’hui, nous faisons appel à votre générosité.</p>
              <div className="hero-actions">
                <a href={DONATION_URL} className="btn btn-primary" target="_blank" rel="noreferrer">Faire un don</a>
                <a href="#histoire" className="btn btn-line">Découvrir son histoire</a>
              </div>
              <blockquote>
                "Chaque geste compte. Chaque partage nous aide à continuer."
                <cite>Mélanie & Jonathan</cite>
              </blockquote>
            </div>
            <div className="hero-media" data-animate>
              <HeroCarousel photos={photos} />
            </div>
          </div>
        </section>

        <section id="identite" className="identity section">
          <div className="container identity-card" data-animate>
            <h2>Lys’Espoir</h2>
            <p className="subtitle">"UNIS CONTRE LE NEUROBLASTOME"</p>
            <p>
              L’association Lys’Espoir est née d’un combat de famille devenu un engagement collectif :
              aider Lyséa dans son parcours de soins, soutenir ses proches et créer une chaîne
              de solidarité durable face aux cancers pédiatriques.
            </p>
          </div>
        </section>

        <section id="histoire" className="section story">
          <div className="container">
            <div className="section-head" data-animate>
              <h2>Le combat de Lyséa - Ensemble, continuons d’y croire</h2>
            </div>
            <div className="story-flow">
              <article className="story-block stage-critical" data-date="09.2021" data-animate>
                <h3>Septembre 2021</h3>
                <p>Diagnostic d’un neuroblastome métastatique de stade IV. Notre vie bascule.</p>
                <p>Les traitements s’enchaînent : chimiothérapies lourdes, opérations, greffes, radiothérapie.</p>
              </article>
              <article className="story-block stage-remission" data-date="2023" data-animate>
                <h3>2023 - Rémission</h3>
                <p>Après des mois d’épreuves, le mot tant attendu tombe : <strong>RÉMISSION</strong>.</p>
                <p>On respire, on reconstruit, on essaie de reprendre une vie plus douce.</p>
              </article>
              <article className="story-block stage-critical" data-date="07.2025" data-animate>
                <h3>Juillet 2025 - Rechute</h3>
                <p>Les douleurs reviennent. Le verdict tombe : <strong>RECHUTE</strong>.</p>
                <p>Retour en Normandie au CHU de Rouen, où Lyséa est suivie avec confiance.</p>
              </article>
              <article className="story-block stage-treatment" data-date="08.2025" data-animate>
                <h3>Un combat qui continue</h3>
                <ul>
                  <li>7 cures de chimiothérapie et d’immunothérapie</li>
                  <li>17 séances de radiothérapie en février 2026</li>
                </ul>
                <p>La maladie est stabilisée, mais rien n’est gagné.</p>
              </article>
              <article className="story-block stage-hope" data-date="02.2026" data-animate>
                <h3>Nouvelle étape : Rome</h3>
                <p>Lyséa est acceptée dans un essai clinique CAR-T en Italie.</p>
                <p>Un immense espoir, avec des coûts importants autour du traitement.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="don" className="section donate">
          <div className="container donate-grid">
            <div className="donate-text" data-animate>
              <h2>Faire un don pour Lyséa</h2>
              <p>
                Chaque don aide Lyséa dans son parcours de soins à Rome et soutient aussi
                d’autres familles confrontées au neuroblastome.
              </p>
              <div className="tax-cards">
                <article><strong>50 €</strong><span>coût réel 17 €</span></article>
                <article><strong>100 €</strong><span>coût réel 34 €</span></article>
                <article><strong>200 €</strong><span>coût réel 68 €</span></article>
                <article className="wide"><strong>66 % déductibles</strong><span>dans la limite prévue par la loi</span></article>
              </div>
            </div>
            <aside className="don-box" data-animate>
              <h3>Accès direct à la page de don</h3>
              <p>Un clic suffit pour rejoindre la collecte officielle et sécurisée.</p>
              <div className="donate-panel">
                <p>Paiement sécurisé</p>
                <p>Reçu fiscal disponible</p>
                <p>Plateforme officielle de l’association</p>
              </div>
              <a href={DONATION_URL} className="btn btn-primary btn-full" target="_blank" rel="noreferrer">
                Accéder au don maintenant
              </a>
              <p className="secure-note">Merci pour votre soutien et votre confiance.</p>
            </aside>
          </div>
        </section>

        <section id="impact" className="section impact">
          <div className="container">
            <div className="section-head" data-animate>
              <h2>À quoi servent vos dons</h2>
            </div>
            <div className="impact-grid">
              <article data-animate><h3>Déplacements vers Rome</h3><p>Trajets médicaux et logistique de suivi.</p></article>
              <article data-animate><h3>Logement sur place</h3><p>Hébergement près de l’hôpital pendant les soins.</p></article>
              <article data-animate><h3>Vie quotidienne</h3><p>Dépenses essentielles loin du domicile.</p></article>
              <article data-animate><h3>Accompagnement et entraide</h3><p>Présence parentale et soutien d’autres familles.</p></article>
            </div>
          </div>
        </section>

        <section id="moments" className="section moments">
          <div className="container">
            <div className="section-head" data-animate>
              <h2>Des moments de vie, de courage et d’espoir</h2>
            </div>
            <div className="moments-shell" data-animate>
              <div className="moments-stage">
                <figure className="moments-main-photo">
                  <img src={photos[currentSlide]} alt={`Lyséa - photo ${currentSlide + 1}`} decoding="async" fetchPriority="high" />
                  <figcaption>Des instants vrais, pleins de force et de douceur.</figcaption>
                </figure>
                <button className="moments-nav prev" onClick={prevSlide} aria-label="Photo précédente">
                  &#8249;
                </button>
                <button className="moments-nav next" onClick={nextSlide} aria-label="Photo suivante">
                  &#8250;
                </button>
              </div>

              <div className="moments-thumbs">
                {photos.map((src, index) => (
                  <button
                    key={`thumb-${src}`}
                    className={`moments-thumb ${index === currentSlide ? "is-active" : ""}`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Voir la photo ${index + 1}`}
                  >
                    <img src={src} alt={`Miniature ${index + 1}`} loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>

              <div className="moments-info">
                <article>
                  <h3>Une enfant extraordinaire</h3>
                  <p>Malgre les soins, Lysea garde son sourire et sa lumiere.</p>
                </article>
                <article>
                  <h3>Une famille unie</h3>
                  <p>Chaque jour est organise pour l'accompagner dans les meilleures conditions.</p>
                </article>
                <article>
                  <h3>Une solidarite reelle</h3>
                  <p>Chaque don aide concretement son parcours et soutient d'autres familles.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="video-france3" className="section media-section">
          <div className="container media-card" data-animate>
            <div className="media-head">
              <p className="kicker">Passage TV</p>
              <h2>Lyséa sur France 3</h2>
              <p>Découvrez le reportage consacré au combat de Lyséa.</p>
            </div>
            <div className="media-video-wrap">
              <video controls preload="metadata" playsInline>
                <source src="lyseafrance3-seek.mp4" type="video/mp4" />
                <source src="lyseafrance3.mov" type="video/quicktime" />
                Votre navigateur ne peut pas lire cette vidéo.
              </video>
            </div>
          </div>
        </section>

        <section className="section cta">
          <div className="container cta-card" data-animate>
            <p>Chaque don est un pas de plus dans son combat. Chaque partage est une force supplémentaire.</p>
            <a href={DONATION_URL} className="btn btn-primary" target="_blank" rel="noreferrer">Soutenir Lyséa</a>
          </div>
        </section>
      </main>

      <footer id="contact" className="site-footer">
        <div className="container footer-grid">
          <div>
            <h3>Lys’Espoir</h3>
            <p>15 Rue de la Poudrière, 67340 Ingwiller, France</p>
            <p><a href="mailto:contact@lysespoir.org">contact@lysespoir.org</a></p>
          </div>
          <div>
            <h4>Liens utiles</h4>
            <p><a href="#hero">Accueil</a></p>
            <p><a href="#histoire">Le combat de Lyséa</a></p>
            <div className="social-links">
              <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" aria-label="Facebook Lys'Espoir">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.6.4-1 1-1z"></path></svg>
                <span>Facebook</span>
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram Lys'Espoir">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10c2.8 0 5 2.2 5 5v10c0 2.8-2.2 5-5 5H7c-2.8 0-5-2.2-5-5V7c0-2.8 2.2-5 5-5zm0 2C5.9 4 5 4.9 5 6v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H7zm11.2 1.5a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"></path></svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>
          <div>
            <h4>Transparence</h4>
            <p>Association déclarée</p>
            <p>Suivi médical CHU de Rouen / Rome</p>
            <p className="powered">Propulsé par <a href={KLYON_URL} target="_blank" rel="noreferrer">KLYON</a></p>
          </div>
        </div>
      </footer>

      <div className="mobile-donate-bar">
        <span>Soutenir Lyséa</span>
        <a href={DONATION_URL} className="btn btn-primary btn-small" target="_blank" rel="noreferrer">Faire un don</a>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
