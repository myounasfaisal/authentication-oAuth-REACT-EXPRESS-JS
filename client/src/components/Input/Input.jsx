import React from 'react';

export default function Input({ type, name, className, placeholder }) {
  return (
    <input
      type={type}
      name={name} // The `name` prop is still required for FormData
      className={className}
      placeholder={placeholder}
    />
  );
}