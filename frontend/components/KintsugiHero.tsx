"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Shard = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
};

export default function KintsugiHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const DPR = window.devicePixelRatio || 1;

    function resize() {
      canvas.width = window.innerWidth * DPR;
      canvas.height = window.innerHeight * DPR;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    // -----------------------------
    // SHARDS
    // -----------------------------
    const SHARD_COUNT = window.innerWidth < 768 ? 80 : 180;
    const shards: Shard[] = [];

    for (let i = 0; i < SHARD_COUNT; i++) {
      const x = window.innerWidth / 2 + gsap.utils.random(-40, 40);
      const y = window.innerHeight / 2 + gsap.utils.random(-60, 60);

      shards.push({
        x,
        y,
        ox: x,
        oy: y,
        vx: gsap.utils.random(-12, 12),
        vy: gsap.utils.random(-12, 12),
        size: gsap.utils.random(5, 14),
        angle: Math.random() * Math.PI,
      });
    }

    // -----------------------------
    // MOUSE MAGNET
    // -----------------------------
    const mouse = { x: -9999, y: -9999 };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", onMove);

    // -----------------------------
    // DRAW LOOP
    // -----------------------------
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shards.forEach((s) => {
        // movement
        s.x += s.vx * 0.08;
        s.y += s.vy * 0.08;

        // mouse magnet
        const dx = mouse.x - s.x;
        const dy = mouse.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 160) {
          s.x += dx * 0.015;
          s.y += dy * 0.015;
        }

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);
        ctx.fillStyle = "#8B4513";
        ctx.globalAlpha = 0.9;
        ctx.fillRect(-s.size / 2, -s.size / 2, s.size, s.size);
        ctx.restore();
      });

      requestAnimationFrame(draw);
    }

    draw();

    // -----------------------------
    // SCROLL PIN
    // -----------------------------
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=300%",
      pin: true,
      scrub: true,
    });

    // -----------------------------
    // EXPLODE
    // -----------------------------
    gsap.to(shards, {
      vx: () => gsap.utils.random(-20, 20),
      vy: () => gsap.utils.random(-20, 20),
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "25% top",
        scrub: true,
      },
    });

    // -----------------------------
    // REASSEMBLE
    // -----------------------------
    gsap.to(shards, {
      x: (i) => shards[i].ox,
      y: (i) => shards[i].oy,
      vx: 0,
      vy: 0,
      scrollTrigger: {
        trigger: section,
        start: "40% top",
        end: "80% top",
        scrub: true,
      },
    });

    // -----------------------------
    // GOLD CRACK DRAW
    // -----------------------------
    gsap.fromTo(
      "#kintsugi-crack",
      { strokeDasharray: 1200, strokeDashoffset: 1200 },
      {
        strokeDashoffset: 0,
        scrollTrigger: {
          trigger: section,
          start: "60% top",
          end: "100% top",
          scrub: true,
        },
      }
    );

    // -----------------------------
    // TEXT REVEAL
    // -----------------------------
    gsap.to("#kintsugi-text", {
      opacity: 1,
      y: -20,
      scrollTrigger: {
        trigger: section,
        start: "70% top",
        end: "100% top",
        scrub: true,
      },
    });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen bg-[#efe9dd] overflow-hidden"
    >
      {/* CANVAS */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[1]" />

      {/* GOLD CRACK SVG */}
      <svg
        className="absolute inset-0 w-full h-full z-[2] pointer-events-none"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <path
          id="kintsugi-crack"
          d="M500 80 
             L520 180 
             L470 260 
             L540 340 
             L500 420 
             L560 520 
             L480 620 
             L520 720 
             L500 900"
          fill="none"
          stroke="#d4af37"
          strokeWidth="4"
          strokeLinecap="round"
          style={{
            filter: "drop-shadow(0 0 6px #d4af37)",
          }}
        />
      </svg>

      {/* CENTER TEXT */}
      <div className="absolute inset-0 z-[3] flex items-center justify-center">
        <h1
          id="kintsugi-text"
          className="opacity-0 translate-y-10 text-center font-[var(--font-display)] text-4xl md:text-6xl text-[var(--basho-brown)]"
        >
          The Journey Begins
        </h1>
      </div>
    </section>
  );
}
