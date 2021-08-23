import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const CrossSmall = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      width={23}
      height={23}
      viewBox="0 0 23 23"
      fill="none"
      {...rest}
    >
      <path
        d="M15.1826 6.96094L6.64941 15.4934"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M6.64941 6.96094L15.1819 15.4941"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
});

CrossSmall.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

CrossSmall.displayName = 'CrossSmall';

export default CrossSmall;
