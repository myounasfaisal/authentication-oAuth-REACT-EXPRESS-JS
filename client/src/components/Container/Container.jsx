import React from 'react';

export default function Container({ children }) {
  return <div className="container mx-auto max-w-[600px] w-[80%] p-4">{children}</div>;
}