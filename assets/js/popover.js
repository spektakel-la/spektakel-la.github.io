(function () {

    const createPopoverContentImageHtml = (artist) => {
        const artistImageWebp = artist.image;
        if (artistImageWebp) {
            const artistImageJpg = artistImageWebp.replace('.webp', '.jpg');
            return `
                <picture>
                    <source srcset="${artistImageWebp}" type="image/webp">
                    <source srcset="${artistImageJpg}" type="image/png">
                    <img src="${artistImageJpg}"
                        alt="${artist.name}"
                        class="custom-position-${artist.image_position ? artist.image_position : 'center'}">
                </picture>
            `;
        } else {
            return '';
        }
    };

    const createPopoverContentCategoryHtml = (artist) => {
        if (!artist.categories) {
            return '';
        }
        return `(${artist.categories.join(', ')})`;
    }

    const createPopoverContentHtml = (artistId) => {
        const artist = spektakel.constants.ARTISTS.find(a => a.artist_id === artistId);
        const artistFavorites = spektakel.favorites.getArtistFavorites();

        if(!artist) {
            return '';
        } else {
            return `
                <div class="popover-artist-details">
                    <div class="popover-artist-details-image">
                        ${createPopoverContentImageHtml(artist)}
                    </div>
                    <div class="popover-artist-details-category">
                        ${createPopoverContentCategoryHtml(artist)}
                    </div>
                    <div class="popover-artist-details-link">
                        <a href="/artists#${artistId}">Zum Künstlerprofil</a>
                        <span></span>
                        <i class="favorite-toggle fa ${artistFavorites.includes(artistId) ?
                                                        'fa-star' :
                                                        'fa-star-o'}"
                        aria-hidden="true"
                        data-artist-id="${artistId}"
                        onclick="spektakel.favorites.toggleArtistFavorite('${artistId}');"></i>
                    </div>
                </div>
            `;
        }
    };

    /*
     * Namespace setup
     */
    const spektakel = window.spektakel || {};
    spektakel.popover = (function() {
        return {
            createPopoverContentHtml,
        }
    })();
    window.spektakel = spektakel;
})();