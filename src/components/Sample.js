import React, { useRef, useLayoutEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, SpotLight } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Model from "./Models";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const containerRef = useRef();

  useLayoutEffect(() => {
    console.log("Setting up scroll animations");
    
    if (!containerRef.current) {
      console.log("Container ref not found");
      return;
    }

    // Create a global variable to store the model group reference
    let modelGroup = null;

    // Function to update animations once we have the model reference
    const setupAnimations = (group) => {
      if (!group) return;
      
      modelGroup = group;
      console.log("Setting up animations for model:", group);

      let ctx = gsap.context(() => {
        // Initial position
        gsap.set(group.rotation, { y: Math.PI * 0.25 });
        gsap.set(group.position, { y: -1 });
        
        // Section 1: Overview
        gsap.to(group.rotation, {
          y: Math.PI * 2,
          scrollTrigger: {
            trigger: "#section1",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onEnter: () => {
              gsap.to("#overview-specs", {
                opacity: 1,
                y: 0,
                duration: 0.5
              });
            },
            onLeaveBack: () => {
              gsap.to("#overview-specs", {
                opacity: 0,
                y: 20,
                duration: 0.3
              });
            }
          },
        });

        // Section 2: Display features
        gsap.to(group.rotation, {
          y: Math.PI * 1.5,
          scrollTrigger: {
            trigger: "#section2",
            start: "top bottom",
            end: "center center",
            scrub: 1,
            onEnter: () => {
              gsap.to("#screen-specs", {
                opacity: 1,
                y: 0,
                duration: 0.5
              });
            },
            onLeaveBack: () => {
              gsap.to("#screen-specs", {
                opacity: 0,
                y: 20,
                duration: 0.3
              });
            }
          },
        });

        // Section 3: Keyboard features
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#section3",
            start: "top center",
            end: "bottom bottom",
            scrub: 1,
            onEnter: () => {
              gsap.to("#keyboard-specs", {
                opacity: 1,
                y: 0,
                duration: 0.5
              });
            },
            onLeaveBack: () => {
              gsap.to("#keyboard-specs", {
                opacity: 0,
                y: 20,
                duration: 0.3
              });
            }
          }
        });

        tl.to(group.rotation, {
          x: -Math.PI / 6,
          y: Math.PI * 1.75,
          duration: 1
        })
        .to(group.position, {
          y: -0.5,
          duration: 1
        }, "<");
      });

      return () => ctx.revert();
    };

    // Create a custom event to receive the model group reference
    window.addEventListener('modelLoaded', (e) => {
      console.log("Model loaded event received:", e.detail);
      setupAnimations(e.detail);
    });

    return () => {
      window.removeEventListener('modelLoaded', setupAnimations);
    };
  }, []);

  return (
    <div ref={containerRef}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#111",
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <SpotLight
          position={[0, 5, 2]}
          angle={0.3}
          penumbra={1}
          intensity={1.5}
        />

        <Model 
          scale={2}
          position={[0, -1, 0]}
        />

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>

      {/* Scrollable sections with specs */}
      <section id="section1" style={{ 
        height: "100vh", 
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div id="overview-specs" className="spec-item" style={{
          padding: '2rem',
          background: 'rgba(0,0,0,0.85)',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          opacity: 0,
          transform: 'translateY(20px)',
          transition: 'all 0.5s ease'
        }}>
          <h2 style={{ color: '#4a9eff', fontSize: '2rem', marginBottom: '1rem' }}>Dell XPS 15</h2>
          <p style={{ color: 'white', fontSize: '1.2rem', lineHeight: '1.6' }}>
            Experience premium computing with the Dell XPS 15
          </p>
        </div>
      </section>

      <section id="section2" style={{ 
        height: "100vh", 
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div id="screen-specs" className="spec-item" style={{
          padding: '2rem',
          background: 'rgba(0,0,0,0.85)',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          opacity: 0,
          transform: 'translateY(20px)',
          transition: 'all 0.5s ease'
        }}>
          <h2 style={{ color: '#4a9eff', fontSize: '2rem', marginBottom: '1rem' }}>InfinityEdge Display</h2>
          <ul style={{ color: 'white', listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '1rem' }}>15.6" FHD+ (1920 x 1200)</li>
            <li style={{ marginBottom: '1rem' }}>Anti-Glare Display</li>
            <li style={{ marginBottom: '1rem' }}>500-nit brightness</li>
            <li style={{ marginBottom: '1rem' }}>100% sRGB color</li>
          </ul>
        </div>
      </section>

      <section id="section3" style={{ 
        height: "100vh", 
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div id="keyboard-specs" className="spec-item" style={{
          padding: '2rem',
          background: 'rgba(0,0,0,0.85)',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          opacity: 0,
          transform: 'translateY(20px)',
          transition: 'all 0.5s ease'
        }}>
          <h2 style={{ color: '#4a9eff', fontSize: '2rem', marginBottom: '1rem' }}>Premium Keyboard</h2>
          <ul style={{ color: 'white', listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '1rem' }}>Backlit Keyboard</li>
            <li style={{ marginBottom: '1rem' }}>Large Precision Touchpad</li>
            <li style={{ marginBottom: '1rem' }}>Multi-gesture support</li>
            <li style={{ marginBottom: '1rem' }}>Palm rejection technology</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
