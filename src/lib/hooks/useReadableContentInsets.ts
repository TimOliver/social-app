import {useEffect, useState} from 'react'
import {Dimensions} from 'react-native'

import {IS_IPAD} from '#/env'
import {
  PlatformInfo,
  type ReadableContentInsets,
} from '../../../modules/expo-bluesky-swiss-army'

const ZERO_INSETS: ReadableContentInsets = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
}

/**
 * Returns the insets `UIView.readableContentGuide` would apply to a
 * full-screen view at the current screen size and Dynamic Type setting.
 *
 * On iPad these cap content to a comfortable reading width — useful for
 * left/right padding on vertically-scrolling feeds. On iPhone, web, and
 * Android, returns zero insets (the surrounding layout already handles
 * comfortable widths there).
 *
 * Re-evaluates on dimension change (e.g. rotation).
 */
export function useReadableContentInsets(): ReadableContentInsets {
  const [insets, setInsets] = useState<ReadableContentInsets>(() =>
    IS_IPAD ? PlatformInfo.getReadableContentInsets() : ZERO_INSETS,
  )

  useEffect(() => {
    if (!IS_IPAD) return
    const sub = Dimensions.addEventListener('change', () => {
      setInsets(PlatformInfo.getReadableContentInsets())
    })
    return () => sub.remove()
  }, [])

  return insets
}
