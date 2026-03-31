"use client";

import { useMemo } from "react";
import { base } from "wagmi/chains";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";

function shortAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending: connecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: switching } = useSwitchChain();

  const wrongChain = useMemo(() => isConnected && chainId !== base.id, [isConnected, chainId]);

  if (!isConnected) {
    return (
      <button
        className="btn primary"
        type="button"
        onClick={() => connect({ connector: connectors[0] })}
        disabled={connecting || connectors.length === 0}
      >
        {connecting ? "Connecting..." : "Connect Wallet"}
      </button>
    );
  }

  if (wrongChain) {
    return (
      <button className="btn warn" type="button" onClick={() => switchChain({ chainId: base.id })} disabled={switching}>
        {switching ? "Switching..." : "Switch To Base"}
      </button>
    );
  }

  return (
    <button className="btn ghost" type="button" onClick={() => disconnect()}>
      {shortAddress(address)}
    </button>
  );
}
