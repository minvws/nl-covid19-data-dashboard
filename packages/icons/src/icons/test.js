import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Test = forwardRef(
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
        <path d="M15.7261 23.3383C15.5898 23.4425 15.4541 23.5463 15.4124 23.7326C15.3812 23.8736 15.4293 24.0408 15.4839 24.2309C15.6015 24.6393 15.7493 25.1533 15.2059 25.7393C14.8176 26.1589 14.0262 26.4001 13.1021 26.2602C11.9224 26.0817 8.86998 25.4547 8.86998 25.4547C8.86015 25.4788 8.83065 25.556 8.92896 25.6235C9.02727 25.691 11.1507 26.6991 11.1507 26.6991V29H2.75521C2.75521 29 3.52201 25.7537 3.4532 24.7311C3.35783 23.276 2.47685 21.5223 1.65146 19.8792C1.15808 18.8971 0.684565 17.9545 0.410563 17.1388C-0.218609 15.2672 -0.626588 11.5386 3.12387 9.53682C6.67771 7.64115 11.5095 7.72798 12.8465 8.5721C14.0213 9.31494 14.4047 10.6173 13.6232 12.0789C13.6232 12.0789 14.2966 13.6272 14.5424 15.0261C14.5648 15.1516 14.5514 15.3467 14.5372 15.5527C14.5203 15.7978 14.5023 16.0586 14.5424 16.2368L16.887 18.8271C17.118 19.1695 17.0197 19.6374 16.6658 19.8593L15.432 20.5008C15.432 20.5008 15.4222 20.9591 15.8744 21.2437C16.0366 21.345 16.071 21.5572 16.0366 21.7501C15.9875 22.0106 15.786 22.2229 15.6237 22.3049C15.7663 22.3338 16.0121 22.4158 16.0514 22.7052C16.0966 23.0549 15.9108 23.197 15.7261 23.3383Z" />
        <path d="M20.6779 23.9207C20.6779 23.9207 23.4157 26.6267 23.6025 26.81C23.7844 26.9885 23.75 27.0946 23.6959 27.1476C23.6932 27.1503 23.6905 27.1531 23.6876 27.156C23.6373 27.2069 23.5507 27.2945 23.3322 27.0801C23.1011 26.8534 20.2797 24.0702 20.2797 24.0702C20.2529 24.0801 20.2299 24.0904 20.2091 24.0997C20.0769 24.1591 20.0292 24.1805 19.626 23.8097C19.4097 23.6071 17.8023 22.0346 17.6057 21.8369C17.3649 21.6005 17.1191 21.3256 17.4484 21.0024C17.7707 20.6909 18.0412 20.9567 18.2415 21.1536C18.2459 21.1579 18.2502 21.1622 18.2546 21.1664C18.4364 21.3449 20.0585 22.9415 20.2502 23.1441C20.5886 23.5038 20.5803 23.559 20.5663 23.6522C20.5632 23.6727 20.5599 23.695 20.5599 23.7229C20.543 23.7892 20.5052 23.8442 20.4752 23.8877C20.4616 23.9075 20.4496 23.9249 20.4419 23.94C20.4272 23.9641 20.5107 24.0461 20.5402 24.0364C20.5943 24.022 20.6238 23.9978 20.6779 23.9207Z" />
      </svg>
    );
  }
);

Test.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Test.displayName = 'Test';

export default Test;
