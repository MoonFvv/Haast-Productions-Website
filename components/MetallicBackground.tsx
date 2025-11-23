import React, { useEffect, useRef } from 'react';

const MetallicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let time = 0;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Configuration for the "liquid metal" waves
    const waves = [
      { y: 0.3, amplitude: 80, frequency: 0.002, speed: 0.015, color: [20, 20, 20] },
      { y: 0.45, amplitude: 120, frequency: 0.001, speed: 0.01, color: [40, 40, 45] },
      { y: 0.6, amplitude: 100, frequency: 0.003, speed: 0.02, color: [10, 10, 12] },
    ];

    const drawWave = (yRatio: number, amplitude: number, frequency: number, phase: number, colorRGB: number[]) => {
        ctx.beginPath();
        const baseHeight = height * yRatio;
        
        ctx.moveTo(0, baseHeight);
        
        for (let x = 0; x <= width; x += 10) {
            // Complex wave interference for liquid look
            const y = baseHeight + 
                      Math.sin(x * frequency + phase) * amplitude + 
                      Math.sin(x * frequency * 2.5 + phase * 1.5) * (amplitude / 2);
            ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        // Create metallic gradient
        const gradient = ctx.createLinearGradient(0, baseHeight - amplitude, 0, height);
        gradient.addColorStop(0, `rgba(${colorRGB[0] + 40}, ${colorRGB[1] + 40}, ${colorRGB[2] + 40}, 0.1)`); // Highlight
        gradient.addColorStop(0.3, `rgba(${colorRGB[0]}, ${colorRGB[1]}, ${colorRGB[2]}, 0.8)`); // Body
        gradient.addColorStop(1, `rgba(0, 0, 0, 1)`); // Shadow

        ctx.fillStyle = gradient;
        ctx.fill();

        // Add a "specular highlight" line on top
        ctx.strokeStyle = `rgba(255, 255, 255, 0.05)`;
        ctx.lineWidth = 1;
        ctx.stroke();
    };

    const animate = () => {
      ctx.fillStyle = '#020202';
      ctx.fillRect(0, 0, width, height);

      time += 1;

      // Draw subtle background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      
      waves.forEach((wave, i) => {
         drawWave(
             wave.y, 
             wave.amplitude, 
             wave.frequency, 
             time * wave.speed + i, 
             wave.color
         );
      });

      // Add Noise
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 10;
          data[i] = Math.min(255, Math.max(0, data[i] + noise));
          data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise));
          data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise));
      }
      ctx.putImageData(imageData, 0, 0);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

export default MetallicBackground;