export { createContainer, type AppContainer, type ContainerInit } from './container';
// NOTE: `./view` (the default wired singleton + Svelte store bridges) is
// intentionally NOT re-exported here. Importing this barrel must stay
// side-effect free; UI shells opt into the singleton explicitly via
// `@gocommerce/composition/view`, tests via `createContainer(init)`.
