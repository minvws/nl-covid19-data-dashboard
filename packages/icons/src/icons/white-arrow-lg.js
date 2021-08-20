import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const WhiteArrowLg = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="currentColor"
        stroke="none"
        {...rest}
      >
        <path
          d="M1 1l10 10L1 21"
          stroke="#fff"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    );
  }
);

WhiteArrowLg.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

WhiteArrowLg.displayName = 'WhiteArrowLg';

export default WhiteArrowLg;
