import debounce from 'lodash/debounce';
import React, { useState, useEffect, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export type ParentSizeProps = {
  /** Optional `className` to add to the parent `div` wrapper used for size measurement. */
  className?: string;
  /** Child render updates upon resize are delayed until `debounceTime` milliseconds _after_ the last resize event is observed. */
  debounceTime?: number;
  /** Optional flag to toggle leading debounce calls. When set to true this will ensure that the component always renders immediately. (defaults to true) */
  enableDebounceLeadingCall?: boolean;
  /** Optional `style` object to apply to the parent `div` wrapper used for size measurement. */
  parentSizeStyles?: React.CSSProperties;
  /** Child render function `({ width, height, top, left, ref, resize }) => ReactNode`. */
  children: (
    args: {
      ref: HTMLDivElement | null;
      resize: (state: any) => void;
    } & any
  ) => React.ReactNode;
};

export type ParentSizeProvidedProps = any;

export type IProps = ParentSizeProps &
  Omit<JSX.IntrinsicElements['div'], keyof ParentSizeProps>;

export default function ParentSize(props: IProps) {
  const {
    debounceTime,
    enableDebounceLeadingCall,
    className,
    children,
    parentSizeStyles,
    ...restProps
  } = props;

  const animationFrameID = useRef<number>(0);
  const resizeObserver = useRef<ResizeObserver | undefined>(undefined);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  const resize = debounce(
    ({ width, height, top, left }) => {
      setWidth(width);
      setHeight(height);
      setTop(top);
      setLeft(left);
    },
    debounceTime,
    { leading: enableDebounceLeadingCall }
  );

  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries = []) => {
      entries.forEach((entry) => {
        const { left, top, width, height } = entry.contentRect;
        animationFrameID.current = window.requestAnimationFrame(() => {
          resize({ width, height, top, left });
        });
      });
    });
    if (ref.current) {
      resizeObserver.current.observe(ref.current);
      return () => {
        window.cancelAnimationFrame(animationFrameID.current);
        if (resizeObserver.current) {
          resizeObserver.current.disconnect();
        }
        resize.cancel();
      };
    }
  }, [resize]);

  return (
    <div
      style={parentSizeStyles}
      ref={ref}
      className={className}
      {...restProps}
    >
      {children({
        width,
        height,
        top,
        left,
        ref: ref.current,
        resize: resize,
      })}
    </div>
  );
}

ParentSize.defaultProps = {
  debounceTime: 300,
  enableDebounceLeadingCall: true,
  parentSizeStyles: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
};
