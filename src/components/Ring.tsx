/* Adherence ring: SVG donut with the percentage in the center. */
export function Ring({ pct = 92, size = 84 }: { pct?: number; size?: number }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "0 0 auto" }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--oj-blue-tint)" strokeWidth="9" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--oj-blue)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 19, fontWeight: 700, color: "var(--oj-navy)", lineHeight: 1 }}>{pct}%</span>
        <span style={{ fontSize: 9, color: "var(--oj-gray)", marginTop: 2 }}>on time</span>
      </div>
    </div>
  );
}
