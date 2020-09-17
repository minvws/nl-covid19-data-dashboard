import styles from './tooltip.module.scss';

export default function Tooltip(props: any) {
  const { tooltipStore, getTooltipContent } = props;

  const tooltip = tooltipStore((state: any) => state.tooltip);

  return tooltip ? (
    <div
      style={{
        left: tooltip.left,
        top: tooltip.top,
      }}
      className={styles.tooltip}
    >
      {getTooltipContent(tooltip.data)}
    </div>
  ) : null;
}
