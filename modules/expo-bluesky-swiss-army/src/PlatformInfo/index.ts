import {NotImplementedError} from '../NotImplemented'
import {type AudioCategory, type ReadableContentInsets} from './types'

export function getIsReducedMotionEnabled(): boolean {
  throw new NotImplementedError()
}

/**
 * Returns the insets that UIView's `readableContentGuide` would apply to a
 * full-screen view at the current screen size and Dynamic Type setting. On
 * iPad these constrain content to a comfortable reading width; on iPhone
 * they're typically just the layout margins.
 *
 * @platform ios
 */
export function getReadableContentInsets(): ReadableContentInsets {
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
