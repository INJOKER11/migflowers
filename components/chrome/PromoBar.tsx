import { FREE_DELIVERY_THRESHOLD, SAME_DAY_CUTOFF } from '@/lib/constants';
import { uah } from '@/lib/format';

export function PromoBar() {
  return (
    <div className="promo-bar">
      Замовлення до {SAME_DAY_CUTOFF} — доставка сьогодні&nbsp;·&nbsp;Безкоштовна доставка від{' '}
      {uah(FREE_DELIVERY_THRESHOLD)}
    </div>
  );
}
