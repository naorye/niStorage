window.niStorage = {
    getItem: key => JSON.parse(localStorage.getItem(key)),
    setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value))
}