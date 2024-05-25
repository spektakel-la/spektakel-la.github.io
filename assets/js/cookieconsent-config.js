/**
 * All config. options available here:
 * https://cookieconsent.orestbida.com/reference/configuration-reference.html
 */
CookieConsent.run({

    categories: {
        necessary: {
            enabled: true,  // this category is enabled by default
            readOnly: true  // this category cannot be disabled
        },
        analytics: {
            readOnly: false,
            autoClear: {
                cookies: [
                    {
                        name: /^(_ga)/      //regex
                    }
                ]
            }
        }
    },

    onConsent: ({cookie}) => {
        const analyticsEnabled = CookieConsent.acceptedCategory('analytics');
        setConsentGranted(analyticsEnabled);
    },

    onChange: ({cookie, changedCategories, changedServices}) => {
        const analyticsEnabled = CookieConsent.acceptedCategory('analytics');
        setConsentGranted(analyticsEnabled);
    },

    language: {
        default: 'de',
        translations: {
            de: {
                consentModal: {
                    title: 'Wir nutzen Cookies',
                    description: 'Wir verwenden Cookies auf der Website, um Ihren Besuch benutzerfreundlicher zu gestalten. Darüber hinaus sammeln wir auch Informationen, wie die Besucher unser Angebot nutzen.',
                    acceptAllBtn: 'Akzeptieren',
                    acceptNecessaryBtn: 'Ablehnen',
                    showPreferencesBtn: 'Präferenzen einstellen'
                },
                preferencesModal: {
                    title: 'Cookie Präferenzen',
                    acceptAllBtn: 'Alle annehmen',
                    acceptNecessaryBtn: 'Nur notwendige',
                    savePreferencesBtn: 'Auswahl speichern',
                    closeIconLabel: 'Schließen',
                    sections: [
                        {
                            title: 'Warum verwenden wir Cookies?',
                            description: 'Wir verwenden Cookies auf der Website, um Ihren Besuch benutzerfreundlicher zu gestalten. Darüber hinaus sammeln wir auch Informationen, wie die Besucher unser Angebot nutzen.'
                        },
                        {
                            title: 'Notwendig / Essenziell',
                            description: 'Diese Cookies sind für technische Funktionen der Website erforderlich und können nicht deaktiviert werden.',

                            //this field will generate a toggle linked to the 'necessary' category
                            linkedCategory: 'necessary'
                        },
                        {
                            title: 'Performance / Analytics',
                            description: 'Diese Cookies sammeln Informationen darüber, wie unsere Besucher die Website nutzen. Alle Daten sind annonymisiert und können nicht verwendet werden, um Sie zu identifizieren.',
                            linkedCategory: 'analytics'
                        },
                        {
                            title: 'Mehr Informationen',
                            description: 'Für Anfragen bezüglich unserer Cookie-Regeln, wenden Sie sich gerne <a href="/impressum">per Email an uns</a>.'
                        }
                    ]
                }
            }
        }
    }
});