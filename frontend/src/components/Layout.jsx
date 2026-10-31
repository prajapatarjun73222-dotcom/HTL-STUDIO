import { Link, Outlet, useLocation } from "react-router-dom";
import { bookingText, instagramHref, whatsappHref } from "../api";
import { useSite } from "../site";

export function Layout() {
  const { pathname } = useLocation();
  const { settings } = useSite();
  const book = whatsappHref(settings.whatsapp, bookingText());
  const instagram = instagramHref(settings.instagramHandle);
  const sameHours =
    settings.hours.length > 0 &&
    settings.hours.every((hour) => hour.open === settings.hours[0].open && hour.close === settings.hours[0].close);

  return (
    <>
      <header className="site-head">
        <a className="credit" href="https://fixhance.arjunprajapat.in/" target="_blank" rel="noreferrer">
          Made by Fixhance
        </a>
        <div className="nav">
          <Link to="/" className="brand">
            <strong>HTL STUDIO</strong>
            <em>by Maria</em>
            <small>Hair extensions</small>
          </Link>
          <nav className="nav-links">
            <a href="#work">Work</a>
            <a href="#services">Services</a>
            <a href="#visit">Visit</a>
            <a className="wa" href={book} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </nav>
        </div>
      </header>
      <main key={pathname} className="page">
        <Outlet />
      </main>
      <footer>
        <div className="wrap foot">
          <div>
            <p className="foot-brand">
              <strong>HTL STUDIO</strong>
              <em>by Maria</em>
              <small>Hair extensions</small>
            </p>
            <p>{settings.address}</p>
            <p>{settings.placeNote}</p>
          </div>
          <div>
            <p className="kicker">Hours</p>
            {sameHours ? (
              <p>
                Every day, {settings.hours[0].open} – {settings.hours[0].close}
              </p>
            ) : (
              settings.hours.map((hour) => (
                <p key={hour.day}>
                  {hour.day} {hour.open} – {hour.close}
                </p>
              ))
            )}
          </div>
          <div className="foot-links">
            <a href={instagram} target="_blank" rel="noreferrer">
              @{settings.instagramHandle}
            </a>
            <a href={book} target="_blank" rel="noreferrer">
              Message on WhatsApp
            </a>
            <p>{settings.paymentNote}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
