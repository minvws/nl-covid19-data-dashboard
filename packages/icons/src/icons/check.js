import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Check = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
        {...rest}
      >
        <path
          d="M21.249 5.77521L10.2011 20.2033L2.7511 12.6409L5.06981 10.3566L9.89271 15.2523L18.6647 3.79639L21.249 5.77521Z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    );
  }
);

Check.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Check.displayName = 'Check';

export default Check;
