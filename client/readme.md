# niStorage

## Running locally

`npm run serve` will create local server under port 3000

## Usage

1. Open a website and inject the followint installation script:

```
function install(){const t=document.createElement("script");t.src="http://localhost:3000/launcher.js",document.body.append(t)}install();
```

2. Wait for niStorage to be ready:

```
const niStoragePromise = new Promise(resolve => {
    document.addEventListener('niStorage:ready', function(event) {
        // Ready to use niStorage
        const niStorage = event.detail;
        resolve(niStorage)
    });
});
..
..
..
const niStorage = await niStoragePromise;
...
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

## Example

```
async function start() {
    const niStoragePromise = new Promise(resolve => {
        document.addEventListener('niStorage:ready', function(event) {
            // Ready to use niStorage
            const niStorage = event.detail;
            resolve(niStorage)
        });
    });
    const niStorage = await niStoragePromise;

    const data = {hello: 'world'};
    niStorage.setItem('hello', data);

    setTimeout(() => {
        window.niStorage.getItem('hello').then(value => console.log(value));
    }, 5000);
}

start();
```
