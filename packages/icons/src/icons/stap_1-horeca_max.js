import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Stap1HorecaMax = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      focusable="false"
      width={36}
      height={36}
      viewBox="0 0 36 36"
      fill="currentColor"
      {...rest}
    >
      <path d="M23.3163 9.06828C24.685 9.06828 25.5404 8.0418 25.5404 6.67315C25.5404 5.13342 24.685 4.27802 23.3163 4.27802C21.9477 4.27802 21.2634 5.3045 21.2634 6.67315C21.2634 8.21288 21.9477 9.06828 23.3163 9.06828Z" />
      <path d="M25.8826 10.2658C24.3428 9.92369 22.2899 9.92369 20.9212 10.2658C18.0128 10.9502 18.1839 15.5694 18.1839 19.5042C18.355 20.8729 19.2104 21.215 19.8947 21.215V17.6223C19.8947 15.9115 20.2369 14.2007 20.408 13.5164C20.408 13.3453 20.579 13.3453 20.579 13.3453V31.822C20.579 31.822 22.632 31.822 22.8031 29.598C22.8031 29.598 23.1453 21.0439 23.1453 20.8729C23.1453 20.7018 23.1453 20.7018 23.3163 20.7018C23.4874 20.7018 23.4874 20.8729 23.4874 20.8729L23.8296 29.4269C24.0007 31.822 26.0536 31.822 26.0536 31.822V13.3453C26.0536 13.3453 26.2247 13.3453 26.2247 13.5164C26.5669 14.0296 26.909 15.9115 26.909 17.4512V21.0439C27.5934 21.0439 28.4488 20.7018 28.6199 19.3331C28.6199 15.5694 28.7909 10.9502 25.8826 10.2658Z" />
      <path d="M9.62987 16.5958H7.23474V17.7934C7.40582 17.7934 7.5769 17.7934 7.91906 17.7934C9.11663 17.7934 9.80095 18.4777 9.80095 19.5042C9.80095 20.7018 8.77447 21.5572 7.06366 21.5572H6.37933V20.8729H7.06366C8.09014 20.8729 8.77447 20.3596 8.77447 19.6753C8.77447 19.1621 8.26122 18.6488 7.40582 18.6488C7.06366 18.6488 6.7215 18.6488 6.37933 18.6488V15.7404H9.45879V16.5958" />
      <path d="M10.4853 17.9645C10.4853 16.5958 11.5118 15.5694 12.5382 15.5694C13.7358 15.5694 14.5912 16.2537 14.5912 17.7934C14.5912 19.1621 13.5647 20.1885 12.5382 20.1885C11.3407 20.1885 10.4853 19.5042 10.4853 17.9645ZM12.5382 19.3331C13.0515 19.3331 13.5647 18.8199 13.5647 17.7934C13.5647 16.938 13.2226 16.4248 12.5382 16.4248C11.8539 16.5958 11.5118 17.1091 11.5118 17.9645C11.5118 18.991 11.8539 19.3331 12.5382 19.3331Z" />
    </svg>
  );
});

Stap1HorecaMax.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

Stap1HorecaMax.displayName = 'Stap1HorecaMax';

export default Stap1HorecaMax;
