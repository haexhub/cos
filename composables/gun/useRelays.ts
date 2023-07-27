/**
 * Loads the [list of active volunteer DHT gun nodes](https://github.com/amark/gun/wiki/volunteer.dht)  and benchmarks ping for them
 * @module Relays
 * @group Database
 */

interface Relay {
  host: string;
  url: string;
  ping: string;
}

type Relays = Relay[];

import urlRegex from "url-regex";
import { reactive } from "vue";
import { useRelay } from "./useRelay";

/**
 * Load the list of the relays
 */

/**
 * Gets the list of actual gun relays and tool to update the list
 * @returns {useRelays}
 * @example
 * import { useRelays } from '@gun-vue/composables'
 * const { relays, errors, loadRelays } = useRelays()
 */

export const useRelays = defineStore("useRelays", () => {
  const relays = reactive({} as { [key: string]: Relay });
  const errors = reactive({} as { [key: string]: Response });

  const loadRelays = async ({
    source = "https://raw.githubusercontent.com/wiki/amark/gun/volunteer.dht.md",
  }): Promise<{}> => {
    let res = await fetch(source);
    let data = await res.text();
    const { relay } = useRelay();
    const urls = data.match(urlRegex());

    if (urls === null) return false;

    urls.push(relay.peer);
    const urlList = Array.from(urls);
    urlList.forEach((u: string) => {
      let testUrl = new URL(u);
      if (
        testUrl.pathname === "/gun" &&
        testUrl.pathname.indexOf("~~") === -1
      ) {
        let startMoment = performance.now();
        fetch(testUrl.href, {
          method: "HEAD",
          mode: "cors",
          // mode: 'no-cors',
          redirect: "follow",
          referrerPolicy: "no-referrer",
        })
          .then((response) => {
            let endMoment = performance.now();
            if (response.ok) {
              const rel: Relay = {
                host: testUrl.hostname,
                ping: (endMoment - startMoment).toFixed(),
                url: testUrl.href,
              };
              relays[testUrl.hostname] = rel;
            } else {
              errors[testUrl.hostname] = response;
            }
          })
          .catch((e) => {
            errors[testUrl.hostname] = e;
          });
      }
    });
    return relays;
  };

  return { relays, errors, loadRelays };
});
