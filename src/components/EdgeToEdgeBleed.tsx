import {useWindowDimensions, View} from 'react-native'

import {useReadableContentInsets} from '#/lib/hooks/useReadableContentInsets'
import {atoms as a, useTheme} from '#/alf'
import {IS_IPAD} from '#/env'

/**
 * A 1px horizontal divider that breaks out of the readable-content inset on
 * iPad to span the full screen width. Use to anchor sticky-feeling elements
 * (search bar, composer prompt) to the navigation chrome above the feed.
 */
export function EdgeToEdgeBleed() {
  const t = useTheme()
  const insets = useReadableContentInsets()
  const {width: screenWidth} = useWindowDimensions()
  return (
    <View
      style={[
        t.atoms.border_contrast_low,
        a.border_t,
        IS_IPAD ? {width: screenWidth, marginLeft: -insets.left} : a.w_full,
      ]}
    />
  )
}
