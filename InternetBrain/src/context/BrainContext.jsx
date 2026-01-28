/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

const BrainContext = createContext();

export const BrainProvider = ({ children }) => {
    const [chaosLevel, setChaosLevel] = useState(0.1); // 0 (calm) to 1 (chaotic)

    // Initial nodes data
    const [nodes, setNodes] = useState([
        { id: 1, label: 'Memories', x: window.innerWidth * 0.2, y: window.innerHeight * 0.3, type: 'memory' },
        { id: 2, label: 'Music', x: window.innerWidth * 0.5, y: window.innerHeight * 0.5, type: 'creative' },
        { id: 3, label: 'Stress', x: window.innerWidth * 0.8, y: window.innerHeight * 0.2, type: 'emotion' },
        { id: 4, label: 'Goals', x: window.innerWidth * 0.4, y: window.innerHeight * 0.7, type: 'logic' },
    ]);

    const [activeNode, setActiveNode] = useState(null);

    return (
        <BrainContext.Provider value={{ chaosLevel, setChaosLevel, nodes, setNodes, activeNode, setActiveNode }}>
            {children}
        </BrainContext.Provider>
    );
};

export const useBrain = () => useContext(BrainContext);
