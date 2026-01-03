export default function LoadingSkeleton({
  width = '100%',
  height = '20px',
  rounded = 'md',
  className = '',
}) {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={`animate-pulse bg-surface-light ${roundedClasses[rounded]} ${className}`}
      style={{ width, height }}
    />
  );
}

export function GameCardSkeleton() {
  return (
    <div className="bg-surface rounded-xl overflow-hidden border border-gray-800">
      <LoadingSkeleton height="160px" rounded="none" />
      <div className="p-4 space-y-3">
        <LoadingSkeleton height="24px" width="70%" />
        <LoadingSkeleton height="16px" width="50%" />
        <div className="flex justify-between pt-2">
          <LoadingSkeleton height="20px" width="30%" />
          <LoadingSkeleton height="20px" width="30%" />
        </div>
      </div>
    </div>
  );
}

export function BetHistorySkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-surface rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <LoadingSkeleton width="40px" height="40px" rounded="lg" />
            <div className="space-y-2">
              <LoadingSkeleton height="18px" width="120px" />
              <LoadingSkeleton height="14px" width="80px" />
            </div>
          </div>
          <div className="text-right space-y-2">
            <LoadingSkeleton height="18px" width="80px" />
            <LoadingSkeleton height="14px" width="60px" />
          </div>
        </div>
      ))}
    </div>
  );
}
