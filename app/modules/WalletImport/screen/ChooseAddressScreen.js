import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  FlatList,
  SafeAreaView
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import ChooseAddressItem from '../elements/ChooseAddressItem'
import LayoutUtils from '../../../commons/LayoutUtils'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import MainStore from '../../../AppStores/MainStore'
import BottomButton from '../../../components/elements/BottomButton'

const marginTop = LayoutUtils.getExtraTop()
const { width, height } = Dimensions.get('window')
const isIPX = height === 812

@observer
export default class ChooseAddressScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  constructor(props) {
    super(props)
    this.importMnemonicStore = MainStore.importMnemonicStore
  }

  handleSelect = (w) => {
    this.importMnemonicStore.setSelectedWallet(w)
  }

  handleUnlock = () => {
    this.importMnemonicStore.gotoEnterName()
  }

  render() {
    const { navigation } = this.props
    const data = this.importMnemonicStore.mnemonicWallets
    const { selectedWallet } = this.importMnemonicStore

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={[styles.container]}
        >
          <NavigationHeader
            style={{ marginTop: marginTop + 20, width }}
            headerItem={{
              title: null,
              icon: null,
              button: images.backButton
            }}
            action={() => {
              navigation.goBack()
            }}
          />
          <Text style={styles.description}>
            Please select the address you would like to interact with.
          </Text>
          <View style={styles.rowTitle}>
            <Text style={styles.title}>Your Address</Text>
            <Text style={styles.title}>Balance</Text>
          </View>
          <View style={styles.line} />
          <FlatList
            style={{ flex: 1, marginBottom: isIPX ? 124 : 90 }}
            data={data}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item, index }) => {
              return (
                <ChooseAddressItem
                  item={item}
                  index={index}
                  onItemSelect={this.handleSelect}
                />
              )
            }}
          />
          <BottomButton
            onPress={this.handleUnlock}
            disable={!selectedWallet}
          />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1
  },
  description: {
    marginTop: 20,
    width,
    paddingHorizontal: 20,
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: AppStyle.mainTextColor
  },
  rowTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 30,
    width
  },
  title: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: AppStyle.mainColor
  },
  line: {
    backgroundColor: AppStyle.colorLines,
    height: 1,
    width: width - 40,
    marginTop: 20
  }
})
