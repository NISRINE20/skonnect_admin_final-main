import React, { useRef, useEffect } from "react"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

export default function Model(props) {
  const group = useRef()
  const { scene } = useGLTF("/laptop_dell_xps.glb")
  
  useEffect(() => {
    if (group.current) {
      console.log("Model loaded, dispatching event");
      // Dispatch event with the group reference when it's ready
      window.dispatchEvent(new CustomEvent('modelLoaded', { 
        detail: group.current 
      }));
    }
  }, []);

  useFrame(() => {
    if (group.current) {
      // Log only if position changes significantly
      const pos = group.current.position;
      const rot = group.current.rotation;
      if (Math.abs(pos.y) > 0.01 || Math.abs(rot.y) > 0.01) {
        console.log("Model moving:", { 
          position: [pos.x, pos.y, pos.z],
          rotation: [rot.x, rot.y, rot.z]
        });
      }
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}
