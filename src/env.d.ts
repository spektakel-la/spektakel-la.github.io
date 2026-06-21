/// <reference types="astro/client" />

type ConsentStatus = 'pending' | 'accepted' | 'declined';

interface Window {
  __gtmLoaded: boolean;
  spektakel: {
    consent: {
      getStatus(): ConsentStatus;
      isAnalyticsGranted(): boolean;
      setStatus(status: Exclude<ConsentStatus, 'pending'>): void;
    };
  };
}

interface WindowEventMap {
  'spektakel:consent-changed': CustomEvent<{
    status: Exclude<ConsentStatus, 'pending'>;
    analytics: boolean;
  }>;
}
