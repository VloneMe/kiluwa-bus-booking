import { contactData } from "@/data/contactData";
import { Container } from "../Container";
import { Section } from "../Section";
import { Form } from "./Form";
import { cn } from "@/lib/utils";

interface ContactUsProps {
  className?: string;
  fixContainer?: string;
}

function contactHref(item: (typeof contactData)[number]): string | undefined {
  if (item.id === 3) return `mailto:${item.description}`;
  if (item.id === 4) return `tel:${item.description.replace(/\s/g, "")}`;
  return undefined;
}

export const ContactUs = ({
  className = "",
  fixContainer,
}: ContactUsProps) => {
  return (
    <Section
      className={cn(
        "flex w-full pt-28 pb-12 sm:pt-32 sm:pb-14 lg:min-h-screen",
        className
      )}
    >
      <Container className={cn("relative w-full", fixContainer)}>
        <div
          className="contact-page"
          aria-labelledby="contact-heading"
        >
          <div className="contact-page__grid">
            <div className="contact-page__intro">
              <h1 id="contact-heading" className="contact-page__title">
                Wasiliana Nasi
                <span className="contact-page__title-accent" aria-hidden />
              </h1>
              <p className="contact-page__lead">
                Tunafurahia kukusaidia na tatizo lolote linalokukabili. Tafadhali
                jisikie huru kutuunganishia msaada — tutajibu haraka iwezekanavyo.
              </p>

              <ul className="contact-page__channels" role="list">
                {contactData.map((item) => {
                  const href = contactHref(item);
                  return (
                    <li key={item.id}>
                      <div className="contact-page__channel">
                        <div className="contact-page__icon" aria-hidden>
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <h2 className="contact-page__channel-title">
                            {item.title}
                          </h2>
                          <div className="contact-page__channel-body">
                            {href ? (
                              <a
                                href={href}
                                className="contact-page__channel-link break-all"
                              >
                                {item.description}
                              </a>
                            ) : (
                              item.description
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="contact-page__form-wrap">
              <h2 className="contact-page__form-title">Tuma ujumbe</h2>
              <p className="contact-page__form-subtitle">
                Jaza fomu hapa chini; tutakupigia au kukutumia barua pepe kulingana
                na taarifa ulizoweka.
              </p>
              <Form />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
