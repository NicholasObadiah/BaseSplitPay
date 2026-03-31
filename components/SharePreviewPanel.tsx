import { StatusChip } from "@/components/StatusChip";

type SharePreviewPanelProps = {
  totalAmount: string;
  recipientCount: number;
  estimatedShare: string;
};

export function SharePreviewPanel({
  totalAmount,
  recipientCount,
  estimatedShare
}: SharePreviewPanelProps) {
  return (
    <section className="panel preview-panel">
      <div className="preview-head">
        <h2>Share Preview</h2>
        <StatusChip tone="neutral" text={`${recipientCount} recipients`} />
      </div>
      <div className="kv-grid">
        <div>
          <p className="label">Total Amount</p>
          <p className="value">{totalAmount || "0"} ETH</p>
        </div>
        <div>
          <p className="label">Estimated Equal Share</p>
          <p className="value">{estimatedShare} ETH</p>
        </div>
      </div>
      <p className="hint">
        Current contract uses integer division on-chain. Remainder handling is not shown in this version.
      </p>
    </section>
  );
}
