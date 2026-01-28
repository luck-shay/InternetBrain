import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
    // Session Data
    const metrics = useRef({
        startTime: Date.now(),
        hoverTimes: {}, // { nodeId: durationMs }
        clickCounts: {}, // { nodeId: count }
        maxSpeed: 0,
        avgSpeed: 0,
        speedSamples: 0,
        idleTime: 0,
        chaosHistory: [] // [0.1, 0.5, ...]
    });

    const [sessionStatus, setSessionStatus] = useState('active'); // active, snapshot

    const recordHover = (nodeId, duration) => {
        if (!metrics.current.hoverTimes[nodeId]) metrics.current.hoverTimes[nodeId] = 0;
        metrics.current.hoverTimes[nodeId] += duration;
    };

    const recordClick = (nodeId) => {
        if (!metrics.current.clickCounts[nodeId]) metrics.current.clickCounts[nodeId] = 0;
        metrics.current.clickCounts[nodeId]++;
    };

    const recordSpeed = (speed) => {
        metrics.current.maxSpeed = Math.max(metrics.current.maxSpeed, speed);
        // Rolling average
        const n = metrics.current.speedSamples;
        metrics.current.avgSpeed = (metrics.current.avgSpeed * n + speed) / (n + 1);
        metrics.current.speedSamples++;
    };

    const recordChaos = (level) => {
        metrics.current.chaosHistory.push(level);
    };

    const generateSnapshot = () => {
        const m = metrics.current;
        const totalDuration = (Date.now() - m.startTime) / 1000;

        // Domaint Focus
        let maxHover = 0;
        let dominantNodeId = null;
        Object.entries(m.hoverTimes).forEach(([id, time]) => {
            if (time > maxHover) {
                maxHover = time;
                dominantNodeId = id;
            }
        });

        // Interaction Style
        const avgChaos = m.chaosHistory.reduce((a, b) => a + b, 0) / (m.chaosHistory.length || 1);
        let style = 'Balanced';
        if (avgChaos > 0.6) style = 'Scattered / Anxious';
        if (avgChaos < 0.2) style = 'Calm / Intentional';

        return {
            duration: totalDuration.toFixed(0) + 's',
            dominantNodeId,
            interactionStyle: style,
            data: m
        };
    };

    return (
        <AnalyticsContext.Provider value={{
            recordHover,
            recordClick,
            recordSpeed,
            recordChaos,
            generateSnapshot,
            sessionStatus,
            setSessionStatus
        }}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalytics = () => useContext(AnalyticsContext);
