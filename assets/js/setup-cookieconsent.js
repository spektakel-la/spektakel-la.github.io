(function () {
    const setConsent = (consent) => {
        try {
            const consentMode = {
                'functionality_storage': consent.necessary ? 'granted': 'denied',
                'security_storage': consent.necessary ? 'granted': 'denied',
                'ad_storage': consent.analytics ? 'granted': 'denied',
                'ad_personalization': consent.analytics ? 'granted': 'denied',
                'ad_user_data': consent.analytics ? 'granted': 'denied',
                'analytics_storage': consent.analytics ? 'granted': 'denied',
                'personalization_storage': consent.analytics ? 'granted': 'denied',
            };
            gtag('consent', 'update', consentMode);
            localStorage.setItem('consentMode', JSON.stringify(consentMode));

            const consentChangedEvent = new CustomEvent("consentChanged", {
                detail: consent,
                bubbles: true,
                cancelable: true,
                composed: false,
              });
              window.dispatchEvent(consentChangedEvent);
        } catch(_err){}
    }

    /*
     * Namespace setup
     */
    const spektakel = window.spektakel || {};
    spektakel.consent = (function() {
        return {
            setConsent
        }
    })();
    window.spektakel = spektakel;
})();

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
                        name: /^(?!cc_cookie).*/      //regex
                    }
                ],
                reloadPage: true
            }
        }
    },

    onConsent: ({cookie}) => {
        const consent = {
            necessary: CookieConsent.acceptedCategory('necessary'),
            analytics: CookieConsent.acceptedCategory('analytics')
        }
        spektakel.consent.setConsent(consent);
    },

    onChange: ({cookie, changedCategories, changedServices}) => {
        const consent = {
            necessary: CookieConsent.acceptedCategory('necessary'),
            analytics: CookieConsent.acceptedCategory('analytics')
        }
        spektakel.consent.setConsent(consent);
    },

    guiOptions: {
        consentModal: {
            equalWeightButtons: false,
        },
        preferencesModal: {
            equalWeightButtons: false,
        }
    },

    language: {
        default: 'de',
        translations: {
            de: {
                consentModal: {
                    title: 'Wir nutzen Cookies',
                    description: 'Wir verwenden Cookies auf der Website, um Ihren Besuch benutzerfreundlicher zu gestalten. Mit Ihrer Erlaubnis, sammeln wir dabei auch Informationen, wie Sie unser Angebot nutzen.',
                    acceptAllBtn: 'Akzeptieren',
                    acceptNecessaryBtn: 'Ablehnen',
                    showPreferencesBtn: 'Einstellungen'
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
                            description: 'Wir verwenden Cookies auf der Website, um Ihren Besuch benutzerfreundlicher zu gestalten. Mit Ihrer Erlaubnis, sammeln wir dabei auch Informationen, wie Sie unser Angebot nutzen.'
                        },
                        {
                            title: 'Notwendig / Essenziell',
                            description: 'Diese Cookies sind für technische Funktionen der Website erforderlich und können nicht deaktiviert werden.',

                            //this field will generate a toggle linked to the 'necessary' category
                            linkedCategory: 'necessary'
                        },
                        {
                            title: 'Performance / Analytics',
                            description: 'Diese Cookies sammeln Informationen darüber, wie Besucher die Website nutzen. Alle Daten sind annonymisiert und können nicht verwendet werden, um Sie zu identifizieren.',
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
