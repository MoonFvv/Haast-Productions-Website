import React, { useEffect, useRef } from 'react';

const AnimatedGrid: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const CELL = 60;
        const GLOW_RADIUS = 200;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        const draw = () => {
            time += 0.005;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cols = Math.ceil(canvas.width / CELL) + 1;
            const rows = Math.ceil(canvas.height / CELL) + 1;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * CELL;
                    const y = j * CELL;

                    // Distance from mouse
                    const dx = x - mouse.current.x;
                    const dy = y - mouse.current.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Mouse glow effect
                    const mouseGlow = Math.max(0, 1 - dist / GLOW_RADIUS);

                    // Ambient pulse wave that ripples across the grid
                    const wave1 = Math.sin(time * 2 + i * 0.3 + j * 0.2) * 0.5 + 0.5;
                    const wave2 = Math.sin(time * 1.5 + j * 0.4 - i * 0.15) * 0.5 + 0.5;
                    const ambient = (wave1 * 0.3 + wave2 * 0.2) * 0.15;

                    // Combined brightness
                    const brightness = ambient + mouseGlow * 0.6;

                    if (brightness > 0.02) {
                        // Blue tint for mouse, subtle white for ambient
                        const r = Math.round(mouseGlow * 80 + ambient * 30);
                        const g = Math.round(mouseGlow * 120 + ambient * 40);
                        const b = Math.round(mouseGlow * 255 + ambient * 60);
                        const alpha = Math.min(brightness, 0.7);

                        // Draw intersection point (dot at grid crossing)
                        ctx.beginPath();
                        ctx.arc(x, y, 1.5 + mouseGlow * 2, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                        ctx.fill();

                        // Draw grid lines from this point
                        if (brightness > 0.05) {
                            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`;
                            ctx.lineWidth = 0.5 + mouseGlow;

                            // Horizontal line segment
                            ctx.beginPath();
                            ctx.moveTo(x, y);
                            ctx.lineTo(x + CELL, y);
                            ctx.stroke();

                            // Vertical line segment
                            ctx.beginPath();
                            ctx.moveTo(x, y);
                            ctx.lineTo(x, y + CELL);
                            ctx.stroke();
                        }
                    }
                }
            }

            // Mouse radial glow overlay
            if (mouse.current.x > 0) {
                const gradient = ctx.createRadialGradient(
                    mouse.current.x, mouse.current.y, 0,
                    mouse.current.x, mouse.current.y, GLOW_RADIUS * 1.5
                );
                gradient.addColorStop(0, 'rgba(59, 130, 246, 0.06)');
                gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.02)');
                gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            animationId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    );
};

export default AnimatedGrid;
