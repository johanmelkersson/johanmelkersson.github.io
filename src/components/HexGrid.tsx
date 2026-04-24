import { useEffect, useRef } from 'react';
import styles from './HexGrid.module.css';

interface Hex {
  x: number;
  y: number;
  phase: number;
}

const ACCENT: [number, number, number] = [56, 189, 248];
const SIZE = 32;
const W = Math.sqrt(3) * SIZE;
const H = 2 * SIZE;

function drawHex(ctx: CanvasRenderingContext2D, cx: number, cy: number, opacity: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const px = cx + SIZE * Math.cos(angle);
    const py = cy + SIZE * Math.sin(angle);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = `rgba(${ACCENT.join(',')}, ${opacity.toFixed(3)})`;
  ctx.lineWidth = 0.6;
  ctx.stroke();
}

function buildGrid(width: number, height: number): Hex[] {
  const cols = Math.ceil(width / W) + 2;
  const rows = Math.ceil(height / (H * 0.75)) + 2;
  const hexes: Hex[] = [];
  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      hexes.push({
        x: col * W + (row % 2 !== 0 ? W / 2 : 0),
        y: row * H * 0.75,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }
  return hexes;
}

function HexGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let hexes: Hex[] = [];

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
      hexes = buildGrid(canvas!.width, canvas!.height);
    }

    function render(time: number) {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const hex of hexes) {
        const pulse = 0.5 + 0.5 * Math.sin(time * 0.00045 + hex.phase);
        drawHex(ctx!, hex.x, hex.y, 0.025 + pulse * 0.055);
      }
      animId = requestAnimationFrame(render);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}

export default HexGrid;
