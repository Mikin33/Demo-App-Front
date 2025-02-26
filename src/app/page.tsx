'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <header className="w-full max-w-4xl flex justify-between items-center py-6">
        <h1 className="text-3xl font-bold text-gray-800">MyShop</h1>
        <nav className="flex gap-4">
          <Button onClick={() => router.push('/register')} className="bg-blue-500 text-white px-4 py-2 rounded">
            Register
          </Button>
          <Button onClick={() => router.push('/login')} className="bg-gray-700 text-white px-4 py-2 rounded">
            Login
          </Button>
        </nav>
      </header>

      <main className="text-center mt-16 max-w-2xl">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome to MyShop</h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover the best products at unbeatable prices. Sign up now and start shopping!
        </p>
      </main>

      <footer className="absolute bottom-6 text-gray-500">
        &copy; {new Date().getFullYear()} MyShop. All rights reserved.
      </footer>
    </div>
  );
}
