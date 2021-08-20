import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Dot = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 6 6"
        fill="currentColor"
        stroke="none"
        {...rest}
      >
        <circle cx="3" cy="3" r="3" />
      </svg>
    );
  }
);

Dot.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Dot.displayName = 'Dot';

export default Dot;
