import { 
  siVisa, 
  siMastercard, 
  siAmericanexpress, 
  siDiscover, 
  siJcb
} from 'simple-icons';

interface CardIconProps {
  brand: string;
  className?: string;
}

export function CardIcon({ brand, className = "h-6 w-auto" }: CardIconProps) {
  // Normalize brand names and map to Simple Icons data
  const brandMap: { [key: string]: { path: string, name: string } } = {
    'visa': { ...siVisa, name: 'Visa' },
    'mastercard': { ...siMastercard, name: 'Mastercard' },
    'amex': { ...siAmericanexpress, name: 'American Express' },
    'american express': { ...siAmericanexpress, name: 'American Express' },
    'discover': { ...siDiscover, name: 'Discover' },
    'jcb': { ...siJcb, name: 'JCB' }
  };

  const normalizedBrand = brand.toLowerCase();
  const iconData = brandMap[normalizedBrand] || { ...siVisa, name: 'Credit Card' };
  const cardName = iconData.name || 'Credit Card';

  return (
    <svg 
      className={className}
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`${cardName} card`}
    >
      <title>{cardName}</title>
      <path d={iconData.path} />
    </svg>
  );
} 