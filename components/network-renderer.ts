export const networkSettings = {
  desktopPoints: 45,
  mobilePoints: 22,
  mobileBreakpoint: 768,
  maxConnections: 3,
  connectionDistance: 200,
  speed: 9,
  maxFps: 30,
  maxPixelRatio: 1.5,
  pointColor: "#94b9ff",
  accentColor: "#71d1e8",
  lineColor: "112, 163, 238",
} as const;

type Point = { x: number; y: number; vx: number; vy: number; radius: number; accent: boolean };
type BackgroundState = { supported: boolean; reducedMotion: boolean };

export type NetworkRenderer = {
  setPaused: (paused: boolean) => void;
  dispose: () => void;
};

/** Owns the canvas lifecycle; no React state updates on animation frames. */
export function createNetworkRenderer(
  canvas: HTMLCanvasElement,
  onState: (state: BackgroundState) => void,
): NetworkRenderer {
  let context: CanvasRenderingContext2D | null;
  try {
    context = canvas.getContext("2d");
  } catch {
    context = null;
  }
  if (!context) {
    onState({ supported: false, reducedMotion: true });
    return { setPaused() {}, dispose() {} };
  }

  const ctx = context;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const settings = networkSettings;
  let points: Point[] = [];
  let width = 1;
  let height = 1;
  let frame: number | null = null;
  let lastFrameTime: number | null = null;
  let lastDrawTime: number | null = null;
  let paused = false;
  let disposed = false;

  function makePoints(count: number) {
    // A repeatable layout avoids a different random composition on every mount.
    let seed = 1709;
    function random() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    }
    return Array.from({ length: count }, (_, index) => {
      const x = (0.02 + random() * 0.96) * width;
      const y = (0.02 + random() * 0.96) * height;
      const angle = random() * Math.PI * 2;
      const speed = settings.speed * (0.5 + random() * 0.5);
      return { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, radius: 1 + random() * 0.8, accent: index % 5 === 0 };
    });
  }

  function draw() {
    if (disposed || document.hidden) return;
    ctx.clearRect(0, 0, width, height);
    const candidates: { a: number; b: number; distance: number }[] = [];
    const distanceLimit = Math.min(settings.connectionDistance, width * 0.45);
    for (let a = 0; a < points.length; a++) {
      for (let b = a + 1; b < points.length; b++) {
        const distance = Math.hypot(points[a].x - points[b].x, points[a].y - points[b].y);
        if (distance < distanceLimit) candidates.push({ a, b, distance });
      }
    }
    candidates.sort((a, b) => a.distance - b.distance);
    const connections = new Uint8Array(points.length);
    ctx.lineWidth = 0.7;
    for (const { a, b, distance } of candidates) {
      if (connections[a] >= settings.maxConnections || connections[b] >= settings.maxConnections) continue;
      connections[a]++;
      connections[b]++;
      ctx.strokeStyle = `rgba(${settings.lineColor}, ${(1 - distance / distanceLimit) * 0.3})`;
      ctx.beginPath();
      ctx.moveTo(points[a].x, points[a].y);
      ctx.lineTo(points[b].x, points[b].y);
      ctx.stroke();
    }
    for (const point of points) {
      ctx.globalAlpha = point.accent ? 0.65 : 0.45;
      ctx.fillStyle = point.accent ? settings.accentColor : settings.pointColor;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 7;
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  function shouldAnimate() {
    return !disposed && !paused && !motion.matches && !document.hidden;
  }

  function stop() {
    if (frame !== null) window.cancelAnimationFrame(frame);
    frame = null;
    lastFrameTime = null;
    lastDrawTime = null;
  }

  function animate(timestamp: number) {
    frame = null;
    if (!shouldAnimate()) return;
    if (lastFrameTime === null || lastDrawTime === null) {
      lastFrameTime = timestamp;
      lastDrawTime = timestamp;
    }
    const interval = 1000 / settings.maxFps;
    const elapsed = timestamp - lastFrameTime;
    if (elapsed >= interval) {
      // Clamp long frames so returning from a stall never jumps across the screen.
      const seconds = Math.min(timestamp - lastDrawTime, 100) / 1000;
      lastDrawTime = timestamp;
      lastFrameTime = timestamp - (elapsed % interval);
      for (const point of points) {
        point.x += point.vx * seconds;
        point.y += point.vy * seconds;
        if (point.x < 0 || point.x > width) { point.vx *= -1; point.x = Math.max(0, Math.min(width, point.x)); }
        if (point.y < 0 || point.y > height) { point.vy *= -1; point.y = Math.max(0, Math.min(height, point.y)); }
      }
      draw();
    }
    frame = window.requestAnimationFrame(animate);
  }

  function syncAnimation() {
    stop();
    draw();
    if (shouldAnimate()) frame = window.requestAnimationFrame(animate);
  }

  function resize() {
    if (disposed) return;
    const previousWidth = width;
    const previousHeight = height;
    width = Math.max(1, canvas.clientWidth || window.innerWidth);
    height = Math.max(1, canvas.clientHeight || window.innerHeight);
    const ratio = Math.min(window.devicePixelRatio || 1, settings.maxPixelRatio);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = width < settings.mobileBreakpoint ? settings.mobilePoints : settings.desktopPoints;
    if (points.length !== count) points = makePoints(count);
    else for (const point of points) { point.x *= width / previousWidth; point.y *= height / previousHeight; }
    draw();
  }

  function handleMotionChange() {
    onState({ supported: true, reducedMotion: motion.matches });
    syncAnimation();
  }

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", syncAnimation);
  motion.addEventListener("change", handleMotionChange);
  resize();
  handleMotionChange();

  return {
    setPaused(value) { paused = value; syncAnimation(); },
    dispose() {
      disposed = true;
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", syncAnimation);
      motion.removeEventListener("change", handleMotionChange);
    },
  };
}
