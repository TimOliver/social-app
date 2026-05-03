import {useMemo} from 'react'
import {useWindowDimensions} from 'react-native'

import {IS_IPAD} from '#/env'

export type ReadableContentInsets = {
  left: number
  right: number
  top: number
  bottom: number
}

const ZERO_INSETS: ReadableContentInsets = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
}

// Apple's `UIView.readableContentGuide` caps content to roughly this width
// at the default Dynamic Type setting. Computing the insets in JS avoids a
// race with UIKit's layout on rotation that left the bridged native call
// returning stale values mid-rotation.
const READABLE_MAX_WIDTH = 672

/**
 * Returns the horizontal/vertical insets that approximate
 * `UIView.readableContentGuide` at the current window size.
 *
 * On iPad these cap content to a comfortable reading width — useful for
 * left/right padding on vertically-scrolling feeds. On iPhone, web, and
 * Android, returns zero insets.
 */
export function useReadableContentInsets(): ReadableContentInsets {
  const {width} = useWindowDimensions()
  return useMemo(() => {
    if (!IS_IPAD || width <= READABLE_MAX_WIDTH) return ZERO_INSETS
    const horizontal = (width - READABLE_MAX_WIDTH) / 2
    return {left: horizontal, right: horizontal, top: 0, bottom: 0}
  }, [width])
}
