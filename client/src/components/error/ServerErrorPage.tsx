import { ErrorPageShell } from "./ErrorPageShell";

const ServerErrorPage = () => (
  <ErrorPageShell
    code="500"
    variant="500"
    eyebrow="Server error"
    title="Hitilafu ya seva"
    description="Tumepata tatizo upande wetu. Jaribu tena baada ya muda mfupi."
    hint="Something went wrong on our servers. Please try again in a few minutes."
  />
);

export default ServerErrorPage;
