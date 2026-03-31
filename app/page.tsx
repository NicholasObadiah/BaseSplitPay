"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatEther, isAddress, parseEther } from "viem";
import { useAccount } from "wagmi";
import { BottomNav } from "@/components/BottomNav";
import { SharePreviewPanel } from "@/components/SharePreviewPanel";
import { SplitFormPanel } from "@/components/SplitFormPanel";
import { SplitHeader } from "@/components/SplitHeader";
import { StatusChip } from "@/components/StatusChip";
import { WalletButton } from "@/components/WalletButton";
import { useSplitStatus } from "@/hooks/useSplitStatus";
import { useTrackedSplit } from "@/hooks/useTrackedSplit";

function shortHash(hash?: string) {
  if (!hash) return "";
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export default function HomePage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { splitTracked, isPending } = useTrackedSplit();
  const {
    receivers,
    totalAmount,
    recipientCount,
    estimatedShare,
    canSubmit,
    setReceiverAt,
    addReceiver,
    removeReceiver,
    setTotalAmount,
    setRecentSplit
  } = useSplitStatus();

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const cleanReceivers = useMemo(
    () => receivers.map((item) => item.trim()).filter(Boolean),
    [receivers]
  );

  async function handleSplit() {
    setError("");
    setSuccess("");

    if (!isConnected) {
      setError("Connect wallet before submitting.");
      return;
    }

    if (cleanReceivers.length === 0) {
      setError("Add at least one recipient address.");
      return;
    }

    const invalid = cleanReceivers.find((item) => !isAddress(item));
    if (invalid) {
      setError(`Invalid address: ${invalid}`);
      return;
    }

    const amount = Number.parseFloat(totalAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Total amount must be greater than 0 ETH.");
      return;
    }

    try {
      const normalizedTotal = formatEther(parseEther(totalAmount.trim()));
      const result = await splitTracked({
        receivers: cleanReceivers,
        totalAmountEth: totalAmount
      });

      setRecentSplit({
        receivers: cleanReceivers,
        totalAmount: normalizedTotal,
        estimatedShare,
        txHash: result.txHash,
        event: result.event
      });

      setSuccess(`Payment split successfully: ${shortHash(result.txHash)}`);
      router.push("/review");
    } catch (splitError) {
      if (splitError instanceof Error) {
        setError(splitError.message);
      } else {
        setError("Split transaction failed.");
      }
    }
  }

  return (
    <main className="app-shell">
      <div className="content-wrap">
        <SplitHeader
          title="Split Payment"
          subtitle="Send one ETH payment and split evenly to multiple recipients on Base."
          rightSlot={<WalletButton />}
        />

        <SplitFormPanel title="Recipients">
          <div className="stack-gap">
            {receivers.map((receiver, index) => (
              <div key={`receiver-${index}`} className="receiver-row">
                <input
                  aria-label={`Recipient ${index + 1}`}
                  className="input"
                  placeholder="0x..."
                  value={receiver}
                  onChange={(event) => setReceiverAt(index, event.target.value)}
                />
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => removeReceiver(index)}
                  disabled={receivers.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="btn secondary" onClick={addReceiver}>
              Add Recipient
            </button>
          </div>
        </SplitFormPanel>

        <SplitFormPanel title="Total Amount (ETH)">
          <input
            aria-label="Total amount"
            className="input"
            placeholder="0.01"
            inputMode="decimal"
            value={totalAmount}
            onChange={(event) => setTotalAmount(event.target.value)}
          />
        </SplitFormPanel>

        <SharePreviewPanel
          totalAmount={totalAmount || "0"}
          recipientCount={recipientCount}
          estimatedShare={estimatedShare}
        />

        <section className="panel">
          <div className="status-row">
            <StatusChip tone={isConnected ? "success" : "warn"} text={isConnected ? "Wallet Connected" : "Wallet Not Connected"} />
            <StatusChip tone="neutral" text={`${cleanReceivers.length} valid entries`} />
          </div>
          <button
            type="button"
            className="btn primary full"
            onClick={handleSplit}
            disabled={!canSubmit || isPending || !isConnected}
          >
            {isPending ? "Submitting On-Chain..." : "Split Payment"}
          </button>
          {error ? <p className="feedback error">{error}</p> : null}
          {success ? <p className="feedback success">{success}</p> : null}
        </section>
      </div>
      <BottomNav />
    </main>
  );
}
