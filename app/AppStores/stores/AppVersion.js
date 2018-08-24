import { observable, action } from 'mobx'
import DeviceInfo from 'react-native-device-info'
import MainStore from '../MainStore'
import api from '../../api'

class AppVersion {
  @observable tickers = []
  @observable latestVersion = {
    version_number: DeviceInfo.getVersion(),
    change_logs: '',
    created_at: '2018-08-23T11:41:25.828Z'
  }

  @action async getChangelogsLatest() {
    if (MainStore.appState.internetConnection === 'online') {
      const res = await api.changelogsLatest()
      if (res && res.data) {
        this.latestVersion = res.data.data
      }
    }
  }
}

export default new AppVersion()
