import styles from "./TopItemsList.module.css";

type Item = {
  id: string;
  title: string;
  metric: string | number;
};

type TopItemsListProps = {
  title: string;
  items: Item[];
  metricLabel: string;
};

export function TopItemsList({ title, items, metricLabel }: TopItemsListProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.list}>
        {items.map((item, index) => (
          <div key={item.id} className={styles.item}>
            <span className={styles.index}>{index + 1}</span>
            <span className={styles.itemTitle}>{item.title}</span>
            <span className={styles.itemMetric}>
              {item.metric} <span className={styles.metricLabel}>{metricLabel}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
