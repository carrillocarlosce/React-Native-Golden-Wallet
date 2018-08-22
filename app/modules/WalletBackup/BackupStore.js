import { observable, action, computed } from 'mobx'
import lodash from 'lodash'
import HapticHandler from '../../Handler/HapticHandler'
import NavStore from '../../AppStores/NavStore'
import MainStore from '../../AppStores/MainStore'
import AppStyle from '../../commons/AppStyle'

export default class BackupStore {
  @observable.ref mnemonic = null
  @observable obj = {
    listKeywordRandom: [],
    listKeyWordChoose: [],
    buttonStates: []
  }

  @computed get listMnemonic() {
    return this.mnemonic.split(' ').map(String)
  }

  @action setup() {
    this.obj = {
      listKeywordRandom: lodash.shuffle(this.listMnemonic),
      listKeyWordChoose: this.listMnemonic.map(str => ''),
      buttonStates: this.listMnemonic.map(str => true)
    }
  }

  @action setMnemonic = (mn) => { this.mnemonic = mn }

  @action removeWord = (word) => {
    if (word === '') {
      return
    }
    HapticHandler.ImpactLight()
    const newObj = this.obj
    const index = newObj.listKeywordRandom.indexOf(word)
    newObj.buttonStates[index] = true
    newObj.listKeyWordChoose = newObj.listKeyWordChoose.filter((str) => {
      return str !== word
    })
    newObj.listKeyWordChoose.push('')
    this.obj = {
      ...this.obj,
      ...this.newObj
    }
  }

  @action addWord = (word) => {
    HapticHandler.ImpactLight()
    const newObj = this.obj
    const index = newObj.listKeywordRandom.indexOf(word)
    newObj.buttonStates[index] = false
    for (let i = 0; i < this.obj.listKeyWordChoose.length; ++i) {
      if (newObj.listKeyWordChoose[i] === '') {
        newObj.listKeyWordChoose[i] = word
        break
      }
    }
    this.obj = {
      ...this.obj,
      ...this.newObj
    }
  }

  @action confirmMnemonic = () => {
    if (JSON.stringify(this.listMnemonic) === JSON.stringify(this.obj.listKeyWordChoose)) {
      MainStore.appState.setBackup(true)
      MainStore.appState.save()
      NavStore.pushToScreen('BackupFinishScreen')
    } else {
      HapticHandler.ImpactLight()
      NavStore.showToastTop('The order is not correct!', { backgroundColor: AppStyle.errorColor }, { color: 'white' })
    }
  }

  @action gotoHome() {
    NavStore.pushToScreen('HomeScreen')
  }

  @computed get isReadyConfirm() {
    const keywordUnChooses = this.obj.listKeyWordChoose.find(str => str === '')
    if (keywordUnChooses === '') {
      return false
    }
    return true
  }
}
