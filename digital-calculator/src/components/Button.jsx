
export default function Button({ children, onClick, className = '' }) {
  return (
    <button
      className={`rounded-full text-xl font-semibold m-1 w-16 h-16 flex items-center justify-center transition bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-800 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
} 