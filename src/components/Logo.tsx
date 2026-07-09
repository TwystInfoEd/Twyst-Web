import Image from 'next/image';

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src='/logo_v3.svg'
      alt='logo'
      width={80}
      height={80}
      priority
      className={className}
    />
  );
}
