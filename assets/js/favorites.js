(function () {
  const FAVORITE_ARTISTS_KEY = "artistFavorites";
  const FAVORITE_EVENT_KEY = "eventFavorites";

  const _getFavorites = (storageKey) => {
    if (localStorage.getItem(storageKey) == null) {
      return [];
    } else {
      return JSON.parse(localStorage.getItem(storageKey));
    }
  };

  const _addOrRemove = (arr, item) =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const _toggleFavorite = (storageKey, itemKey, lang) => {
    try {
      const oldFavorites = _getFavorites(storageKey);
      const newFavorites = _addOrRemove(oldFavorites, itemKey);
      localStorage.setItem(storageKey, JSON.stringify(newFavorites));

      const favoriteWasAdded = newFavorites.length > oldFavorites.length;

      const favoritesChangedEvent = new CustomEvent("favoritesChanged", {
        detail: newFavorites,
        bubbles: true,
        cancelable: true,
        composed: false,
      });
      window.dispatchEvent(favoritesChangedEvent);

      let message;
      message = favoriteWasAdded
        ? lang === "de"
          ? "Künstler wird in Spielplänen hervorgehoben."
          : "Artist will be highlighted in schedules."
        : lang === "de"
        ? "Künstler aus Favoriten entfernt."
        : "Artist removed from favorites.";

      Toast.fire({
        icon: favoriteWasAdded ? "success" : "info",
        title: message,
      });
    } catch (_err) {}
  };

  const getArtistFavorites = () => {
    return _getFavorites(FAVORITE_ARTISTS_KEY);
  };

  const toggleArtistFavorite = (artistId, lang) => {
    _toggleFavorite(FAVORITE_ARTISTS_KEY, artistId, lang);
  };

  const getEventFavorites = () => {
    return _getFavorites(FAVORITE_EVENT_KEY);
  };

  const toggleEventFavorite = (eventId) => {
    _toggleFavorite(FAVORITE_EVENT_KEY, eventId);
  };

  /*
   * Namespace setup
   */
  const spektakel = window.spektakel || {};
  spektakel.favorites = (function () {
    return {
      getArtistFavorites,
      toggleArtistFavorite,
      getEventFavorites,
      toggleEventFavorite,
    };
  })();
  window.spektakel = spektakel;
})();
