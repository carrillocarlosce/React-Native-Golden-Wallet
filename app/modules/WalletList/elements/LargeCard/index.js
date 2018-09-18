import React, { Component } from 'react'

import { observer } from 'mobx-react/native'
import PropTypes from 'prop-types'
import FlipCard from '../../../../../Libs/react-native-flip-card'
import MainStore from '../../../../AppStores/MainStore'
import FrontCard from './FrontCard'
import BackCard from './BackCard'
import AddCard from './AddCard'

@observer
export default class LargeCard extends Component {
  static propTypes = {
    style: PropTypes.object,
    onPress: PropTypes.func,
    onAddPrivateKey: PropTypes.func,
    index: PropTypes.number.isRequired,
    onCopy: PropTypes.func,
    onBackup: PropTypes.func,
    onAlertBackup: PropTypes.func,
    onShare: PropTypes.func,
    onLongPress: PropTypes.func
  }

  static defaultProps = {
    style: {},
    onPress: () => { },
    onAddPrivateKey: () => { },
    onCopy: () => { },
    onBackup: () => { },
    onAlertBackup: () => { },
    onShare: () => { },
    onLongPress: () => { }
  }

  constructor(props) {
    super(props)

    this.state = {
      isFlipped: false
    }
  }

  onCopy = () => {
    const { onCopy } = this.props
    this.flipCard()
    onCopy()
  }

  get wallet() {
    const { index } = this.props
    const { length } = MainStore.appState.wallets
    return index < length ? MainStore.appState.wallets[index] : null
  }

  reflipCard() {
    if (this.state.isFlipped) {
      this.setState({
        isFlipped: false
      })
    }
  }

  flipCard() {
    this.setState({ isFlipped: !this.state.isFlipped })
  }

  renderAddCard = () =>
    (
      <AddCard {...this.props} />
    )

  renderFrontCard = () =>
    (
      <FrontCard
        {...this.props}
        onCopy={this.onCopy}
      />
    )

  renderBackCard = () =>
    (
      <BackCard
        {...this.props}
        onPress={this.flipCard.bind(this)}
      />
    )

  render() {
    const { wallet } = this
    if (!wallet) {
      return this.renderAddCard()
    }
    return (
      <FlipCard
        style={{ flex: 1 }}
        friction={6}
        perspective={1000}
        flipHorizontal
        flipVertical={false}
        flip={this.state.isFlipped}
      >
        {this.renderFrontCard()}
        {this.renderBackCard()}
      </FlipCard>
    )
  }
}
