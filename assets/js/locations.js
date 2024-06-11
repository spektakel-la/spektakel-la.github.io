---
---
const createIconMarkup = (locationObj) => `
    <div class="spektakel-leaflet-location-icon-container">
        <div>
            ${locationObj.location_id.toUpperCase()}
        </div>
    </div>
    `;

const toggleArtistDetails = (rowElement) => {
    rowElement.classList.toggle('expanded');
    rowElement.nextElementSibling.classList.toggle('visible');
};

const toggleFavoriteOnLocationTable = (iconElement, event, artistId) => {
    event.stopPropagation();

    // persist favorite-setting in localStorage
    toggleArtistFavorite(artistId);

    // update ui
    const allFavoriteTogglesForArtist = document.querySelectorAll(`i[${DATA_ATTRIBUTE_FAVORITE_TOGGLE}="${artistId}"]`);
    allFavoriteTogglesForArtist.forEach((iconElement) => {
        iconElement.classList.toggle(CSS_CLASS_NO_FAVORITE);
        iconElement.classList.toggle(CSS_CLASS_FAVORITE);
    });
};

const sanityCheckSchedule = () => {
    SCHEDULE.forEach((entry) => {
        const locationForEntry = LOCATIONS.find((loc) => entry.location_id === loc.location_id);
        if (!locationForEntry) {
            throw new Error(`Schedule entry with invalid location_id: '${JSON.stringify(entry)}'`);
        }
        const artistForEntry = ARTISTS.find((art) => entry.artist_id === art.artist_id);
        if (!artistForEntry) {
            throw new Error(`Schedule entry with invalid artist_id: '${JSON.stringify(entry)}'`);
        }
    });
};

const createScheduleMarkupForLocation = (locationId) => {
    const scheduleForLocation = SCHEDULE.filter((entry) => entry.location_id === locationId);
    const scheduleForLocationWithArtist = scheduleForLocation.map((entry) => {
        const artist = ARTISTS.find((artist) => artist.artist_id === entry.artist_id);
        if (artist){
            entry.artist_name = artist?.name;
            entry.artist_categories = artist?.categories;
            entry.artist_image = artist?.image;
            entry.image_position = artist?.image_position;
            return entry;
        } else {
            console.error("Error processing schedule entry");
            console.dir(entry);
        }
    });

    const artistFavorites = getArtistFavorites();
    let sectionDateString = null;
    const tableRows = scheduleForLocationWithArtist.map((sched, idx) => {
        const now = new Date();
        const scheduleDate = dateFns.fp.parseISO(sched.time);
        if (now > scheduleDate) {  // ignore old dates
            return '';
        }

        const currentDateString = scheduleDate.toLocaleDateString();
        let maybeDateSection = '';
        if (currentDateString !== now.toLocaleDateString() // don't show date-section for today
            && currentDateString !== sectionDateString) {
            maybeDateSection = `
                <tr class="day-section">
                    <td colspan="2">${currentDateString}</td>
                </tr>`;
            sectionDateString = currentDateString;
        }
        return `
            ${maybeDateSection}
            <tr class="schedule-details" onclick="toggleArtistDetails(this);">
                <td>
                    <i class="expand-icon fa fa-caret-down" aria-hidden="true"></i>
                    <i class="collapse-icon fa fa-caret-up" aria-hidden="true"></i>
                    &nbsp;${scheduleDate.toLocaleTimeString()}
                </td>
                <td>
                    <div class="artist-and-favorite-toggle">
                        <span>${sched.artist_name}</span>
                        <i class="favorite-toggle fa ${artistFavorites.includes(sched.artist_id) ? CSS_CLASS_FAVORITE : CSS_CLASS_NO_FAVORITE}"
                        aria-hidden="true"
                        ${DATA_ATTRIBUTE_FAVORITE_TOGGLE}="${sched.artist_id}"
                        onclick="toggleFavoriteOnLocationTable(this, event, '${sched.artist_id}');"></i>
                    </div>
                </td>
            </tr>
            <tr class="artist-details">
                <td colspan="2">
                    <div>
                        <!--
                            <div class="artist-details-categories">
                                ${sched.artist_categories.join(', ')}
                            </div>
                        -->
                        <div class="artist-details-image">
                            <img
                                src="${sched.artist_image}"
                                alt="${sched.artist_name}"
                                class="custom-position-${sched.image_position ? sched.image_position : 'center'}"/>
                        </div>
                        <div class="artist-details-link">
                            <a href="/artists#${sched.artist_id}">Zum Künstlerprofil</a>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('\n');

    if(!tableRows){
        return '';
    } else {
        return `
            <table>
                <tr class="sticky">
                    <th class="schedule-time">Zeit</th>
                    <th>Künstler</th>
                </tr>
                ${tableRows}
            </table>
            `;
    }
}

const createPopupMarkup = (locationObj) => `
    <div class="leaflet-popup-content">
        <div class="location-title">Location ${locationObj.location_id.toUpperCase()} - ${locationObj.description}</div>
        <div class="location-table-wrapper">
            ${createScheduleMarkupForLocation(locationObj.location_id)}
        </div>
    </div>
    `;

const setupLeafletMap = (mapContainer) => {
    const map = L.map(mapContainer, {
        minZoom: 16,
        maxZoom: 19,
        maxBounds: MAP_BOUNDS,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    map.attributionControl.setPrefix(false)

    const imageUrl = '/assets/img/map/map.webp';
    const imageLayer = L.imageOverlay(imageUrl, MAP_BOUNDS);
    imageLayer.addTo(map);

    const geoLocation = L.control.locate({
        strings: {
            title: "Zeig mir wo ich bin",
            metersUnit: "Meter",
            feetUnit: "Fuß",
            popup: "Du befindest dich innerhalb {distance} {unit} von diesem Punkt",
            outsideMapBoundsMsg: "Du scheinst Dich außerhalb der verfügbaren Kartenregion zu befinden"
        }
    });
    geoLocation.addTo(map);

    const fullScreen = L.control
    .fullscreen({
        position: 'topright',
        forceSeparateButton: true,
    });
    fullScreen.addTo(map);

    const clusterGroup = L.markerClusterGroup();
    clusterGroup.addTo(map);

    LOCATIONS.forEach((location) => {
        const markerIcon = L.divIcon({
        className: 'spektakel-leaflet-location-icon',
            html: createIconMarkup(location),
            iconSize: MARKER_ICON_SIZE,
            iconAnchor: MARKER_ICON_ANCHOR
        });
        const [lat, lon] = location.gps;
        const marker = L.marker([lat, lon], {icon: markerIcon});
        marker.bindPopup('', {className: 'spektakel-leaflet-popup'})
            .on("popupopen", function (event) {
                // Dynamically create the content on `popupopen`-event
                event.popup.setContent(createPopupMarkup(location))
            });
        clusterGroup.addLayer(marker);

        // debug position
        // L.marker([lat, lon]).addTo(map);
    });

    map.fitBounds(L.latLngBounds(LOCATIONS.map(location => location.gps)));

}