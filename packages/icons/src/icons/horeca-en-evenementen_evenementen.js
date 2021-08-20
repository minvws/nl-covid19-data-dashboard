import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const HorecaEnEvenementenEvenementen = forwardRef(
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
        <path
          d="M18.2905 7.66392L21.6132 6.5259C21.6519 6.51074 21.6851 6.48457 21.7085 6.45076C21.7319 6.41696 21.7444 6.37706 21.7444 6.33623C21.7444 6.2954 21.7319 6.2555 21.7085 6.22169C21.6851 6.18789 21.6519 6.16171 21.6132 6.14656L18.2905 5.00854C18.2599 4.99958 18.2276 4.99764 18.1961 5.00286C18.1645 5.00809 18.1346 5.02034 18.1087 5.03867C18.0828 5.057 18.0615 5.08092 18.0466 5.10859C18.0316 5.13625 18.0233 5.16691 18.0224 5.19821V7.47425C18.0233 7.50554 18.0316 7.53621 18.0466 7.56387C18.0615 7.59153 18.0828 7.61546 18.1087 7.63379C18.1346 7.65212 18.1645 7.66437 18.1961 7.66959C18.2276 7.67482 18.2599 7.67288 18.2905 7.66392Z"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M15.3106 12.5078C16.1908 11.8145 17.0129 11.0534 17.7691 10.2318C17.4271 11.4025 17.0141 12.5523 16.5324 13.675L28.2138 25.1135C27.6897 23.1951 27.2916 21.2458 27.0218 19.2775L27.6774 19.0733C27.8344 19.0189 27.9704 18.9181 28.0665 18.7848C28.1626 18.6515 28.214 18.4923 28.2138 18.3292V16.1845C28.2158 16.0398 28.1764 15.8976 28.1001 15.7738C28.0237 15.65 27.9134 15.5496 27.7817 15.4841C24.1982 13.7632 21.0252 11.3223 18.4693 8.32047C18.4318 8.2721 18.3834 8.23288 18.3278 8.20588C18.2722 8.17888 18.211 8.16483 18.149 8.16483C18.087 8.16483 18.0258 8.17888 17.9702 8.20588C17.9146 8.23288 17.8662 8.2721 17.8287 8.32047C16.8564 9.5789 15.7249 10.7114 14.4613 11.6908L15.3106 12.5078ZM25.6361 15.6884H21.0023C19.9058 14.0035 19.0815 12.163 18.5587 10.2318C20.62 12.3933 23.0067 14.2335 25.6361 15.6884Z"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5 8.01408L6.40057 6.64262L31 30.6577L29.6441 32L24.9507 27.4042H22.1645C19.7507 27.4042 18.1564 21.1159 18.1564 21.1159C18.1564 21.1159 16.5473 27.4042 14.1335 27.4042H7.32436C8.25133 25.0574 8.87694 22.607 9.18682 20.1092C9.79042 20.0935 10.3801 19.9278 10.9003 19.6277C11.6199 20.0669 12.4693 20.2568 13.3122 20.1668C14.1552 20.0769 14.9429 19.7123 15.549 19.1316C15.847 18.7815 15.549 18.7815 15.549 18.7815C12.3009 20.401 11.0046 18.5335 11.0046 18.5335C10.6892 18.8483 10.2729 19.0477 9.82546 19.0981C9.37798 19.1486 8.92638 19.0471 8.54613 18.8107C8.4183 18.7419 8.31196 18.6404 8.23848 18.5171C8.165 18.3937 8.12713 18.2531 8.12894 18.1103V16.1553C8.12687 16.0107 8.16626 15.8684 8.24264 15.7446C8.31902 15.6208 8.42933 15.5204 8.56103 15.455C9.08252 15.2215 10.051 14.6963 11.1834 13.996L5 8.01408ZM12.0625 14.8568L10.6619 15.6884H12.9117L12.0625 14.8568Z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

HorecaEnEvenementenEvenementen.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

HorecaEnEvenementenEvenementen.displayName = 'HorecaEnEvenementenEvenementen';

export default HorecaEnEvenementenEvenementen;
