import type { ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  action?: string;
  onAction?: () => void;
}

export function SectionLabel({ children, action, onAction }: SectionLabelProps) {
  return (
    <div className="mj-sectionlabel">
      <span>{children}</span>
      {action && (
        <a
          className="mj-seeall"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onAction?.();
          }}
        >
          {action}
        </a>
      )}
    </div>
  );
}
