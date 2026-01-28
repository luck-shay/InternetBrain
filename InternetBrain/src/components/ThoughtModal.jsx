import React from 'react';
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';
import { useBrain } from '../context/BrainContext';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';

const ThoughtModal = () => {
    const { activeNode, setActiveNode } = useBrain();

    const handleClose = () => setActiveNode(null);

    if (!activeNode) return null;

    return (
        <Modal
            open={!!activeNode}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            closeAfterTransition
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(5px)' // additional blur
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{ outline: 'none' }}
            >
                <Box sx={{
                    width: 400,
                    maxWidth: '90vw',
                    bgcolor: 'rgba(10, 10, 10, 0.9)',
                    border: '1px solid',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 4,
                    color: 'white',
                    position: 'relative'
                }}>
                    <IconButton
                        onClick={handleClose}
                        sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography id="modal-title" variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {activeNode.label}
                    </Typography>

                    <Typography id="modal-description" sx={{ mt: 2, opacity: 0.8 }}>
                        This is the deep dive into {activeNode.label}. It represents a core cluster of neural activity.
                        In a full version, this would contain unique content: images, memories, or tasks related to {activeNode.label}.
                    </Typography>

                    <Button variant="outlined" sx={{ mt: 4, width: '100%', borderColor: 'rgba(255,255,255,0.3)', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }} onClick={handleClose}>
                        Close Thought
                    </Button>
                </Box>
            </motion.div>
        </Modal>
    );
};

export default ThoughtModal;
