import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Gelijk = forwardRef(
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
        <circle cx="12" cy="12" r="6" fill="currentColor" />
      </svg>
    );
  }
);

Gelijk.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Gelijk.displayName = 'Gelijk';

export default Gelijk;
