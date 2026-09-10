import { describe, expect, it } from 'vitest';
import { formatLocationLabel, splitLocationLabel } from '@utils/locations';

describe('Spielort-Labels', () => {
  it('stellt die zentrale Spielortnummer vor den Namen', () => {
    expect(formatLocationLabel('1', 'Jungheinrich Bühne')).toBe('1\u00a0–\u00a0Jungheinrich Bühne');
  });

  it('berücksichtigt ein abweichendes Kartenlabel', () => {
    expect(formatLocationLabel('i1', 'Hauptinformation', 'i')).toBe('i\u00a0–\u00a0Hauptinformation');
  });

  it('hält Nummer und erstes Wort für schmale Tabellenköpfe zusammen', () => {
    expect(splitLocationLabel('1', 'Jungheinrich Bühne')).toEqual({
      nonBreakingPrefix: '1\u00a0–\u00a0Jungheinrich',
      remainder: 'Bühne',
      breakAtSlash: false,
    });
  });

  it('erhält bei zusammengesetzten Ortsnamen den Umbruch nach dem Schrägstrich', () => {
    expect(splitLocationLabel('9', 'Altstadt/Theaterstraße')).toEqual({
      nonBreakingPrefix: '9\u00a0–\u00a0Altstadt/',
      remainder: 'Theaterstraße',
      breakAtSlash: true,
    });
  });
});
