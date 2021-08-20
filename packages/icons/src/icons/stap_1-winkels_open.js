import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Stap1WinkelsOpen = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="currentColor"
        stroke={color}
        {...rest}
      >
        <path d="M32.3556 24.8447L28.6828 19.8364C28.5158 19.6694 28.3489 19.5025 28.182 19.5025H25.8447C25.6778 19.5025 25.6778 19.5025 25.5108 19.5025L25.3439 19.6694L24.6761 22.0066C24.6761 22.1736 24.6761 22.3405 24.8431 22.5075L28.5158 27.5158C28.6828 27.6828 29.0167 27.6828 29.1836 27.5158L32.3556 25.1786C32.3556 25.1786 32.5225 25.0116 32.3556 24.8447ZM27.1803 21.6728C26.8464 21.8397 26.5125 21.8397 26.3456 21.5058C26.1786 21.1719 26.1786 20.838 26.5125 20.6711C26.8464 20.5041 27.1803 20.5041 27.3472 20.838C27.5142 21.1719 27.5142 21.5058 27.1803 21.6728Z" />
        <path d="M29.8514 14.828L26.0117 8.98497C25.6778 8.65108 25.3439 8.31719 24.8431 8.15024L21.6711 6.98163C20.6694 8.48413 19 10.1536 17.1636 9.81969C16.9967 9.81969 16.9967 9.65275 16.9967 9.65275C17.9983 9.4858 19 8.81802 20.0017 7.81635C19.3339 7.9833 18.4992 8.15024 17.6644 8.15024C15.6611 8.15024 13.8247 6.98163 13.8247 6.98163L10.6528 7.9833C10.1519 8.15024 9.81803 8.48413 9.48414 8.81802L5.64441 14.828L9.15025 18.3339L11.3205 16.4975V29.0183H24.3422V16.3305L26.5125 18.1669L29.8514 14.828Z" />
      </svg>
    );
  }
);

Stap1WinkelsOpen.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Stap1WinkelsOpen.displayName = 'Stap1WinkelsOpen';

export default Stap1WinkelsOpen;
