import css from '@styled-system/css';
import { EscalationLevelIcon } from '~/components-styled/escalation-level-icon';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import styles from '~/components/choropleth/tooltips/tooltip.module.scss';
import siteText from '~/locale';

const escalationThresholds =
  regionThresholds.escalation_levels.escalation_level;

export const EscalationMapLegenda = () => {
  return (
    <div className={styles.legenda} aria-label="legend">
      <h3 css={css({ maxWidth: '20em' })}>
        {siteText.escalatie_niveau.legenda.titel}
      </h3>
      {escalationThresholds.map((info) => (
        <div
          className={styles.escalationInfoLegenda}
          key={`legenda-item-${info?.threshold}`}
        >
          <div className={styles.bubbleLegenda}>
            <EscalationLevelIcon level={info.threshold} />
          </div>
          <div className={styles.escalationTextLegenda}>
            {siteText.escalatie_niveau.types[info.threshold].titel}
          </div>
        </div>
      ))}
    </div>
  );
};
