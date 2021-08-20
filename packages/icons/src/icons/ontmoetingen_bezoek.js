import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const OntmoetingenBezoek = forwardRef(
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
        <path d="M18.4138 17.1512V22.2822H15.269C15.6 19.965 16.7586 18.3098 18.4138 17.1512Z" />
        <path
          d="M18.2483 6.72375L29.669 17.4824C29.8345 17.6479 30 17.8134 30 18.1444V18.8065C30 19.1375 29.8345 19.3031 29.5035 19.3031H27.5172V29.3996H8.48276V19.3031H6.49655C6.16552 19.3031 6 19.1375 6 18.8065V18.1444C6 17.8134 6.16552 17.6479 6.33103 17.4824L17.5862 6.72375C17.7517 6.55823 18.0828 6.55823 18.2483 6.72375ZM21.7241 22.2822H20.4V15.3305H18.4138C15.6 16.6546 13.9448 19.4684 13.4483 22.6132L13.9448 23.9374H18.4138V26.9167H20.4V23.9374H21.7241V22.2822Z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    );
  }
);

OntmoetingenBezoek.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

OntmoetingenBezoek.displayName = 'OntmoetingenBezoek';

export default OntmoetingenBezoek;
