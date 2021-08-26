import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Stap1HorecaVerplaatsen = forwardRef(({ ...rest }, ref) => {
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
      <path d="M11.227 10.2816C12.7395 10.0925 13.4958 8.769 13.3068 7.25641C12.9286 5.55475 11.7942 4.79845 10.2816 4.98753C8.76899 5.36568 8.0127 6.50012 8.20177 8.01271C8.57992 9.71437 9.52529 10.6597 11.227 10.2816Z" />
      <path d="M23.1386 17.6555C21.8151 16.1429 21.2479 16.1429 19.3571 16.7101C18.2227 17.2773 17.0882 17.6555 15.9538 18.2227C15.1975 15.5757 14.4412 13.3068 14.4412 13.3068C13.1177 9.71437 8.57991 11.0379 9.14713 14.2521C9.52528 16.521 10.4706 19.7353 11.0379 21.626C11.416 22.7605 12.7395 23.5168 14.4412 23.3277C15.7647 23.1386 19.9243 22.1932 19.9243 22.1932C19.9243 22.1932 21.0588 26.3529 21.8151 28.4327C22.5714 30.7016 24.273 30.5125 24.8403 30.3234L22.7604 20.1134C22.7604 20.1134 22.9495 20.1134 22.9495 20.3025C23.3277 21.2479 24.8403 24.4621 24.8403 24.4621C24.8403 24.4621 25.0293 24.6512 25.2184 24.8403C27.1091 26.5419 28.0545 25.5966 28.4327 25.2184C28.2436 24.6512 26.1638 21.0588 23.1386 17.6555Z" />
      <path d="M18.2227 23.5167C18.2227 23.5167 16.521 23.8949 14.2521 24.273C12.3614 24.6512 10.4706 23.5167 10.0925 21.815L8.39083 15.3865C8.39083 14.8193 7.8236 14.6302 7.44546 14.8193C7.06731 14.8193 6.87823 15.1975 6.87823 15.7647L8.39083 22.1932C8.76897 23.3276 9.33619 24.273 10.2816 25.0293L8.39083 30.5124H10.0925L11.6051 25.7856C12.1723 25.9747 12.5504 25.9747 13.1177 25.9747C13.4958 25.9747 13.874 25.9747 14.2521 25.7856C14.4412 25.7856 14.6303 25.7856 14.8193 25.5965L16.7101 30.3234H18.4117L16.3319 25.2184C17.4664 25.0293 18.2227 24.8402 18.2227 24.8402C18.6008 24.8402 18.979 24.273 18.7899 23.8949C18.979 23.7058 18.6008 23.5167 18.2227 23.5167Z" />
    </svg>
  );
});

Stap1HorecaVerplaatsen.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

Stap1HorecaVerplaatsen.displayName = 'Stap1HorecaVerplaatsen';

export default Stap1HorecaVerplaatsen;
