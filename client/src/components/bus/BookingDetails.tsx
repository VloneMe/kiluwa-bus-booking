import React from "react";
import type { LucideIcon } from "lucide-react";
import { AirVent, CircleDot, MapPin, Tv, Wifi } from "lucide-react";

interface BusInfoProps {
  company: string;
  tripName: string;
  busPlateNumber: string;
  busClass: string;
  brandName: string;
  via?: string;
  origin: string;
  destination: string;
  amenities: string[];
}

const AMENITY_META: Record<
  string,
  { label: string; Icon: LucideIcon }
> = {
  tv: { label: "Runinga", Icon: Tv },
  ac: { label: "Hewa baridi", Icon: AirVent },
  wifi: { label: "Wi‑Fi", Icon: Wifi },
};

function AmenityItem({ code }: { code: string }) {
  const key = code.trim().toLowerCase();
  const meta = AMENITY_META[key];

  if (meta) {
    const { Icon, label } = meta;
    return (
      <li>
        <span
          className="bus-info__amenity"
          title={label}
          aria-label={label}
        >
          <Icon aria-hidden />
        </span>
      </li>
    );
  }

  const short = key.slice(0, 3) || "?";
  return (
    <li>
      <span
        className="bus-info__amenity bus-info__amenity--fallback"
        title={code}
        aria-label={code}
      >
        {short}
      </span>
    </li>
  );
}

const BusInfo: React.FC<BusInfoProps> = ({
  company,
  tripName,
  busPlateNumber,
  busClass,
  brandName,
  via,
  origin,
  destination,
  amenities,
}) => (
  <section className="bus-info" aria-label="Maelezo ya kampuni na safari">
    <div className="bus-info__head">
      <h2 className="bus-info__company">{company}</h2>
      <h3 className="bus-info__trip">
        {tripName}
        {via ? (
          <span className="bus-info__via"> · {via}</span>
        ) : null}
      </h3>
    </div>

    <div className="bus-info__brand-row">
      <div className="bus-info__meta" aria-label="Gari na daraja">
        <span className="bus-info__chip bus-info__chip--plate">{busPlateNumber}</span>
        <span className="bus-info__chip">{busClass}</span>
      </div>

      <div className="bus-info__brand-row">
        <span hidden className="bus-info__brand">{brandName}</span>
        {amenities.length > 0 ? (
          <ul
            className="bus-info__amenities"
            aria-label="Vifaa vinavyopatikana kwenye basi"
          >
            {amenities.map((amenity) => (
              <AmenityItem key={amenity} code={amenity} />
            ))}
          </ul>
        ) : null}
      </div>
    </div>

    <div className="bus-info__route">
      <div className="bus-info__route-leg">
        <span className="bus-info__route-icon" aria-hidden>
          <CircleDot />
        </span>
        <div className="bus-info__route-text">
          <span className="bus-info__route-label">Kutoka</span>
          <p className="bus-info__route-place">{origin}</p>
        </div>
      </div>
      <div className="bus-info__route-leg">
        <span
          className="bus-info__route-icon bus-info__route-icon--to"
          aria-hidden
        >
          <MapPin />
        </span>
        <div className="bus-info__route-text">
          <span className="bus-info__route-label">Kwenda</span>
          <p className="bus-info__route-place">{destination}</p>
        </div>
      </div>
    </div>
  </section>
);

export default BusInfo;
