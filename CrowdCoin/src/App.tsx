import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PrivyProvider } from '@privy-io/react-auth';
import AppRoutes from '@/routes';
import Header from '@/components/layout/Header';

const PRIVY_APP_ID = 'your-privy-app-id'; // Replace with your Privy app ID

function App() {
  return (
     <PrivyProvider
            appId="cm2ybyp0a02n1nfhbmctt21qc" // Replace with your actual Privy app ID
            config={{
              loginMethods: ['email', 'wallet', 'google'],
            }}
          >
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
          <Header />
          <main className="container mx-auto px-4 pt-20 pb-8">
            <AppRoutes />
          </main>
          <Toaster position="bottom-right" />
        </div>
      </BrowserRouter>
    </PrivyProvider>
  );
}

export default App;