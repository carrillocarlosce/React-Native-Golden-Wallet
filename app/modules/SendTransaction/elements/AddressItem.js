import React, { PureComponent } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../../commons/AppStyle'
import AddressElement from '../../../components/elements/AddressElement'

export default class AddressItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    address: PropTypes.string,
    onPress: PropTypes.func
  }
  static defaultProps = {
    name: '',
    address: '',
    onPress: () => { }
  }

  render() {
    const { name, address, onPress } = this.props
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPress()}
      >
        <View>
          <Text
            style={styles.addressName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
          <AddressElement
            address={address}
            textStyle={{ fontSize: 12 }}
            style={{ width: 281, marginTop: 10 }}
          />
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 14,
    backgroundColor: AppStyle.backgroundTextInput
  },
  addressName: {
    fontSize: 16,
    fontFamily: 'OpenSans-Semibold',
    color: '#4a90e2'
  }
})
