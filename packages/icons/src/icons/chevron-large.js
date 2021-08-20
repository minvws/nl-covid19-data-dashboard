import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const ChevronLarge = forwardRef(
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
          d="M14.225 10.2441C14.525 9.91864 15.0114 9.91864 15.3114 10.2441L22 17.5L15.3114 24.7559C15.0114 25.0814 14.525 25.0814 14.225 24.7559C13.925 24.4305 13.925 23.9028 14.225 23.5774L19.8273 17.5L14.225 11.4226C13.925 11.0972 13.925 10.5695 14.225 10.2441Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    );
  }
);

ChevronLarge.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ChevronLarge.displayName = 'ChevronLarge';

export default ChevronLarge;
