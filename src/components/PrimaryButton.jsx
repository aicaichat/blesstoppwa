import React from 'react';

/**
 * PrimaryButton – 主按钮，暖橙色。
 */
export default function PrimaryButton({ children, className = '', ...rest }) {
  return (
    <button
      className={`bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded transition ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
} 