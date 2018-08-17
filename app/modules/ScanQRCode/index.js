import React, { PureComponent } from 'react'
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  // Clipboard,
  Platform,
  TouchableWithoutFeedback
} from 'react-native'
import PropsType from 'prop-types'
import Permissions from 'react-native-permissions'
import { RNCamera } from 'react-native-camera'
import ImagePicker from 'react-native-image-picker'
import QRCode from './../../../Libs/react-native-qrcode-local-image'
import NavigationHeader from '../../components/elements/NavigationHeader'
import images from './../../commons/images'
import constant from './../../commons/constant'
import AppStyle from '../../commons/AppStyle'
import NavStore from '../../stores/NavStore'
import HapticHandler from '../../Handler/HapticHandler'
import LayoutUtils from '../../commons/LayoutUtils'
import { isIphoneX } from '../../../node_modules/react-native-iphone-x-helper'

const { width } = Dimensions.get('window')
// const widthButton = (width - 60) / 2
const heightBottomView = (width * 65) / 375
const marginTop = LayoutUtils.getExtraTop()

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
    setTimeout(() => {
      this.setState({
        showCamera: true
      })
    }, 300)
    Permissions.check('camera').then((response) => {
      if (response === 'denied') {
        if (Platform.OS === 'android') return
        this.showPopupPermissionCamera()
      } else if (response === 'undetermined') {
        Permissions.request('camera', {
          rationale: {
            title: 'Camera Permission',
            message: '"Golden" needs permission to access your device’s camera to scan QRCode'
          }
        }).then((res) => {
          if (res === 'denied') {
            if (Platform.OS === 'android') return
            this.showPopupPermissionCamera()
          }
        })
      }
    })
  }

  onSuccess = (data) => {
    HapticHandler.NotificationSuccess()
    this.props.navigation.state.params.returnData(data)
    this.props.navigation.goBack()
  }

  onError = (data) => {
    NavStore.popupCustom.show(data)
  }

  // async onPasteAddress() {
  //   const address = await Clipboard.getString()
  //   if (address) {
  //     this.props.navigation.state.params.returnData(address)
  //     this.props.navigation.goBack()
  //   } else {
  //     NavStore.popupCustom.show('No Address Copied')
  //   }
  // }

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

  requestPhotoPermission() {
    NavStore.preventOpenUnlockScreen = true
    Permissions.request('photo')
  }

  showPopupPermissionPhoto() {
    if (Platform.OS == 'android') {
      Permissions.check('camera').then((res) => {
        if (res == 'authorized') {
          this.requestPhotoPermission()
        } else {
          this.requestCameraPermissionAndroid(() => { this.requestPhotoPermission() })
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

  openImageLibrary() {
    NavStore.preventOpenUnlockScreen = true
    Permissions.check('photo').then((response) => {
      if (response != 'authorized') {
        this.showPopupPermissionPhoto()
      } else {
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

  // _renderNotAuthorizedView = () => {
  //   return (
  //     <View
  //       style={{
  //         width,
  //         height: width,
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         backgroundColor: AppStyle.colorBlack
  //       }}
  //     >
  //       <Text
  //         style={{
  //           color: AppStyle.mainTextColor,
  //           fontFamily: 'OpenSans-Semibold',
  //           fontSize: 20
  //         }}
  //       >
  //         Camera not authorized
  //       </Text>
  //     </View>
  //   )
  // }
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
          style={styles.description}
        >
          Automatically scan the QR code into the frame
        </Text>
      </View>
    )
  }

  //   render() {
  //     const { title, marginTop, marginBottom = 0 } = this.props.navigation.state.params
  //     return (
  //       <View style={{ flex: 1, paddingTop: 16 + marginTop }}>
  //         <NavigationHeader
  //           headerItem={{
  //             title,
  //             icon: null,
  //             button: images.backButton
  //           }}
  //           action={() => {
  //             this.props.navigation.goBack()
  //           }}
  //         />
  //         <View
  //           style={{
  //             flex: 1,
  //             alignItems: 'center',
  //             justifyContent: 'center'
  //           }}
  //         >
  //           {this.state.showCamera && (
  //             <Camera
  //               style={styles.camera}
  //               onBarCodeRead={(e) => { this._handleBarCodeRead(e) }}
  //               permissionDialogTitle="Permission to use camera"
  //               permissionDialogMessage="We need your permission to use your camera phone "
  //               notAuthorizedView={
  //                 this._renderNotAuthorizedView()
  //               }
  //             />
  //           )}
  //           <View style={[styles.viewButtonBottom, { marginBottom }]}>
  //             <TouchableOpacity
  //               style={styles.buttonBlue}
  //               onPress={() => {
  //                 this.openImageLibrary()
  //               }}
  //             >
  //               <Image
  //                 style={styles.imageButtonBlue}
  //                 source={images.backgroundLargeButton}
  //               />
  //               <Text style={styles.textButtonBlue}>
  //                 {constant.IMPORT}
  //               </Text>
  //             </TouchableOpacity>
  //             <TouchableOpacity
  //               style={[styles.buttonBlue, { marginLeft: 20 }]}
  //               onPress={() => this.onPasteAddress()}
  //             >
  //               <Image
  //                 style={styles.imageButtonBlue}
  //                 source={images.backgroundLargeButton}
  //               />
  //               <Text style={styles.textButtonBlue}>
  //                 {constant.PASTE_ADDRESS}
  //               </Text>
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //       </View>
  //     )
  //   }
  // }

  // const styles = StyleSheet.create({
  //   camera: {
  //     width,
  //     height: width
  //   },
  //   viewButtonBottom: {
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //     alignSelf: 'center',
  //     width: width - 40,
  //     flex: 1
  //   },
  //   buttonBlue: {
  //     width: widthButton,
  //     height: 34,
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //     borderRadius: 5
  //   },
  //   imageButtonBlue: {
  //     width: widthButton,
  //     height: 34,
  //     borderRadius: 5,
  //     position: 'absolute'
  //   },
  //   textButtonBlue: {
  //     fontFamily: 'OpenSans-Semibold',
  //     fontSize: 14,
  //     color: AppStyle.mainColor
  //   }
  // })
  render() {
    return (
      <View style={{ flex: 1, paddingTop: isIphoneX() ? 64 : marginTop + 20, paddingBottom: isIphoneX() ? 33 : 0 }}>
        <NavigationHeader
          // containerStyle={[styles.header]}
          headerItem={{
            title: 'Scan QR Code',
            icon: null,
            button: images.backButton
          }}
          action={() => {
            // NavigationStore.popView()
            this.props.navigation.goBack()
          }}
          rightView={{
            rightViewIcon: this.state.enableFlash ? images.iconFlashOn : images.iconFlashOff,
            rightViewAction: () => {
              this.setState({ enableFlash: !this.state.enableFlash })
            }
          }}
        />
        <View
          style={{ flex: 1 }}
        >
          {this.state.showCamera && (
            <RNCamera
              style={[styles.camera]}
              onBarCodeRead={(e) => { this._handleBarCodeRead(e) }}
              permissionDialogTitle="Permission to use camera"
              permissionDialogMessage="We need your permission to use your camera phone "
              notAuthorizedView={
                this._renderNotAuthorizedView()
              }
              type={RNCamera.Constants.Type.back}
              flashMode={this.state.enableFlash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
            >
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={images.imgScanFrame}
                />
                <Text
                  style={styles.description}
                >
                  Automatically Scan The QR Code Into The Frame
                </Text>
              </View>
            </RNCamera>
          )}
          <TouchableOpacity
            style={styles.buttonBlue}
            onPress={() => {
              this.openImageLibrary()
            }}
          >
            <Image
              source={images.iconAddPhoto}
            />
            <Text style={styles.textButtonBlue}>
              {constant.ADD_FROM_ALBUM}
            </Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: AppStyle.backgroundDarkBlue,
    position: 'absolute',
    bottom: 0,
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
    marginTop: 20,
    fontFamily: 'OpenSans-Light',
    fontSize: 14,
    color: AppStyle.mainTextColor
  }
  // header: {
  //   position: 'absolute',
  //   zIndex: 1000,
  //   left: 0,
  //   right: 0
  // }
})
