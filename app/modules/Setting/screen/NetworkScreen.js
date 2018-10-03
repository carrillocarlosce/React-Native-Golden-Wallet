import React, { Component } from 'react'
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  View,
  Text
} from 'react-native'
import PropsType from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import Images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import Spinner from '../../../components/elements/Spinner'
import LayoutUtils from '../../../commons/LayoutUtils'
import NetworkItem from '../elements/NetworkItem'
import MainStore from '../../../AppStores/MainStore'
import Config from '../../../AppStores/stores/Config'
import constant from '../../../commons/constant'
import NavStore from '../../../AppStores/NavStore'
import SwitchButton from '../elements/SwtichButton'
import MixpanelHandler from '../../../Handler/MixpanelHandler'

const marginTop = LayoutUtils.getExtraTop()
const networks = [
  'ropsten',
  'rinkeby',
  'kovan'
]

@observer
export default class NetworkScreen extends Component {
  static propTypes = {
    navigation: PropsType.object
  }

  static defaultProps = {
    navigation: null
  }

  onItemPress = (nw) => {
    MainStore.appState.setConfig(new Config(nw, constant.INFURA_API_KEY))
    MainStore.appState.mixpanleHandler.track(MixpanelHandler.eventName.ACTION_CHANGE_NETWORK)
    MainStore.appState.save()
  }

  onStateChange = (isActive) => {
    if (isActive) {
      MainStore.appState.setConfig(new Config(Config.networks.ropsten, constant.INFURA_API_KEY))
      MainStore.appState.save()
    } else {
      MainStore.appState.setConfig(new Config(Config.networks.mainnet, constant.INFURA_API_KEY))
      MainStore.appState.save()
    }
    MainStore.appState.mixpanleHandler.track(MixpanelHandler.eventName.ACTION_CHANGE_NETWORK)
  }

  get enableSwitch() {
    const { config } = MainStore.appState
    return config.network === Config.networks.mainnet
  }

  _renderNetworkItem = ({ item, index }) =>
    (
      <NetworkItem item={item} index={index} onPress={this.onItemPress} />
    )

  _renderNetworkList() {
    return (
      <FlatList
        style={{ flex: 1, marginTop: 15 }}
        data={networks}
        ListHeaderComponent={<Text style={styles.titleText}>Ethereum</Text>}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => `${index}`}
        renderItem={this._renderNetworkItem}
      />
    )
  }

  goBack = () => {
    NavStore.goBack()
  }

  render() {
    const loading = false
    const { enableSwitch } = this
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          style={{ marginTop: 20 + marginTop }}
          headerItem={{
            title: 'Network',
            icon: null,
            button: Images.backButton
          }}
          action={this.goBack}
        />
        <View style={styles.switchNetwork}>
          <Text style={styles.testnet}>Testing Network</Text>
          <SwitchButton
            enable={!enableSwitch}
            onStateChange={this.onStateChange}
          />
        </View>
        {!enableSwitch && this._renderNetworkList()}
        {loading &&
          <Spinner />
        }
      </SafeAreaView >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundDarkMode
  },
  switchNetwork: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: AppStyle.backgroundTextInput,
    marginTop: 20
  },
  testnet: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
    color: AppStyle.secondaryTextColor
  },
  titleText: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16,
    color: AppStyle.mainTextColor,
    marginLeft: 20,
    marginBottom: 20
  }
})
