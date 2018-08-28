import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions
} from 'react-native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import NavStore from '../../../AppStores/NavStore'
import images from '../../../commons/images'
import LayoutUtils from '../../../commons/LayoutUtils'
import DAppListItem from '../elements/DAppListItem'

const marginTop = LayoutUtils.getExtraTop()
const { height } = Dimensions.get('window')
const isIPX = height === 812
export default class DAppListScreen extends Component {
  onBack = () => NavStore.goBack()

  render() {
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: 20 + marginTop }}
          headerItem={{
            title: 'Exchanges & Finance',
            icon: null,
            button: images.backButton
          }}
          action={this.onBack}
        />
        <FlatList
          style={{ marginTop: 30, marginBottom: isIPX ? 68 : 34 }}
          data={dumpData}
          keyExtractor={v => v.title}
          renderItem={({ item, index }) =>
            (
              <View>
                <DAppListItem
                  title={item.title}
                  subTitle={item.subTitle}
                  line={index != 0}
                />
              </View>
            )
          }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

const dumpData = [
  {
    title: 'AirSwap',
    subTitle: 'AirSwap is a global marketplace for trading Ethereum tokens.'
  },
  {
    title: 'Kyber Network',
    subTitle: 'AirSwap is a global marketplace for trading Ethereum tokens.'
  },
  {
    title: 'AirSwap',
    subTitle: 'AirSwap is a global marketplace for trading Ethereum tokens.'
  },
  {
    title: 'Kyber Network',
    subTitle: 'AirSwap is a global marketplace for trading Ethereum tokens.'
  },
  {
    title: 'AirSwap',
    subTitle: 'AirSwap is a global marketplace for trading Ethereum tokens.'
  },
  {
    title: 'Kyber Network',
    subTitle: 'AirSwap is a global marketplace for trading Ethereum tokens.'
  },
  {
    title: 'AirSwap',
    subTitle: 'AirSwap is a global marketplace for trading Ethereum tokens.'
  },
  {
    title: 'Kyber Network',
    subTitle: 'AirSwap is a global marketplace for trading Ethereum tokens.'
  }
]
