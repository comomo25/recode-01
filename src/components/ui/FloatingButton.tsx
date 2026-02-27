interface FloatingButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  ariaLabel: string;
  variant?: 'primary' | 'default';
}

const FloatingButton = ({
  onClick,
  icon,
  position,
  ariaLabel,
  variant = 'default',
}: FloatingButtonProps) => {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-20 left-4',
    'bottom-right': 'bottom-20 right-4',
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
    default: 'bg-white hover:bg-gray-50 active:bg-gray-100',
  };

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`absolute ${positionClasses[position]} z-[1000] ${variantClasses[variant]} rounded-full shadow-lg p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
    >
      {icon}
    </button>
  );
};

export default FloatingButton;
