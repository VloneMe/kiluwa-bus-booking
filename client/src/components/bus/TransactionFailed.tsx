import { Link } from "react-router-dom";
import { Bus, Clock, Home, TimerOff } from "lucide-react";

import { Container } from "../Container";
import { Section } from "../Section";

const TransactionFailed = () => {
  return (
    <Section className="bus-transaction-failed-shell w-full">
      <Container>
        <div className="bus-transaction-failed">
          <div className="bus-transaction-failed__icon-wrap" aria-hidden>
            <TimerOff className="bus-transaction-failed__icon" strokeWidth={1.75} />
          </div>

          <p className="bus-transaction-failed__eyebrow">Hali ya malipo</p>

          <h1 id="transaction-failed-title" className="bus-transaction-failed__title">
            Tiketi imefutwa
          </h1>

          <p className="bus-transaction-failed__lead">
            Malipo hayajakamilika ndani ya muda uliotolewa. Nafasi ya tiketi
            imeachiliwa — unaweza kutafuta safari upya wakati wowote.
          </p>

          <div className="bus-transaction-failed__panel">
            <div className="bus-transaction-failed__panel-row">
              <span className="bus-transaction-failed__panel-icon" aria-hidden>
                <Clock className="size-4" strokeWidth={2} />
              </span>
              <p className="bus-transaction-failed__panel-text">
                Muda wa malipo uliisha kabla ya kuthibitisha kwenye simu yako.
              </p>
            </div>
          </div>

          <div className="bus-transaction-failed__actions">
            <Link
              to="/booking"
              className="bus-transaction-failed__btn bus-transaction-failed__btn--primary"
            >
              <Bus className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              Tafuta safari upya
            </Link>
            <Link
              to="/"
              className="bus-transaction-failed__btn bus-transaction-failed__btn--secondary"
            >
              <Home className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              Rudi nyumbani
            </Link>
          </div>

          <p className="bus-transaction-failed__hint">
            Ukiwa na shida na malipo, wasiliana na msaada wetu kupitia ukurasa wa{" "}
            <Link to="/contactus" className="bus-transaction-failed__inline-link">
              mawasiliano
            </Link>
            .
          </p>
        </div>
      </Container>
    </Section>
  );
};

export default TransactionFailed;
