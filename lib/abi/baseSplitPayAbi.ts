export const baseSplitPayAbi = [
  {
    type: "function",
    name: "split",
    stateMutability: "payable",
    inputs: [{ name: "receivers", type: "address[]" }],
    outputs: []
  },
  {
    type: "event",
    name: "Split",
    inputs: [
      { indexed: true, name: "sender", type: "address" },
      { indexed: false, name: "total", type: "uint256" },
      { indexed: false, name: "count", type: "uint256" }
    ],
    anonymous: false
  }
] as const;
