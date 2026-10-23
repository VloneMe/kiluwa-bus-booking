// useCountdownTimer.ts
import { useEffect, useState } from 'react';

const useCountdownTimer = (endTime: number) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        if (!endTime) {
            return; // Do nothing if there's no end time
        }

        const intervalId = setInterval(() => {
            const remainingTime = Math.max(Math.floor((endTime - Date.now()) / 1000), 0); // Calculate remaining time
            setTimeLeft(remainingTime);

            if (remainingTime <= 0) {
                clearInterval(intervalId); // Stop the timer
            }
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup
    }, [endTime]);

    return timeLeft;
};

export default useCountdownTimer;
