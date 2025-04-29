"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Twitter } from "lucide-react";

/**
 * Hero component for the personal portfolio landing page.
 *
 * Renders an interactive hero section with:
 * - Animated typewriter effect for displaying professional roles
 * - Particle background animation
 * - Responsive layout with name, role, description, and social links
 * - Animated motion effects for page elements
 *
 * @component
 * @returns {JSX.Element} Fully rendered hero section with dynamic content
 */
export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // List of roles for typewriter effect
  const roles = [
    "Machine Learning Engineer",
    "Full Stack Developer",
    "Data Science Enthusiast",
  ];

  // Typewriter effect
  useEffect(() => {
    const currentRole = roles[currentRoleIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(currentRole.substring(0, displayedText.length + 1));
        setTypingSpeed(80);

        if (displayedText.length === currentRole.length) {
          // Pause at the end of typing
          setTypingSpeed(2000);
          setIsDeleting(true);
        }
      } else {
        setDisplayedText(currentRole.substring(0, displayedText.length - 1));
        setTypingSpeed(50);

        if (displayedText.length === 0) {
          setIsDeleting(false);
          setCurrentRoleIndex((currentRoleIndex + 1) % roles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, currentRoleIndex, isDeleting, typingSpeed, roles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }[] = [];

    const createParticles = () => {
      const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: `rgba(139, 92, 246, ${Math.random() * 0.5 + 0.2})`,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(139, 92, 246, ${
                0.1 * (1 - distance / 100)
              })`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        });
      });

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.length = 0;
      createParticles();
    };

    createParticles();
    animate();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 w-full">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full w-full">
          {/* Larger waist-up image with transparent background */}

          {/* Text content */}
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-2 glow-text">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600 animate-gradient">
                  Pubali Basak
                </span>
              </h1>
            </motion.div>

            <motion.div
              className="h-8 md:h-10 mb-6 text-xl md:text-2xl font-medium text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="inline-block after:content-['|'] after:ml-1 after:animate-blink">
                {displayedText}
              </span>
            </motion.div>

            <motion.p
              className="text-lg md:text-xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Passionate about problem-solving, I leverage my skills in
              TypeScript, React, and FastAPI to build innovative solutions, with
              a drive to continuously learn and grow in both tech and academia
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                View Projects
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                Contact Me
              </Button>
            </motion.div>

            <motion.div
              className="flex justify-center md:justify-start space-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Github size={24} />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Linkedin size={24} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Twitter size={24} />
                <span className="sr-only">Twitter</span>
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center md:justify-end h-full w-full"
          >
            {/* Image container */}
            <div className="relative h-full overflow-hidden">
              <img
                src="profile-pic.png"
                alt="Alex Johnson"
                className="w-auto h-screen object-cover ml-12"
              />

              {/* Purple glow under the image */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-64 h-1 bg-gradient-to-r from-purple-500/0 via-purple-500 to-purple-500/0 blur-xl opacity-70"></div>
              {/* Adding the blurred right edge */}
              <div className="absolute inset-0 right-0 w-1/3 bg-gradient-to-l from-transparent to-white blur-xl opacity-50"></div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          repeatDelay: 0.5,
        }}
      >
        <ArrowDown className="text-gray-400" />
      </motion.div>

      {/* Add this to global.css or a styled component for the blinking cursor effect */}
      <style jsx global>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </section>
  );
}
