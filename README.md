# algorithms canvas

This library visualizes well-known algorithms from computer science.

## 👀 Demo

Take a look: https://dnagel.de/projects/algorithms


## 🔧 Getting started

> ⚠️ node and npm need to be installed, tested with node v21.7.3, v24.3.0 and v24.4.0.

Install package with npm:

```
npm install @dnagel/algorithms-canvas
```

Use as you like:

### ✅ Option 1: Use `import` in an ESM project

For modern projects (e.g., with TypeScript, Vite, Astro, Next.js), you can import the ESM build as usual:

```ts
import { run } from '@dnagel/algorithms-canvas';

run({
  containerId: 'canvas',
  selectedAlgorithm: 'quicksort'
});
```

### 🔁 Option 2: Embed via `<script>` in HTML

If you want to use the script directly in an HTML page (e.g., without a build tool), you can use the CommonJS/UMD build:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Algorithm Canvas Example</title>
</head>
<body>
  <div id="canvas"></div>

  <script src="./node_modules/@dnagel/algorithms-canvas/dist/algorithms.umd.cjs"></script>
  <script>
    // Access the globally exported object
    Algorithms.run({
      containerId: 'canvas',
      selectedAlgorithm: 'quicksort'
    });
  </script>
</body>
</html>
```
