import { TAU, r2, usePhase } from "../loop";

type Props = {
  x: number;
  y: number;
  cols: number;
  rows: number;
  gap: number;
  color: string;
  opacity: number;
};

/** Small decorative dot matrix with a diagonal shimmer (2 sweeps per loop). */
export const DotGrid = ({ x, y, cols, rows, gap, color, opacity }: Props) => {
  const phase = usePhase();
  return (
    <g>
      {Array.from({ length: rows * cols }, (_, n) => {
        const i = n % cols;
        const j = Math.floor(n / cols);
        const wave = 0.5 + 0.5 * Math.sin(TAU * (2 * phase - (i + j) / 9));
        return (
          <circle
            key={n}
            cx={x + i * gap}
            cy={y + j * gap}
            r={0.75}
            fill={color}
            opacity={r2(opacity * (0.35 + 0.65 * wave))}
          />
        );
      })}
    </g>
  );
};
