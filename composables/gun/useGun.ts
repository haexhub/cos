/**
 * Gun DB initialization and basic methods
 * @module Gun
 * @group Database
 */

import type { GunOptions, IGunInstance } from "gun";

import Gun from "gun/gun";
import SEA from "gun/sea.js";
import "gun/lib/radix";
import "gun/lib/radisk";
import "gun/lib/store";
import "gun/lib/rindexed";
import "gun/lib/webrtc";
import "gun/nts";

import { useRelay } from "./useRelay";
import { skipHydrate, storeToRefs } from "pinia";

// https://github.com/amark/gun/wiki/volunteer.dht
// https://github.com/draeder/gun-relays

/** The main Gun instance for database operations */

/**
 * Instantiate a Gun instance for DB manipulations
 * @example
 * import { useGun } from '@gun-vue/composables'
 * const gun = useGun()
 */

export const useGun = defineStore(
  "useGun",
  (options: GunOptions = { localStorage: false }) => {
    let gun: IGunInstance = reactive({} as IGunInstance);

    const init = () => {
      const { relay } = useRelay();
      const opts = { peers: [relay.peer] };

      console.log(relay);
      if (typeof options === "object") {
        Object.assign(opts, options);
      }
      console.log(opts.peers);
      gun = new Gun(opts);
      console.log("gun", gun);
    };

    if (!("user" in gun)) {
      init();
    }

    const useGunPath = (...args: string[]) => {
      let g;
      for (let arg of args) {
        g = gun.get(arg);
      }
      return g || gun;
    };

    return {
      gun: skipHydrate(gun),
      useGunPath,
    };
  }
);

/**
 * SEA library
 * @constant SEA
 */
export { default as SEA } from "gun/sea.js";

/**
 * **Get a soul for any given node**
 * A wrapper for `Gun.node.soul`
 * @function soul
 */

// @ts-ignore: Incorrect GUN types
export const soul = Gun?.node?.soul;
