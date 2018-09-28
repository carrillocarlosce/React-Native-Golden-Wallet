import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    SafeAreaView,
    Keyboard,
    Dimensions,
    Text
} from 'react-native'
import { observer } from 'mobx-react/native'
import PropTypes from 'prop-types'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import InputWithAction from '../../../components/elements/InputWithActionItem'
import BottomButton from '../../../components/elements/BottomButton'
import LayoutUtils from '../../../commons/LayoutUtils'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import Spinner from '../../../components/elements/Spinner'
import constant from '../../../commons/constant'
import MainStore from '../../../AppStores/MainStore'
import TouchOutSideDismissKeyboard from '../../../components/elements/TouchOutSideDismissKeyboard'
import NavStore from '../../../AppStores/NavStore'

const { width } = Dimensions.get('window')
const marginTop = LayoutUtils.getExtraTop()

@observer
export default class EnterNameViaAddress extends Component {
    static propTypes = {
        navigation: PropTypes.object
    }

    static defaultProps = {
        navigation: {}
    }

    constructor(props) {
        super(props)
        this.importAddressStore = MainStore.importAddressStore
    }

    onChangeText = (text) => {
        this.importAddressStore.setTitle(text)
    }

    handleBack = () => {
        Keyboard.dismiss()
        NavStore.goBack()
    }

    handleCreate = () => {
        const { navigation } = this.props
        const { coin } = navigation.state.params
        const { title } = this.importAddressStore
        this.importAddressStore.create(title, coin)
    }

    renderErrorField = () => {
        const { isErrorTitle } = this.importAddressStore
        if (isErrorTitle) {
            return <Text style={styles.errorText}>{constant.EXISTED_NAME}</Text>
        }
        return <View />
    }

    render() {
        const { title, loading, isReadyCreate } = this.importAddressStore
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <TouchOutSideDismissKeyboard >
                    <View style={styles.container}>
                        <NavigationHeader
                            style={{ marginTop: marginTop + 20, width }}
                            headerItem={{
                                title: 'Type Your Wallet Name',
                                icon: null,
                                button: images.backButton
                            }}
                            action={this.handleBack}
                        />
                        <InputWithAction
                            autoFocus
                            style={{ width: width - 40, marginTop: 25 }}
                            value={title}
                            onChangeText={this.onChangeText}
                        />
                        {this.renderErrorField()}
                        <BottomButton
                            disable={!isReadyCreate}
                            text="Done"
                            onPress={this.handleCreate}
                        />
                        {loading &&
                            <Spinner />
                        }
                    </View>
                </TouchOutSideDismissKeyboard>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    errorText: {
        color: AppStyle.errorColor,
        fontSize: 14,
        fontFamily: 'OpenSans-Semibold',
        marginTop: 10,
        marginLeft: 20,
        alignSelf: 'flex-start'
    }
})
