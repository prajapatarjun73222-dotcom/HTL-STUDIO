import { bookingText, instagramHref, whatsappHref } from "../api";
import { Compare } from "../components/Compare";
import { Reveal } from "../components/Reveal";
import { useSite } from "../site";

const instagramPosts = {
  "/instagram/01.jpg": "https://www.instagram.com/htlstudio/p/DcidYMEo8hx/",
  "/instagram/02.jpg": "https://www.instagram.com/htlstudio/reel/De-FVUPoSqG/",
  "/instagram/03.jpg": "https://www.instagram.com/htlstudio/reel/De2Rg_QIj57/",
  "/instagram/04.jpg": "https://www.instagram.com/htlstudio/reel/De0DVnIoUuj/",
  "/instagram/05.jpg": "https://www.instagram.com/htlstudio/reel/DexGgDSo_s0/",
  "/instagram/06.jpg": "https://www.instagram.com/htlstudio/reel/DerYrsuIOnN/",
  "/instagram/07.jpg": "https://www.instagram.com/htlstudio/reel/DeFFDNuoeK4/",
  "/instagram/08.jpg": "https://www.instagram.com/htlstudio/reel/DdrMzLxoe_b/",
  "/instagram/09.jpg": "https://www.instagram.com/htlstudio/reel/Ddg-LuvIf11/",
};

