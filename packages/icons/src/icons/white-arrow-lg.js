import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const WhiteArrowLg = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      viewBox="0 0 13 22"
      fill="none"
      {...rest}
    >
      <path
        d="M1 1l10 10L1 21"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
});

WhiteArrowLg.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

WhiteArrowLg.displayName = 'WhiteArrowLg';

export default WhiteArrowLg;
