import {Platform} from 'react-native'
import {requireNativeModule} from 'expo-modules-core'

import {type AudioCategory} from './types'

const NativeModule = requireNativeModule('ExpoPlatformInfo')

export function getIsReducedMotionEnabled(): boolean {
  return NativeModule.getIsReducedMotionEnabled()
}

export function getCornerAdaptedMargins(): {left: number; right: number} {
  if (Platform.OS !== 'ios') return {left: 0, right: 0}
  return NativeModule.getCornerAdaptedMargins()
}

export function setAudioActive(active: boolean): void {
  if (Platform.OS !== 'ios') return
  NativeModule.setAudioActive(active)
}

export function setAudioCategory(audioCategory: AudioCategory): void {
  if (Platform.OS !== 'ios') return
  NativeModule.setAudioCategory(audioCategory)
}
