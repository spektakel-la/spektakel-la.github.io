import { festival } from '../data/festival';

type GeoPoint = readonly [number, number];

const SCHEMA_DATE_LOCALE = 'de-DE-u-nu-latn';
const SCHEMA_TIME_ZONE = 'Europe/Berlin';

type FestivalEventInput = {
  id?: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  url: string;
  performer: Record<string, unknown>;
  image?: string;
  duration?: string;
  location?: {
    id?: string;
    name: string;
    gps: GeoPoint;
    url?: string;
    containedInPlace?: Record<string, unknown>;
  };
};

function normalizeDescription(description?: string): string | undefined {
  const normalized = description?.replace(/\s+/g, ' ').trim();
  return normalized || undefined;
}

export function formatSchemaDateTime(date: Date): string {
  const parts = new Intl.DateTimeFormat(SCHEMA_DATE_LOCALE, {
    timeZone: SCHEMA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'shortOffset',
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes): string => parts.find((part) => part.type === type)?.value ?? '';
  const offsetMatch = value('timeZoneName').match(/^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/);
  const offset = offsetMatch
    ? `${offsetMatch[1]}${offsetMatch[2].padStart(2, '0')}:${offsetMatch[3] ?? '00'}`
    : '+01:00';

  return `${value('year')}-${value('month')}-${value('day')}T${value('hour')}:${value('minute')}:${value('second')}${offset}`;
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

export function createPlace(
  name: string,
  gps?: GeoPoint,
  options: { id?: string; url?: string; containedInPlace?: Record<string, unknown> } = {},
): Record<string, unknown> {
  const place: Record<string, unknown> = {
    '@type': 'Place',
    name,
    address: createPostalAddress(),
  };
  if (options.id) place['@id'] = options.id;
  if (options.url) place.url = options.url;
  if (options.containedInPlace) place.containedInPlace = options.containedInPlace;
  if (gps) {
    place.geo = {
      '@type': 'GeoCoordinates',
      latitude: gps[0],
      longitude: gps[1],
    };
  }
  return place;
}

export function createFestivalLocationPlace(locationsUrl: string): Record<string, unknown> {
  return createPlace(festival.locationName, undefined, {
    id: `${locationsUrl}#place-altstadt-landshut`,
    url: locationsUrl,
  });
}

export function createOrganizer(): Record<string, unknown> {
  return {
    '@type': 'Organization',
    '@id': `${festival.siteUrl}/#organization`,
    name: festival.organizerName,
    url: festival.siteUrl,
    logo: `${festival.siteUrl}/assets/img/logo/logo.webp`,
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
    isAccessibleForFree: festival.admissionPrice === 0,
  };
  if (input.id) eventObj['@id'] = input.id;
  if (description) eventObj.description = description;
  if (input.image) eventObj.image = input.image;
  if (input.duration) eventObj.duration = input.duration;
  if (input.location) {
    eventObj.location = createPlace(input.location.name, input.location.gps, {
      id: input.location.id,
      url: input.location.url,
      containedInPlace: input.location.containedInPlace,
    });
  }
  return eventObj;
}
