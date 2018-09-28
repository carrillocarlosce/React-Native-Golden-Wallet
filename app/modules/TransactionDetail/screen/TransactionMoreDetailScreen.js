import React, { PureComponent } from 'react'
import {
	View,
	StyleSheet,
	Dimensions,
	FlatList,
	Text,
	ScrollView,
	SafeAreaView
} from 'react-native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import NavStore from '../../../AppStores/NavStore'
import MainStore from '../../../AppStores/MainStore'
import AppStyle from '../../../commons/AppStyle'
import AddressElement from '../../../components/elements/AddressElement'
import LayoutUtils from '../../../commons/LayoutUtils'
import Helper from '../../../commons/Helper'

const { width } = Dimensions.get('window')
const marginTop = LayoutUtils.getExtraTop()

export default class TransactionMoreDetailScreen extends PureComponent {
	get selectedTransaction() {
		return MainStore.appState.selectedTransaction
	}

	_onClose = () => NavStore.goBack()
	_renderItemInput = ({ item, index }) => {
		const { prev_out } = item
		const { addr, value } = prev_out
		const valueFormat = Helper.formatETH(value / 100000000, false, 5)
		return (
			<View style={[styles.containerItem, { marginTop: index === 0 ? 12 : 9 }]}>
				<AddressElement style={{ width: width * 0.6 }} address={addr} />
				<Text style={styles.balance}>{valueFormat}</Text>
			</View>
		)
	}

	_renderItemOutput = ({ item, index }) => {
		const { addr, value } = item
		const valueFormat = Helper.formatETH(value / 100000000, false, 5)
		return (
			<View style={[styles.containerItem, { marginTop: index === 0 ? 12 : 9 }]}>
				<AddressElement style={{ width: width * 0.6 }} address={addr} />
				<Text style={styles.balance}>{valueFormat}</Text>
			</View>
		)
	}

	render() {
		const { inputs, out } = this.selectedTransaction
		return (
			<SafeAreaView style={styles.container}>
				<NavigationHeader
					style={{ width, marginTop: marginTop + 20 }}
					headerItem={{
						title: 'Transaction Details',
						icon: null,
						button: images.backButton
					}}
					action={this._onClose}
				/>
				<ScrollView >
					<FlatList
						style={{ flex: 1 }}
						data={inputs}
						scrollEnabled={false}
						ListHeaderComponent={<Text style={styles.titleText}>{`${inputs.length} Inputs`}</Text>}
						showsVerticalScrollIndicator={false}
						keyExtractor={(item, index) => `${index}`}
						renderItem={this._renderItemInput}
					/>
					<View style={styles.line} />
					<FlatList
						style={{ flex: 1, marginBottom: 20 }}
						data={out}
						scrollEnabled={false}
						ListHeaderComponent={<Text style={styles.titleText}>{`${out.length} Outputs`}</Text>}
						showsVerticalScrollIndicator={false}
						keyExtractor={(item, index) => `${index}`}
						renderItem={this._renderItemOutput}
					/>
				</ScrollView>
			</SafeAreaView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	line: {
		height: 1,
		width: width - 40,
		margin: 20,
		backgroundColor: AppStyle.colorLines
	},
	containerItem: {
		paddingHorizontal: 20,
		flexDirection: 'row',
		flex: 1
	},
	balance: {
		position: 'absolute',
		fontSize: 14,
		right: 20,
		fontFamily: 'OpenSans-Semibold',
		color: AppStyle.mainColor
	},
	titleText: {
		marginLeft: 20,
		fontSize: 16,
		color: AppStyle.mainTextColor,
		fontFamily: 'OpenSans-Semibold'
	}
})
