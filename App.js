import React from 'react';
import Navigaters from './src/Navigaters';
import AuthProvider from './src/context/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <Navigaters />
    </AuthProvider>
  );
}
