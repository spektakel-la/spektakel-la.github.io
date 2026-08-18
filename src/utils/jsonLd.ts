import { festival } from '../data/festival';

type GeoPoint = readonly [number, number];

type FestivalEventInput = {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  url: string;
  performer: Record<string, unknown>;
  image?: string;
  duration?: string;
  location?: {
    name: string;
    gps: GeoPoint;
  };
};

function normalizeDescription(description?: string): string | undefined {
  const normalized = description?.replace(/\s+/g, ' ').trim();
  return normalized || undefined;
}

export function createPostalAddress(): Record<string, unknown> {
  return {
    '@type': 'PostalAddress',
    addressLocality: festival.addressLocality,
    addressCountry: festival.addressCountry,
  };
}

export function createOffer(url: string): Record<string, unknown> {
  return {
    '@type': 'Offer',
    price: festival.admissionPrice,
    priceCurrency: festival.currency,
    url,
    validFrom: festival.startDate,
    availability: 'https://schema.org/InStock',
  };
}

export function createPlace(name: string, gps?: GeoPoint): Record<string, unknown> {
  const place: Record<string, unknown> = {
    '@type': 'Place',
    name,
    address: createPostalAddress(),
  };
  if (gps) {
    place.geo = {
      '@type': 'GeoCoordinates',
      latitude: gps[0],
      longitude: gps[1],
    };
  }
  return place;
}

export function createOrganizer(): Record<string, unknown> {
  return {
    '@type': 'Organization',
    name: festival.organizerName,
    url: festival.siteUrl,
  };
}

export function createFestivalEvent(input: FestivalEventInput): Record<string, unknown> {
  const description = normalizeDescription(input.description);
  const eventObj: Record<string, unknown> = {
    '@type': 'Event',
    name: input.name,
    startDate: input.startDate,
    endDate: input.endDate,
    url: input.url,
    performer: input.performer,
    organizer: createOrganizer(),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    offers: createOffer(input.url),
  };
  if (description) eventObj.description = description;
  if (input.image) eventObj.image = input.image;
  if (input.duration) eventObj.duration = input.duration;
  if (input.location) eventObj.location = createPlace(input.location.name, input.location.gps);
  return eventObj;
}
