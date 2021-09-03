import React, { forwardRef } from 'react';

const Klok2100 = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      width={36}
      height={36}
      viewBox="0 0 36 36"
      fill="currentColor"
      focusable="false"
      {...rest}
    >
      <path d="M17 17.1L12.8 17.4C12.2 17.5 12.1 17.8 12.2 18C12.2 18.3 12.5 18.6 12.9 18.6C17.1 18.9 17.9 18.9 18.1 18.9C18.6 18.9 19 18.4 19 17.9L18.7 11.7C18.7 11.4 18.4 11.1 18 11.1C17.6 11.1 17.3 11.3 17.3 11.7L17 17.1Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29 18C29 11.9 24.1 7 18 7C11.9 7 7 11.9 7 18C7 24.1 11.9 29 18 29C24.1 29 29 24.1 29 18ZM26.5 18C26.5 22.7 22.7 26.5 18 26.5C13.3 26.5 9.5 22.7 9.5 18C9.5 13.3 13.3 9.5 18 9.5C22.7 9.5 26.5 13.3 26.5 18Z"
      />
    </svg>
  );
});

Klok2100.displayName = 'Klok2100';

export default Klok2100;
