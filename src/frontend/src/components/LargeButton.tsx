import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

type LargeButtonProps = ComponentProps<typeof Button>;

export default function LargeButton({ className, size = 'lg', ...props }: LargeButtonProps) {
  return (
    <Button
      className={cn('min-h-12 px-8 text-base font-semibold', className)}
      size={size}
      {...props}
    />
  );
}
