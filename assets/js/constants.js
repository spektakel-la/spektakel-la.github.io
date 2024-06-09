---
---

const LOCATIONS = {{ site.locations | jsonify }};
const ARTISTS = {{ site.artists | jsonify }};
const SCHEDULE = {{ site.data.schedule | sort: 'time' | jsonify }};
const MAP_BOUNDS = {{ site.data.settings.offline_map.bounding_rect | jsonify }};
const MARKER_ICON_SIZE = {{ site.data.settings.offline_map.icon_size | jsonify }};
const MARKER_ICON_ANCHOR = {{ site.data.settings.offline_map.icon_anchor | jsonify }};

const DATA_ATTRIBUTE_FAVORITE_TOGGLE = 'data-artist-favorite-toggle';
const CSS_CLASS_NO_FAVORITE = 'fa-star-o';
const CSS_CLASS_FAVORITE = 'fa-star';