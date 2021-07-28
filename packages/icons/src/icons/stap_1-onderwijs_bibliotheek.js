import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Stap1OnderwijsBibliotheek = forwardRef(
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
          <path d="M28.8875 9.07H27.2279V7.41038C27.2279 6.91249 26.896 6.58057 26.3981 6.58057C20.5894 6.58057 18.9298 6.58057 13.1211 6.58057C10.9636 6.58057 8.80611 7.41038 8.80611 9.56788V13.219C7.47842 13.551 6.31668 14.3808 6.31668 16.0404V26.662C6.31668 27.8237 7.31245 28.8195 8.47419 28.8195H17.934C18.4319 28.8195 18.7638 28.4876 18.7638 27.9897V16.8702C18.7638 16.3723 18.4319 16.0404 17.934 16.0404C14.6148 16.0404 14.7807 16.0404 14.1169 16.0404H10.6317C10.1338 16.0404 9.46996 16.0404 8.80611 16.0404C8.64015 16.0404 8.47419 15.8744 8.47419 15.5425C8.80611 14.8787 10.1338 14.7127 10.6317 14.7127C20.4235 14.7127 10.7977 14.7127 20.4235 14.7127V27.1599H22.9129C23.4108 27.1599 23.7427 26.8279 23.7427 26.3301V10.3977C23.7427 9.89981 23.4108 9.56788 22.9129 9.56788C16.9383 9.56788 13.9509 9.56788 11.2955 9.56788C11.1296 9.56788 10.9636 9.40192 10.9636 9.07C11.2955 8.40615 12.6232 8.24019 13.1211 8.24019C18.7638 8.24019 19.7596 8.24019 25.5683 8.24019V24.5045H26.3981C26.896 24.5045 27.2279 24.1725 27.2279 23.6747V10.3977H28.5556V22.8448H29.0535C29.5514 22.8448 29.8833 22.5129 29.8833 22.015V10.0658C29.8833 9.56788 29.3854 9.07 28.8875 9.07Z" />
        </svg>
      </svg>
    );
  }
);

Stap1OnderwijsBibliotheek.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Stap1OnderwijsBibliotheek.displayName = 'Stap1OnderwijsBibliotheek';

export default Stap1OnderwijsBibliotheek;
