import React from 'react';
import CookieConsent from './CookieConsent';

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      {children}
      <CookieConsent />
    </>
  );
}