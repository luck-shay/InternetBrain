import React, { useRef, useEffect } from 'react';
import { useBrain } from '../context/BrainContext';

const NeuralCanvas = () => {
    const canvasRef = useRef(null);
    const { chaosLevel } = useBrain();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Resize handler
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // Particles
        const particleCount = 80; // Number of background nodes
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
            });
        }

        // Animation Loop
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Adjust speed based on chaos level
            const speedMultiplier = 1 + (chaosLevel * 5);

            // Update and draw particles
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            particles.forEach(p => {
                p.x += p.vx * speedMultiplier;
                p.y += p.vy * speedMultiplier;

                // Wrap around screen
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw connections
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.strokeStyle = `rgba(0, 255, 204, ${0.15 * (1 - dist / 150)})`;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [chaosLevel]);

    return (
        <canvas
            ref={canvasRef}
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
                zIndex: 0,
                filter: `blur(${chaosLevel * 2}px)` // Dynamic blur
            }}
        />
    );
};

export default NeuralCanvas;
