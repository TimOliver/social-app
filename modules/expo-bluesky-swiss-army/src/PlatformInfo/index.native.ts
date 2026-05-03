import {Platform} from 'react-native'
import {requireNativeModule} from 'expo-modules-core'

import {type AudioCategory, type ReadableContentInsets} from './types'

const NativeModule = requireNativeModule('ExpoPlatformInfo')

export function getIsReducedMotionEnabled(): boolean {
  return NativeModule.getIsReducedMotionEnabled()
}

export function getReadableContentInsets(): ReadableContentInsets {
  if (Platform.OS !== 'ios') {
    return {left: 0, right: 0, top: 0, bottom: 0}
  }
  return NativeModule.getReadableContentInsets()
}

export function setAudioActive(active: boolean): void {
  if (Platform.OS !== 'ios') return
  NativeModule.setAudioActive(active)
}

export function setAudioCategory(audioCategory: AudioCategory): void {
  if (Platform.OS !== 'ios') return
  NativeModule.setAudioCategory(audioCategory)
}
