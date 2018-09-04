import ConfirmStore from './ConfirmStore'
import AdvanceStore from './AdvanceStore'

export default class DAppStore {
  confirmStore = null
  advanceStore = null

  constructor() {
    this.confirmStore = new ConfirmStore()
    this.advanceStore = new AdvanceStore()
  }
}
