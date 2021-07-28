import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const OnderwijsEnKinderopvangKinderopvang = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        stroke={color}
        {...rest}
      >
        <svg
          focusable="false"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.7427 17.8389C19.7427 16.4072 18.8836 15.4049 18.0246 15.4049C17.1655 15.4049 16.3065 16.5503 16.3065 17.8389H19.7427Z"
            fill="currentColor"
          />
          <path
            d="M18.0246 18.9843C17.4519 18.9843 17.0223 19.4139 17.0223 19.9866C17.0223 20.2729 17.1655 20.5593 17.4519 20.7025V22.7069H18.5973V20.7025C18.8836 20.5593 19.0268 20.2729 19.0268 19.9866C19.0268 19.4139 18.5973 18.9843 18.0246 18.9843Z"
            fill="currentColor"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M18.3109 7.53023L28.7628 17.4094C29.0491 17.5526 29.0491 17.8389 28.906 18.1253V18.698C28.906 18.9843 28.7628 19.1275 28.4764 19.1275H26.7583V28.5771H9.14764V19.2707H7.42953C7.14318 19.2707 7 19.1275 7 18.8412V18.1253C7 17.8389 7.14318 17.5526 7.28635 17.4094L17.7382 7.53023C17.8814 7.38706 18.1677 7.38706 18.3109 7.53023ZM20.6017 23.7091C20.8881 23.566 21.1744 23.4228 21.1744 23.1364C21.3176 22.4206 21.3176 20.9888 21.3176 20.8456C21.3176 19.9866 21.3176 19.2707 21.1744 18.2684C21.1744 18.173 21.0472 18.0775 20.9199 17.9821C20.8563 17.9344 20.7926 17.8866 20.7449 17.8389L20.6017 17.9821C20.029 18.4116 19.5995 18.5548 19.4563 18.5548H19.3132C19.3847 18.5548 19.4563 18.519 19.5279 18.4832C19.5995 18.4474 19.6711 18.4116 19.7427 18.4116L20.4586 17.6957C20.6017 17.6957 20.6017 17.5526 20.6017 17.5526C20.3154 15.8345 19.3132 14.5459 18.0246 14.5459C16.736 14.5459 15.5906 16.1208 15.4474 17.9821C15.161 18.1253 14.8747 18.2684 14.8747 18.5548C14.7315 19.2707 14.7315 20.5593 14.7315 20.8456C14.7315 21.132 14.7315 22.4206 14.8747 23.1364C14.8747 23.4228 15.161 23.7091 15.4474 23.7091C16.3065 23.8523 17.7382 23.8523 18.0246 23.8523C18.3109 23.8523 19.7427 23.8523 20.6017 23.7091Z"
            fill="currentColor"
          />
        </svg>
      </svg>
    );
  }
);

OnderwijsEnKinderopvangKinderopvang.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

OnderwijsEnKinderopvangKinderopvang.displayName =
  'OnderwijsEnKinderopvangKinderopvang';

export default OnderwijsEnKinderopvangKinderopvang;
