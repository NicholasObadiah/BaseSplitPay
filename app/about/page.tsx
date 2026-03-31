import { BottomNav } from "@/components/BottomNav";
import { RuleList } from "@/components/RuleList";
import { SplitHeader } from "@/components/SplitHeader";
import { StatusChip } from "@/components/StatusChip";

const rules = [
  "One sender submits one total payment.",
  "Current contract splits one payment evenly across all recipients.",
  "Current version uses equal shares only.",
  "Current version does not expose custom allocation or remainder handling.",
  "Custom shares and remainder handling can be added in a future upgrade."
];

export default function AboutPage() {
  return (
    <main className="app-shell">
      <div className="content-wrap">
        <SplitHeader
          title="About BaseSplitPay"
          subtitle="Transparent scope of current on-chain behavior."
          rightSlot={<StatusChip tone="neutral" text="Rules" />}
        />
        <RuleList rules={rules} />
      </div>
      <BottomNav />
    </main>
  );
}
