import { prefs } from '../core/preferences';


export type MapRouletteUpdateTiming = 'with_save' | 'right_away';

const PREF_KEY = 'maproulette-update-timing';


export function getMapRouletteUpdateTiming(): MapRouletteUpdateTiming {
  const raw = prefs(PREF_KEY) as unknown;
  return raw === 'right_away' ? 'right_away' : 'with_save';
}


export function setMapRouletteUpdateTiming(value: MapRouletteUpdateTiming): void {
  prefs(PREF_KEY, value === 'right_away' ? 'right_away' : 'with_save');
}
