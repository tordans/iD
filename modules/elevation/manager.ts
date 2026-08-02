import { dispatch as d3_dispatch } from 'd3-dispatch';

import {
  MAPTERHORN_OVERLAY_ID,
  MAPTERHORN_TILE_SIZE,
  MAPTERHORN_TILE_TEMPLATE
} from './constants';
import { DemTileCache } from './tile_cache';
import { buildElevationProfile } from './profile';
import type { ProfilePoint } from './profile';

export interface ElevationHover {
  loc: [number, number];
  distance: number;
  elevation: number | null;
}

export function elevationManager(context: iD.Context) {
  const dispatch = d3_dispatch('change', 'hover', 'profile');
  const cache = new DemTileCache(120);

  let _profile: ProfilePoint[] = [];
  let _profileWayId: EntityID | null = null;
  let _profileLoading = false;
  let _loadGeneration = 0;
  let _hover: ElevationHover | null = null;
  let _mapHoverEnabled = false;

  const manager = {
    tileCache: () => cache,
    template: () => MAPTERHORN_TILE_TEMPLATE,
    tileSize: () => MAPTERHORN_TILE_SIZE,
    overlayId: () => MAPTERHORN_OVERLAY_ID,

    profile: () => _profile,
    profileWayId: () => _profileWayId,
    profileLoading: () => _profileLoading,
    hover: () => _hover,

    showsOverlay: () => {
      const source = context.background().findSource(MAPTERHORN_OVERLAY_ID);
      return source ? context.background().showsLayer(source) : false;
    },

    panelActive: () => {
      const ui = context.ui() as unknown as { info?: { isActive?: (id: string) => boolean } };
      return !!(ui.info && ui.info.isActive && ui.info.isActive('elevation'));
    },

    ensurePanelOpen: () => {
      if (!manager.panelActive()) {
        const ui = context.ui() as unknown as { info: { toggle: (id: string) => void } };
        ui.info.toggle('elevation');
      }
      return manager;
    },

    setMapHoverEnabled: (val: boolean) => {
      _mapHoverEnabled = val;
      return manager;
    },

    mapHoverEnabled: () => _mapHoverEnabled,

    setHover: (hover: ElevationHover | null) => {
      _hover = hover;
      dispatch.call('hover', manager, hover);
      return manager;
    },

    clearHover: () => manager.setHover(null),

    toggleOverlay: (show?: boolean) => {
      const source = context.background().findSource(MAPTERHORN_OVERLAY_ID);
      if (!source) return manager;

      const isOn = context.background().showsLayer(source);
      const shouldShow = show !== undefined ? show : !isOn;

      if (shouldShow !== isOn) {
        context.background().toggleOverlayLayer(source);
        if (shouldShow) {
          manager.ensurePanelOpen();
        }
      }
      return manager;
    },

    loadProfileForWay: async (wayId: EntityID, options?: { force?: boolean }) => {
      const entity = context.hasEntity(wayId);
      if (!entity || entity.geometry(context.graph()) !== 'line') {
        _loadGeneration++;
        _profile = [];
        _profileWayId = null;
        _profileLoading = false;
        dispatch.call('profile', manager);
        return;
      }

      if (!options?.force && _profileWayId === wayId && _profile.length && !_profileLoading) return;

      const generation = ++_loadGeneration;
      _profileWayId = wayId;
      _profileLoading = true;
      dispatch.call('profile', manager);

      const coords = entity.nodes.map((nodeId: EntityID) => {
        const node = context.entity(nodeId);
        return node.loc as [number, number];
      });

      try {
        const profile = await buildElevationProfile(
          coords,
          MAPTERHORN_TILE_TEMPLATE,
          MAPTERHORN_TILE_SIZE,
          cache
        );

        if (generation !== _loadGeneration) return;

        _profile = profile;
      } catch {
        if (generation !== _loadGeneration) return;
        _profile = [];
      } finally {
        if (generation === _loadGeneration) {
          _profileLoading = false;
          dispatch.call('profile', manager);
        }
      }
    },

    clearProfile: () => {
      _loadGeneration++;
      _profile = [];
      _profileWayId = null;
      _profileLoading = false;
      _hover = null;
      dispatch.call('profile', manager);
      dispatch.call('hover', manager, null);
    }
  };

  return Object.assign(manager, { on: dispatch.on, off: dispatch.on });
}

export type ElevationManager = ReturnType<typeof elevationManager>;
