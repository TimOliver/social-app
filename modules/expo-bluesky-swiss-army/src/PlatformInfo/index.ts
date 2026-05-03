import {NotImplementedError} from '../NotImplemented'
import {type AudioCategory} from './types'

export function getIsReducedMotionEnabled(): boolean {
  throw new NotImplementedError()
}

/**
 * Horizontal insets that account for iPadOS 26 windowed-mode window
 * controls (traffic-light buttons), via the iOS 26 `UIView.LayoutRegion`
 * margins API. Returns zeros on older iOS / non-iPad platforms.
 *
 * @platform ios
 */
export function getCornerAdaptedMargins(): {left: number; right: number} {
  throw new NotImplementedError()
}

/**
 * Set whether the app's audio should mix with other apps' audio. Will also resume background music playback when `false`
 * if it was previously playing.
 * @param mixWithOthers
 * @see https://developer.apple.com/documentation/avfaudio/avaudiosession/setactiveoptions/1616603-notifyothersondeactivation
 */
export function setAudioActive(active: boolean): void {
  throw new NotImplementedError({active})
}

/**
 * Set the audio category for the app.
 * @param audioCategory
 * @platform ios
 */
export function setAudioCategory(audioCategory: AudioCategory): void {
  throw new NotImplementedError({audioCategory})
}
