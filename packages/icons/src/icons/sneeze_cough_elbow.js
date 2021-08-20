import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const SneezeCoughElbow = forwardRef(
  ({ color = 'currentColor', size = 36, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="currentColor"
        stroke="none"
        {...rest}
      >
        <path fill="#fff" d="M0 0h32v32H0z" />
        <path
          d="M18.96 11.492a.454.454 0 00-.59.084.454.454 0 00.085.591l.295.253h-.464c-.253 0-.422.211-.38.464 0 .211.211.38.422.38h.042l1.603-.127a.405.405 0 00.38-.295.421.421 0 00-.169-.464l-1.223-.886z"
          fill="currentColor"
        />
        <path
          d="M26.766 15.753c-.296-1.055-1.224-1.56-2.236-1.687 1.054-1.94 3.586-7.088.295-7.636-1.055-1.181-1.73-2.067-4.345-1.983-2.447.084-5.274.127-6.37 4.177-.507 1.898-.212 2.868.084 4.935-1.097-.506-2.152-1.012-2.827-1.307l-.126-.38c-.17-.464-.338-.886-.718-1.223-.38-.296-.843-.338-1.18-.296-.465-.38-1.013-.548-1.562-.422-.506.127-1.012.507-1.308 1.14-1.012 2.109-.21 3.164.633 3.67.802.506 1.646.633 2.236.675 1.055.928 6.033 5.189 7.467 5.61 1.013.296 3.502-.084 5.611-.632.042.084-.042.169-.168.21-1.899.887-4.599 1.52-5.822 1.182-.844-.253-2.953-1.814-4.852-3.333-.886.38-1.73.844-2.194 1.308-1.139 1.308-1.772 7.13-1.772 7.13h17.044s.38-5.063 1.814-8.269c.38-.886.675-1.645.296-2.869zm-17.34-1.181c-.463 0-1.18-.127-1.898-.548-.506-.296-1.097-.929-.295-2.574.169-.38.422-.633.76-.675.294-.042.674.085.97.38l.168.168.253-.084s.38-.126.633.084c.211.211.338.507.464.886 0 .043.042.085.042.127l-1.096 2.236zm5.949-.464c0-.506.042-1.055.253-1.561-.548-.464-.844-1.14-.506-1.94.21-.507.717-.929 1.35-.422-.042.295-.085.463-.085.548-.042.38.507.506.507.506l.886-2.278c.843.253 4.218.928 6.37.76l.21 1.982c-.168.422-.379.802-.59 1.181-.38.043-.886.127-1.054.17a.458.458 0 00-.338.337.401.401 0 00.169.422l.464.295c-1.392.21-3.375.801-4.767 1.308-.76-.296-1.814-.802-2.869-1.308z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

SneezeCoughElbow.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

SneezeCoughElbow.displayName = 'SneezeCoughElbow';

export default SneezeCoughElbow;
