import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const HorecaEvenementen = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="currentColor"
        stroke={color}
        {...rest}
      >
        <path d="M18.0465 7.53093L21.5129 6.31769C21.6862 6.31769 21.6862 5.97105 21.5129 5.97105L18.0465 4.75781C17.8732 4.75781 17.6998 4.75781 17.6998 4.93113V7.35761C17.6998 7.53093 17.8732 7.70425 18.0465 7.53093Z" />
        <path d="M27.2324 20.5299L27.9257 20.3566C28.2724 20.1833 28.4457 19.8367 28.4457 19.49V17.2369C28.4457 16.8902 28.2724 16.5436 27.9257 16.5436C26.3658 15.677 20.9929 12.7305 18.0465 8.74417C17.8732 8.57085 17.5265 8.57085 17.3532 8.74417C14.4068 12.7305 9.03384 15.677 7.47396 16.5436C7.12732 16.7169 6.954 16.8902 6.954 17.2369V19.3167C6.954 19.6633 7.12732 20.01 7.47396 20.01C7.99392 20.3566 9.20716 20.7033 10.0738 19.6633C10.0738 19.6633 11.4603 21.7432 14.9267 20.01C14.9267 20.01 15.2734 20.01 14.9267 20.3566C14.4068 20.8766 12.1536 22.4365 9.90044 20.8766C9.90044 20.8766 9.20716 21.3965 7.99392 21.3965C7.12732 27.2894 6.0874 29.5426 6.0874 29.5426H13.3668C15.9666 29.5426 17.6998 22.6098 17.6998 22.6098C17.6998 22.6098 19.433 29.5426 22.0328 29.5426H29.3123C29.3123 29.5426 28.099 26.9428 27.2324 20.5299ZM14.7534 16.7169H9.72712C11.807 15.5037 14.9267 13.4238 17.3532 10.824C16.8332 12.0373 15.7933 15.3303 14.7534 16.7169ZM20.8196 16.7169C19.6064 15.3303 18.5664 12.0373 18.0465 10.824C20.473 13.4238 23.5927 15.677 25.6726 16.7169H20.8196Z" />
      </svg>
    );
  }
);

HorecaEvenementen.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

HorecaEvenementen.displayName = 'HorecaEvenementen';

export default HorecaEvenementen;
