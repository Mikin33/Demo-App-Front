"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/redux/store";
import { io, Socket } from "socket.io-client";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppDispatch } from "@/redux/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

// Socket.IO Listener Component
const SocketListener: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const socket: Socket = io("http://localhost:4000"); // Connect to backend

    socket.on("productUpdated", (updatedProducts: Product[]) => {
      console.log("productUpdated",updatedProducts);
      // dispatch(updateProducts(updatedProducts)); // Update Redux state
      toast.info("Product stock updated!", { autoClose: 2000 }); // Show notification
    });

    return () => {
      socket.disconnect(); // Cleanup on unmount
    };
  }, [dispatch]);

  return null; // No UI, just handling socket events
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <SocketListener /> {/* Global Socket.IO listener */}
          <ToastContainer /> {/* Global Toast Notifications */}
          {children}
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
