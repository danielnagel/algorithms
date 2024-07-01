# Algorithms

This web application visualizes well-known algorithms from computer science.

## Development

Development mode uses [Vite's development server](https://vitejs.dev/).
The `dev` command will server-side render (SSR) the output during development.

```shell
npm start
```

## Production

The production build will generate client and server modules by running both client and server build commands.
The build command will use Typescript to run a type check on the source code.

```shell
npm run build
```

This app has a minimal [Express server](https://expressjs.com/) implementation.
After running a full build, you can preview the build using the command:

```shell
npm run serve
```

Then visit [http://localhost:3000/](http://localhost:3000/)
