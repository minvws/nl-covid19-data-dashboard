import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const BasisregelsMondkapje = forwardRef(
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
          <path
            d="M25.5726 25.2019C25.1489 24.7782 24.4076 24.3546 23.5603 24.0369C22.9248 23.7191 21.3362 23.0837 21.1244 22.9778C21.1244 22.66 21.0185 22.3423 21.0185 22.0246C21.548 21.6009 21.9717 21.1773 22.713 20.5418C22.9248 20.4359 22.9248 20.2241 22.8189 20.0123L22.6071 19.4827C22.6071 19.2709 22.713 19.0591 22.713 18.9532C22.713 18.8473 22.713 18.7414 22.713 18.6355C23.0307 18.2118 23.2426 17.5764 23.2426 16.7291C23.2426 16.4114 23.2426 15.67 22.8189 15.2464C23.2426 12.8104 21.8657 10.4804 19.5357 9.84496C19.1121 9.52723 18.7944 9.42132 18.3707 9.42132C18.3707 9.31541 18.4766 9.31541 18.5825 9.31541C19.1121 9.2095 19.8535 9.31541 20.383 9.42132C20.4889 9.10359 20.7007 8.57404 20.7007 8.25631C20.7007 7.19721 19.7475 6.34994 18.6885 6.34994C17.9471 6.34994 17.3116 6.87949 16.888 7.40903C16.2525 8.25631 15.8289 7.72676 16.2525 7.09131C16.2525 7.09131 14.9816 7.19721 14.9816 8.25631C14.9816 8.99768 15.723 9.63314 16.1466 9.84496C14.0284 10.5863 12.6516 12.8104 13.0752 15.1404C12.6516 15.67 12.6516 16.4114 12.6516 16.6232C12.6516 17.3645 12.8634 18 13.1811 18.5296C13.1811 18.6355 13.1811 18.7414 13.1811 18.8473C13.1811 19.0591 13.2871 19.2709 13.2871 19.3768L13.1811 19.9064C13.0752 20.1182 13.1811 20.33 13.2871 20.4359C14.0284 21.0714 14.4521 21.495 14.9816 21.9187C14.9816 22.2364 14.8757 22.5541 14.8757 22.8718C14.7698 22.8718 12.6516 23.825 12.4398 23.9309C11.5925 24.2487 10.8511 24.6723 10.4275 25.096C9.68613 25.9432 9.15658 28.3792 8.94476 29.6501H27.0553C26.8435 28.3792 26.3139 25.9432 25.5726 25.2019ZM13.8166 16.6232C13.8166 16.4114 13.8166 15.8818 14.0284 15.7759C14.2402 15.7759 14.3462 15.7759 14.558 15.8818C14.558 15.5641 14.558 14.7168 14.8757 13.7636C15.723 13.0222 16.888 12.4927 18.053 12.4927C19.3239 12.4927 20.383 13.0222 21.2303 13.7636C21.2303 13.8695 21.2303 13.8695 21.2303 13.9754C21.3362 14.1873 21.3362 14.505 21.3362 14.7168C21.4421 15.2464 21.4421 15.67 21.4421 15.8818C21.548 15.7759 21.7598 15.67 21.9717 15.7759C22.1835 15.8818 22.1835 16.0936 22.1835 16.6232C22.1835 16.7291 22.1835 16.835 22.1835 16.9409C20.7007 16.9409 19.8535 16.835 19.5357 16.6232C19.1121 16.3054 18.7944 15.7759 17.9471 15.7759C17.2057 15.7759 16.7821 16.3054 16.3584 16.6232C16.1466 16.835 15.2993 16.9409 13.8166 16.9409C13.8166 16.835 13.8166 16.7291 13.8166 16.6232ZM14.1343 20.0123C14.2402 19.8005 14.2402 19.8005 14.3462 19.6946L16.5703 20.33C16.5703 20.33 16.6762 20.2241 16.5703 20.1182L14.2402 18.7414C14.2402 18.4236 14.1343 18.2118 14.1343 17.8941C16.0407 17.8941 16.6762 17.6823 17.0998 17.3645C17.5234 16.9409 17.6294 16.7291 17.9471 16.7291C18.3707 16.7291 18.4766 16.9409 18.9003 17.3645C19.3239 17.6823 19.9594 17.8941 21.8657 17.8941C21.8657 18.2118 21.8657 18.5296 21.7598 18.7414L19.5357 20.1182C19.4298 20.2241 19.4298 20.2241 19.5357 20.33L21.7598 19.6946C21.7598 19.8005 21.8657 19.8005 21.8657 20.0123C21.4421 20.33 21.2303 20.6477 20.9126 20.8596C19.9594 21.7068 19.3239 22.0246 18.053 22.0246C16.7821 22.0246 16.2525 21.7068 15.2993 20.9655C14.9816 20.7537 14.558 20.33 14.1343 20.0123ZM17.9471 27.0023C17.9471 27.0023 14.3462 26.8964 13.4989 24.7782C14.8757 24.1428 15.8289 23.9309 15.9348 23.2955C15.9348 23.1896 15.9348 22.9778 16.0407 22.7659C16.5703 22.9778 17.2057 23.1896 17.9471 23.1896C18.7944 23.1896 19.3239 23.0837 19.8535 22.7659C19.8535 22.9778 19.8535 23.1896 19.8535 23.2955C19.9594 24.0369 20.9126 24.2487 22.2894 24.7782C21.6539 26.8964 17.9471 27.0023 17.9471 27.0023Z"
            fill="currentColor"
          />
        </svg>
      </svg>
    );
  }
);

BasisregelsMondkapje.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

BasisregelsMondkapje.displayName = 'BasisregelsMondkapje';

export default BasisregelsMondkapje;
