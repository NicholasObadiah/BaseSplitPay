"use client";

import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { base } from "wagmi/chains";
import {
  BaseError,
  decodeEventLog,
  formatEther,
  isAddress,
  parseEther,
  type Address,
  type Hash
} from "viem";
import { baseSplitPayAbi } from "@/lib/abi/baseSplitPayAbi";
import { baseSplitPayContract, DATA_SUFFIX } from "@/lib/contracts";
import { trackTransaction } from "@/utils/track";

type SplitTrackedParams = {
  receivers: string[];
  totalAmountEth: string;
};

type SplitEventSummary = {
  sender: Address;
  totalEth: string;
  count: string;
};

type SplitTrackedResult = {
  txHash: Hash;
  event?: SplitEventSummary;
};

function toUserError(error: unknown): string {
  if (error instanceof BaseError) {
    return error.shortMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Transaction failed. Please try again.";
}

export function useTrackedSplit() {
  const { address } = useAccount();
  const publicClient = usePublicClient({ chainId: base.id });
  const { writeContractAsync, isPending } = useWriteContract();

  async function splitTracked({ receivers, totalAmountEth }: SplitTrackedParams): Promise<SplitTrackedResult> {
    const cleanReceivers = receivers.map((item) => item.trim()).filter(Boolean);

    if (cleanReceivers.length === 0) {
      throw new Error("Add at least one recipient address.");
    }

    const invalidAddress = cleanReceivers.find((item) => !isAddress(item));
    if (invalidAddress) {
      throw new Error(`Invalid address: ${invalidAddress}`);
    }

    const value = parseEther(totalAmountEth.trim());
    if (value <= 0n) {
      throw new Error("Total amount must be greater than 0.");
    }

    try {
      const txHash = await writeContractAsync({
        ...baseSplitPayContract,
        functionName: "split",
        args: [cleanReceivers as Address[]],
        value,
        dataSuffix: DATA_SUFFIX
      });

      void trackTransaction("app-009", "BaseSplitPay", address, txHash);

      let event: SplitEventSummary | undefined;
      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

        for (const log of receipt.logs) {
          if (log.address.toLowerCase() !== baseSplitPayContract.address.toLowerCase()) continue;
          try {
            const parsed = decodeEventLog({
              abi: baseSplitPayAbi,
              data: log.data,
              topics: log.topics
            });
            if (parsed.eventName === "Split") {
              event = {
                sender: parsed.args.sender,
                totalEth: formatEther(parsed.args.total),
                count: parsed.args.count.toString()
              };
              break;
            }
          } catch {
            // Ignore decode mismatch logs.
          }
        }
      }

      return { txHash, event };
    } catch (error) {
      throw new Error(toUserError(error));
    }
  }

  return {
    splitTracked,
    isPending
  };
}
