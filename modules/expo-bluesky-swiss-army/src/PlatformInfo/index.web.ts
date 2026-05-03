import {NotImplementedError} from '../NotImplemented'
import {type AudioCategory} from './types'

export function getIsReducedMotionEnabled(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function getCornerAdaptedMargins(): {left: number; right: number} {
  return {left: 0, right: 0}
}

export function setAudioActive(active: boolean): void {
  throw new NotImplementedError({active})
}

export function setAudioCategory(audioCategory: AudioCategory): void {
  throw new NotImplementedError({audioCategory})
}
