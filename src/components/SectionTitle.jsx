import React from 'react';

export default function SectionTitle({ children }) {
  return (
    <h2 className="text-2xl md:text-3xl font-semibold text-orange-600 border-b-2 border-orange-500 inline-block mb-6">
      {children}
    </h2>
  );
} 