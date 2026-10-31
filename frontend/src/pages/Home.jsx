import { bookingText, instagramHref, whatsappHref } from "../api";

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
import { useSite } from "../site";
import { Reveal, SplitTitle } from "../components/Reveal";

export function Home() {
  const { settings, services, gallery } = useSite();
  if (!settings) return null;

  const methods = services.filter((service) => service.kind === "method");
  const treatments = services.filter((service) => service.kind === "treatment");
  const works = gallery.filter((item) => item.kind === "work");
  const pairs = gallery.filter((item) => item.kind === "pair");
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(settings.mapQuery || settings.address)}&z=16&output=embed`;

  return (
    <>
      <section className="hero" id="top">
        {settings.heroImage && <img className="hero-media" src={settings.heroImage} alt="" />}
        <div className="hero-card">
          <p className="kicker">{settings.eyebrow}</p>
          <SplitTitle text={settings.headline} />
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
                <figure key={item._id} className="frame">
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
              <article key={item._id} className="ba-card">
                <div className="pair">
                  <div className="frame">
                    <img src={item.beforeUrl} alt="" />
                  </div>
                  <div className="frame">
                    <img src={item.afterUrl} alt="" />
                  </div>
                </div>
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
              <Reveal key={method._id} delay={index * 70}>
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
              <article key={treatment._id} className="tariff-row">
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
