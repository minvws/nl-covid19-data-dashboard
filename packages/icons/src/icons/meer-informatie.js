import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const MeerInformatie = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 15 15"
        fill="currentColor"
        stroke="none"
        {...rest}
      >
        <path
          d="M8 0.999998C4.13401 0.999998 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 0.999998 8 0.999998ZM0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
        <path d="M8.80499 3.63687C8.80499 3.19237 8.44465 2.83203 8.00015 2.83203C7.55565 2.83203 7.19531 3.19237 7.19531 3.63687V3.67039C7.19531 4.11489 7.55565 4.47523 8.00015 4.47523C8.44465 4.47523 8.80499 4.11489 8.80499 3.67039V3.63687Z" />
        <path d="M8.80499 6.0275C8.80499 5.583 8.44465 5.22266 8.00015 5.22266C7.55565 5.22266 7.19531 5.583 7.19531 6.0275V11.8763C7.19531 12.3208 7.55565 12.6811 8.00015 12.6811C8.44465 12.6811 8.80499 12.3208 8.80499 11.8763V6.0275Z" />
      </svg>
    );
  }
);

MeerInformatie.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

MeerInformatie.displayName = 'MeerInformatie';

export default MeerInformatie;
