import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Stap1OnderwijsOpen = forwardRef(
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
        <path d="M29.6646 14.2874L24.74 7.29762C24.5811 6.9799 24.2634 6.82104 23.9457 6.82104H12.0313C11.7136 6.82104 11.5547 6.9799 11.3959 7.13876L6.31238 14.2874C6.31238 14.4463 6.31238 14.6051 6.47124 14.6051H9.64841L16.9559 8.56849C17.4325 8.09191 18.2268 8.09191 18.8622 8.56849L26.1697 14.6051H29.3469C29.6646 14.6051 29.8235 14.4463 29.6646 14.2874Z" />
        <path d="M18.0679 9.83936L10.4427 16.0348H7.90096V29.379H28.076V16.0348H25.5343L18.0679 9.83936ZM14.7319 26.5195H11.0781V24.2955H14.7319V26.5195ZM14.7319 22.8658H11.0781V18.7354H14.7319V22.8658ZM19.8154 26.5195H16.1616V24.2955H19.8154V26.5195ZM19.8154 22.8658H16.1616V18.7354H19.8154V22.8658ZM18.0679 16.5114C16.9559 16.5114 16.1616 15.7171 16.1616 14.6051C16.1616 13.4931 16.9559 12.6988 18.0679 12.6988C19.1799 12.6988 19.9742 13.4931 19.9742 14.6051C19.9742 15.7171 19.0211 16.5114 18.0679 16.5114ZM24.8988 26.5195H21.2451V24.2955H24.8988V26.5195ZM24.8988 22.8658H21.2451V18.7354H24.8988V22.8658Z" />
      </svg>
    );
  }
);

Stap1OnderwijsOpen.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Stap1OnderwijsOpen.displayName = 'Stap1OnderwijsOpen';

export default Stap1OnderwijsOpen;
