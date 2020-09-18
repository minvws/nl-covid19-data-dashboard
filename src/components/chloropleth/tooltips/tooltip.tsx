import styles from './tooltip.module.scss';

export default function Tooltip(props: any) {
  const { tooltipStore, getTooltipContent } = props;

  const tooltip = tooltipStore((state: any) => state.tooltip);

  return tooltip ? (
    <div
      className={styles.tooltip}
      style={{
        left: tooltip.left,
        top: tooltip.top,
      }}
    >
      {getTooltipContent(tooltip.data)}
    </div>
  ) : null;
}
