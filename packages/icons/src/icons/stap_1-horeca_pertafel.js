import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Stap1HorecaPertafel = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        stroke={color}
        {...rest}
      >
        <svg
          focusable="false"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M23.5476 7.34839C23.5476 8.69033 22.8895 9.52904 21.5734 9.52904C20.4217 9.52904 19.5992 8.69033 19.5992 7.34839C19.5992 6.00645 20.2572 5 21.5734 5C22.8895 5 23.5476 5.83871 23.5476 7.34839Z" />
          <path d="M17.0492 10.7871C17.1315 10.829 17.2137 10.871 17.296 10.871C15.5482 12.653 15.7953 16.6253 15.9625 19.3128L15.9798 19.5935C15.9798 20.0968 16.3089 20.6 16.6379 21.1032V29.3226C15.3218 29.3226 14.6637 28.6516 14.6637 27.4774L14.3347 20.0968C14.3347 20.0968 14.3347 19.929 14.1702 19.929C14.0056 19.929 14.0056 20.0968 14.0056 20.0968L13.6766 27.4774C13.5121 28.6516 12.6895 29.3226 11.7024 29.3226V13.3871C11.7024 13.2194 11.5379 13.3871 11.5379 13.3871C11.2089 14.3935 11.2089 15.2323 11.2089 16.2387V20.2645C10.7153 20.2645 9.89274 19.929 9.5637 18.5871C9.39919 16.4065 9.23467 11.3742 11.7024 10.7032C13.1831 10.3677 15.4863 10.3677 16.8024 10.7032C16.8847 10.7032 16.9669 10.7452 17.0492 10.7871Z" />
          <path d="M24.3702 10.7032C22.725 10.2 20.7508 10.2 18.9411 10.7032C16.1811 11.5309 16.4653 16.4429 16.6314 19.3125L16.6379 19.4258C16.6379 20.7677 17.625 21.1032 18.1186 21.1032V17.5806C18.1186 16.071 18.1186 14.5613 18.4476 13.5548C18.4476 13.3871 18.6121 13.3871 18.6121 13.3871V31C19.7637 31 20.7508 30.329 20.9153 28.9871L21.2444 20.9355C21.2444 20.7677 21.4089 20.7677 21.4089 20.7677C21.5734 20.7677 21.5734 20.9355 21.5734 20.9355C21.5734 21.1032 21.9024 28.9871 21.9024 28.9871C22.0669 30.329 23.054 31 24.2057 31V13.5548C24.2057 13.5548 24.3702 13.5548 24.3702 13.7226C24.6992 14.5613 24.6992 16.071 24.6992 17.7484V21.271C25.3573 21.271 26.1799 20.9355 26.1799 19.5935C26.6734 16.5742 27.0024 11.5419 24.3702 10.7032Z" />
          <path d="M16.1444 7.51613C16.1444 8.69033 15.4863 9.52904 14.3347 9.52904C13.1831 9.52904 12.525 8.85807 12.525 7.51613C12.525 6.34194 13.1831 5.50323 14.3347 5.50323C15.4863 5.50323 16.1444 6.17419 16.1444 7.51613Z" />
        </svg>
      </svg>
    );
  }
);

Stap1HorecaPertafel.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Stap1HorecaPertafel.displayName = 'Stap1HorecaPertafel';

export default Stap1HorecaPertafel;
