import { FREE_DELIVERY_THRESHOLD } from '@/lib/constants';
import type { Dictionary } from '@/lib/dictionaries';
import { uah } from '@/lib/format';

export function PromoBar({ dict }: { dict: Dictionary['chrome'] }) {
  return (
    <div className="promo-bar">
      {dict.promoDaily} ·&nbsp;{dict.promoFreeFrom} {uah(FREE_DELIVERY_THRESHOLD)}
    </div>
  );
}
