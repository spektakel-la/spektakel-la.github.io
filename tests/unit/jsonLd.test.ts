import { createFestivalEvent, createOffer } from '@utils/jsonLd';
import { describe, expect, it } from 'vitest';
import { festival } from '../../src/data/festival';

describe('JSON-LD Offers', () => {
  it('enthält die für Google Event Enhancements empfohlenen Offer-Felder', () => {
    const offer = createOffer('https://spektakel.la/program/#event-test', 'Kostenfreie Straßenshow.');

    expect(offer).toEqual(expect.objectContaining({
      '@type': 'Offer',
      name: `Freier Eintritt - ${festival.name}`,
      description: 'Kostenfreie Straßenshow.',
      price: 0,
      priceCurrency: 'EUR',
      url: 'https://spektakel.la/program/#event-test',
      validFrom: festival.liveStart,
      availability: 'https://schema.org/InStock',
    }));
    expect(offer.validFrom).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
  });

  it('übernimmt die Event-Beschreibung in das Offer', () => {
    const event = createFestivalEvent({
      name: 'Test Show',
      description: '  Eine Testshow mit freiem Eintritt.  ',
      startDate: '2026-09-18T17:00:00+02:00',
      endDate: '2026-09-18T18:00:00+02:00',
      url: 'https://spektakel.la/program/#event-test',
      performer: {
        '@type': 'PerformingGroup',
        name: 'Test Artist',
      },
    });

    expect(event.description).toBe('Eine Testshow mit freiem Eintritt.');
    expect(event.offers).toEqual(expect.objectContaining({
      description: 'Eine Testshow mit freiem Eintritt.',
      validFrom: festival.liveStart,
    }));
  });
});
