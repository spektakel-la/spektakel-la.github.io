const FAVORITE_ARTISTS_KEY = 'artistFavorites';

const getArtistFavorites = () => {
    if (localStorage.getItem(FAVORITE_ARTISTS_KEY) === null) {
        return [];
    } else {
        return JSON.parse(localStorage.getItem(FAVORITE_ARTISTS_KEY));
    }
};

const addOrRemove = (arr, item) => arr.includes(item) ? arr.filter(i => i !== item) : [ ...arr, item ];

const toggleArtistFavorite = (artistId) => {
    try {
        const newFavorites = addOrRemove(getArtistFavorites(), artistId)
        localStorage.setItem(FAVORITE_ARTISTS_KEY, JSON.stringify(newFavorites));
    } catch(_err){}
}