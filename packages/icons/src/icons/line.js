import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Line = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 12 6"
        fill="currentColor"
        stroke="none"
        {...rest}
      >
        <path
          d="M0 0 l12 0"
          stroke="currentColor"
          fill="currentColor"
          stroke-width="6"
        />
      </svg>
    );
  }
);

Line.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Line.displayName = 'Line';

export default Line;
