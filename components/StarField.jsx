"use client";
import { useEffect, useRef } from "react";

export default function StarField() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w, h;

    // ── Nebula layer (static, drawn once to offscreen canvas) ──────────────
    const nebula = document.createElement("canvas");
    const nCtx = nebula.getContext("2d");

    function buildNebula() {
      nebula.width  = w;
      nebula.height = h;
      // Two soft radial blobs — deep violet + cold blue
      const blobs = [
        { x: w * 0.72, y: h * 0.28, r: w * 0.38, color: "rgba(80,30,120,0.13)" },
        { x: w * 0.22, y: h * 0.65, r: w * 0.30, color: "rgba(20,60,120,0.10)" },
        { x: w * 0.55, y: h * 0.75, r: w * 0.22, color: "rgba(0,80,100,0.07)"  },
      ];
      blobs.forEach(({ x, y, r, color }) => {
        const g = nCtx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        nCtx.fillStyle = g;
        nCtx.fillRect(0, 0, w, h);
      });
    }

    // ── Star layers ────────────────────────────────────────────────────────
    // Three tiers: tiny/dim background, medium, bright with soft glow
    function makeStars() {
      const layers = [];

      // Layer 0 — distant, tiny, static-ish (1400 stars)
      for (let i = 0; i < 1400; i++) {
        layers.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 0.55 + 0.15,
          o: Math.random() * 0.4 + 0.08,
          do: (Math.random() - 0.5) * 0.003,   // twinkle delta
          color: "255,255,255",
          layer: 0,
        });
      }

      // Layer 1 — mid-field, slight color tint (500 stars)
      const tints = ["200,220,255", "255,220,200", "200,255,230", "255,255,255"];
      for (let i = 0; i < 500; i++) {
        layers.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 0.8 + 0.4,
          o: Math.random() * 0.5 + 0.2,
          do: (Math.random() - 0.5) * 0.006,
          color: tints[Math.floor(Math.random() * tints.length)],
          layer: 1,
        });
      }

      // Layer 2 — hero stars, few, bright, with glow (60 stars)
      for (let i = 0; i < 60; i++) {
        layers.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.1 + 0.9,
          o: Math.random() * 0.4 + 0.55,
          do: (Math.random() - 0.5) * 0.008,
          color: i % 4 === 0 ? "180,210,255" : i % 4 === 1 ? "255,230,190" : "255,255,255",
          glow: true,
          layer: 2,
        });
      }

      return layers;
    }

    // ── Shooting stars ─────────────────────────────────────────────────────
    function makeShooting() {
      return {
        active: false,
        x: 0, y: 0,
        vx: 0, vy: 0,
        len: 0,
        life: 0, maxLife: 0,
        timer: Math.random() * 280 + 120,   // frames until next shoot
      };
    }

    let stars, shooters;

    function init() {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
      buildNebula();
      stars    = makeStars();
      shooters = [makeShooting(), makeShooting()];
    }

    // ── Draw ───────────────────────────────────────────────────────────────
    let frame;
    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Nebula
      ctx.drawImage(nebula, 0, 0);

      // Stars
      stars.forEach(s => {
        s.o += s.do;
        if (s.o > 0.95 || s.o < 0.04) s.do *= -1;

        if (s.glow) {
          // Soft cross-diffraction spike for hero stars
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
          g.addColorStop(0,   `rgba(${s.color},${(s.o * 0.6).toFixed(2)})`);
          g.addColorStop(1,   `rgba(${s.color},0)`);
          ctx.fillStyle = g;
          ctx.fillRect(s.x - s.r * 5, s.y - s.r * 5, s.r * 10, s.r * 10);

          // Tiny cross flare
          ctx.strokeStyle = `rgba(${s.color},${(s.o * 0.35).toFixed(2)})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(s.x - s.r * 4, s.y); ctx.lineTo(s.x + s.r * 4, s.y);
          ctx.moveTo(s.x, s.y - s.r * 4); ctx.lineTo(s.x, s.y + s.r * 4);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${s.o.toFixed(2)})`;
        ctx.fill();
      });

      // Shooting stars
      shooters.forEach(sh => {
        if (!sh.active) {
          sh.timer--;
          if (sh.timer <= 0) {
            sh.active  = true;
            sh.x       = Math.random() * w * 0.7;
            sh.y       = Math.random() * h * 0.4;
            const angle = (Math.random() * 20 + 20) * Math.PI / 180;
            const speed = Math.random() * 9 + 7;
            sh.vx      = Math.cos(angle) * speed;
            sh.vy      = Math.sin(angle) * speed;
            sh.maxLife = Math.random() * 35 + 25;
            sh.life    = sh.maxLife;
            sh.len     = Math.random() * 90 + 60;
          }
          return;
        }

        const progress = 1 - sh.life / sh.maxLife;
        const alpha    = Math.sin(progress * Math.PI) * 0.85;
        const tailX    = sh.x - sh.vx * (sh.len / 12);
        const tailY    = sh.y - sh.vy * (sh.len / 12);

        const grad = ctx.createLinearGradient(tailX, tailY, sh.x, sh.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(1, `rgba(255,255,255,${alpha.toFixed(2)})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(sh.x, sh.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 1.2;
        ctx.stroke();

        sh.x    += sh.vx;
        sh.y    += sh.vy;
        sh.life--;

        if (sh.life <= 0) {
          sh.active = false;
          sh.timer  = Math.random() * 300 + 150;
        }
      });

      frame = requestAnimationFrame(draw);
    }

    init();
    draw();

    const onResize = () => { init(); };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        background: "linear-gradient(160deg,#020510 0%,#030a14 50%,#050410 100%)",
      }}
    />
  );
}