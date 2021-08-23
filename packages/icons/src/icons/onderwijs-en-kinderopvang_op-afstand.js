import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const OnderwijsEnKinderopvangOpAfstand = forwardRef(({ ...rest }, ref) => {
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
      <path
        d="M15.201 12.8112L20.6591 14.0708L19.3995 14.9105L21.2189 16.0301L20.5191 17.1497L18.6998 16.0301L18.14 17.2896L15.201 12.8112Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.7966 20.0886L30.3157 24.0072C30.4556 24.1472 30.5956 24.4271 30.5956 24.707V26.6663C30.5956 27.2261 30.1757 27.6459 29.6159 27.6459H6.38413C5.82433 27.6459 5.40448 27.2261 5.40448 26.6663V24.707C5.40448 24.4271 5.40448 24.1472 5.54443 24.0072L8.20349 20.0886L8.62334 9.87224C8.62334 9.03254 9.32309 8.47274 10.0228 8.47274H25.8372C26.537 8.47274 27.2368 9.17249 27.2368 9.87224L27.7966 20.0886ZM15.6209 22.4678L14.6412 24.2871H21.2189L20.2392 22.4678H15.6209ZM8.76329 20.0886H27.2368V19.9487C26.537 19.6688 25.9772 19.5288 25.9772 19.5288L25.5573 10.2921H10.5826L10.1628 19.5288C10.1628 19.5288 9.46304 19.8087 8.90324 19.9487C8.76329 19.9487 8.76329 20.0886 8.76329 20.0886Z"
        fill="currentColor"
      />
    </svg>
  );
});

OnderwijsEnKinderopvangOpAfstand.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

OnderwijsEnKinderopvangOpAfstand.displayName =
  'OnderwijsEnKinderopvangOpAfstand';

export default OnderwijsEnKinderopvangOpAfstand;
