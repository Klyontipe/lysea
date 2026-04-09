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
    "https://lys-espoir-unis-contre-le-neuroblastome.s2.yapla.com/fr/faire-un-don/donate/un-espoir-pour-lysea-a-rome/15342";
  const photos = [
    "photo/IMG_0042.jpeg",
    "photo/IMG_5990.jpeg",
    "photo/IMG_5998.jpeg",
    "photo/IMG_6051.jpeg",
    "photo/IMG_6288.jpeg",
    "photo/IMG_6623.jpeg",
    "photo/IMG_6690.jpeg",
    "photo/IMG_6903.jpeg",
    "photo/IMG_6953.jpeg",
    "photo/IMG_7113.jpeg",
  ];
  const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61587588269464";
  const INSTAGRAM_URL = "https://www.instagram.com/lys.espoir";
  const KLYON_URL = "https://klyon.fr";
  const videos = [
    {
      title: "Premier combat de Lyséa",
      subtitle: "Vidéo du premier cancer",
      src: "video/whatsapp-web.mp4",
    },
    {
      title: "Passage France 3",
      subtitle: "Reportage TV",
      src: "video/france3-seek.mp4",
    },
  ];
  const timelineEntries = [
    {
      date: "09.2021",
      title: "Septembre 2021",
      className: "stage-critical",
      paragraphs: [
        "Diagnostic d’un neuroblastome métastatique de stade IV. Notre vie bascule.",
        "Les traitements s’enchaînent : chimiothérapies lourdes, opérations, greffes, radiothérapie.",
      ],
      linkToVideos: true,
      images: ["frise/septembre2021.jpeg", "frise/septembre2021_2.jpeg"],
    },
    {
      date: "2023",
      title: "2023 - Rémission",
      className: "stage-remission",
      paragraphs: [
        "Après des mois d’épreuves, le mot tant attendu tombe : RÉMISSION.",
        "On respire, on reconstruit, on essaie de reprendre une vie plus douce.",
      ],
      images: ["frise/2023 rémission.jpeg", "frise/2023 rémission 2.jpeg"],
    },
    {
      date: "07.2025",
      title: "Juillet 2025 - Rechute",
      className: "stage-critical",
      paragraphs: [
        "Les douleurs reviennent. Le verdict tombe : RECHUTE.",
        "Retour en Normandie au CHU de Rouen, où Lyséa est suivie avec confiance.",
      ],
      images: ["frise/2025 rechute.jpeg"],
    },
    {
      date: "08.2025",
      title: "Un combat qui continue",
      className: "stage-treatment",
      paragraphs: ["La maladie est stabilisée, mais rien n’est gagné."],
      bullets: ["7 cures de chimiothérapie et d’immunothérapie", "17 séances de radiothérapie en février 2026"],
      images: ["frise/combatcontinu.jpeg", "frise/combatcontinu2.jpeg", "frise/combatcontinu3.jpeg"],
    },
    {
      date: "02.2026",
      title: "Nouvelle étape : Rome",
      className: "stage-hope",
      paragraphs: [
        "Lyséa est acceptée dans un essai clinique CAR-T en Italie.",
        "Un immense espoir, avec des coûts importants autour du traitement.",
      ],
    },
  ];
  const [navOpen, setNavOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);

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
  const nextVideo = () => setCurrentVideo((prev) => (prev + 1) % videos.length);
  const prevVideo = () => setCurrentVideo((prev) => (prev - 1 + videos.length) % videos.length);

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

        <section id="lys-info" className="section lys-info">
          <div className="container">
            <article className="lys-info-card" data-animate>
              <p className="lys-info-badge">LYS&apos;INFO</p>
              <h3>Dernière info</h3>
              <p>Départ prévu : dimanche 12 avril 2026 pour la greffe de CAR-T en Italie.</p>
              <p className="lys-info-closing">Nous vous donnerons des nouvelles régulièrement.</p>
            </article>
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
              {timelineEntries.map((entry) => (
                <article key={entry.title} className={`story-block ${entry.className}`} data-date={entry.date} data-animate>
                  <h3>{entry.title}</h3>
                  {entry.paragraphs?.map((paragraph) => (
                    <p key={paragraph}>
                      {paragraph.includes("RÉMISSION") || paragraph.includes("RECHUTE") ? (
                        <>
                          {paragraph.split(/(RÉMISSION|RECHUTE)/g).map((part) =>
                            part === "RÉMISSION" || part === "RECHUTE" ? <strong key={`${paragraph}-${part}`}>{part}</strong> : part
                          )}
                        </>
                      ) : (
                        paragraph
                      )}
                    </p>
                  ))}
                  {entry.bullets?.length ? (
                    <ul>
                      {entry.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                  {entry.images?.length ? (
                    <div className="story-gallery">
                      {entry.images.map((src, imageIndex) => (
                        <figure key={`${entry.title}-${src}`} className="story-gallery-item">
                          <img src={src} alt={`${entry.title} - photo ${imageIndex + 1}`} loading="lazy" />
                        </figure>
                      ))}
                    </div>
                  ) : null}
                  {entry.linkToVideos ? <a href="#videos" className="story-video-link">Voir la vidéo du premier combat</a> : null}
                </article>
              ))}
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

        <section id="videos" className="section media-section">
          <div className="container media-card" data-animate>
            <div className="media-head">
              <p className="kicker">Vidéos</p>
              <h2>Témoignages vidéo</h2>
              <p>Retrouvez la vidéo du premier combat et le passage sur France 3.</p>
            </div>
            <div className="video-slider">
              <button className="video-nav prev" onClick={prevVideo} aria-label="Vidéo précédente">&#8249;</button>
              <div className="media-video-wrap">
                <video key={videos[currentVideo].src} controls preload="metadata" playsInline>
                  <source src={videos[currentVideo].src} type="video/mp4" />
                  Votre navigateur ne peut pas lire cette vidéo.
                </video>
              </div>
              <button className="video-nav next" onClick={nextVideo} aria-label="Vidéo suivante">&#8250;</button>
            </div>
            <div className="video-meta">
              <strong>{videos[currentVideo].title}</strong>
              <span>{videos[currentVideo].subtitle}</span>
            </div>
          </div>
        </section>

        <section id="remerciements" className="section thanks-section">
          <div className="container">
            <article className="thanks-card" data-animate>
              <h2>Remerciements</h2>
              <p>
                Merci du fond du cœur à toutes les personnes - famille, amis, proches
                et inconnus - qui nous soutiennent chaque jour.
              </p>
              <p>
                Votre bienveillance, vos messages et votre générosité nous donnent de
                la force pour continuer ce combat.
              </p>
            </article>
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
