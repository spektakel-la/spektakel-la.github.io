(function () {

    const createIconMarkup = (locationObj) => {
        let label = '';
        if (locationObj.marker_color === 'yellow') {
            label =  `<i class="fa fa-info" aria-hidden="true"></i>`;
        } else {
            label = locationObj?.location_label ? locationObj.location_label : locationObj.location_id
        }
        return `
            <div class="spektakel-leaflet-location-icon-container">
                <div>
                    ${label}
                </div>
            </div>`
    };

    const toggleArtistDetails = (rowElement) => {
        rowElement.classList.toggle('expanded');
        const element = rowElement.nextElementSibling;
        element.classList.toggle('visible');
        element.scrollIntoView({behavior: "smooth", block: "center"});
    };

    const sanityCheckSchedule = () => {
        spektakel.constants.SCHEDULE.forEach((entry) => {
            const locationForEntry = spektakel.constants.LOCATIONS.find((loc) => entry.location_id === loc.location_id);
            if (!locationForEntry) {
                throw new Error(`Schedule entry with invalid location_id: '${JSON.stringify(entry)}'`);
            }
            const artistForEntry = spektakel.constants.ARTISTS.find((art) => entry.artist_id === art.artist_id);
            if (!artistForEntry) {
                throw new Error(`Schedule entry with invalid artist_id: '${JSON.stringify(entry)}'`);
            }
        });
    };

    const createPopupMarkupForLocation = (locationId) => {
        const artistFavorites = spektakel.favorites.getArtistFavorites();

        const scheduleForLocation = spektakel.constants.SCHEDULE.filter((entry) => entry.location_id === locationId);

        /*
         * The schedule is setup with 30 minutes blocks. If an artist acts for 1 hour, he occupies 2 blocks.
         * The user doesn't care about these blocks, so we just remove successive entries with the same artist.
         */
        const prunedScheduleForLocation= scheduleForLocation.reduce((acc, entry) => {
            const maybeLastEntry = acc[acc.length - 1];
            if (maybeLastEntry &&
                maybeLastEntry.artist_id === entry.artist_id &&
                dateFns.differenceInHours(dateFns.parseISO(maybeLastEntry.time), dateFns.parseISO(entry.time)) < 1
            ) {
                return acc;
            } else {
                return [...acc, entry];
            }
        }, []);

        const scheduleForLocationWithArtist = prunedScheduleForLocation.map((entry) => {
            const artist = spektakel.constants.ARTISTS.find((artist) => artist.artist_id === entry.artist_id);
            if (artist){
                entry.artist_name = artist?.short_name ? artist?.short_name : artist?.name;
                entry.artist_categories = artist?.categories;
                entry.artist_image = artist?.image;
                entry.image_position = artist?.image_position;
                return entry;
            } else {
                console.error("Error processing schedule entry");
                console.dir(entry);
            }
        });

        let sectionDateString = null;
        const tableRows = scheduleForLocationWithArtist.map((sched, idx) => {
            const now = new Date();
            const scheduleDate = dateFns.parseISO(sched.time);
            if (now > scheduleDate) {  // ignore old dates
                return '';
            }

            const currentDateString = scheduleDate.toLocaleDateString();
            let maybeDateSection = '';
            if (currentDateString !== now.toLocaleDateString() // don't show date-section for today
                && currentDateString !== sectionDateString) {
                maybeDateSection = `
                    <tr class="day-section">
                        <td colspan="2">
                            <strong>${dateFns.format(scheduleDate, 'EEEE dd.MM.yyyy', { locale: dateFns.locale.de })}</strong>
                        </td>
                    </tr>`;
                sectionDateString = currentDateString;
            }

            return `
                ${maybeDateSection}
                <tr class="schedule-details${artistFavorites.includes(sched.artist_id) ? ' favorite': ''}"
                    data-artist-id="${sched.artist_id}" onclick="spektakel.locations.toggleArtistDetails(this);">
                    <td>
                        <i class="expand-icon fa fa-caret-down" aria-hidden="true"></i>
                        <i class="collapse-icon fa fa-caret-up" aria-hidden="true"></i>
                        &nbsp;${dateFns.format(scheduleDate, 'HH:mm')}
                    </td>
                    <td>
                        <div class="artist-name">
                            <span>${sched.artist_name}</span>
                        </div>
                    </td>
                </tr>
                <tr class="artist-details">
                    <td colspan="2">
                        ${spektakel.popover.createPopoverContentHtml(sched.artist_id)}
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
            <div class="location-title">
                ${locationObj.location_id} - ${locationObj.description}
                </div>
            <div class="location-table-wrapper">
                ${createPopupMarkupForLocation(locationObj.location_id)}
            </div>
        </div>
        `;

    const setupLeafletMap = async (mapContainer) => {
        const map = L.map(mapContainer, {
            minZoom: 16,
            maxZoom: 19,
            maxBounds: spektakel.constants.MAP_BOUNDS,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        map.attributionControl.setPrefix(false)

        const hasWebpSupport = await spektakel.featuredetection.hasWebpSupport();
        const tilesLayer = L.tileLayer(`/assets/img/map/tiles/{z}/{x}/{y}.${hasWebpSupport ? 'webp' : 'jpg'}`,
            { minZoom: 16, maxZoom: 19, tms: false, attribution: '© OpenStreetMap'});
        tilesLayer.addTo(map);

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

        const markers = spektakel.constants.LOCATIONS.map((location) => {
            const markerColor = location.marker_color ? location.marker_color : 'pink';
            const markerIcon = L.divIcon({
            className: `spektakel-leaflet-location-icon-${markerColor}`,
                html: createIconMarkup(location),
                iconSize: spektakel.constants.MARKER_ICON_SIZE,
                iconAnchor: spektakel.constants.MARKER_ICON_ANCHOR
            });

            const [lat, lon] = location.gps;
            const marker = L.marker([lat, lon], {icon: markerIcon});
            marker.bindPopup('', {className: 'spektakel-leaflet-popup', offset: [0, -38]})
                .on("popupopen", (event) => {
                    window.location.hash = `${location.location_id}`;
                    event.popup.setContent(createPopupMarkup(location));
                })
                .on("popupclose", (event) => {
                    window.location.hash = '';
                });
            marker.addTo(map);

            // debug position
            // L.marker([lat, lon]).addTo(map);

            return { marker, location_id: location.location_id };
        });

        map.on('load', () => {
            const hash = window.location.hash.substring(1); // Entfernt das '#' Zeichen
            const targetMarker = markers.find(m => m.location_id === hash);
            if (targetMarker) {
                targetMarker.marker.openPopup();
            }
        });

        map.fitBounds(L.latLngBounds(spektakel.constants.LOCATIONS.map(location => location.gps)));
    }

    /*
     * Namespace setup
     */
    const spektakel = window.spektakel || {};
    spektakel.locations = (function() {
        return {
            toggleArtistDetails,
            sanityCheckSchedule,
            setupLeafletMap
        }
    })();
    window.spektakel = spektakel;
})();