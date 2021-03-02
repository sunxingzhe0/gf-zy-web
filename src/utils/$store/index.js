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
    let accountList = this.loadAccount()
    let list = accountList
    if (accountList) {
      if (Array.isArray(accountList)) {
        let ofItem = accountList.filter(item => item.account == account.account)
        if (ofItem.length > 0) {
          accountList.forEach((item, index) => {
            if (item.account == account.account) {
              list.splice(index, 1)
              list.push(account)
            }
          })
        } else {
          list.push(account)
        }
      } else {
        if (accountList.account == account.account) {
          list = [accountList]
        } else {
          list = [...accountList.account, account.account]
        }
      }
    } else {
      list = []
      list.push(account)
    }
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(list),
      screat,
    ).toString()
    localStorage.account = encrypted
  },
}
