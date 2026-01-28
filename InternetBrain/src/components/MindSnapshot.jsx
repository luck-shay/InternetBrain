import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Fade } from '@mui/material';
import { useAnalytics } from '../context/AnalyticsContext';
import { useBrain } from '../context/BrainContext';

const MindSnapshot = () => {
    const { sessionStatus, setSessionStatus, generateSnapshot } = useAnalytics();
    const { nodes } = useBrain();
    const [snapshot, setSnapshot] = useState(null);

    useEffect(() => {
        if (sessionStatus === 'snapshot') {
            setSnapshot(generateSnapshot());
        }
    }, [sessionStatus, generateSnapshot]);

    const handleRestart = () => {
        setSessionStatus('active');
        window.location.reload(); // Hard reset for session
    };

    if (sessionStatus !== 'snapshot' || !snapshot) return null;

    // Find label for dominant node
    const dominantNode = nodes.find(n => n.id == snapshot.dominantNodeId);
    const dominantLabel = dominantNode ? dominantNode.label : 'Drifting';

    return (
        <Modal
            open={true}
            closeAfterTransition
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Fade in={true}>
                <Box sx={{
                    width: 500,
                    maxWidth: '90%',
                    bgcolor: 'black',
                    border: '1px solid #333',
                    boxShadow: '0 0 50px rgba(0, 255, 204, 0.2)',
                    p: 6,
                    color: 'white',
                    textAlign: 'center',
                    outline: 'none',
                    borderRadius: 2
                }}>
                    <Typography variant="overline" sx={{ letterSpacing: '0.2em', color: 'gray' }}>
                        SESSION COMPLETE
                    </Typography>

                    <Typography variant="h3" sx={{ mt: 2, mb: 4, fontWeight: 'bold' }}>
                        Mind Snapshot
                    </Typography>

                    <div className="d-flex justify-content-between mb-3 text-start">
                        <Typography color="gray">Duration</Typography>
                        <Typography variant="h6">{snapshot.duration}</Typography>
                    </div>

                    <div className="d-flex justify-content-between mb-3 text-start">
                        <Typography color="gray">Main Focus</Typography>
                        <Typography variant="h6" sx={{ color: '#00ffcc' }}>{dominantLabel}</Typography>
                    </div>

                    <div className="d-flex justify-content-between mb-5 text-start">
                        <Typography color="gray">Interaction Style</Typography>
                        <Typography variant="h6" sx={{ color: snapshot.interactionStyle.includes('Calm') ? '#00ffcc' : '#ff0055' }}>
                            {snapshot.interactionStyle}
                        </Typography>
                    </div>

                    <Typography variant="body2" sx={{ opacity: 0.7, mb: 4, fontStyle: 'italic' }}>
                        "Reflect on why you gravitated towards <strong>{dominantLabel}</strong>.
                        Your interaction pattern was mostly <strong>{snapshot.interactionStyle.split('/')[0]}</strong>."
                    </Typography>

                    <Button
                        variant="outlined"
                        size="large"
                        onClick={handleRestart}
                        sx={{ borderColor: 'white', color: 'white', '&:hover': { bgcolor: 'white', color: 'black' } }}
                    >
                        Reset Consciousness
                    </Button>
                </Box>
            </Fade>
        </Modal>
    );
};

export default MindSnapshot;
