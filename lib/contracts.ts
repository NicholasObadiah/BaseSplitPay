import { Attribution } from "ox/erc8021";
import type { Address } from "viem";
import { baseSplitPayAbi } from "@/lib/abi/baseSplitPayAbi";

export const BASESPLITPAY_CONTRACT_ADDRESS_PLACEHOLDER = "BASESPLITPAY_CONTRACT_ADDRESS_PLACEHOLDER";
export const BUILDER_CODE_PLACEHOLDER = "BUILDER_CODE_PLACEHOLDER";

export const baseSplitPayContract = {
  address: "0x2265ffade3670ea62D9A30784C167c4485F53740" as Address,
  abi: baseSplitPayAbi
} as const;

// 这里替换为真实 Builder Code
export const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [BUILDER_CODE_PLACEHOLDER]
});
