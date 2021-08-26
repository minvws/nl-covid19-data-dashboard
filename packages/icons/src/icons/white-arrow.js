import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const WhiteArrow = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      viewBox="0 0 13 8"
      fill="none"
      {...rest}
    >
      <path
        d="M11.042 1l-5 5-5-5"
        stroke="#FFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
});

WhiteArrow.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

WhiteArrow.displayName = 'WhiteArrow';

export default WhiteArrow;
