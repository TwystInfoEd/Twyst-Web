import Image from 'next/image';

export default function Maimuta({ className }: { className?: string }) {
  return (
    <Image
      src='/maimuta.svg'
      alt='maimuta'
      width={150}
      height={150}
      priority
      className={className}
    />
  );
}
