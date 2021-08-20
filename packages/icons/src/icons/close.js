import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Close = forwardRef(
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
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M20.1213 18L28.1213 10L26 7.87868L18 15.8787L10 7.87868L7.87868 10L15.8787 18L7.87868 26L10 28.1213L18 20.1213L26 28.1213L28.1213 26L20.1213 18Z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

Close.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Close.displayName = 'Close';

export default Close;
