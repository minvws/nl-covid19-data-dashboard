import { motion } from 'framer-motion';
import { memo } from 'react';
import { useIsMotionDisabled } from '~/utils/use-is-motion-disabled';
import { usePathMorph } from '~/utils/use-path-morph';

interface AnimatedPathProps {
  d: string;
  fill?: string;
  strokeLinecap?: 'round' | 'inherit' | 'butt' | 'square';
  strokeLinejoin?: 'inherit' | 'round' | 'bevel' | 'miter';
  stroke?: string;
  strokeWidth?: number;
  isAnimated?: boolean;
}

export const Path = memo(PathUnmemoized);

function PathUnmemoized(props: AnimatedPathProps) {
  const {
    d,
    fill,
    strokeWidth,
    stroke,
    strokeLinecap,
    strokeLinejoin,
    isAnimated,
  } = props;
  const isMotionDisabled = useIsMotionDisabled();

  if (isAnimated && !isMotionDisabled) {
    return <AnimatedPath {...props} />;
  }

  return (
    <path
      d={d}
      fill={fill}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

function AnimatedPath(props: AnimatedPathProps) {
  const { d, fill, strokeWidth, stroke, strokeLinecap, strokeLinejoin } = props;

  const path = usePathMorph(d, {
    type: 'spring',
    stiffness: 500,
    damping: 55,
  });

  return (
    <motion.path
      d={path}
      fill={fill}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}
