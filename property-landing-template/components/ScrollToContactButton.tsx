'use client';

import { Button } from '@your-org/design-system';

export default function ScrollToContactButton({
  children,
  size = 'md',
  className,
}: {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const handleClick = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <Button size={size} onClick={handleClick} className={className}>
      {/* design-system의 @types/react와 프로젝트의 @types/react 버전 차이로 인한 타입 호환 단언 */}
      {children as any}
    </Button>
  );
}
