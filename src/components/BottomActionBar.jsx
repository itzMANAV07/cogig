import { createPortal } from 'react-dom';
import { Button } from './Button';
import { cn } from '../lib/cn';

/**
 * Global UX pattern: one fixed, thumb-reachable primary action pinned to the
 * bottom of the viewport. Optional secondary action renders as a smaller
 * text-link above the primary button — never as a competing button of
 * equal visual weight. Pair with <PageShell hasBottomBar> so page content
 * gets enough bottom padding to never sit underneath this bar.
 *
 * Rendered via a portal into document.body rather than in place: PageShell's
 * animated wrapper (Framer Motion) leaves an inline `transform` on its
 * element even at rest, which makes it the containing block for any
 * `position: fixed` descendant — silently breaking "pinned to the real
 * viewport" for anything nested inside it. Portaling sidesteps that.
 */
export function BottomActionBar({ primary, secondary, disabled = false }) {
  return createPortal(
    <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-line bg-paper/95 px-6 py-4 backdrop-blur sm:px-10">
      <div className="mx-auto flex max-w-xl flex-col items-stretch gap-2">
        {secondary && (
          <button
            type="button"
            onClick={secondary.onClick}
            className="mx-auto text-sm font-medium text-muted underline underline-offset-4 hover:text-ink"
          >
            {secondary.label}
          </button>
        )}
        <Button
          type={primary.type || 'button'}
          form={primary.form}
          variant={primary.variant || 'marigold'}
          onClick={primary.onClick}
          disabled={disabled || primary.disabled}
          className={cn('w-full', primary.className)}
        >
          {primary.icon}
          {primary.label}
        </Button>
      </div>
    </div>,
    document.body
  );
}
