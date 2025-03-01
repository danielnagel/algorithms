# algorithms canvas

This library visualizes well-known algorithms from computer science.

Take a look: https://dnagel.de/projects/algorithms

node and npm need to be installed, tested with node v21.7.3.

The library requires that a `canvas` element and control elements with the corresponding IDs are present on the HTML page where the library is included.  
A minimal setup could look like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canvas Library Setup</title>
    <style>
        #canvas {
            border: 1px solid black;
            display: block;
            margin: 20px auto;
        }
    </style>
</head>
<body>
    <canvas id="algorithm-canvas" width="500" height="400"></canvas>

    <div id="controls">
        <button id="randomize-button">randomize</button>
        <button id="play-button">start/stop</button>
        <button id="skip-back-button">skip back</button>
        <button id="step-back-button">step back</button>
        <button id="step-forward-button">step forward</button>
        <button id="skip-forward-button">skip forward</button>
        <input id="interval-timeout-input" type="number" min="1" max="1000" />
    </div>
</body>
</html>
```
