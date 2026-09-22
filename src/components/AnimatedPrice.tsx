import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useTransform, motion } from 'motion/react';
import { formatVnd } from '@/lib/format';

interface AnimatedPriceProps {
  value: number;
  className?: string;
}

export function AnimatedPrice({ value, className }: AnimatedPriceProps) {
  const motionVal = useMotionValue(value);
  const springVal = useSpring(motionVal, {
    stiffness: 180,
    damping: 24,
    mass: 0.8,
  });

  const display = useTransform(springVal, (current) => formatVnd(Math.round(current)));
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      motionVal.set(value);
    } else {
      motionVal.set(value);
    }
  }, [value, motionVal]);

  return <motion.span className={className}>{display}</motion.span>;
}
