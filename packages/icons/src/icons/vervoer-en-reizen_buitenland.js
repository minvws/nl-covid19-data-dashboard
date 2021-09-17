import React, { forwardRef } from 'react';

const VervoerEnReizenBuitenland = forwardRef(({ ...rest }, ref) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.5941 27.611L27.6541 30.671L28.92 29.405L7.50523 7.99029L6.23932 9.2562L10.4604 13.4773H10.1557C9.29916 13.4773 8.58533 14.1911 8.44257 15.1904C8.15704 18.7596 8.15704 22.3287 8.44257 25.8978C8.44257 26.7544 9.29916 27.611 10.1557 27.611H24.5941ZM14.9087 17.9255L12.8271 15.8439L11.4406 18.6168L14.0104 19.9017L14.9087 17.9255Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.7158 25.8978C27.7035 25.984 27.6859 26.0682 27.6634 26.1499L14.7242 13.2107V11.7641C14.7242 10.7647 15.5808 10.0509 16.4374 10.0509H19.5782C20.5776 10.0509 21.2914 10.9075 21.2914 11.7641V13.4773H25.8599C26.8593 13.4773 27.7158 14.3338 27.7158 15.1904C28.0014 18.6168 28.0014 22.3287 27.7158 25.8978ZM19.721 13.4773H16.4374V11.7641H19.721V13.4773Z"
        fill="currentColor"
      />
    </svg>
  );
});

VervoerEnReizenBuitenland.displayName = 'VervoerEnReizenBuitenland';

export default VervoerEnReizenBuitenland;
