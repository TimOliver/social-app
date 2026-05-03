import {useWindowDimensions} from 'react-native'

import {IS_IPAD} from '#/env'

export type ReadableContentInsets = {left: number; right: number}

// Apple's `UIView.readableContentGuide` caps content to roughly this width
// at the default Dynamic Type setting. Computing the insets in JS avoids a
// race with UIKit's layout on rotation that left the bridged native call
// returning stale values mid-rotation.
const READABLE_MAX_WIDTH = 672

/**
 * Cap on iPad media (images, videos, link-card thumbnails) so they don't
 * stretch edge-to-edge.
 */
export const IPAD_MEDIA_MAX_HEIGHT = 320

/**
 * Approximation of `UIView.readableContentGuide`. Returns horizontal insets
 * on iPad; zero on iPhone, web, and Android.
 *
 * Computed inline (no `useMemo`) on top of `useWindowDimensions` so the
 * value tracks rotation in lockstep — any layer of memoization downstream
 * would observe the inset object's identity changing along with its values.
 */
export function useReadableContentInsets(): ReadableContentInsets {
  const {width} = useWindowDimensions()
  if (!IS_IPAD || width <= READABLE_MAX_WIDTH) {
    return {left: 0, right: 0}
  }
  const horizontal = (width - READABLE_MAX_WIDTH) / 2
  return {left: horizontal, right: horizontal}
}

/**
 * Returns a style object that applies `paddingLeft`/`paddingRight` matching
 * the readable-content insets — or `null` when no inset should apply.
 */
export function useReadableInsetStyle(): {
  paddingLeft: number
  paddingRight: number
} | null {
  const {left, right} = useReadableContentInsets()
  if (!left && !right) return null
  return {paddingLeft: left, paddingRight: right}
}
