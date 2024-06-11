const FAVORITE_ARTISTS_KEY = 'artistFavorites';
const FAVORITE_EVENT_KEY = 'eventFavorites';

const _getFavorites = (storageKey) => {
    if (localStorage.getItem(storageKey) == null) {
        return [];
    } else {
        return JSON.parse(localStorage.getItem(storageKey));
    }
};

const _addOrRemove = (arr, item) => arr.includes(item) ? arr.filter(i => i !== item) : [ ...arr, item ];

const _toggleFavorite = (storageKey, itemKey) => {
    try {
        const newFavorites = _addOrRemove(_getFavorites(storageKey), itemKey)
        localStorage.setItem(storageKey, JSON.stringify(newFavorites));
    } catch(_err){}
}


const getArtistFavorites = () => {
    return _getFavorites(FAVORITE_ARTISTS_KEY);
};

const toggleArtistFavorite = (artistId) => {
    _toggleFavorite(FAVORITE_ARTISTS_KEY, artistId);
}

const getEventFavorites = () => {
    return _getFavorites(FAVORITE_EVENT_KEY);
};

const toggleEvemtFavorite = (eventId) => {
    _toggleFavorite(FAVORITE_EVENT_KEY, eventId);
}