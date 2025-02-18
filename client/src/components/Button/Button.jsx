import React from 'react';

function Button({ children, color, onClick, className = "", ...props }) {
  let buttonColor = "bg-blue-500 text-white rounded hover:bg-blue-600"; // Default color

  if (color === "white") {
    buttonColor = "bg-white text-blue-500 border border-blue-500 rounded hover:bg-gray-100";
  }

  return (
    <button
      onClick={onClick}
      className={`${buttonColor} ${className}  px-4 py-2 cursor-pointer`}
      {...props} 
    >
      {children}
    </button>
  );
}

export default Button;
