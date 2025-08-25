import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { CartProvider } from '../contexts/CartContext';
import AuthModal from './auth/AuthModal';
import CartDrawer from './cart/CartDrawer';
import PathDebug from '../dev/PathDebug';


const Layout: React.FC = () => {
  return (
    <CartProvider>
      <>
        <Header />
        <PathDebug />
        <main dir="rtl">
          <Outlet />
        </main>
        <Footer />
        <AuthModal />
        <CartDrawer />
      </>
    </CartProvider>
  );
};

export default Layout;