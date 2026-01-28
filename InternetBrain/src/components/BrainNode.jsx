import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Typography } from '@mui/material';
import { useBrain } from '../context/BrainContext';
import { useAnalytics } from '../context/AnalyticsContext';
import PropTypes from 'prop-types';

const BrainNode = ({ node }) => {
    const { setActiveNode, chaosLevel } = useBrain();
    const { recordHover, recordClick } = useAnalytics();
    const [hoverStart, setHoverStart] = useState(0);

    const handleHoverStart = () => {
        setHoverStart(Date.now());
    };

    const handleHoverEnd = () => {
        const duration = Date.now() - hoverStart;
        recordHover(node.id, duration);
    };

    const handleClick = () => {
        recordClick(node.id);
        setActiveNode(node);
    };

    // Psych-based visual behavior
    // Stress: Shakes more when chaos is high
    // Goals: Stays relatively stable (Grounding)
    // Creative: Floats widely
    const getVariants = () => {
        const jitter = chaosLevel * 50;

        const baseAnimation = {
            y: [0, -10, 0],
            rotate: [0, 1, -1, 0],
            transition: { repeat: Infinity, duration: 4 }
        };

        if (node.type === 'emotion' || node.type === 'stress') {
            // Stress/Emotion: Unstable
            return {
                animate: {
                    x: [0, -jitter, jitter, 0],
                    y: [0, -jitter, jitter, 0],
                    rotate: [0, -2, 2, 0],
                    scale: [1, 1.05 + chaosLevel * 0.1, 1],
                    transition: { repeat: Infinity, duration: 0.2 + (1 - chaosLevel) } // Faster when chaotic
                }
            };
        }

        if (node.type === 'logic' || node.type === 'goals') {
            // Logic/Goals: Stable, Heavy
            return {
                animate: {
                    y: [0, -5, 0],
                    scale: 1,
                    transition: { repeat: Infinity, duration: 6, ease: "easeInOut" }
                }
            };
        }

        // Default / Creative
        return {
            animate: {
                y: [0, -15 - (jitter / 2), 0],
                x: [0, 5, -5, 0],
                transition: { repeat: Infinity, duration: 3, ease: "easeInOut" }
            }
        };
    };

    const variants = getVariants();

    // Style Mapping
    const getNodeStyles = (type) => {
        switch (type) {
            case 'memory': return { borderColor: '#cc00ff', boxShadow: `0 0 ${15 + chaosLevel * 20}px rgba(204, 0, 255, 0.4)` };
            case 'creative': return { borderColor: '#00ffcc', boxShadow: `0 0 ${15 + chaosLevel * 20}px rgba(0, 255, 204, 0.4)` };
            case 'emotion': // Stress
                return { borderColor: '#ff0055', boxShadow: `0 0 ${15 + chaosLevel * 50}px rgba(255, 0, 85, ${0.4 + chaosLevel})` };
            case 'logic': return { borderColor: '#00ccff', boxShadow: '0 0 15px rgba(0, 204, 255, 0.4)' };
            default: return { borderColor: '#ffffff' };
        }
    };

    const styles = getNodeStyles(node.type);

    return (
        <motion.div
            drag
            dragConstraints={{ left: 0, right: window.innerWidth - 100, top: 0, bottom: window.innerHeight - 100 }}
            dragElastic={0.2}
            whileHover={{ scale: 1.1, zIndex: 100 }}
            whileDrag={{ scale: 1.2, zIndex: 100, cursor: 'grabbing' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={variants.animate}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
            onClick={handleClick}
            style={{
                position: 'absolute',
                left: node.x,
                top: node.y,
                cursor: 'grab'
            }}
        >
            <Card
                sx={{
                    minWidth: 100,
                    padding: 2,
                    background: 'rgba(20, 20, 20, 0.65)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderRadius: '16px',
                    color: 'white',
                    ...styles
                }}
            >
                <Typography variant="body1" sx={{ fontWeight: 'bold', pointerEvents: 'none', userSelect: 'none' }}>
                    {node.label}
                </Typography>
            </Card>
        </motion.div>
    );
};

BrainNode.propTypes = {
    node: PropTypes.shape({
        id: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired
    }).isRequired
};

export default BrainNode;
