import React, { Component } from 'react'
import {
  View,
  Dimensions,
  StyleSheet,
  Platform
} from 'react-native'
import { observer } from 'mobx-react/native'
import PropsType from 'prop-types'
import Permissions from 'react-native-permissions'
import { RNCamera } from 'react-native-camera'
import ImagePicker from 'react-native-image-picker'
import QRCode from './../../../Libs/react-native-qrcode-local-image'
import NavigationHeader from '../../components/elements/NavigationHeader'
import images from './../../commons/images'
import NavStore from '../../AppStores/NavStore'
import HapticHandler from '../../Handler/HapticHandler'
import LayoutUtils from '../../commons/LayoutUtils'
import UnAuthorizedView from './elements/UnAuthorizedView'
import AuthorizedView from './elements/AuthorizedView'
import AddPhotosField from './elements/AddPhotosField'
import { isIphoneX } from '../../../node_modules/react-native-iphone-x-helper'

const { width, height } = Dimensions.get('window')
const heightBottomView = (width * 65) / 375
const marginTop = LayoutUtils.getExtraTop()
const bottomPadding = isIphoneX() ? 33 : 0
const topPadding = isIphoneX() ? 64 : marginTop + 20
const heightCamera = height - heightBottomView - topPadding - bottomPadding
const ratio = 0.3

@observer
export default class ScanQRCodeScreen extends Component {
  static propTypes = {
    navigation: PropsType.object
  }

  static defaultProps = {
    navigation: null
  }

  state = {
    showCamera: false,
    enableFlash: false
  }

  componentWillMount() {
    NavStore.preventOpenUnlockScreen = true
    Permissions.check('camera').then((response) => {
      if (response == 'denied') {
        this.setState({
          showCamera: true
        })
        if (Platform.OS === 'android') return
        this.showPopupPermissionCamera()
      } else {
        setTimeout(() => {
          this.setState({
            showCamera: true
          })
        }, 500)
      }
    })
    if (Platform.OS == 'ios') {
      this.requestPhotoPermission()
    }
  }

  componentDidUpdate() {
    if (NavStore.shouldReloadCamera) {
      NavStore.shouldReloadCamera = false
      this.resetCamera()
    }
  }

  resetCamera() {
    this.setState({ showCamera: false }, () => {
      this.setState({ showCamera: true })
    })
  }

  requestCameraPermissionAndroid() {
    return Permissions.request('camera').then((res) => {
      if (res == 'authorized') {
        this.resetCamera()
      }
    })
  }

  _getQRCode = (url) => {
    if (url) {
      QRCode.decode(url, (error, result) => {
        if (error === null) {
          HapticHandler.NotificationSuccess()
          this.props.navigation.state.params.returnData(result)
          this.setState({ showCamera: false })
          this.props.navigation.goBack()
        } else {
          NavStore.popupCustom.show('Can’t detect this code')
        }
      })
    }
  }

  showPopupPermissionCamera() {
    NavStore.preventOpenUnlockScreen = true
    if (Platform.OS == 'android') {
      this.requestCameraPermissionAndroid()
    } else {
      NavStore.popupCustom.show(
        'Camera Access',
        [
          {
            text: 'Cancel',
            onClick: () => {
              NavStore.popupCustom.hide()
            }
          },
          {
            text: 'Settings',
            onClick: () => {
              Permissions.openSettings()
              NavStore.popupCustom.hide()
            }
          }
        ],
        '"Golden" needs permission to access your device’s camera to scan QRCode. Please go to Setting > Golden > Turn on Camera'
      )
    }
  }

  requestPhotoPermission(callback = () => { }) {
    NavStore.preventOpenUnlockScreen = true
    Permissions.check('photo').then((response) => {
      if (response != 'authorized') {
        Permissions.request('photo').then((res) => {
          if (res == 'authorized') {
            callback()
          }
        })
      }
    })
  }

  showPopupPermissionPhoto() {
    if (Platform.OS == 'android') {
      Permissions.check('camera').then(async (res) => {
        if (res == 'authorized') {
          this.requestPhotoPermission(this.pickPhotosFromGallery)
        } else {
          await this.requestCameraPermissionAndroid()
          this.requestPhotoPermission(this.pickPhotosFromGallery)
        }
      })
    } else {
      NavStore.popupCustom.show(
        'Photo Access',
        [
          {
            text: 'Not Now',
            onClick: () => {
              NavStore.popupCustom.hide()
            }
          },
          {
            text: 'Settings',
            onClick: () => {
              Permissions.openSettings()
              NavStore.popupCustom.hide()
            }
          }
        ],
        '"Golden" needs permission to access your photo library to select a photo. Please go to Setting > Golden > Photo > choose Read and Write'
      )
    }
  }

  pickPhotosFromGallery = () => {
    NavStore.preventOpenUnlockScreen = true
    const options = {
      title: 'QRCode Image',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }
    ImagePicker.launchImageLibrary(options, (res) => {
      if (res.error) {
        this.showPopupPermissionPhoto()
      } else {
        const url = Platform.OS === 'ios' ? res.uri : res.path
        this._getQRCode(url)
      }
    })
  }

  openImageLibrary() {
    NavStore.preventOpenUnlockScreen = true
    Permissions.check('photo').then((response) => {
      if (response != 'authorized') {
        this.showPopupPermissionPhoto()
      } else if (Platform.OS == 'android') {
        Permissions.check('camera').then(async (res) => {
          if (res != 'authorized') {
            await this.requestCameraPermissionAndroid()
          }
          this.pickPhotosFromGallery()
        })
      } else {
        this.pickPhotosFromGallery()
      }
    })
  }

  _handleBarCodeRead = (e) => {
    if (this.state.showCamera) {
      HapticHandler.NotificationSuccess()
      this.props.navigation.goBack()
      this.props.navigation.state.params.returnData(e.data)
      this.setState({ showCamera: false })
    }
  }

  goBack = () => {
    this.props.navigation.goBack()
  }

  rightViewAction = () => {
    this.setState({ enableFlash: !this.state.enableFlash })
  }

  render() {
    const triggerRender = NavStore.triggerRenderAndroid
    return (
      <View style={{
        flex: triggerRender ? 1 : 1,
        paddingTop: topPadding,
        paddingBottom: bottomPadding
      }}
      >
        <NavigationHeader
          headerItem={{
            title: 'Scan QR Code',
            icon: null,
            button: images.backButton
          }}
          action={this.goBack}
          rightView={{
            rightViewIcon: this.state.enableFlash ? images.iconFlashOff : images.iconFlashOn,
            rightViewAction: this.rightViewAction,
            styleContainer: {
              bottom: 10,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center'
            }
          }}
        />
        {!this.state.showCamera &&
          <View style={styles.camera} />
        }
        {this.state.showCamera && (
          <RNCamera
            style={styles.camera}
            onBarCodeRead={this._handleBarCodeRead}
            permissionDialogTitle="Permission to use camera"
            permissionDialogMessage="We need your permission to use your camera phone "
            notAuthorizedView={
              <UnAuthorizedView
                onPress={this.showPopupPermissionCamera.bind(this)}
              />
            }
            type={RNCamera.Constants.Type.back}
            flashMode={this.state.enableFlash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
          >
            <AuthorizedView
              imageStyle={{ width, flex: 1 }}
              textStyle={{
                position: 'absolute',
                bottom: ratio * heightCamera - (isIphoneX() ? 20 : 30)
              }}
            />
          </RNCamera>
        )}
        <AddPhotosField
          onPress={this.openImageLibrary.bind(this)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
