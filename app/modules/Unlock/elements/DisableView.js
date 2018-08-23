import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Platform
} from 'react-native'
// import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import { opensansRegular } from '../../../commons/commonStyles'
import AppStyle from '../../../commons/AppStyle'
import UnlockStore from '../UnlockStore'

const title = 'PIN Code is disabled'
const attention = 'Erase all your data on Golden after 10 failed PIN Code attempts'

const { width, height } = Dimensions.get('window')
const extraBottom = Platform.OS === 'ios' ? 0 : 48

@observer
export default class DisableView extends Component {
  static propTypes = {

  }

  static defaultProps = {

  }

  renderContent = (countdownMsg) => {
    return (
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{countdownMsg}</Text>
        <Text style={styles.attention}>{attention}</Text>
      </View>
    )
  }

  render() {
    const { countdownMsg } = UnlockStore
    return (
      <View style={styles.container}>
        {this.renderContent(countdownMsg)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    width,
    height: height + extraBottom,
    paddingHorizontal: 60
  },
  title: {
    color: 'white',
    fontSize: 26,
    fontFamily: 'OpenSans-Semibold',
    textAlign: 'center'
  },
  description: {
    fontFamily: opensansRegular,
    fontSize: 20,
    color: AppStyle.mainTextColor,
    marginTop: 10,
    textAlign: 'center'
  },
  attention: {
    color: AppStyle.secondaryTextColor,
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
    marginTop: 20,
    textAlign: 'center'
  }
})
