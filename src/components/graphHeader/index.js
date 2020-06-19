import React from 'react';
import styles from './graphHeader.module.scss';

const GraphHeader = ({ Icon, title, headingRef }) => {
  return (
    <div className={styles.graphHeader}>
      {Icon && (
        <div className={styles.graphHeaderIcon}>
          <Icon />
        </div>
      )}
      {/*
      An optional ref and the tabIndex makes it focussable via JS,
      this is used on the region page to focus the first graph header
      after the region is changed.
      */}
      <h3 ref={headingRef} tabIndex={headingRef ? -1 : undefined}>{title}</h3>
    </div>
  );
};

export default GraphHeader;
