import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const ArtsSmall = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 15 16"
        fill="currentColor"
        stroke="none"
        {...rest}
      >
        <path
          d="M2.577 11.597c-.03-.292 0-.583.058-.816-.55.233-1.072.524-1.361.845-.84.902-1.274 4.31-1.274 4.31h2.287c0-.03-.029-.03-.029-.06-.058-.116-1.274-3.26.319-4.28z"
          fill="#000"
        />
        <path
          d="M13.217 11.632c-.318-.32-.897-.64-1.505-.902.145.466.116 1.048-.087 1.688.347.234.579.641.579 1.107 0 .728-.608 1.34-1.332 1.34a1.351 1.351 0 0 1-1.332-1.34c0-.728.608-1.34 1.332-1.34h.087c.174-.553.203-1.019.029-1.368-.232-.466-.753-.64-1.042-.699-.058-.32-.116-.699-.145-1.019.521-.64.84-1.281.926-1.95.377-.35.608-.933.608-1.631 0-.204 0-.787-.347-1.165.087-.961.145-2.475-.232-3.087C10.293.51 9.743.16 8.643.393 7.948.043 7.456-.16 6.21.16c-.869.204-1.795.553-2.287 1.136-.493.553-.435 2.096-.377 3.086-.347.379-.347.932-.347 1.165 0 .699.202 1.252.608 1.601.116.728.463 1.427 1.071 2.126-.029.233-.058.495-.116.786-.145.058-.376.116-.637.204-.55.204-.84.553-.84 1.135.29-.029.58 0 .87.146 1.331.611 1.968 2.883 1.997 2.97a.31.31 0 0 1-.029.233v.03c0 .028-.029.028-.029.057l-.058.058a2.96 2.96 0 0 1-.84.466c-.318.117-.434-.058-.492-.29-.087-.234-.058-.38.232-.554.116-.058.26-.146.405-.204-.26-.699-.781-1.805-1.476-2.125a.854.854 0 0 0-.753 0c-1.013.466-.55 2.329-.29 3.144.145-.058.29-.116.435-.145.318-.088.463 0 .55.233.116.233.145.407-.174.553-.029 0-.058.029-.087.029h10.944c0-.058-.434-3.465-1.274-4.368zm-5.964 1.514c-.666-.524-1.795-1.601-1.68-2.62.059-.553 0-.146.232-1.572-.665-.641-1.187-1.427-1.187-2.359-.463-.146-.579-.728-.579-1.107 0-.378.087-.582.232-.64.116-.058.232 0 .29.029.028.204.057.32.086.379.058.262.29.232.29.232v-1.95a8.582 8.582 0 0 0 3.098-.903l1.534 1.02v1.833s.232.03.29-.232c0-.059.029-.204.087-.379.058-.03.173-.087.29-.03.144.06.23.263.23.641 0 .379-.115.961-.578 1.107 0 1.077-.724 1.893-1.535 2.591-.231.204-.637.32-1.07.32-.32 0-.609-.087-.84-.174.173.262.492.611 1.042.757.926.233 1.592-.262 1.592-.262s.087.553.087.699c.029.99-1.187 2.096-1.91 2.62z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

ArtsSmall.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ArtsSmall.displayName = 'ArtsSmall';

export default ArtsSmall;
