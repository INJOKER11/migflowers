import { FREE_DELIVERY_THRESHOLD, SAME_DAY_CUTOFF } from '@/lib/constants';
import type { Dictionary } from '@/lib/dictionaries';
import { uah } from '@/lib/format';

export function PromoBar({ dict }: { dict: Dictionary['chrome'] }) {
  return (
    <div className="promo-bar">
      {dict.promoBefore} {SAME_DAY_CUTOFF}&nbsp;{dict.promoAfter} {uah(FREE_DELIVERY_THRESHOLD)}
    </div>
  );
}