export function Home() {
  const { settings, services, gallery } = useSite();
  if (!settings) return null;

  const methods = services.filter((service) => service.kind === "method");
  const treatments = services.filter((service) => service.kind === "treatment");
  const works = gallery.filter((item) => item.kind === "work");
  const pairs = gallery.filter((item) => item.kind === "pair");
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(settings.mapQuery || settings.address)}&z=16&output=embed`;
  const headlineParts = settings.headline.split(",");
  const headlineLead = headlineParts.length > 1 ? `${headlineParts[0].trim()},` : settings.headline;
  const headlineEmphasis = headlineParts.length > 1 ? headlineParts.slice(1).join(",").trim() : "";

  return (
    <>
      <section className="hero" id="top">
        {settings.heroImage && (
          <img
            className="hero-media"
            src={settings.heroImage}
            alt="HTL Studio by Maria. The art of seamless extensions. Seamless length, quietly done."
          />
        )}
        <h1 className="sr-only hero-title-desktop">{settings.headline}</h1>
        <div className="hero-mobile">
          <p className="hero-lockup">
            <strong>HTL STUDIO</strong>
            <em>by Maria</em>
            <small>Hair extensions</small>
          </p>
          <p className="hero-kicker">The art of seamless extensions</p>
          <h1>
            {headlineLead}
            {headlineEmphasis && (
              <>
                <br />
                <em>{headlineEmphasis}</em>
              </>
            )}
          </h1>
          <p className="hero-note">
            Thoughtfully tailored hair extensions, designed to look and feel like your own.
          </p>
          <img
            className="hero-portrait"
            src="/hero-portrait.jpg"
            alt="Maria finishing a set of long blonde extensions in the studio"
          />
          <ul className="hero-points">
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 15c2.2-6 3.4-8.2 6.2-8.2 2.2 0 2.6 3.1 2.3 6.2-.2 2.5.5 4.2 2.4 4.2 1.7 0 2.5-1.7 3.4-4.2" />
              </svg>
              <span>Natural Look</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.2 9.6 12 4.2l4.8 5.4L12 20.2 7.2 9.6Z" />
                <path d="M7.2 9.6h9.6" />
              </svg>
              <span>Premium Hair</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 18.2s-5.6-3.4-5.6-6.8c0-2.1 1.5-3.4 3-3.4 1 0 1.8.5 2.6 1.6.8-1.1 1.6-1.6 2.6-1.6 1.5 0 3 1.3 3 3.4 0 3.4-5.6 6.8-5.6 6.8Z" />
              </svg>
              <span>Personal Care</span>
            </li>
          </ul>
        </div>
      </section>

      <div className="wrap">
        <section className="intro">
          <Reveal>
            <div className="portrait frame">
              <img src={settings.portraitImage} alt="Hair being finished in the studio" />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <p className="kicker">The studio</p>
            <h2>{settings.introTitle}</h2>
            <p className="lede">{settings.about}</p>
            <a href="#visit" className="text-link">
              Visit Lee High Road
            </a>
          </Reveal>
        </section>

        <section className="work-top" id="work">
          <p className="kicker">HTLSTUDIO</p>
          <h2 className="display">
            Our <em>Work</em>
          </h2>
          <p className="center-copy">{settings.workIntro}</p>

          <div className="ig">
            <img className="avatar" src="/instagram/avatar.jpg" alt="HTLSTUDIO on Instagram" />
            <p className="ig-name">HTLSTUDIO</p>
            <a className="ig-handle" href={instagramHref(settings.instagramHandle)} target="_blank" rel="noreferrer">
              @{settings.instagramHandle}
            </a>
            <ul className="stats">
              <li>
                <b>{settings.instagramPosts}</b>
                <span>posts</span>
              </li>
              <li>
                <b>{settings.instagramFollowers}</b>
                <span>followers</span>
              </li>
              <li>
                <b>{settings.instagramFollowing}</b>
                <span>following</span>
              </li>
            </ul>
            <a className="follow" href={instagramHref(settings.instagramHandle)} target="_blank" rel="noreferrer">
              Follow
            </a>
          </div>

          <div className="ig-grid">
            {works.map((item) => {
              const post = instagramPosts[item.imageUrl];
              const photo = <img src={item.imageUrl} alt={item.caption || "HTLSTUDIO"} />;
              return (
                <figure key={item.id} className="frame">
                  {post ? (
                    <a href={post} target="_blank" rel="noreferrer">
                      {photo}
                    </a>
                  ) : (
                    photo
                  )}
                  {item.caption && <figcaption>{item.caption}</figcaption>}
                </figure>
              );
            })}
          </div>
        </section>

        <section className="ba">
          <p className="kicker">Transformations</p>
          <h2>
            Before <em>& After</em>
          </h2>
          <p className="lede ba-copy">{settings.baIntro}</p>
          <div className="ba-grid">
            {pairs.map((item) => (
              <article key={item.id} className="ba-card">
                <Compare before={item.beforeUrl} after={item.afterUrl} />
                <div className="pair-labels">
                  <span>Before</span>
                  <span>After</span>
                </div>
                <p>{item.caption}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="services-page" id="services">
          <p className="kicker">Services</p>
          <h2 className="display">
            Tape-ins, K-Tips <em>and nanos.</em>
          </h2>
          <p className="lede narrow">{settings.servicesIntro}</p>
          <div className="methods">
            {methods.map((method, index) => (
              <Reveal key={method.id} delay={index * 70}>
                <article className="method">
                  <div className="frame method-photo">
                    <img src={method.imageUrl} alt="" />
                  </div>
                  <h3>{method.name}</h3>
                  <p>{method.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="tariff">
            {treatments.map((treatment) => (
              <article key={treatment.id} className="tariff-row">
                <h3>{treatment.name}</h3>
                <span className="meta">{treatment.duration}</span>
                <span className="price">£{treatment.price}</span>
                <a
                  className="book"
                  href={whatsappHref(settings.whatsapp, bookingText(treatment.name))}
                  target="_blank"
                  rel="noreferrer"
                >
                  Book
                </a>
              </article>
            ))}
          </div>
          <p className="pay-note">{settings.paymentNote}</p>
        </section>

        <section className="visit" id="visit">
          <div>
            <p className="kicker">Visit</p>
            <h2 className="display">
              Lee <em>High Road</em>
            </h2>
            <p className="lede">{settings.address}</p>
            <p className="place">{settings.placeNote}</p>
            <a className="book" href={whatsappHref(settings.whatsapp, bookingText())} target="_blank" rel="noreferrer">
              WhatsApp Maria
            </a>
            <ul className="notes">
              {(settings.notes || []).map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            <h2>Opening times</h2>
            <ul className="hours">
              {(settings.hours || []).map((hour) => (
                <li key={hour.day}>
                  <span>{hour.day}</span>
                  <span>
                    {hour.open} – {hour.close}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="map-frame">
            <iframe title="Map showing the studio on Lee High Road" src={mapSrc} loading="lazy" />
          </div>
        </section>
      </div>
    </>
  );
}
