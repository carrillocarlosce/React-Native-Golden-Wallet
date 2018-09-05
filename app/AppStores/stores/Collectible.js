import { observable, computed } from 'mobx'

export default class Collectible {
  @observable id = ''
  @observable name = ''
  @observable thumnail = ''
  @observable originUrl = ''
  @observable background = ''
  @observable description = ''
  @observable assetContractName = ''
  @observable previewUrl = ''

  belongsToWalletAddress = null

  constructor(obj, belongsToWalletAddress) {
    this.id = obj.token_id
    this.name = obj.name
    this.thumnail = obj.image_thumbnail_url
    this.originUrl = obj.image_original_url
    this.background = obj.background_color || 'f9f2c8'
    this.description = obj.description || ''
    this.assetContractName = obj.asset_contract.name
    this.previewUrl = obj.image_preview_url

    this.belongsToWalletAddress = belongsToWalletAddress
  }

  @computed get tokenName() {
    return this.name
  }

  @computed get backgroundColor() {
    return `#${this.background}`
  }

  @computed get tokenDescription() {
    if (!this.description) return ''
    return this.description
  }
}
