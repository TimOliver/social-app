import {NotImplementedError} from '../NotImplemented'
import {type AudioCategory, type ReadableContentInsets} from './types'

export function getIsReducedMotionEnabled(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function setAudioActive(active: boolean): void {
  throw new NotImplementedError({active})
}

export function setAudioCategory(audioCategory: AudioCategory): void {
  throw new NotImplementedError({audioCategory})
}

export function getReadableContentInsets(): ReadableContentInsets {
  return {left: 0, right: 0, top: 0, bottom: 0}
}
