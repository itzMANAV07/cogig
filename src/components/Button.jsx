import { motion } from 'motion/react';
import { cn } from '../lib/cn';

const variants = {
  primary: 'bg-ink text-paper hover:bg-ink/90',
  marigold: 'bg-marigold text-ink hover:bg-marigold-dark',
  indigo: 'bg-indigo text-white hover:bg-indigo-dark',
  ghost: 'bg-transparent text-ink hover:bg-ink/5 border border-line',
  link: 'bg-transparent text-ink underline underline-offset-4 hover:text-muted p-0',
};

export function Button({
  children,
  variant = 'primary',
  className,
  as: As = 'button',
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.12 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-[15px] font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
