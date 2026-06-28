/// <reference types="astro/client" />

type ConsentStatus = 'pending' | 'accepted' | 'declined';

interface Window {
  __gtmLoaded: boolean;
  dataLayer?: Array<Record<string, unknown>>;
  spektakel: {
    consent: {
      getStatus(): ConsentStatus;
      isAnalyticsGranted(): boolean;
      setStatus(status: Exclude<ConsentStatus, 'pending'>): void;
    };
    analytics: {
      track(eventName: string, params?: Record<string, unknown>): void;
    };
  };
}

interface WindowEventMap {
  'spektakel:consent-changed': CustomEvent<{
    status: Exclude<ConsentStatus, 'pending'>;
    analytics: boolean;
  }>;
}
