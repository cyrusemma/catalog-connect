import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Admin pages
const Dashboard = () => <div className="p-8">Dashboard Analytics</div>;
const Products = () => <div className="p-8">Product Management</div>;
const Orders = () => <div className="p-8">Order Management</div>;
const Settings = () => <div className="p-8">Store Settings</div>;
const Login = () => <div className="p-8">Admin Login</div>;

export default function AdminApp() {
  const isAuthenticated = false; // TODO: Check auth

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/admin">
        <Routes>
          <Route path="/login" element={<Login />} />
          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
