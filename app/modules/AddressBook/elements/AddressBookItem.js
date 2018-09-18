import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../../commons/AppStyle'
import MainStore from '../../../AppStores/MainStore'
import MoreButton from '../../../components/elements/MoreButton'
import AddressElement from '../../../components/elements/AddressElement'
import images from '../../../commons/images'

export default class AddressBookItem extends Component {
  static propTypes = {
    style: PropTypes.object,
    index: PropTypes.number.isRequired,
    action: PropTypes.func
  }

  static defaultProps = {
    style: {},
    action: () => { }
  }

  get addressBook() {
    const { index } = this.props
    return MainStore.appState.addressBooks[index]
  }

  render() {
    const {
      style, action
    } = this.props
    const { title, address, type } = this.addressBook

    return (
      <TouchableWithoutFeedback>
        <View style={[styles.container, style]}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{ marginRight: 10 }}
              source={type === 'ethereum' ? images.logoETH : images.logoBTC}
            />
            <View>
              <Text style={styles.name}>{title}</Text>
              <AddressElement
                address={address}
                style={{ width: 281, marginTop: 10 }}
                textStyle={{ fontSize: 12 }}
              />
            </View>
          </View>
          <MoreButton onPress={action} />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppStyle.backgroundTextInput,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: AppStyle.borderLinesSetting,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  name: {
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
    color: '#3B7CEC'
  }
})
