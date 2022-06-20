# niStorage

## Running locally

`npm run serve` will create local server under port 3000

## Usage

1. Open a website and inject the followint installation script:

```
window.addEventListener('DOMContentLoaded', (event) => {
    const t = document.createElement("script");
    t.src = "http://localhost:3000/launcher.js", document.body.appendChild(t);
    t.addEventListener('load', async (event) => {
        if (window.niStorage) {
            await window.niStorage.ready;
            // can use storage
        }
    })
}
```

2. To store data:

```
const data = ...
window.niStorage.setItem('someKey', data)
```

3. To read data:

```
window.niStorage.getItem('someKey').then(value => console.log(value));
```
