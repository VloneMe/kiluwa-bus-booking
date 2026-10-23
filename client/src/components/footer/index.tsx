import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Globe, Mail, Phone } from "lucide-react";

import { Container } from "../Container";

const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/",
    label: "Facebook",
    Icon: FaFacebookF,
  },
  {
    href: "https://twitter.com/",
    label: "X (Twitter)",
    Icon: FaTwitter,
  },
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
    Icon: FaInstagram,
  },
  {
    href: "https://www.linkedin.com/",
    label: "LinkedIn",
    Icon: FaLinkedin,
  },
] as const;

const POLICY_LINKS = [
  { to: "/terms", label: "Masharti ya huduma" },
  { to: "/privacy", label: "Sera ya faragha" },
  { to: "/cancellation", label: "Sera ya kufuta" },
  { to: "/refund", label: "Sera ya kurudishiwa pesa" },
] as const;

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo" aria-label="Kijachini cha tovuti">
      <Container className="site-footer__inner max-w-[90rem]">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <p className="site-footer__brand-tag">Imewezeshwa na</p>
            <div className="site-footer__logo-wrap">
              <img
                src="/logo.png"
                alt="Nembo ya BusPoa"
                width={120}
                height={48}
                className="site-footer__logo"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="max-w-xs text-[0.78rem] leading-relaxed opacity-90">
              Nunua tiketi za basi mtandaoni kwa urahisi na salama popote ulipo Tanzania.
            </p>
          </div>

          <div>
            <h2 className="site-footer__col-title">Wasiliana nasi</h2>
            <ul className="site-footer__contact-list">
              <li className="site-footer__contact-item">
                <Phone className="site-footer__contact-icon h-4 w-4" aria-hidden strokeWidth={2} />
                <div className="flex min-w-0 flex-col gap-1">
                  <a href="tel:+255767859044" className="site-footer__link font-semibold">
                    <span className="sr-only">Simu 1: </span>
                    +255 767 859 044
                  </a>
                  <a href="tel:+255789100089" className="site-footer__link font-semibold">
                    <span className="sr-only">Simu 2: </span>
                    +255 789 100 089
                  </a>
                </div>
              </li>
              <li className="site-footer__contact-item">
                <Mail className="site-footer__contact-icon h-4 w-4" aria-hidden strokeWidth={2} />
                <div>
                  <span className="sr-only">Barua pepe: </span>
                  <a href="mailto:info@buspoa.co.tz" className="site-footer__link break-all font-semibold">
                    info@buspoa.co.tz
                  </a>
                </div>
              </li>
              <li className="site-footer__contact-item">
                <Globe className="site-footer__contact-icon h-4 w-4" aria-hidden strokeWidth={2} />
                <div>
                  <span className="sr-only">Tovuti: </span>
                  <a
                    href="https://www.buspoa.co.tz"
                    className="site-footer__link break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.buspoa.co.tz
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <nav aria-label="Viungo muhimu">
            <h2 className="site-footer__col-title">Viungo muhimu</h2>
            <ul className="site-footer__list">
              {POLICY_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="site-footer__link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="site-footer__col-title">Tufuatilie</h2>
            <p className="mb-3 max-w-[14rem] text-xs leading-snug opacity-88">
              Ungana nasi mitandaoni kwa taarifa na matangazo.
            </p>
            <div className="site-footer__social">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="site-footer__social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon size={18} aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <div className="site-footer__bar">
        <p className="m-0">
          © {year} BusPoa. Haki zote zimehifadhiwa.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
