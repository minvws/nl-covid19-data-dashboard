import styles from '../chloropleth.module.scss';

export default function Tooltip(props: any) {
  const { tooltipStore, getTooltipContent } = props;

  const tooltip = tooltipStore((state: any) => state.tooltip);

  // console.log({ tooltip });

  // if (tooltip) {
  //   console.log(getTooltipContent(tooltip.data));
  // }

  return tooltip ? (
    <div
      style={{
        left: tooltip.left,
        top: tooltip.top,
      }}
      className={styles.defaultTooltip}
    >
      {getTooltipContent(tooltip.data)}
    </div>
  ) : null;
}
