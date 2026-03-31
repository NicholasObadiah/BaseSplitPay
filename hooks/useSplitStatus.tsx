"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { formatEther, isAddress, parseEther } from "viem";

type SplitEventSummary = {
  sender: `0x${string}`;
  totalEth: string;
  count: string;
};

export type SplitRecord = {
  receivers: string[];
  totalAmount: string;
  estimatedShare: string;
  txHash?: `0x${string}`;
  event?: SplitEventSummary;
  updatedAt: number;
};

type SplitStatusContextValue = {
  receivers: string[];
  totalAmount: string;
  recipientCount: number;
  estimatedShare: string;
  canSubmit: boolean;
  recentSplit: SplitRecord | null;
  setReceiverAt: (index: number, value: string) => void;
  addReceiver: () => void;
  removeReceiver: (index: number) => void;
  setTotalAmount: (value: string) => void;
  setRecentSplit: (next: Omit<SplitRecord, "updatedAt">) => void;
  resetRecentSplit: () => void;
};

const STORAGE_KEY = "basesplitpay-recent-split";

const SplitStatusContext = createContext<SplitStatusContextValue | null>(null);

function normalizeEth(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "0";
  try {
    return formatEther(parseEther(trimmed));
  } catch {
    return "0";
  }
}

function calculateShare(totalEth: string, count: number): string {
  const total = Number.parseFloat(totalEth);
  if (!Number.isFinite(total) || total <= 0 || count <= 0) {
    return "0";
  }
  return (total / count).toFixed(6);
}

function hasValidInputs(receivers: string[], totalAmount: string): boolean {
  const cleanReceivers = receivers.map((item) => item.trim()).filter(Boolean);
  if (cleanReceivers.length === 0) return false;
  if (!cleanReceivers.every((item) => isAddress(item))) return false;

  const amount = Number.parseFloat(totalAmount);
  return Number.isFinite(amount) && amount > 0;
}

export function SplitStatusProvider({ children }: { children: ReactNode }) {
  const [receivers, setReceivers] = useState<string[]>(["", ""]);
  const [totalAmount, setTotalAmountState] = useState<string>("");
  const [recentSplit, setRecentSplitState] = useState<SplitRecord | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as SplitRecord;
      if (parsed && Array.isArray(parsed.receivers)) {
        setRecentSplitState(parsed);
      }
    } catch {
      // Ignore bad cache payloads.
    }
  }, []);

  useEffect(() => {
    if (!recentSplit) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSplit));
  }, [recentSplit]);

  const setReceiverAt = useCallback((index: number, value: string) => {
    setReceivers((prev) => prev.map((item, i) => (i === index ? value : item)));
  }, []);

  const addReceiver = useCallback(() => {
    setReceivers((prev) => [...prev, ""]);
  }, []);

  const removeReceiver = useCallback((index: number) => {
    setReceivers((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const setTotalAmount = useCallback((value: string) => {
    setTotalAmountState(value);
  }, []);

  const setRecentSplit = useCallback((next: Omit<SplitRecord, "updatedAt">) => {
    setRecentSplitState({ ...next, updatedAt: Date.now() });
  }, []);

  const resetRecentSplit = useCallback(() => {
    setRecentSplitState(null);
  }, []);

  const recipientCount = useMemo(
    () => receivers.map((item) => item.trim()).filter(Boolean).length,
    [receivers]
  );

  const normalizedTotal = useMemo(() => normalizeEth(totalAmount), [totalAmount]);
  const estimatedShare = useMemo(
    () => calculateShare(normalizedTotal, recipientCount),
    [normalizedTotal, recipientCount]
  );

  const canSubmit = useMemo(
    () => hasValidInputs(receivers, totalAmount),
    [receivers, totalAmount]
  );

  const value = useMemo<SplitStatusContextValue>(
    () => ({
      receivers,
      totalAmount,
      recipientCount,
      estimatedShare,
      canSubmit,
      recentSplit,
      setReceiverAt,
      addReceiver,
      removeReceiver,
      setTotalAmount,
      setRecentSplit,
      resetRecentSplit
    }),
    [
      receivers,
      totalAmount,
      recipientCount,
      estimatedShare,
      canSubmit,
      recentSplit,
      setReceiverAt,
      addReceiver,
      removeReceiver,
      setTotalAmount,
      setRecentSplit,
      resetRecentSplit
    ]
  );

  return <SplitStatusContext.Provider value={value}>{children}</SplitStatusContext.Provider>;
}

export function useSplitStatus() {
  const context = useContext(SplitStatusContext);
  if (!context) {
    throw new Error("useSplitStatus must be used within SplitStatusProvider");
  }
  return context;
}
