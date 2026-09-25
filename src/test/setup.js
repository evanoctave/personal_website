import '@testing-library/jest-dom/vitest'

// jsdom has no canvas; FX layers skip drawing when getContext returns null.
HTMLCanvasElement.prototype.getContext = () => null
