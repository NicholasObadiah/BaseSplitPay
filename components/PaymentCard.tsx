import type { ReactNode } from "react";

type PaymentCardProps = {
  title: string;
  children: ReactNode;
};

export function PaymentCard({ title, children }: PaymentCardProps) {
  return (
    <section className="payment-card">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
