import { useState } from "react";

export const usePickupDropoff = (
        initialPickup: string, initialDropoff: string) => {
        const [pickupPoint, setPickupPoint] = useState<string>(initialPickup);
        const [dropOffPoint, setDropOffPoint] = useState<string>(initialDropoff);

        return {
                pickupPoint,
                dropOffPoint,
                setPickupPoint,
                setDropOffPoint,
        };
};
      