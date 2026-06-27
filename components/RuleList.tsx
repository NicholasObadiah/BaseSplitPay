type RuleListProps = {
  rules: string[];
};

export function RuleList({ rules }: RuleListProps) {
  return (
    <section className="panel">
      <h2>Rules</h2>
      <ul className="rule-list">
        {rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </section>
  );
}
