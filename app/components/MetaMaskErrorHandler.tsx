'use client';

import { useEffect } from 'react';

/**
 * Component to suppress MetaMask connection errors
 * MetaMask extension automatically injects into all pages,
 * and can throw errors even when not being used
 */
export function MetaMaskErrorHandler() {
  useEffect(() => {
    // Suppress MetaMask connection errors
    const originalError = console.error;
    const originalWarn = console.warn;

    const errorHandler = (...args: any[]) => {
      const errorMessage = args.join(' ');
      
      // Filter out MetaMask-related errors
      if (
        errorMessage.includes('MetaMask') ||
        errorMessage.includes('Failed to connect to MetaMask') ||
        errorMessage.includes('nkbihfbeogaeaoehlefnkodbefgpgknn') ||
        errorMessage.includes('ethereum') ||
        errorMessage.includes('wallet')
      ) {
        // Silently ignore MetaMask errors
        return;
      }
      
      // Allow other errors through
      originalError.apply(console, args);
    };

    const warnHandler = (...args: any[]) => {
      const warnMessage = args.join(' ');
      
      // Filter out MetaMask-related warnings
      if (
        warnMessage.includes('MetaMask') ||
        warnMessage.includes('nkbihfbeogaeaoehlefnkodbefgpgknn')
      ) {
        // Silently ignore MetaMask warnings
        return;
      }
      
      // Allow other warnings through
      originalWarn.apply(console, args);
    };

    // Override console methods
    console.error = errorHandler;
    console.warn = warnHandler;

    // Handle unhandled promise rejections from MetaMask
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || event.reason?.toString() || '';
      
      if (
        errorMessage.includes('MetaMask') ||
        errorMessage.includes('Failed to connect') ||
        errorMessage.includes('nkbihfbeogaeaoehlefnkodbefgpgknn')
      ) {
        event.preventDefault();
        return;
      }
    };

    window.addEventListener('unhandledrejection', rejectionHandler);

    // Cleanup
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, []);

  return null;
}
