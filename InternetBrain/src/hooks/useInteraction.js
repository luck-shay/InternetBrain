import { useEffect } from 'react';
import { useBrain } from '../context/BrainContext';
import { useAnalytics } from '../context/AnalyticsContext';

const useInteraction = () => {
    const { setChaosLevel } = useBrain();
    const { recordSpeed, recordChaos } = useAnalytics();

    useEffect(() => {
        let lastX = 0;
        let lastY = 0;
        let lastTime = Date.now();
        let speed = 0;
        let idleTimer;

        const handleMouseMove = (e) => {
            const now = Date.now();
            const dt = now - lastTime;

            if (dt > 50) { // Limit updates
                const dx = e.clientX - lastX;
                const dy = e.clientY - lastY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                speed = dist / dt; // pixels per ms

                // Map speed to chaos (0 to 1)
                // Speed 0.1 is slow, 5 is fast
                let newChaos = Math.min(Math.max(speed / 3, 0), 1);

                setChaosLevel(prev => prev * 0.9 + newChaos * 0.1); // Smooth transition

                // Analytics
                if (speed > 0.01) recordSpeed(speed);
                recordChaos(newChaos);

                lastX = e.clientX;
                lastY = e.clientY;
                lastTime = now;

                // Reset idle
                clearTimeout(idleTimer);
                idleTimer = setTimeout(() => {
                    // IDLE STATE: Reduce chaos slowly
                    setChaosLevel(c => Math.max(c - 0.05, 0));
                }, 500);
            }
        };

        const idleLoop = setInterval(() => {
            // Decay chaos if no movement
            setChaosLevel(prev => Math.max(prev * 0.95, 0.1)); // Decay to base level 0.1
        }, 100);

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(idleLoop);
            clearTimeout(idleTimer);
        };
    }, [setChaosLevel]);
};

export default useInteraction;
