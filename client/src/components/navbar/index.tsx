import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  KeyRound,
  LogIn,
  LogOut,
  Menu,
  User,
  UserCircle,
  UserPlus,
  X,
} from "lucide-react";

import { navLinks } from "@/data/navLinks";
import { useAuth } from "@/context/AuthProvider";
import { cn } from "@/lib/utils";
import { Container } from "../Container";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

function linkHiddenOnDesktop(link: (typeof navLinks)[number]) {
  return Boolean(link.classNames?.includes("hidden"));
}

/** CTA links (e.g. Wasiliana Nasi) render at the far right of the bar, not in the center list */
function isNavCtaLink(link: (typeof navLinks)[number]) {
  return Boolean(link.classNames?.includes("bg-white"));
}

function isActivePath(pathname: string, linkTo: string) {
  if (linkTo === "/") return pathname === "/";
  return pathname === linkTo || pathname.startsWith(`${linkTo}/`);
}

/** Set true to show Ingia / Jisajili in the navbar again */
const SHOW_LOGIN_REGISTER_NAV = false;

/** Served from `client/public/logo.svg` */
const NAV_LOGO_SRC = "/logo.svg";

export const Navbar = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const desktopVisible = navLinks.filter((l) => !linkHiddenOnDesktop(l));
  const desktopLinks = desktopVisible.filter((l) => !isNavCtaLink(l));
  const desktopCta = desktopVisible.find((l) => isNavCtaLink(l));
  const userInitial =
    user?.first_name?.trim()?.[0]?.toUpperCase() ??
    user?.last_name?.trim()?.[0]?.toUpperCase() ??
    "?";

  const shellClass = scrolled ? "nav-bar-shell--fixed" : "nav-bar-shell--floating";

  return (
    <>
      <div className={cn("nav-bar-shell", shellClass)}>
        <Container className="max-w-[90rem] px-3 md:px-4">
          <nav className="nav-bar" aria-label="Urambazaji kuu">
            <Link to="/" className="nav-bar__brand">
              <span
                className="nav-bar__brand-icon nav-bar__brand-icon--logo"
                aria-hidden
              >
                <img
                  src={NAV_LOGO_SRC}
                  alt=""
                  className="nav-bar__brand-logo-img"
                  width={160}
                  height={44}
                  decoding="async"
                />
              </span>
              <span className="nav-bar__brand-text">
                <span className="nav-bar__brand-sub">Safari bora</span>
                <span>KILUWA LUXURY COACH</span>
              </span>
            </Link>

            <ul className="nav-bar__links">
              {desktopLinks.map((link) => {
                const active = isActivePath(pathname, link.linkTo);
                return (
                  <li key={link.linkTo}>
                    <Link
                      to={link.linkTo}
                      className={cn(
                        "nav-bar__link",
                        active && "nav-bar__link--active"
                      )}
                    >
                      {link.title}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="nav-bar__actions">
              {SHOW_LOGIN_REGISTER_NAV && !isLoggedIn && (
                <div className="nav-bar__auth">
                  <Link
                    to="/login"
                    className={cn("nav-bar__auth-link", "nav-bar__auth-link--ghost")}
                  >
                    <LogIn className="h-4 w-4 shrink-0" aria-hidden />
                    Ingia
                  </Link>
                  <Link
                    to="/register"
                    className={cn("nav-bar__auth-link", "nav-bar__auth-link--solid")}
                  >
                    <UserPlus className="h-4 w-4 shrink-0" aria-hidden />
                    Jisajili
                  </Link>
                </div>
              )}

              {isLoggedIn && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="nav-bar__user-trigger"
                      aria-label="Menyu ya akaunti"
                    >
                      {userInitial}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2" align="end" sideOffset={8}>
                    <Link to="/myaccount" className="nav-bar__popover-link">
                      <UserCircle className="h-4 w-4 shrink-0" />
                      Wasifu wangu
                    </Link>
                    <Link
                      to="/myaccount/change-password"
                      className="nav-bar__popover-link"
                    >
                      <KeyRound className="h-4 w-4 shrink-0" />
                      Badilisha nenosiri
                    </Link>
                    <Link
                      to="/myaccount/update-profile"
                      className="nav-bar__popover-link"
                    >
                      <User className="h-4 w-4 shrink-0" />
                      Badilisha wasifu
                    </Link>
                    <Separator className="my-1" />
                    <button
                      type="button"
                      className="nav-bar__popover-link w-full border-0 bg-transparent text-left font-semibold text-destructive"
                      onClick={() => logout()}
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      Toka
                    </button>
                  </PopoverContent>
                </Popover>
              )}

              {desktopCta && (
                <Link
                  to={desktopCta.linkTo}
                  className={cn(
                    "nav-bar__link nav-bar__link--cta nav-bar__cta-end",
                    "hidden shrink-0 lg:inline-flex",
                    isActivePath(pathname, desktopCta.linkTo) &&
                      "nav-bar__link--active"
                  )}
                >
                  {desktopCta.title}
                </Link>
              )}

              <button
                type="button"
                className="nav-bar__icon-btn lg:hidden"
                aria-expanded={open}
                aria-controls="nav-mobile-panel"
                aria-label={open ? "Funga menyu" : "Fungua menyu"}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? (
                  <X className="h-6 w-6" strokeWidth={2} aria-hidden />
                ) : (
                  <Menu className="h-6 w-6" strokeWidth={2} aria-hidden />
                )}
              </button>
            </div>
          </nav>
        </Container>
      </div>

      {open && (
        <>
          <button
            type="button"
            className="nav-mobile-backdrop lg:hidden"
            aria-label="Funga menyu"
            onClick={() => setOpen(false)}
          />
          <div
            id="nav-mobile-panel"
            className="nav-mobile-panel lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menyu ya simu"
          >
            <div className="nav-mobile-panel__head">
              <Link
                to="/"
                className="nav-mobile-panel__brand"
                onClick={() => setOpen(false)}
              >
                <img
                  src={NAV_LOGO_SRC}
                  alt=""
                  className="nav-mobile-panel__brand-logo"
                  width={160}
                  height={44}
                  decoding="async"
                />
                <span>KILUWA LUXURY COACH</span>
              </Link>
              <button
                type="button"
                className="nav-mobile-panel__close"
                aria-label="Funga"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            <div className="nav-mobile-panel__body">
              {navLinks.map((link) => (
                <Link
                  key={link.linkTo}
                  to={link.linkTo}
                  className={cn(
                    "nav-mobile-panel__link",
                    isActivePath(pathname, link.linkTo) &&
                      "nav-mobile-panel__link--active"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {link.title}
                </Link>
              ))}

              {isLoggedIn ? (
                <div className="nav-mobile-panel__section">
                  <Link
                    to="/myaccount"
                    className="nav-mobile-panel__row"
                    onClick={() => setOpen(false)}
                  >
                    <UserCircle className="h-5 w-5 text-primary" />
                    Wasifu wangu
                  </Link>
                  <Link
                    to="/myaccount/change-password"
                    className="nav-mobile-panel__row"
                    onClick={() => setOpen(false)}
                  >
                    <KeyRound className="h-5 w-5 text-primary" />
                    Badilisha nenosiri
                  </Link>
                  <button
                    type="button"
                    className="nav-mobile-panel__row w-full border-0 bg-transparent text-left text-destructive"
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    Toka
                  </button>
                </div>
              ) : SHOW_LOGIN_REGISTER_NAV ? (
                <div className="nav-mobile-panel__section nav-mobile-panel__btns">
                  <Link
                    to="/login"
                    className="nav-mobile-panel__btn nav-mobile-panel__btn--outline"
                    onClick={() => setOpen(false)}
                  >
                    <LogIn className="h-4 w-4" />
                    Ingia
                  </Link>
                  <Link
                    to="/register"
                    className="nav-mobile-panel__btn"
                    onClick={() => setOpen(false)}
                  >
                    <UserPlus className="h-4 w-4" />
                    Jisajili
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </>
  );
};
