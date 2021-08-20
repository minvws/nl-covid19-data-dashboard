import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Locatie = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 14 22"
        fill="currentColor"
        stroke="none"
        {...rest}
      >
        <path
          d="M8.8 7C8.79974 7.23645 8.75291 7.47052 8.66218 7.68887C8.57145 7.90722 8.43861 8.10555 8.27123 8.27256C8.10385 8.43957 7.90522 8.57197 7.68667 8.66221C7.46813 8.75245 7.23394 8.79876 6.9975 8.7985C6.76105 8.79824 6.52698 8.75141 6.30863 8.66068C6.09028 8.56995 5.89194 8.43711 5.72494 8.26973C5.55793 8.10235 5.42553 7.90372 5.33529 7.68517C5.24505 7.46663 5.19874 7.23245 5.199 6.996C5.19953 6.51835 5.38979 6.06046 5.72791 5.72309C6.06604 5.38571 6.52435 5.19647 7.002 5.197C7.47965 5.19753 7.93754 5.38779 8.27491 5.72592C8.61229 6.06404 8.80153 6.52235 8.801 7H8.8Z"
          fill="black"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.53674e-07 7C9.53674e-07 3.1 3.102 0 7 0C10.898 0 14 3.1 14 7C14 8.3 13.5 9.5 13 10.7C12.691 11.47 10.656 15.518 9.055 18.703L7.8 21.2C7.6 21.501 7.3 21.7 6.999 21.7C6.601 21.7 6.299 21.501 6.199 21.2C4.699 18.2 1.397 11.7 0.999001 10.7C0.499001 9.501 -0.000999451 8.302 -0.000999451 7.001L9.53674e-07 7ZM2.8 7C2.8 9.3 4.7 11.2 7 11.2C9.3 11.2 11.2 9.3 11.2 7C11.1967 6.26679 11.0021 5.54713 10.6356 4.91211C10.2691 4.27708 9.74322 3.74864 9.11 3.379C8.47138 3.00014 7.74255 2.80014 7 2.8C4.7 2.8 2.8 4.698 2.8 6.999V7Z"
          fill="black"
        />
      </svg>
    );
  }
);

Locatie.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Locatie.displayName = 'Locatie';

export default Locatie;
