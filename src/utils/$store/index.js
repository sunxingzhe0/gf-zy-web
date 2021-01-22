import CryptoJS from 'crypto-js'

const screat = 'gf-ih'

export default {
  loadAccount() {
    const encrypted = localStorage.account
    if (encrypted) {
      const bytes = CryptoJS.AES.decrypt(encrypted, screat)
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    return null
  },
  saveAccount(account) {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(account),
      screat,
    ).toString()
    localStorage.account = encrypted
  },
}
