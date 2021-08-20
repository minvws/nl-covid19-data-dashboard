import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const WhiteArrow = forwardRef(
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
          d="M11.042 1l-5 5-5-5"
          stroke="#FFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
);

WhiteArrow.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

WhiteArrow.displayName = 'WhiteArrow';

export default WhiteArrow;
