import React from 'react';
import { BrainProvider, useBrain } from './context/BrainContext';
import NeuralCanvas from './components/NeuralCanvas';
import BrainNode from './components/BrainNode';
import ThoughtModal from './components/ThoughtModal';
import MindSnapshot from './components/MindSnapshot';
import useInteraction from './hooks/useInteraction';
import { useAnalytics } from './context/AnalyticsContext';
import { Button } from '@mui/material';

const BrainInterface = () => {
  const { nodes } = useBrain();
  const { setSessionStatus } = useAnalytics();

  useInteraction(); // Activate the interaction tracker

  return (
    <>
      <NeuralCanvas />
      <ThoughtModal />
      <MindSnapshot />

      <div className="position-absolute bottom-0 end-0 p-4" style={{ zIndex: 200 }}>
        <Button
          variant="text"
          onClick={() => setSessionStatus('snapshot')}
          sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', '&:hover': { color: 'white' } }}
        >
          END SESSION
        </Button>
      </div>

      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 10 }}>
        {/* Title Background */}
        <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: -1 }}>
          <h1 className="text-white user-select-none" style={{ opacity: 0.1, fontSize: '5rem', letterSpacing: '0.2em' }}>
            INTERNET BRAIN
          </h1>
        </div>

        {/* Nodes */}
        {nodes.map(node => (
          <BrainNode key={node.id} node={node} />
        ))}
      </div>
    </>
  );
};

function App() {
  return (
    <BrainProvider>
      <div className="position-relative w-100 vh-100 overflow-hidden" style={{ background: 'var(--brain-bg)' }}>
        <BrainInterface />
      </div>
    </BrainProvider>
  )
}

export default App
