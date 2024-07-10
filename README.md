# algorithms website

This web application visualizes well-known algorithms from computer science.

## Install, build and run project

node and npm need to be installed, tested with node v21.7.3.

```bash
npm i
npm start
```

## docker

```bash
docker build -t algorithms-dnagel-website .
docker run --name algorithms-dnagel-website -p 80:8080 -d algorithms-dnagel-website
```

## about

* I switched from qwik to astro, because the need to serialize every bit of client side code in qwik made the application a lot more complicated than it needed to be.