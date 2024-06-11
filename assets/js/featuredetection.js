
(function () {

    const hasWebpSupport = (feature = 'lossy') => {
        return new Promise((resolve, _reject) => {
            var kTestImages = {
                lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
                lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
                alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
                animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
            };

            var img = new Image();
            img.onload = function () {
                var result = (img.width > 0) && (img.height > 0);
                resolve(result);
            };
            img.onerror = function () {
                resolve(false);
            };
            img.src = "data:image/webp;base64," + kTestImages[feature];
        });
    };

    /*
     * Namespace setup
     */
    const spektakel = window.spektakel || {};
    spektakel.featuredetection = (function() {
        return {
            hasWebpSupport,
        }
    })();
    window.spektakel = spektakel;
})();