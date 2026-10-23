import { ErrorPageShell } from "./ErrorPageShell";

const NotFoundPage = () => (
  <ErrorPageShell
    code="404"
    variant="404"
    eyebrow="Page not found"
    title="Ukurasa haupatikani"
    description="Ukurasa unaoutafuta haupo au umeshahamishwa. Angalia kiungo au rudi mwanzo."
    hint="The page you’re looking for doesn’t exist or may have been moved."
  />
);

export default NotFoundPage;
