type StatusChipTone = "neutral" | "success" | "warn";

type StatusChipProps = {
  tone?: StatusChipTone;
  text: string;
};

export function StatusChip({ tone = "neutral", text }: StatusChipProps) {
  return <span className={`status-chip ${tone}`}>{text}</span>;
}
