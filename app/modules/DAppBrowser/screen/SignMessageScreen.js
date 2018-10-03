import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView
} from 'react-native'
import PropTypes from 'prop-types'
import { hexToString } from '../../../api/ether-json-rpc'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import NavStore from '../../../AppStores/NavStore'
import images from '../../../commons/images'
import LayoutUtils from '../../../commons/LayoutUtils'
import MainStore from '../../../AppStores/MainStore'
import AppStyle from '../../../commons/AppStyle'
import BottomButton from '../../../components/elements/BottomButton'

const marginTop = LayoutUtils.getExtraTop()

export default class DAppListScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  onBack = () => NavStore.goBack()
  onSignPersonalMessage = () => {
    const { navigation } = this.props
    const { params } = navigation.state
    MainStore.dapp.sign(params.id, params.object.data)
  }

  render() {
    const { navigation } = this.props
    const { params } = navigation.state
    const info = hexToString(params.object.data)
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <NavigationHeader
            style={{ marginTop: 20 + marginTop }}
            headerItem={{
              title: 'Sign Message',
              icon: null,
              button: images.closeButton
            }}
            action={this.onBack}
          />
          <Text style={[styles.standardText, { marginTop: 15, alignSelf: 'center' }]}>
            Only authorize signature from sources that
          </Text>
          <Text style={[styles.standardText, { alignSelf: 'center' }]}>
            you trust.
          </Text>
          <View style={[styles.item, { marginTop: 30 }]}>
            <Text style={styles.key}>
              Requester
            </Text>
            <Text style={[styles.standardText, { marginTop: 10 }]}>
              {MainStore.dapp.url}
            </Text>
          </View>
          <View style={styles.line} />
          <View style={[styles.item, { marginTop: 20 }]}>
            <Text style={styles.key}>
              Message
            </Text>
            <Text style={[styles.standardText, { marginTop: 10 }]}>
              {info}
            </Text>
          </View>
          <BottomButton
            text="Sign"
            onPress={this.onSignPersonalMessage}
          />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  standardText: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
    color: AppStyle.secondaryTextColor
  },
  item: {
    paddingLeft: 20,
    paddingRight: 20
  },
  line: {
    height: 1,
    backgroundColor: '#14192D',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15
  },
  key: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16,
    color: AppStyle.mainTextColor,
    marginTop: 15
  }
})
