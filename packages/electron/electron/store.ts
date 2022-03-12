import Store from 'electron-store'

const store = new Store({
  // this is only used for obfuscation, not real security.
  // all that matters is the key never changes.
  encryptionKey: 'fehfuiehfuewhfehw',
})

export default store
