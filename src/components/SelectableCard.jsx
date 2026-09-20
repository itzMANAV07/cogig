import { motion } from 'motion/react';
import { Icon } from './Icon';
import { cn } from '../lib/cn';

const accentMap = {
  marigold: 'group-hover:border-marigold group-hover:bg-marigold-light/40',
  indigo: 'group-hover:border-indigo group-hover:bg-indigo-light/40',
};

const iconBg = {
  marigold: 'bg-marigold-light text-marigold-dark',
  indigo: 'bg-indigo-light text-indigo-dark',
};

export function SelectableCard({ icon, title, description, accent = 'marigold', onClick, sub }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'group flex flex-col items-start gap-3 rounded-lg border border-line bg-surface p-6 text-left transition-colors',
        accentMap[accent]
      )}
    >
      <div className={cn('flex size-11 items-center justify-center rounded-lg', iconBg[accent])}>
        <Icon name={icon} size={22} />
      </div>
      <div>
        <div className="font-semibold text-ink">{title}</div>
        {description && <div className="mt-1 text-sm text-muted">{description}</div>}
        {sub && <div className="mt-1 text-sm text-muted tabular">{sub}</div>}
      </div>
    </motion.button>
  );
}
