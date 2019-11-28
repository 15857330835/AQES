export default {
  // videoHeight: state => {
  //   if (state.clientwidth >= 1440) {
  //     return (
  //       ((state.clientwidth - 36) *
  //         state.all.track_property.fanwei["1920"].now *
  //         9) /
  //         16 +
  //       67
  //     );
  //   } else {
  //     return (
  //       ((state.clientwidth - 36) *
  //         state.all.track_property.fanwei["1440"].now *
  //         9) /
  //         16 +
  //       67
  //     );
  //   }
  // },
  aspect_ratio: state => {
    function gcd(a, b) {
      let temp
      while (b !== 0) {
        temp = a % b
        // eslint-disable-next-line no-param-reassign
        a = b
        // eslint-disable-next-line no-param-reassign
        b = temp
      }
      return a
    }
    const player = state.systemmessage.player
    const commonFactor = gcd(player.w, player.h)
    return player.w / commonFactor + ':' + player.h / commonFactor
  }
}
