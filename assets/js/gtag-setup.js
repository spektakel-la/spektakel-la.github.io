
// window.dataLayer = window.dataLayer || [];
// function gtag() { dataLayer.push(arguments); }

// function getConsentGranted() {
//     try {
//         return localStorage.getItem('consentGranted') || 'false';
//     } catch(_err){}
//     return 'false';
// }

// function setConsentGranted(isGranted) {
//     try {
//         const newValue = isGranted ? 'granted': 'denied';
//         gtag('consent', 'update', {
//             'ad_user_data': newValue,
//             'ad_personalization': newValue,
//             'ad_storage': newValue,
//             'analytics_storage': newValue,
//             // 'wait_for_update': 500,
//         });
//         gtag('config', '{{ site.data.settings.google-tag }}', {
//             'send_page_view': isGranted
//         });
//         localStorage.setItem("consentGranted", `${isGranted}`);
//     } catch(_err){}
// }


// gtag({'gtm.start': new Date().getTime(), 'event': 'gtm.js'});
// setConsentGranted(false);
