"use client";

type PoemData = {
  title: string;
  lines: string[];
  colors: string[];
  motif: string;
};

function hashSeed(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function rand(seed: number, i: number) {
  const x = Math.sin(seed + i * 999) * 10000;
  return x - Math.floor(x);
}

function Motif({ motif, color, seed, bgColor }: { motif: string; color: string; seed: number; bgColor: string }) {
  const shapes: React.ReactNode[] = [];
  const count = 7;

  if (motif === "flower") {
    for (let i = 0; i < count; i++) {
      const cx = 40 + rand(seed, i) * 520;
      const cy = 60 + rand(seed, i + 50) * 680;
      const r = 8 + rand(seed, i + 100) * 10;
      shapes.push(
        <g key={i} opacity={0.35}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx={cx + r * 1.1 * Math.cos((a * Math.PI) / 180)}
              cy={cy + r * 1.1 * Math.sin((a * Math.PI) / 180)}
              rx={r}
              ry={r * 0.6}
              fill={color}
              transform={`rotate(${a} ${cx} ${cy})`}
            />
          ))}
        </g>
      );
    }
  } else if (motif === "wave") {
    for (let i = 0; i < 5; i++) {
      const y = 100 + i * 130 + rand(seed, i) * 30;
      shapes.push(
        <path
          key={i}
          d={`M -20 ${y} Q 150 ${y - 40} 300 ${y} T 620 ${y}`}
          stroke={color}
          strokeWidth={3}
          fill="none"
          opacity={0.4}
        />
      );
    }
  } else if (motif === "mountain") {
    for (let i = 0; i < 4; i++) {
      const baseY = 780 - i * 60;
      const peakX = 100 + rand(seed, i) * 400;
      shapes.push(
        <polygon
          key={i}
          points={`${peakX - 180},${baseY} ${peakX},${baseY - 220 - i * 20} ${peakX + 180},${baseY}`}
          fill={color}
          opacity={0.25 + i * 0.1}
        />
      );
    }
  } else if (motif === "star") {
    for (let i = 0; i < count + 5; i++) {
      const cx = 30 + rand(seed, i) * 540;
      const cy = 40 + rand(seed, i + 30) * 720;
      const s = 3 + rand(seed, i + 60) * 6;
      shapes.push(<circle key={i} cx={cx} cy={cy} r={s} fill={color} opacity={0.5} />);
    }
  } else if (motif === "leaf") {
    for (let i = 0; i < count; i++) {
      const cx = 40 + rand(seed, i) * 520;
      const cy = 60 + rand(seed, i + 40) * 680;
      const rot = rand(seed, i + 80) * 360;
      shapes.push(
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={22}
          ry={10}
          fill={color}
          opacity={0.3}
          transform={`rotate(${rot} ${cx} ${cy})`}
        />
      );
    }
  } else if (motif === "moon") {
    shapes.push(
      <g key="moon" opacity={0.4}>
        <circle cx={480} cy={140} r={70} fill={color} />
        <circle cx={510} cy={120} r={70} fill={bgColor} />
      </g>
    );
    for (let i = 0; i < 15; i++) {
      const cx = 20 + rand(seed, i) * 560;
      const cy = 20 + rand(seed, i + 90) * 760;
      shapes.push(<circle key={`s${i}`} cx={cx} cy={cy} r={1.5} fill={color} opacity={0.5} />);
    }
  } else if (motif === "rain") {
    for (let i = 0; i < 25; i++) {
      const x = 10 + rand(seed, i) * 580;
      const y = rand(seed, i + 60) * 800;
      shapes.push(
        <line key={i} x1={x} y1={y} x2={x - 10} y2={y + 40} stroke={color} strokeWidth={2} opacity={0.35} />
      );
    }
  } else {
    for (let i = 0; i < 5; i++) {
      const cx = 60 + rand(seed, i) * 480;
      const cy = 100 + rand(seed, i + 20) * 600;
      shapes.push(
        <g key={i} opacity={0.3}>
          <ellipse cx={cx} cy={cy} rx={60} ry={28} fill={color} />
          <ellipse cx={cx + 40} cy={cy + 8} rx={40} ry={22} fill={color} />
          <ellipse cx={cx - 35} cy={cy + 5} rx={35} ry={20} fill={color} />
        </g>
      );
    }
  }

  return <>{shapes}</>;
}

export default function PoemCard({ data, id }: { data: PoemData; id?: string }) {
  const seed = hashSeed(data.title + data.lines.join(""));
  const [c1, c2, c3] = data.colors.length === 3 ? data.colors : ["#333", "#666", "#999"];

  return (
    <svg
      id={id}
      viewBox="0 0 600 800"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", borderRadius: 12, display: "block" }}
    >
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={600} height={800} fill={`url(#bg-${id})`} />
      <Motif motif={data.motif} color={c3} seed={seed} bgColor={c1} />
      <text
        x={300}
        y={340}
        textAnchor="middle"
        fontSize={30}
        fontWeight={700}
        fill="#fff"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        {data.title}
      </text>
      {data.lines.map((line, i) => (
        <text
          key={i}
          x={300}
          y={410 + i * 44}
          textAnchor="middle"
          fontSize={22}
          fill="#fff"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          {line}
        </text>
      ))}
      <text x={300} y={760} textAnchor="middle" fontSize={13} fill="#ffffffaa" style={{ fontFamily: "system-ui, sans-serif" }}>
        Mood Poem Card
      </text>
    </svg>
  );
}
