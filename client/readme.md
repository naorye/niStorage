## Runnint locally

`npm run serve` will create local server under port 3000

## Usage

1. Open a website and inject the followint installation script:

```
function install(){const t=document.createElement("script");t.src="http://localhost:3000/launcher.js",document.body.append(t)}install();
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
