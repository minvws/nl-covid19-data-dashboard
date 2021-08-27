import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Stap1Theorie = forwardRef(({ ...rest }, ref) => {
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
      <path d="M25.413 7.41534H16.7311C16.464 7.41534 16.3304 7.54891 16.0633 7.68248L10.0528 13.693C9.91921 13.9601 9.78564 14.0937 9.78564 14.3608V27.1833C9.78564 27.584 10.1863 27.9847 10.587 27.9847H25.413C25.8137 27.9847 26.2144 27.584 26.2144 27.1833V8.21675C26.2144 7.81605 25.8137 7.41534 25.413 7.41534ZM24.2109 25.9812H11.7892V14.8951L10.4535 14.4944C10.3199 14.4944 10.3199 14.3608 10.3199 14.3608H16.1969C16.464 14.3608 16.5976 14.2273 16.5976 13.9601V8.08318C16.5976 8.08318 16.7311 8.08318 16.7311 8.21675L17.1318 9.55242H23.9438V25.9812H24.2109Z" />
      <path d="M22.6081 13.1587H18.4675V14.3608H22.6081V13.1587Z" />
      <path d="M22.4745 17.2993H16.3304V18.5014H22.4745V17.2993Z" />
      <path d="M15.529 17.2993H13.5255V18.5014H15.529V17.2993Z" />
      <path d="M22.4745 19.7035H16.3304V20.9056H22.4745V19.7035Z" />
      <path d="M15.529 19.7035H13.5255V20.9056H15.529V19.7035Z" />
      <path d="M15.529 22.2413H13.5255V23.4434H15.529V22.2413Z" />
      <path d="M22.4745 22.2413H16.3304V23.4434H22.4745V22.2413Z" />
    </svg>
  );
});

Stap1Theorie.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

Stap1Theorie.displayName = 'Stap1Theorie';

export default Stap1Theorie;
