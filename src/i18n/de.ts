export const de = {
  nav: {
    program: 'Programm',
    artists: 'Künstler',
    locations: 'Spielorte',
    gallery: 'Galerie',
    info: 'Infos',
    nightlife: 'Nightlife',
  },
  common: {
    all: 'Alle',
    loadMore: 'Mehr anzeigen',
    back: '← Zurück',
    backArtists: '← Zurück zur Künstlerübersicht',
    search: 'Künstler suchen…',
    allCategories: 'Alle Kategorien',
    allLocations: 'Alle Spielorte',
    sortAZ: 'A–Z',
    favorite: 'Merken',
    favorited: 'Gemerkt',
    filter: 'Filter',
    reset: 'Zurücksetzen',
    apply: 'Anwenden',
    moreImages: 'Mehr Bilder ansehen →',
    toProgram: 'Im Programm ansehen →',
    viewProgram: 'Zum Programm',
    disclaimer: 'Änderungen vorbehalten.',
    hutAct: 'Künstler spielen für den Hut!',
  },
  program: {
    title: 'Spielplan',
    friday: 'Freitag',
    saturday: 'Samstag',
    sunday: 'Sonntag',
    tableView: 'Tabellen-Ansicht',
    listView: 'Listen-Ansicht',
  },
  artists: {
    title: 'Alle Künstler auf einen Blick',
    tagline:
      'Entdecke die Artistik, die Musik, die Magie und die verrückten Talente, die Landshut zum Staunen bringen.',
  },
  locations: {
    title: 'Spielorte',
  },
  gallery: {
    title: 'Impressionen',
  },
  nightlife: {
    title: 'Nightlife',
  },
  info: {
    title: 'Festival-Infos',
  },
  footer: {
    about: 'Über uns',
    sponsors: 'Sponsoren',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
  },
  cookie: {
    message: 'Wir verwenden Cookies und Google Tag Manager, um diese Website zu verbessern.',
    accept: 'Akzeptieren',
    decline: 'Ablehnen',
    details: 'Details',
  },
} as const;

export type TranslationKey = typeof de;
