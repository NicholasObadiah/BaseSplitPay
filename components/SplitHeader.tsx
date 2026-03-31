import type { ReactNode } from "react";

type SplitHeaderProps = {
  title: string;
  subtitle: string;
  rightSlot?: ReactNode;
};

export function SplitHeader({ title, subtitle, rightSlot }: SplitHeaderProps) {
  return (
    <header className="split-header">
      <div>
        <p className="brand-pill">BaseSplitPay</p>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
      </div>
      {rightSlot ? <div>{rightSlot}</div> : null}
    </header>
  );
}
