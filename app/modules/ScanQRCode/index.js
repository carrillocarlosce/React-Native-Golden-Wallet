import React, { PureComponent } from 'react'
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  Image,
  Platform,
  TouchableWithoutFeedback
} from 'react-native'
import { observer } from 'mobx-react/native'
import PropsType from 'prop-types'
import Permissions from 'react-native-permissions'
import { RNCamera } from 'react-native-camera'
import ImagePicker from 'react-native-image-picker'
import QRCode from './../../../Libs/react-native-qrcode-local-image'
import NavigationHeader from '../../components/elements/NavigationHeader'
import images from './../../commons/images'
import constant from './../../commons/constant'
import AppStyle from '../../commons/AppStyle'
import NavStore from '../../AppStores/NavStore'
import HapticHandler from '../../Handler/HapticHandler'
import LayoutUtils from '../../commons/LayoutUtils'
import { isIphoneX } from '../../../node_modules/react-native-iphone-x-helper'

const { width, height } = Dimensions.get('window')
// const widthButton = (width - 60) / 2
const heightBottomView = (width * 65) / 375
const marginTop = LayoutUtils.getExtraTop()
const bottomPadding = isIphoneX() ? 33 : 0
const topPadding = isIphoneX() ? 64 : marginTop + 20
const heightCamera = height - heightBottomView - topPadding - bottomPadding
const ratio = 0.3
@observer
export default class ScanQRCodeScreen extends PureComponent {
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
      this.setState({ showCamera: false }, () => {
        this.setState({ showCamera: true })
      })
    }
  }

  onSuccess = (data) => {
    HapticHandler.NotificationSuccess()
    this.props.navigation.state.params.returnData(data)
    this.props.navigation.goBack()
  }

  onError = (data) => {
    NavStore.popupCustom.show(data)
  }

  requestCameraPermissionAndroid(callback = () => { }) {
    Permissions.request('camera').then((res) => {
      if (res == 'authorized') {
        this.setState({ showCamera: false }, () => {
          this.setState({ showCamera: true }, callback)
        })
      }
    })
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

  requestPhotoPermission(openLibrary = false) {
    NavStore.preventOpenUnlockScreen = true
    Permissions.check('photo').then((response) => {
      if (response != 'authorized') {
        Permissions.request('photo').then((res) => {
          if (openLibrary && res == 'authorized') {
            this.pickPhotosFromGallery()
          }
        })
      }
    })
  }

  showPopupPermissionPhoto() {
    if (Platform.OS == 'android') {
      Permissions.check('camera').then((res) => {
        if (res == 'authorized') {
          this.requestPhotoPermission(true)
        } else {
          this.requestCameraPermissionAndroid(() => { this.requestPhotoPermission(true) })
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

  _getQRCode(url) {
    if (url) {
      QRCode.decode(url, (error, result) => {
        if (error === null) {
          HapticHandler.NotificationSuccess()
          this.props.navigation.state.params.returnData(result.toLowerCase())
          this.setState({ showCamera: false })
          this.props.navigation.goBack()
        } else {
          NavStore.popupCustom.show('Can’t detect this code')
        }
      })
    }
  }

  pickPhotosFromGallery() {
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
      } else {
        if (Platform.OS == 'android') {
          Permissions.check('camera').then((res) => {
            if (res != 'authorized') {
              this.requestCameraPermissionAndroid(this.pickPhotosFromGallery)
            } else {
              this.pickPhotosFromGallery()
            }
          })
        } else {
          this.pickPhotosFromGallery()
        }
      }
    })
  }

  _handleBarCodeRead(e) {
    if (this.state.showCamera) {
      HapticHandler.NotificationSuccess()
      this.props.navigation.goBack()
      this.props.navigation.state.params.returnData(e.data.toLowerCase())
      this.setState({ showCamera: false })
    }
  }

  _renderNotAuthorizedView = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: AppStyle.colorBlack
        }}
      >
        <TouchableWithoutFeedback
          onPress={this.showPopupPermissionCamera.bind(this)}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Image
              source={images.imgScanFrame}
            />
            <Text
              style={{
                color: AppStyle.blueActionColor,
                position: 'absolute',
                fontFamily: 'OpenSans-Semibold',
                fontSize: 18
              }}
            >
              Allow Camera Access
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <Text
          style={[styles.description, { marginTop: 25 }]}
        >
          Automatically scan the QR code into the frame
        </Text>
      </View>
    )
  }

  render() {
    const triggerRender = NavStore.triggerRenderAndroid
    return (
      <View style={{ flex: 1, paddingTop: topPadding, paddingBottom: bottomPadding }}>
        <NavigationHeader
          headerItem={{
            title: 'Scan QR Code',
            icon: null,
            button: images.backButton
          }}
          action={() => {
            this.props.navigation.goBack()
          }}
          rightView={{
            rightViewIcon: this.state.enableFlash ? images.iconFlashOff : images.iconFlashOn,
            rightViewAction: () => {
              this.setState({ enableFlash: !this.state.enableFlash })
            }
          }}
        />
        {/* <View
          style={{ flex: 1 }}
        > */}
        {!this.state.showCamera &&
          <View style={styles.camera} />
        }
        {this.state.showCamera && (
          <RNCamera
            style={styles.camera}
            onBarCodeRead={(e) => { this._handleBarCodeRead(e) }}
            permissionDialogTitle="Permission to use camera"
            permissionDialogMessage="We need your permission to use your camera phone "
            notAuthorizedView={
              this._renderNotAuthorizedView()
            }
            type={RNCamera.Constants.Type.back}
            flashMode={this.state.enableFlash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
          >
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                style={{ width, flex: 1 }}
                source={images.scanFrame}
              />
              <Text
                style={[styles.description, {
                  position: 'absolute',
                  bottom: ratio * heightCamera - (isIphoneX() ? 20 : 30)
                }]}
              >
                Automatically scan the QR code into the frame
              </Text>
            </View>
          </RNCamera>
        )}
        <TouchableWithoutFeedback
          onPress={() => {
            this.openImageLibrary()
          }}
        >
          <View
            style={styles.buttonBlue}
          >
            <Image
              source={images.iconAddPhoto}
            />
            <Text style={styles.textButtonBlue}>
              {constant.ADD_FROM_ALBUM}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        {/* </View> */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonBlue: {
    width,
    height: heightBottomView,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  textButtonBlue: {
    marginLeft: 6,
    fontFamily: 'OpenSans-Light',
    fontSize: 14,
    color: AppStyle.mainTextColor
  },
  description: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
    color: AppStyle.mainTextColor
  }
})
