"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}

export function GSAPReveal({ children, direction = "up", delay = 0 }: Props) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let initialX = 0;
    let initialY = 0;

    if (direction === "up") initialY = 50;
    if (direction === "down") initialY = -50;
    if (direction === "left") initialX = 50;
    if (direction === "right") initialX = -50;

    gsap.fromTo(
      element,
      {
        opacity: 0,
        x: initialX,
        y: initialY,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 1,
        delay: delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [direction, delay]);

  return <div ref={elementRef}>{children}</div>;
}
