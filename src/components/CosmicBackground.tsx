import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
  layer: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

interface Galaxy {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  armCount: number;
  color: string;
}

const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const starsRef = useRef<Star[]>([]);
  const nebulasRef = useRef<Nebula[]>([]);
  const galaxiesRef = useRef<Galaxy[]>([]);
  const animationRef = useRef<number>();
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const colors = [
      'rgba(0, 255, 247, ',    // Cyan
      'rgba(139, 92, 246, ',   // Violet
      'rgba(236, 72, 153, ',   // Pink
      'rgba(255, 255, 255, ',  // White
      'rgba(167, 139, 250, ',  // Light violet
    ];

    const initStars = () => {
      starsRef.current = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 2000);
      
      for (let i = 0; i < starCount; i++) {
        const layer = Math.floor(Math.random() * 3); // 0 = far, 1 = mid, 2 = close
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: (Math.random() * 2 + 0.5) * (layer * 0.5 + 0.5),
          speedX: (Math.random() - 0.5) * 0.2 * (layer + 1),
          speedY: (Math.random() - 0.5) * 0.2 * (layer + 1),
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          layer,
        });
      }
    };

    const initNebulas = () => {
      nebulasRef.current = [];
      const nebulaCount = 3;
      
      for (let i = 0; i < nebulaCount; i++) {
        nebulasRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 300 + 200,
          color: colors[Math.floor(Math.random() * 3)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.0005,
        });
      }
    };

    const initGalaxies = () => {
      galaxiesRef.current = [];
      const galaxyCount = 2;
      
      for (let i = 0; i < galaxyCount; i++) {
        galaxiesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 150 + 100,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.001,
          armCount: Math.floor(Math.random() * 3) + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    const drawNebula = (nebula: Nebula, time: number) => {
      ctx.save();
      ctx.translate(nebula.x, nebula.y);
      ctx.rotate(nebula.rotation + time * nebula.rotationSpeed);
      
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, nebula.radius);
      gradient.addColorStop(0, nebula.color + '0.15)');
      gradient.addColorStop(0.3, nebula.color + '0.08)');
      gradient.addColorStop(0.6, nebula.color + '0.03)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.beginPath();
      ctx.ellipse(0, 0, nebula.radius, nebula.radius * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.restore();
    };

    const drawGalaxy = (galaxy: Galaxy, time: number) => {
      ctx.save();
      ctx.translate(galaxy.x, galaxy.y);
      ctx.rotate(galaxy.rotation + time * galaxy.rotationSpeed);
      
      // Draw spiral arms
      for (let arm = 0; arm < galaxy.armCount; arm++) {
        const armAngle = (arm / galaxy.armCount) * Math.PI * 2;
        
        for (let i = 0; i < 50; i++) {
          const distance = (i / 50) * galaxy.size;
          const angle = armAngle + (i / 50) * Math.PI * 1.5;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance * 0.4;
          
          const starSize = Math.random() * 1.5 + 0.5;
          const opacity = (1 - i / 50) * 0.6;
          
          ctx.beginPath();
          ctx.arc(x, y, starSize, 0, Math.PI * 2);
          ctx.fillStyle = galaxy.color + opacity + ')';
          ctx.fill();
        }
      }
      
      // Draw core glow
      const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size * 0.3);
      coreGradient.addColorStop(0, galaxy.color + '0.4)');
      coreGradient.addColorStop(0.5, galaxy.color + '0.1)');
      coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(0, 0, galaxy.size * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();
      
      ctx.restore();
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear with fade effect for trails
      ctx.fillStyle = 'rgba(10, 5, 20, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;
      const parallaxX = (mouseRef.current.x - canvas.width / 2) * 0.02;
      const parallaxY = (mouseRef.current.y - canvas.height / 2) * 0.02;

      // Draw nebulas first (background layer)
      nebulasRef.current.forEach((nebula) => {
        const offsetX = parallaxX * 0.3;
        const offsetY = parallaxY * 0.3 + scrollRef.current * 0.05;
        
        ctx.save();
        ctx.translate(offsetX, offsetY);
        drawNebula(nebula, time);
        ctx.restore();
      });

      // Draw galaxies
      galaxiesRef.current.forEach((galaxy) => {
        const offsetX = parallaxX * 0.5;
        const offsetY = parallaxY * 0.5 + scrollRef.current * 0.1;
        
        ctx.save();
        ctx.translate(offsetX, offsetY);
        drawGalaxy(galaxy, time);
        ctx.restore();
      });

      // Draw stars with parallax based on layer
      starsRef.current.forEach((star) => {
        const layerMultiplier = (star.layer + 1) * 0.5;
        const starParallaxX = parallaxX * layerMultiplier;
        const starParallaxY = parallaxY * layerMultiplier + scrollRef.current * (0.02 * layerMultiplier);

        // Mouse interaction - stronger for closer stars
        const dx = mouseRef.current.x - (star.x + starParallaxX);
        const dy = mouseRef.current.y - (star.y + starParallaxY);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150 + star.layer * 50;

        let displayX = star.x + starParallaxX;
        let displayY = star.y + starParallaxY;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance * (star.layer + 1);
          displayX -= (dx / distance) * force * 2;
          displayY -= (dy / distance) * force * 2;
        }

        // Update base position
        star.x += star.speedX;
        star.y += star.speedY;

        // Wrap around edges
        if (star.x < -50) star.x = canvas.width + 50;
        if (star.x > canvas.width + 50) star.x = -50;
        if (star.y < -50) star.y = canvas.height + 50;
        if (star.y > canvas.height + 50) star.y = -50;

        // Twinkle effect
        const twinkle = Math.sin(time * star.twinkleSpeed * 10 + star.twinkleOffset) * 0.5 + 0.5;
        const currentOpacity = star.opacity * (0.5 + twinkle * 0.5);

        // Draw star
        ctx.beginPath();
        ctx.arc(displayX, displayY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color + currentOpacity + ')';
        ctx.fill();

        // Add glow for larger/closer stars
        if (star.size > 1.5 || star.layer === 2) {
          ctx.beginPath();
          ctx.arc(displayX, displayY, star.size * 4, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            displayX, displayY, 0,
            displayX, displayY, star.size * 4
          );
          gradient.addColorStop(0, star.color + (currentOpacity * 0.5) + ')');
          gradient.addColorStop(1, star.color + '0)');
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });

      // Draw constellation lines between nearby close-layer stars
      const closeStars = starsRef.current.filter(s => s.layer === 2);
      closeStars.forEach((star, i) => {
        for (let j = i + 1; j < closeStars.length; j++) {
          const other = closeStars[j];
          const dx = star.x - other.x;
          const dy = star.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120 && distance > 40) {
            ctx.beginPath();
            ctx.moveTo(star.x + parallaxX, star.y + parallaxY);
            ctx.lineTo(other.x + parallaxX, other.y + parallaxY);
            const opacity = (1 - distance / 120) * 0.2;
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      // Occasional shooting star
      if (Math.random() < 0.002) {
        const shootingStarX = Math.random() * canvas.width;
        const shootingStarY = Math.random() * canvas.height * 0.5;
        
        ctx.beginPath();
        ctx.moveTo(shootingStarX, shootingStarY);
        ctx.lineTo(shootingStarX + 100, shootingStarY + 50);
        
        const shootingGradient = ctx.createLinearGradient(
          shootingStarX, shootingStarY,
          shootingStarX + 100, shootingStarY + 50
        );
        shootingGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        shootingGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = shootingGradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initStars();
    initNebulas();
    initGalaxies();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initStars();
      initNebulas();
      initGalaxies();
    });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default CosmicBackground;
