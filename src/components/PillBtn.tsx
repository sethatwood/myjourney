import type { CSSProperties, ReactNode } from "react";

interface PillBtnProps {
  variant?: "white" | "blue";
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
}

/** Brand pill button (.oj-btn) with the sweep-fill hover, sized for the app. */
export function PillBtn({ variant, children, onClick, disabled, style }: PillBtnProps) {
  const cls = "oj-btn" + (variant ? " " + variant : "") + (disabled ? " mj-disabled" : "");
  return (
    <button
      className={cls}
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{ padding: "13px 28px", fontSize: 14.5, lineHeight: "14.5px", ...style }}
    >
      <span className="oj-btn-text">{children}</span>
    </button>
  );
}
