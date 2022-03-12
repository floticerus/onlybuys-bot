import getRandomValues from 'get-random-values'

if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = {}
}

if (typeof globalThis.crypto.getRandomValues === 'undefined') {
  globalThis.crypto.getRandomValues = getRandomValues
}
