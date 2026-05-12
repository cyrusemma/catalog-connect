import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Placeholder pages
const Home = () => <div className="p-8">Home Page</div>;
const Shop = () => <div className="p-8">Shop Page</div>;
const Product = () => <div className="p-8">Product Page</div>;
const Cart = () => <div className="p-8">Cart Page</div>;
const Wishlist = () => <div className="p-8">Wishlist Page</div>;
const Checkout = () => <div className="p-8">Checkout Page</div>;
const NotFound = () => <div className="p-8">404 - Page Not Found</div>;

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
