'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Check, STROKE_LIGHT } from '@/components/ui/icons';
import { askQuestion, ValidationError, type FieldErrors } from '@/lib/api';
import { SHOP_DETAILS } from '@/lib/content';
import { useDict } from '@/lib/dictionary-context';
import { useLocale } from '@/lib/use-locale';
import { fill } from '@/lib/format';

/** The named fields, so a 422 about anything else can still be shown as a
    general error rather than disappearing. */
const NAMED_FIELDS = ['name', 'contact', 'order_number', 'question'];

export function ContactForm() {
  const locale = useLocale();
  const t = useDict().contact;

  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const send = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    const data = new FormData(e.currentTarget);
    const text = (name: string) => String(data.get(name) ?? '').trim();

    setErrors({});
    setSending(true);
    try {
      await askQuestion(
        {
          name: text('name'),
          contact: text('contact'),
          question: text('question'),
          order_number: text('order_number') || undefined,
        },
        locale,
      );
    } catch (error) {
      setErrors(
        error instanceof ValidationError
          ? error.fields
          : { form: [fill(t.failed, { phone: SHOP_DETAILS.phone })] },
      );
      setSending(false);
      return;
    }

    setSending(false);
    setSent(true);
  };

  const generalError = Object.entries(errors).find(([key]) => !NAMED_FIELDS.includes(key))?.[1][0];

  const field = (name: string, placeholder: string, label = placeholder) => {
    const message = errors[name]?.[0];
    return (
      <div>
        <input
          name={name}
          className={message ? 'input input-invalid' : 'input'}
          placeholder={placeholder}
          aria-label={label}
          aria-invalid={message ? true : undefined}
          aria-describedby={message ? `${name}-error` : undefined}
        />
        {message && (
          <p className="field-error" id={`${name}-error`}>
            {message}
          </p>
        )}
      </div>
    );
  };

  if (sent) {
    return (
      <div
        className="card"
        style={{ padding: 26, textAlign: 'center' }}
        role="status"
        aria-live="polite"
      >
        {/* `.card` is a flex column, so a fixed-width child sits at the start
            of the cross axis — `text-align` never reaches it. */}
        <Check
          size={34}
          strokeWidth={STROKE_LIGHT}
          color="var(--color-accent)"
          style={{ display: 'block', margin: '0 auto' }}
        />
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, margin: '16px 0 10px' }}>
          {t.sentTitle}
        </div>
        <p
          style={{
            margin: '0 auto',
            maxWidth: '38ch',
            fontSize: 14.5,
            lineHeight: 1.8,
            color: 'var(--color-neutral-700)',
          }}
        >
          {t.sent}
        </p>
        {/* Unmounting the form is what clears it — the inputs are uncontrolled,
            so coming back here gives a fresh set rather than the old answers. */}
        <Button
          variant="ghost"
          cta="sm"
          style={{ marginTop: 20, padding: '10px 22px', alignSelf: 'center' }}
          onClick={() => setSent(false)}
        >
          {t.sendAnother}
        </Button>
      </div>
    );
  }

  return (
    <form className="card" style={{ padding: 26 }} onSubmit={send} noValidate>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, marginBottom: 18 }}>
        {t.formTitle}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {field('name', t.fName)}
        {field('contact', t.fContact)}
        {field('order_number', t.fOrder, t.fOrderAria)}
        <div>
          <textarea
            name="question"
            className={errors.question ? 'input input-invalid' : 'input'}
            placeholder={t.fMessage}
            aria-label={t.fMessageAria}
            aria-invalid={errors.question ? true : undefined}
            aria-describedby={errors.question ? 'question-error' : undefined}
            rows={5}
          />
          {errors.question && (
            <p className="field-error" id="question-error">
              {errors.question[0]}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        block
        cta
        style={{ marginTop: 18, padding: '13px 0' }}
        disabled={sending}
      >
        {sending ? t.sending : t.send}
      </Button>

      {generalError && (
        <p className="field-error" role="alert" style={{ marginTop: 12 }}>
          {generalError}
        </p>
      )}

      <div style={{ fontSize: 12, color: 'var(--color-neutral-600)', marginTop: 10 }}>
        {t.idle}
      </div>
    </form>
  );
}
