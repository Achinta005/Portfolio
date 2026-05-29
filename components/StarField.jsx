"use client";
import { useEffect, useRef } from "react";

export default function StarField() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w, h;
    const mobile = window.innerWidth <= 768;

    // ── Static layer (nebula + all stars baked once) ──────────────────────
    const staticLayer = document.createElement("canvas");
    const sCtx = staticLayer.getContext("2d");

    // ── Star data (only shooting stars need per-frame updates) ────────────
    let twinkleStars; // small subset that twinkles

    function buildStaticLayer() {
      staticLayer.width = w;
      staticLayer.height = h;

      // Nebula blobs
      const blobs = [
        { x: w * 0.72, y: h * 0.28, r: w * 0.38, color: "rgba(80,30,120,0.13)" },
        { x: w * 0.22, y: h * 0.65, r: w * 0.30, color: "rgba(20,60,120,0.10)" },
        { x: w * 0.55, y: h * 0.75, r: w * 0.22, color: "rgba(0,80,100,0.07)" },
      ];
      blobs.forEach(({ x, y, r, color }) => {
        const g = sCtx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        sCtx.fillStyle = g;
        sCtx.fillRect(0, 0, w, h);
      });

      // Layer 0 — distant, tiny (reduced on mobile)
      const L0_COUNT = mobile ? 600 : 1400;
      for (let i = 0; i < L0_COUNT; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = Math.random() * 0.55 + 0.15;
        const o = Math.random() * 0.4 + 0.08;
        sCtx.beginPath();
        sCtx.arc(x, y, r, 0, Math.PI * 2);
        sCtx.fillStyle = `rgba(255,255,255,${o.toFixed(2)})`;
        sCtx.fill();
      }

      // Layer 1 — mid-field (reduced on mobile)
      const tints = ["200,220,255", "255,220,200", "200,255,230", "255,255,255"];
      const L1_COUNT = mobile ? 200 : 500;
      for (let i = 0; i < L1_COUNT; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = Math.random() * 0.8 + 0.4;
        const o = Math.random() * 0.5 + 0.2;
        const color = tints[Math.floor(Math.random() * tints.length)];
        sCtx.beginPath();
        sCtx.arc(x, y, r, 0, Math.PI * 2);
        sCtx.fillStyle = `rgba(${color},${o.toFixed(2)})`;
        sCtx.fill();
      }

      // Layer 2 — hero stars (reduced on mobile)
      twinkleStars = [];
      const L2_COUNT = mobile ? 20 : 60;
      for (let i = 0; i < L2_COUNT; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = Math.random() * 1.1 + 0.9;
        const baseO = Math.random() * 0.4 + 0.55;
        const color = i % 4 === 0 ? "180,210,255" : i % 4 === 1 ? "255,230,190" : "255,255,255";

        // Bake the glow onto static layer
        const g = sCtx.createRadialGradient(x, y, 0, x, y, r * 5);
        g.addColorStop(0, `rgba(${color},${(baseO * 0.6).toFixed(2)})`);
        g.addColorStop(1, `rgba(${color},0)`);
        sCtx.fillStyle = g;
        sCtx.fillRect(x - r * 5, y - r * 5, r * 10, r * 10);

        // Bake cross flare
        sCtx.strokeStyle = `rgba(${color},${(baseO * 0.35).toFixed(2)})`;
        sCtx.lineWidth = 0.4;
        sCtx.beginPath();
        sCtx.moveTo(x - r * 4, y); sCtx.lineTo(x + r * 4, y);
        sCtx.moveTo(x, y - r * 4); sCtx.lineTo(x, y + r * 4);
        sCtx.stroke();

        // Core dot
        sCtx.beginPath();
        sCtx.arc(x, y, r, 0, Math.PI * 2);
        sCtx.fillStyle = `rgba(${color},${baseO.toFixed(2)})`;
        sCtx.fill();

        // Save for twinkle animation (just 60 stars, very lightweight)
        twinkleStars.push({
          x, y, r, o: baseO,
          do: (Math.random() - 0.5) * 0.008,
          color,
        });
      }
    }

    // ── Shooting stars ─────────────────────────────────────────────────────
    function makeShooting() {
      return {
        active: false,
        x: 0, y: 0,
        vx: 0, vy: 0,
        len: 0,
        life: 0, maxLife: 0,
        timer: Math.random() * 280 + 120,
      };
    }

    let shooters;

    function init() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      buildStaticLayer();
      shooters = mobile ? [makeShooting()] : [makeShooting(), makeShooting()];
    }

    // ── Draw (only dynamic elements) ─────────────────────────────────────
    let frame;
    function draw() {
      // Blit the pre-rendered static layer (nebula + all stars)
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(staticLayer, 0, 0);

      // Twinkle overlay — only 60 hero stars, just redraw their cores
      for (let i = 0; i < twinkleStars.length; i++) {
        const s = twinkleStars[i];
        s.o += s.do;
        if (s.o > 0.95 || s.o < 0.25) s.do *= -1;

        ctx.globalAlpha = s.o;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${s.color})`;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Shooting stars
      for (let j = 0; j < shooters.length; j++) {
        const sh = shooters[j];
        if (!sh.active) {
          sh.timer--;
          if (sh.timer <= 0) {
            sh.active = true;
            sh.x = Math.random() * w * 0.7;
            sh.y = Math.random() * h * 0.4;
            const angle = (Math.random() * 20 + 20) * Math.PI / 180;
            const speed = Math.random() * 9 + 7;
            sh.vx = Math.cos(angle) * speed;
            sh.vy = Math.sin(angle) * speed;
            sh.maxLife = Math.random() * 35 + 25;
            sh.life = sh.maxLife;
            sh.len = Math.random() * 90 + 60;
          }
          continue;
        }

        const progress = 1 - sh.life / sh.maxLife;
        const alpha = Math.sin(progress * Math.PI) * 0.85;
        const tailX = sh.x - sh.vx * (sh.len / 12);
        const tailY = sh.y - sh.vy * (sh.len / 12);

        const grad = ctx.createLinearGradient(tailX, tailY, sh.x, sh.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(1, `rgba(255,255,255,${alpha.toFixed(2)})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(sh.x, sh.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life--;

        if (sh.life <= 0) {
          sh.active = false;
          sh.timer = Math.random() * 300 + 150;
        }
      }

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