export const getMiniRuntime = () => {
  if (typeof globalThis !== 'undefined') {
    if (globalThis.uni) return globalThis.uni
    if (globalThis.wx) return globalThis.wx
  }

  return null
}

