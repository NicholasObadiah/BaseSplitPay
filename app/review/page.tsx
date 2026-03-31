"use client";

import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { PaymentCard } from "@/components/PaymentCard";
import { SplitHeader } from "@/components/SplitHeader";
import { StatusChip } from "@/components/StatusChip";
import { useSplitStatus } from "@/hooks/useSplitStatus";

function shortHash(hash?: string) {
  if (!hash) return "";
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export default function ReviewPage() {
  const { recentSplit } = useSplitStatus();

  return (
    <main className="app-shell">
      <div className="content-wrap">
        <SplitHeader
          title="Payment Review"
          subtitle="Latest split summary from this device session."
          rightSlot={<StatusChip tone="neutral" text="Review" />}
        />

        {!recentSplit ? (
          <PaymentCard title="No recent split yet">
            <p className="muted">Create a split from the home page to see a summary here.</p>
            <Link href="/" className="btn primary inline-link">
              Back To Split
            </Link>
          </PaymentCard>
        ) : (
          <PaymentCard title="Latest Split Summary">
            <div className="kv-grid">
              <div>
                <p className="label">Total Amount</p>
                <p className="value">{recentSplit.totalAmount} ETH</p>
              </div>
              <div>
                <p className="label">Recipient Count</p>
                <p className="value">{recentSplit.receivers.length}</p>
              </div>
              <div>
                <p className="label">Estimated Share</p>
                <p className="value">{recentSplit.estimatedShare} ETH</p>
              </div>
              <div>
                <p className="label">Latest Tx</p>
                {recentSplit.txHash ? (
                  <a
                    className="link"
                    href={`https://basescan.org/tx/${recentSplit.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {shortHash(recentSplit.txHash)}
                  </a>
                ) : (
                  <p className="value">-</p>
                )}
              </div>
            </div>

            {recentSplit.event ? (
              <div className="event-box">
                <p>Sender: {recentSplit.event.sender}</p>
                <p>Total sent: {recentSplit.event.totalEth} ETH</p>
                <p>Recipient count: {recentSplit.event.count}</p>
              </div>
            ) : (
              <div className="event-box">
                <p>Payment split successfully.</p>
                <p>Funds were distributed evenly on-chain.</p>
              </div>
            )}

            <Link href="/" className="btn primary inline-link">
              Back To Split
            </Link>
          </PaymentCard>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
