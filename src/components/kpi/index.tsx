import styles from './kpi.module.scss';
import siteText from '~/locale/index';
import React from 'react';

/**
 * This component holds a metric (passed in via children), with a title and
 * other common KPI layout elements
 */
interface KpiProps {
  title: string;
  description: string;
  sourcedFrom?: {
    title: string;
    url: string;
  };
  children: React.ReactNode;
  difference?: {
    old: number;
    new: number;
    delta: number;
    timeWindow: 'day' | 'week' | 'month';
  };
}

export function Kpi(props: KpiProps) {
  const { title, description, sourcedFrom, children } = props;

  return (
    <section className={styles.root}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.metric}>{children}</div>
      <p className={styles.description}>{description}</p>
      {sourcedFrom && (
        <footer className={styles.footer}>
          {siteText.common.metadata.source}:{' '}
          <a href={sourcedFrom.url}>{sourcedFrom.title}</a>
        </footer>
      )}
    </section>
  );
}
