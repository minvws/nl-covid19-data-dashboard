import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Unchecked = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 14 14"
        fill="currentColor"
        stroke="none"
        {...rest}
      >
        <rect x="0.5" y="0.5" width="13" height="13" stroke="#01689B" />
      </svg>
    );
  }
);

Unchecked.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Unchecked.displayName = 'Unchecked';

export default Unchecked;
