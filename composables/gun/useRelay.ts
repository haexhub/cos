/**
 * Relay connection management
 * @module Relay
 * @group Database
 */

import { useGun } from "./composables";
import { computed, reactive, watch } from "vue";
import type { Ref } from "vue";
import { useStorage } from "@vueuse/core";
//@ts-ignore
import ms from "ms";

import config from "@/gun.config.json";
import { skipHydrate, storeToRefs } from "pinia";

const defaultPeer = config.relay;

/**
 * Peer server status reactive object
 * @example
 * {
 * "peer": "https://peer.era.eco/gun",
 * "hostname": "6db1edbb5aae",
 * "status": "running",
 * "started": 1642666725795,
 * "pulse": 1642677007483,
 * "lag": 8,
 * "diff": 10281688,
 * "age": "3h",
 * "delay": 22,
 * "blink": true
 * }
 */

export interface IRelay {
  age: string;
  blink: boolean;
  diff: number;
  hostname: string;
  initiated: boolean;
  lag: number;
  peer: string;
  pulse: number;
  started: number;
  status: string;
}

/**
 * Peer server status monitor
 * @returns {useRelay}
 *
 * @example
 * import { useRelay } from '@gun-vue/composables';
 *
 * const { relay, setPeer, resetPeer } = useRelay()
 */
export const useRelay = defineStore("useRelay", () => {
  const relay: IRelay = reactive({
    age: computed(() => ms(relay.diff)),
    blink: false,
    delay: computed(() => Date.now() - relay.pulse),
    diff: computed(() => relay.pulse - relay.started),
    hostname: computed(() => new URL(relay.peer)?.hostname || ""),
    initiated: false,
    lag: 0,
    list: [],
    peer: skipHydrate(useStorage("peer", defaultPeer)),
    pulse: 0,
    started: 0,
    status: "offline",
  });

  /*  const init = () => {
    const { gun } = useGun();

    if (relay.initiated || !gun) return;

    console.log("useRelay gun", gun);

    if (relay.pulse == 0 && relay.hostname) {
      gun
        .get(relay.hostname)
        .map()
        .on((d: string, k: string) => {
          try {
            //@ts-ignore
            relay[k] = d;
          } catch (e) {
            console.log(e);
          }
        });
    }
  }; 

  init();
  */

  const resetPeer = () => {
    relay.peer = defaultPeer;
    setTimeout(() => {
      window.location.reload(), 700;
    });
  };

  const setPeer = (url: string) => {
    relay.peer = url;
    setTimeout(() => {
      window.location.reload(), 700;
    });
  };

  return { relay, setPeer, resetPeer };
});
