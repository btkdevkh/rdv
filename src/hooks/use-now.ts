import {useEffect, useState} from "react";

/** How often the clock ticks. Minute resolution is enough for "en retard". */
const TICK_MS = 60_000;

/**
 * A Date that refreshes on an interval, so an appointment moves from "À venir"
 * to "En retard" while the screen is open instead of only on reload.
 *
 * Returning one shared instant per render also keeps the counts and the cards
 * in agreement — computing `new Date()` in several places could straddle a
 * minute boundary and disagree.
 */
export function useNow(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(interval);
  }, []);

  return now;
}
