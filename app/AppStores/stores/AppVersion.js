import { observable, action } from 'mobx'
import DeviceInfo from 'react-native-device-info'
import MainStore from '../MainStore'
import api from '../../api'

class AppVersion {
  @observable.ref latestVersion = {
    version_number: DeviceInfo.getVersion(),
    change_logs: '',
    created_at: '2018-08-23T11:41:25.828Z'
  }
  @observable listVersion = []

  @action setChangelogsList(vs) {
    const data = this.listVersion.map((item) => {
      const temp = item.expanse
      return {
        ...item,
        expanse: item.version_number === vs ? !temp : temp
      }
    })

    this.listVersion = data
  }

  @action async getChangelogsLatest() {
    if (MainStore.appState.internetConnection === 'online') {
      const res = await api.changelogsLatest()
      if (res && res.data) {
        this.latestVersion = res.data.data
      }
    }
  }

  @action async getChangelogsList() {
    if (MainStore.appState.internetConnection === 'online') {
      const res = await api.changelogsList()
      if (res && res.data) {
        const data = res.data.data.map((item) => {
          return {
            ...item,
            expanse: false,
            type: 'expanse'
          }
        })
        this.listVersion = data
      }
    }
  }
}

// @observable dataAbout = [
//   {
//     mainText: `Rate Golden on ${store}`,
//     onPress: () => { this.showPopupRating() },
//     iconRight: false
//   },
//   {
//     mainText: 'Source Code',
//     onPress: () => { Linking.openURL('https://github.com/goldennetwork/golden-wallet-react-native') },
//     subText: 'Github'
//   },
//   {
//     mainText: 'Privacy & Terms',
//     onPress: () => { NavStore.pushToScreen('PrivacyTermsScreen') }
//   },
//   {
//     mainText: 'App Version',
//     onPress: () => { NavStore.pushToScreen('AppVersionScreen') },
//     subText: DeviceInfo.getVersion()
//   }
// ]

export default new AppVersion()
