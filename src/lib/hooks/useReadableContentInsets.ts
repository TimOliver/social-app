import {useWindowDimensions} from 'react-native'

import {useAlf} from '#/alf'
import {IS_IPAD} from '#/env'

export type ReadableContentInsets = {left: number; right: number}

const ZERO_INSETS: ReadableContentInsets = {left: 0, right: 0}

// Apple's `UIView.readableContentGuide` caps content to roughly this width
// at the default Dynamic Type setting (~17pt body). The line length stays
// roughly constant in characters, so the readable column scales with the
// effective font size — i.e. larger text → wider column.
const BASE_READABLE_WIDTH = 750

/**
 * Cap on iPad media (images, videos, link-card thumbnails) so they don't
 * stretch edge-to-edge.
 */
export const IPAD_MEDIA_MAX_HEIGHT = 320

/**
 * Approximation of `UIView.readableContentGuide`. Returns horizontal insets
 * on iPad; zero on iPhone, web, and Android. Reactive to rotation, iOS
 * Dynamic Type (via `useWindowDimensions().fontScale`), and Bluesky's
 * in-app font-size preference (via `useAlf().fonts.scaleMultiplier`).
 */
export function useReadableContentInsets(): ReadableContentInsets {
  const {width, fontScale} = useWindowDimensions()
  const {fonts} = useAlf()
  if (!IS_IPAD) return ZERO_INSETS
  const readableMaxWidth =
    BASE_READABLE_WIDTH * fontScale * fonts.scaleMultiplier
  if (width <= readableMaxWidth) return ZERO_INSETS
  const horizontal = (width - readableMaxWidth) / 2
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
