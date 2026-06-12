/* Decorative vertical pill bars — the brand's hero motif, cropped to a card corner. */
export function CardPills() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        right: -10,
        top: -22,
        bottom: -22,
        width: 110,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 0, top: "-30%", width: 26, height: "85%", borderRadius: 99, background: "#1c4368", opacity: 0.18 }} />
      <div style={{ position: "absolute", left: 38, top: "25%", width: 26, height: "95%", borderRadius: 99, background: "#fff", opacity: 0.16 }} />
      <div style={{ position: "absolute", left: 76, top: "-45%", width: 26, height: "80%", borderRadius: 99, background: "#248dc9", opacity: 0.28 }} />
    </div>
  );
}
