'use client';

import { useState } from 'react';
import type { Faq } from '@/types';

export function Accordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<Record<number, boolean>>({});

  return (
    <>
      {items.map((item, i) => {
        const isOpen = !!open[i];
        return (
          <div key={item.q} className="faq-row">
            <button
              type="button"
              className="faq-q"
              aria-expanded={isOpen}
              aria-controls={`faq-a-${i}`}
              onClick={() => setOpen((state) => ({ ...state, [i]: !state[i] }))}
            >
              <span>{item.q}</span>
              <span className="faq-sign" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {/* Closed answers stay in the markup, hidden: rendering them only
                when open left them out of the server HTML, so search engines
                saw the questions and none of the answers. */}
            <p id={`faq-a-${i}`} className="faq-a" hidden={!isOpen}>
              {item.a}
            </p>
          </div>
        );
      })}
    </>
  );
}
