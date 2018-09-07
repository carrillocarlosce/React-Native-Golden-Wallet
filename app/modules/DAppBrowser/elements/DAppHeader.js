import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import LayoutUtils from '../../../commons/LayoutUtils'
import images from '../../../commons/images'
import { openSansRegular } from '../../../commons/commonStyles'
import AppStyle from '../../../commons/AppStyle'
import MainStore from '../../../AppStores/MainStore'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

@observer
export default class DAppHeader extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    onSubmitEditing: PropTypes.func
  }

  static defaultProps = {
    onClose: () => { },
    onSubmitEditing: () => { }
  }

  onChangeDomain = (text) => { MainStore.dapp.setUrl(text) }

  render() {
    const {
      onClose, onSubmitEditing
    } = this.props
    const { url } = MainStore.dapp
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose}>
          <Image source={images.closeButton} style={{ marginHorizontal: 20 }} />
        </TouchableOpacity>
        <TextInput
          underlineColorAndroid="transparent"
          keyboardAppearance="dark"
          autoCorrect={false}
          style={[
            styles.textInput
          ]}
          onChangeText={this.onChangeDomain}
          value={url}
          onSubmitEditing={onSubmitEditing}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: marginTop + 10,
    marginBottom: 10,
    alignItems: 'center',
    width
  },
  textInput: {
    padding: 7,
    textAlign: 'center',
    backgroundColor: '#14192D',
    borderRadius: 14,
    fontFamily: openSansRegular,
    color: AppStyle.mainTextColor,
    fontSize: 16,
    flex: 1,
    marginRight: 20
  }
})
