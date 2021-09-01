import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const KeepDistance = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      width={32}
      height={32}
      fill="currentColor"
      viewBox="0 0 32 32"
      {...rest}
    >
      <path fill="#fff" d="M0 0h32v32H0z" />
      <path
        d="M6.481 9.26c.87 0 1.414-.674 1.414-1.574C7.895 6.562 7.352 6 6.481 6c-.979 0-1.523.675-1.523 1.686 0 1.012.544 1.574 1.523 1.574zM8.113 10.047c-.979-.225-2.284-.225-3.264 0C2.891 10.497 3 13.757 3 16.456c.109.899.762 1.236 1.197 1.236v-2.585c0-1.125.217-2.361.326-2.811 0-.113.109-.113.109-.113V24.888s1.305 0 1.523-1.574l.217-5.959c0-.112 0-.225.218-.225.109 0 .218.113.218.225s.217 5.959.217 5.959c.109 1.573 1.523 1.573 1.523 1.573V12.296s.109 0 .109.112c-.109.338.109 1.574.109 2.699v2.586c.435 0 1.088-.226 1.196-1.237-.108-2.699 0-5.959-1.849-6.409zM25.628 9.26c.87 0 1.414-.674 1.414-1.574 0-1.124-.544-1.686-1.414-1.686-.98 0-1.415.675-1.415 1.686 0 1.012.544 1.574 1.415 1.574zM27.26 10.047c-.98-.225-2.285-.225-3.264 0-1.85.45-1.85 3.71-1.85 6.409.11.899.762 1.236 1.197 1.236v-2.585c0-1.125.218-2.361.326-2.811 0-.113.11-.113.11-.113V24.888s1.305 0 1.522-1.574l.218-5.959c0-.112 0-.225.217-.225.11 0 .218.113.218.225s.218 5.959.218 5.959c.108 1.573 1.523 1.573 1.523 1.573V12.296s.108 0 .108.112c.11.338.327 1.574.327 2.699v2.586c.435 0 1.088-.226 1.196-1.237-.326-2.699-.108-5.959-2.067-6.409zM13.008 13.533c.11-.113.11-.338 0-.338-.108-.112-.217-.112-.435-.112l-1.958 1.686c-.217.225-.217.45 0 .562l2.067 1.687c.109.112.326 0 .326 0s.11-.113.11-.225c0 0 0-.113-.11-.225l-.543-.9h1.523v-1.236h-1.524l.544-.9zM15.837 14.432h-1.088v1.237h2.503v-1.237h-1.415zM19.427 13.083c-.109-.113-.327-.113-.327 0-.108.112-.108.337 0 .337l.544.9h-1.523v1.236h1.523l-.544.9c-.108.112-.108.112-.108.224 0 .113 0 .225.108.225.11.113.327.113.327 0l2.067-1.686c.217-.112.217-.337 0-.562l-2.067-1.574zM11.703 20.053c.218-.112.544-.112.761-.112h.218v2.36h-.544v-1.91h-.544v-.338h.109zm2.067 1.462c.218 0 .326.112.326.337 0 .337-.435.9-.544.9h-.217l.217-.563c-.108 0-.217-.112-.217-.337.109-.112.217-.337.435-.337zm2.285-1.125h-.98v.45h.218c.544 0 .87.225.87.675 0 .562-.435.9-1.196.9h-.327v-.45h.327c.435 0 .652-.113.652-.338 0-.225-.217-.337-.544-.337h-.435v-1.237h1.415v.337zM17.795 20.503v1.799h-.544l.109-2.361h.762l.435 1.349h.108l.436-1.35h.761l.109 2.362h-.544l-.109-1.8-.435 1.35h-.653l-.435-1.35zM20.64 21.45c0-.063.018-.117.056-.16.039-.043.096-.064.173-.064.076 0 .134.021.173.064.04.043.06.097.06.16s-.02.114-.06.156c-.039.041-.097.062-.173.062-.076 0-.134-.02-.173-.062a.223.223 0 01-.056-.155z"
        fill="currentColor"
      />
    </svg>
  );
});

KeepDistance.propTypes = {
  // color: PropTypes.string,
  // size: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

KeepDistance.displayName = 'KeepDistance';

export default KeepDistance;
