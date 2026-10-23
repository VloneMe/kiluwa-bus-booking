import { ErrorPageShell } from "./ErrorPageShell";

const ForbiddenPage = () => (
  <ErrorPageShell
    code="403"
    variant="403"
    eyebrow="Access denied"
    title="Huna ruhusa"
    description="Huwezi kuona maudhui ya ukurasa huu. Unahitaji idhini ya ziada au kuingia kwenye akaunti."
    hint="You don’t have permission to view this page. Try signing in or contact support if this is a mistake."
  />
);

export default ForbiddenPage;
