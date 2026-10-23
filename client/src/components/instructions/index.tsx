import type { ReactNode } from "react";
import {
  MdAirlineSeatReclineExtra,
  MdManageSearch,
} from "react-icons/md";
import { PiSeatBold } from "react-icons/pi";
import { IoMdInformationCircle } from "react-icons/io";
import { FaBus, FaMoneyCheckAlt } from "react-icons/fa";
import { TicketCheck } from "lucide-react";

import { Container } from "../Container";
import { Section } from "../Section";

type InstructionStep = {
  id: string;
  title: string;
  body: ReactNode;
  icon: ReactNode;
  highlight?: boolean;
};

const STEPS: InstructionStep[] = [
  {
    id: "step-1",
    title: "Taarifa za safari",
    icon: <MdManageSearch className="home-instructions__icon" aria-hidden />,
    body: (
      <>
        Chagua kituo unachotoka, kituo unachokwenda na tarehe, kisha bonyeza{" "}
        <strong>Tafuta mabasi</strong> kuendelea. Au chagua kwenye orodha ya{" "}
        <strong>Mabasi ya leo</strong>.
      </>
    ),
  },
  {
    id: "step-2",
    title: "Chagua basi",
    icon: <FaBus className="home-instructions__icon" aria-hidden />,
    body: (
      <>
        Katika orodha ya mabasi yaliyopo, hakikisha unachagua basi sahihi kwa
        kubofya <strong>Tazama viti</strong>.
      </>
    ),
  },
  {
    id: "step-3",
    title: "Chagua kiti",
    icon: <PiSeatBold className="home-instructions__icon" aria-hidden />,
    body: (
      <>
        Chagua kiti au viti unavyohitaji. Idadi ya juu ni viti{" "}
        <strong>vitatu (3)</strong> kwa pamoja kama unasafiri na wengine. Fomu
        ya kila msafiri itafunguka chini.
      </>
    ),
  },
  {
    id: "step-4",
    title: "Taarifa za wasafiri",
    icon: (
      <MdAirlineSeatReclineExtra className="home-instructions__icon" aria-hidden />
    ),
    body: (
      <>
        Jaza taarifa sahihi za wanaosafiri, ikiwemo vitambulisho vya watu wazima.
        Weka mawasiliano sahihi (namba ya simu au barua pepe). Kisha bonyeza{" "}
        <strong>Endelea</strong>.
      </>
    ),
  },
  {
    id: "step-5",
    title: "Thibitisha taarifa",
    icon: <IoMdInformationCircle className="home-instructions__icon" aria-hidden />,
    body: (
      <>
        Hakikisha basi, viti, taarifa za wasafiri na nauli. Kisha bonyeza{" "}
        <strong>Endelea na malipo</strong>.
      </>
    ),
  },
  {
    id: "step-6",
    title: "Fanya malipo",
    icon: <FaMoneyCheckAlt className="home-instructions__icon" aria-hidden />,
    body: (
      <>
        Utapokea ujumbe mfupi kwenye simu yako pamoja na namba ya malipo (mfano:{" "}
        <strong>908099609771</strong>). Namba ya kampuni ni{" "}
        <strong>009009</strong>. Lipa kwa simu au wakala, au fuata maelekezo ya
        njia uliyochagua.
      </>
    ),
  },
  {
    id: "step-7",
    title: "Pakua tiketi",
    icon: <TicketCheck className="home-instructions__icon" aria-hidden strokeWidth={2} />,
    body: (
      <>
        Baada ya malipo, bonyeza <strong>Sasisha</strong> ili kuona tiketi,
        kisha <strong>Pakua tiketi</strong> kwa uthibitisho. Unaweza pia
        kuwasiliana na mtoa huduma kwa msaada.
      </>
    ),
    highlight: true,
  },
];

export const Instructions = () => {
  return (
    <Section
      className="home-instructions"
      aria-labelledby="instructions-heading"
    >
      <Container className="home-instructions__container">
        <header className="home-instructions__header">
          <p className="home-instructions__eyebrow">Muongozo</p>
          <h2 id="instructions-heading" className="home-instructions__title">
            Jinsi ya kukata tiketi mtandaoni
          </h2>
          <p className="home-instructions__lead">
            Hatua chache, wazi na salama — tumepanga kila kitu ili uweze kuhitimu
            haraka bila mkanganyiko.
          </p>
        </header>

        <ol className="home-instructions__grid">
          {STEPS.map((step, index) => (
            <li
              key={step.id}
              className={
                step.highlight
                  ? "home-instructions__step home-instructions__step--wide"
                  : "home-instructions__step"
              }
            >
              <span className="home-instructions__step-index opacity-40" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="home-instructions__step-inner">
                <div className="home-instructions__icon-wrap">{step.icon}</div>
                <div className="home-instructions__step-body">
                  <h3 className="home-instructions__step-title">{step.title}</h3>
                  <p className="home-instructions__text">{step.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
};
