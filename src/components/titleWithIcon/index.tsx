import React from 'react';

import styles from './titleWithIcon.module.scss';

interface IProps {
  Icon?: React.ComponentType;
  title: string;
  regio?: string;
  headingRef?: React.RefObject<HTMLHeadingElement>;
  as?: 'h2' | 'h3';
}

export function TitleWithIcon(props: IProps) {
  const { Icon, title, regio, headingRef, as = 'h3' } = props;

  return (
    <div className={styles.titleWithIcon}>
      {Icon && (
        <div
          className={`${styles.titleWithIconIcon} ${
            as === 'h2' ? styles['icon-large'] : styles['icon-small']
          }`}
        >
          <Icon />
        </div>
      )}
      {/*
      An optional ref and the tabIndex makes it focussable via JS,
      this is used on the region page to focus the first graph header
      after the region is changed.
      */}
      {as === 'h3' && (
        <h3 ref={headingRef} tabIndex={headingRef ? -1 : undefined}>
          {title}
          {regio && ` in ${regio}`}
        </h3>
      )}

      {as === 'h2' && (
        <h2 ref={headingRef} tabIndex={headingRef ? -1 : undefined}>
          {title}
          {regio && ` in ${regio}`}
        </h2>
      )}
    </div>
  );
}
