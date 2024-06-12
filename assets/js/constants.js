---
---

(function () {
    const LOCATIONS = {{ site.locations | jsonify }};
    const ARTISTS = {{ site.artists | jsonify }};
    const SCHEDULE = {{ site.data.schedule | sort: 'time' | jsonify }};
    const MAP_BOUNDS = {{ site.data.settings.offline_map.bounding_rect | jsonify }};
    const MARKER_ICON_SIZE = {{ site.data.settings.offline_map.icon_size | jsonify }};
    const MARKER_ICON_ANCHOR = {{ site.data.settings.offline_map.icon_anchor | jsonify }};

    /*
     * Namespace setup
     */
    const spektakel = window.spektakel || {};
    spektakel.constants = (function() {
        return {
             LOCATIONS,
             ARTISTS,
             SCHEDULE,
             MAP_BOUNDS,
             MARKER_ICON_SIZE,
             MARKER_ICON_ANCHOR,
        }
    })();
    window.spektakel = spektakel;
})();