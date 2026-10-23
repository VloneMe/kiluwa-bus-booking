import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export type AppErrorVariant = "404" | "403" | "500";

interface ErrorPageShellProps {
  code: string;
  variant: AppErrorVariant;
  eyebrow: string;
  title: string;
  description: string;
  hint?: string;
}

export function ErrorPageShell({
  code,
  variant,
  eyebrow,
  title,
  description,
  hint,
}: ErrorPageShellProps) {
  return (
    <div
      className={cn("app-error-page", `app-error-page--${variant}`)}
      role="alert"
    >
      <div className="app-error-page__card">
        <div className="app-error-page__code" aria-hidden="true">
          {code}
        </div>
        <p className="app-error-page__subtitle">{eyebrow}</p>
        <h1 className="app-error-page__title">{title}</h1>
        <p className="app-error-page__text">{description}</p>
        {hint ? <p className="app-error-page__hint">{hint}</p> : null}
        <div className="app-error-page__actions">
          <Link to="/" className="app-error-page__link">
            Rudi mwanzo
          </Link>
          <Link
            to="/booking"
            className="app-error-page__link app-error-page__link--muted"
          >
            Tafuta mabasi
          </Link>
        </div>
      </div>
    </div>
  );
}
