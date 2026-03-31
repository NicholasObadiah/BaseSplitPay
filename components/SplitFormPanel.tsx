import type { ReactNode } from "react";

type SplitFormPanelProps = {
  title: string;
  children: ReactNode;
};

export function SplitFormPanel({ title, children }: SplitFormPanelProps) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="panel-body">{children}</div>
    </section>
  );
}
