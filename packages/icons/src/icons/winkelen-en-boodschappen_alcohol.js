import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const WinkelenEnBoodschappenAlcohol = forwardRef(
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
        <path
          d="M6.05017 6.76869L7.30931 5.50955L28.532 26.7322L27.2729 27.9914L20.2265 20.945C19.7912 21.145 19.332 21.2942 18.8578 21.3882V28.1847C19.8742 28.2654 20.8859 28.397 21.8891 28.5789C22.0192 28.6074 22.1357 28.6796 22.2192 28.7835C22.3027 28.8873 22.3482 29.0165 22.3482 29.1498C22.3482 29.283 22.3027 29.4123 22.2192 29.5161C22.1357 29.6199 22.0192 29.6921 21.8891 29.7207H13.5158C13.3856 29.6921 13.2691 29.6199 13.1856 29.5161C13.1021 29.4123 13.0566 29.283 13.0566 29.1498C13.0566 29.0165 13.1021 28.8873 13.1856 28.7835C13.2691 28.6796 13.3856 28.6074 13.5158 28.5789C14.519 28.397 15.5306 28.2654 16.547 28.1847V21.3882C15.4538 21.1662 14.442 20.6501 13.6204 19.8956C12.7988 19.1411 12.1986 18.1767 11.8846 17.1064C11.5381 15.5285 11.4476 13.9151 11.6077 12.3263L6.05017 6.76869ZM12.9873 13.7058C12.9852 14.6892 13.0929 15.6748 13.3119 16.6442C13.4826 17.272 13.7924 17.8533 14.2182 18.3451C14.6441 18.8368 15.1752 19.2265 15.7722 19.4851C16.2344 19.7162 16.2344 19.4851 16.2344 19.4851C15.6773 19.0589 15.2145 18.5221 14.8751 17.9083C14.352 16.8921 14.0419 15.7908 13.9518 14.6703L12.9873 13.7058Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
        <path
          d="M12.3675 8.87959L13.5171 10.0292C13.6301 9.6423 13.7611 9.25968 13.9099 8.88257C15.1709 8.70881 16.4433 8.63156 17.716 8.65149C18.9768 8.65613 20.2355 8.75609 21.4813 8.95054C21.8273 9.87036 22.0822 10.8219 22.2425 11.7915H15.2794L22.558 19.0701C23.0016 18.4829 23.3378 17.8182 23.5474 17.1064C24.2135 14.0733 23.9336 10.9089 22.7454 8.0398C22.6874 7.91319 22.6007 7.80182 22.4921 7.71453C22.3836 7.62723 22.2563 7.5664 22.1201 7.53686C20.6654 7.28495 19.1924 7.15311 17.716 7.14266C16.2396 7.15311 14.7666 7.28495 13.3119 7.53686C13.1757 7.5664 13.0484 7.62723 12.9399 7.71453C12.8313 7.80182 12.7446 7.91319 12.6866 8.0398C12.5717 8.3171 12.4654 8.59716 12.3675 8.87959Z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

WinkelenEnBoodschappenAlcohol.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

WinkelenEnBoodschappenAlcohol.displayName = 'WinkelenEnBoodschappenAlcohol';

export default WinkelenEnBoodschappenAlcohol;
