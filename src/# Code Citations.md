# Code Citations

## License: unknown
https://github.com/benkaiser/pages-pastebin/tree/2ffc2badd98b068897b05aa93b487380134dd9c6/script.js

```
= file =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
```


## License: unknown
https://github.com/nongtee7559/nipa_assignment/tree/8368d212297d47b1ac8d423147284970d89d0ddb/src/App.js

```
) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
```

