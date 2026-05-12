import React from 'react';

// Button component
export const Button = React.forwardRef<HTMLButtonElement, any>(
  ({ children, variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    const baseStyles =
      'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variants = {
      primary: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    };
    const sizes = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

// Card component
export const Card = React.forwardRef<HTMLDivElement, any>(
  ({ children, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

// Input component
export const Input = React.forwardRef<HTMLInputElement, any>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col">
      {label && <label className="mb-2 text-sm font-medium">{label}</label>}
      <input
        ref={ref}
        className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <span className="mt-1 text-sm text-red-500">{error}</span>}
    </div>
  )
);

// Product Card component
export const ProductCard = ({ product, onAddCart, onWishlist }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
    <img
      src={product.main_image_url}
      alt={product.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h3 className="font-semibold line-clamp-2">{product.title}</h3>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xl font-bold">GHS {product.selling_price}</span>
        {product.discount_price && (
          <span className="text-sm line-through text-gray-500">GHS {product.discount_price}</span>
        )}
      </div>
      {product.rating && (
        <div className="flex items-center gap-1 mt-2">
          <span className="text-yellow-500">★</span>
          <span className="text-sm">{product.rating} ({product.rating_count})</span>
        </div>
      )}
      <div className="flex gap-2 mt-4">
        <Button
          size="sm"
          variant="primary"
          className="flex-1"
          onClick={() => onAddCart(product)}
        >
          Add to Cart
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onWishlist(product.id)}
        >
          ♡
        </Button>
      </div>
    </div>
  </div>
);

// Modal component
export const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Loading skeleton
export const Skeleton = ({ className = '' }: any) => (
  <div
    className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}
  />
);

// Toast notification
export const Toast = ({ message, type = 'info' }: any) => {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg`}>
      {message}
    </div>
  );
};
