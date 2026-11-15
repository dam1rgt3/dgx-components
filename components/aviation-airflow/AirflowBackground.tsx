import { useEffect, useRef } from 'react';

type Props = { paused: boolean; intensity: number; speed: number; theme: 'light' | 'dark' };

/** Decorative, local canvas animation. No network, WebGL, or external runtime. */
export function AirflowBackground({ paused, intensity, speed, theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext('2d');
    if (!canvas || !host || !context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let lastPaint = 0;
    let visible = true;
    let pointer = 0;
    let target = 0;
    let color = '#288eb5';
    const strength = Math.max(0, Math.min(1, intensity));
    const pace = Math.max(0, Math.min(3, speed));

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.strokeStyle = color;
      context.lineWidth = 0.8;
      for (let band = 0; band < 2; band++) {
        context.globalAlpha = strength * (band === 0 ? 0.26 : 0.12);
        for (let line = 0; line < 16; line++) {
          context.beginPath();
          for (let x = -20; x <= width + 20; x += 9) {
            const u = x / Math.max(width, 1);
            const base = band === 0 ? height * 0.93 : height * 0.18;
            const bend = Math.sin(u * Math.PI) * height * (band === 0 ? -0.16 : 0.08);
            const y = base + bend + line * 5
              + Math.sin(u * 7 - timeRef.current * 0.43 + line * 0.105) * 15
              + Math.cos(u * 3 + timeRef.current * 0.28) * 12
              + pointer * 18 * Math.sin(u * Math.PI);
            if (x === -20) context.moveTo(x, y);
            else context.lineTo(x, y);
          }
          context.stroke();
        }
      }
      context.globalAlpha = 1;
    };
    const canAnimate = () => !paused && !reducedMotion.matches && visible && !document.hidden && pace > 0;
    const animate = (now: number) => {
      if (!canAnimate()) { frame = 0; return; }
      if (!lastPaint || now - lastPaint >= 1000 / 30) {
        if (last) timeRef.current += Math.min((now - last) / 1000, 0.1) * pace;
        last = now;
        lastPaint = now;
        pointer += (target - pointer) * 0.08;
        draw();
      }
      frame = requestAnimationFrame(animate);
    };
    const update = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      lastPaint = 0;
      draw();
      if (canAnimate()) frame = requestAnimationFrame(animate);
    };
    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      color = getComputedStyle(host).getPropertyValue('--af-line-color').trim() || '#288eb5';
      draw();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !canAnimate()) return;
      const rect = host.getBoundingClientRect();
      target = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
    };
    const leave = () => { target = 0; };
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    resizeObserver.observe(host);
    intersectionObserver.observe(host);
    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', update);
    reducedMotion.addEventListener('change', update);
    resize();
    update();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', update);
      reducedMotion.removeEventListener('change', update);
    };
  }, [paused, intensity, speed, theme]);

  return <canvas className="af-ambient" ref={canvasRef} aria-hidden="true" />;
}
