import styles from "./MetricCard.module.css";

type MetricCardProps = {
  label: string;
  value: string | number;
  subtext?: string;
  glow?: boolean;
};

export function MetricCard({ label, value, subtext, glow = true }: MetricCardProps) {
  return (
    <div className={styles.card}>
      {glow && <div className={styles.glow} />}
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {subtext && <span className={styles.subtext}>{subtext}</span>}
    </div>
  );
}
