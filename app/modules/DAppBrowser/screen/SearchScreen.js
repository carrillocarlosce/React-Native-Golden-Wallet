import React, { Component } from 'react'
import { View, SafeAreaView, StyleSheet, TouchableOpacity, Text } from 'react-native'
import AppStyle from '../../../commons/AppStyle'
import InputWithActionItem from '../../../components/elements/InputWithActionItem'

export default class SearchScreen extends Component {

  renderHeader = () => (
    <View
      style={styles.header}
    >
      <InputWithActionItem
        placeholder="Search or Enter DApp URL"
      />
      <TouchableOpacity
        style={styles.btCancel}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  )

  render() {
    return (
      <SafeAreaView
        style={styles.container}
      >
        {this.renderHeader()}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundDarkMode
  },
  header: {
    marginTop: 10,
    flexDirection: 'row'
  },
  btCancel: {
    flex: 1
  },
  cancelText: {

  }
})
