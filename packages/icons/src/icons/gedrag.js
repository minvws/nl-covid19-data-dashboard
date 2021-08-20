import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Gedrag = forwardRef(
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
          d="M16.589 9.848c1.047 0 1.652-.812 1.652-1.982 0-1.332-.633-2.046-1.652-2.046-1.075 0-1.653.844-1.653 2.046 0 1.267.606 1.982 1.653 1.982zM26.783 17.178c-.222-1.312-.498-2.029-.598-2.94-.223-2.017-.784-2.986-1.83-3.339a4.565 4.565 0 00-1.511-.245h-.02c-.54 0-1.014.077-1.512.245a2.065 2.065 0 00-.893.583c.25.385.438.841.577 1.344l.033-.067-.02.109c.49 1.816.357 4.209.26 5.913-.058 1.056-.568 1.683-1.162 1.946-.008.215-.014.436-.014.673 0 0 .475.103 1.087.13l.077 5.64s1.18-.198 1.26-1.465c0 0 .1-2.836.146-4.284.06-.01.12-.02.18-.032l.157-.027c.046 1.415.147 4.307.147 4.307.06 1.305 1.264 1.5 1.264 1.5l.074-5.831c.559.058 1.09.158 1.09.158 0-3.084-.746-4.315-.98-5.281-.123-.514-.097-1.052.015-1.566.107-.483.243-.934.029-1.89 0 0 .113.217.158.357.25.782.177 2.292 1.188 5.774.44-.062.98-.645.798-1.712z"
          fill="#000"
        />
        <path
          d="M20.718 18.78c.143-2.556.412-7.148-1.873-7.823-1.307-.386-3.037-.42-4.512 0-2.29.652-2.017 5.267-1.874 7.822.066 1.162.805 1.491 1.293 1.491v-3.144c0-1.4.019-2.722.297-3.534.048-.14.123-.157.152-.12V28.78c1.022 0 1.837-.616 1.924-1.854l.27-6.87c.003-.08.073-.186.194-.186.12 0 .19.105.193.187l.27 6.87c.088 1.242.91 1.853 1.924 1.853V13.473c.046-.044.112-.03.152.119.221.825.298 2.146.298 3.534v3.144c.487 0 1.227-.329 1.292-1.49zM13.65 6.223c.814 0 1.286-.65 1.286-1.586C14.936 3.572 14.443 3 13.65 3c-.835 0-1.286.676-1.286 1.637 0 1.014.472 1.586 1.286 1.586zM19.527 6.223c.814 0 1.286-.65 1.286-1.586C20.813 3.572 20.32 3 19.527 3c-.835 0-1.286.676-1.286 1.637 0 1.014.472 1.586 1.286 1.586zM22.65 9.848c.93 0 1.468-.643 1.468-1.783 0-1.082-.514-1.842-1.469-1.842-.906 0-1.47.643-1.47 1.842 0 1.052.54 1.783 1.47 1.783z"
          fill="#000"
        />
        <path
          d="M13 11.091a1.813 1.813 0 00-.393-.174c-1.16-.348-3.074-.348-4.19 0-.556.173-.974.598-1.235 1.195C6.49 13.7 5 18.562 5 18.562c.092.072.252.088.434.064.139 1.565.732 8.247.76 8.496.027.233.746.156.723-.095-.023-.262-.442-6.753-.576-8.84.14-.133.26-.292.33-.478.292-.76.61-1.623.825-2.283.276-.854.456-1.472.69-2.022.05-.118.098-.19.15-.139V27.17c.865 0 1.502-.574 1.582-1.705l.248-6.261a.181.181 0 01.182-.173c.117 0 .172.098.175.173l.247 6.272c.058 1.092.613 1.694 1.595 1.694v-7.002c-.248-.328-.419-.767-.452-1.344-.13-2.273-.36-6.113 1.088-7.732zM9.074 7.824c-.006.08-.015.157-.015.24 0 1.14.539 1.784 1.47 1.784.93 0 1.468-.731 1.468-1.783 0-.618-.06-1.584-.59-1.795-.238-.095-.707-.032-1.213.108-.004 0-.007.002-.011.003-.908.253-1.852.756-1.857 1.066-.004.291.379.31.748.377z"
          fill="#000"
        />
      </svg>
    );
  }
);

Gedrag.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Gedrag.displayName = 'Gedrag';

export default Gedrag;
