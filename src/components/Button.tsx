import React from 'react';
import Link from 'next/link';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export default function Button({ children, href, onClick, variant = 'primary', className = '' }: ButtonProps) {
  const btnClass = `${styles.btn} ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={btnClass}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={btnClass}>
      {children}
    </button>
  );
}
