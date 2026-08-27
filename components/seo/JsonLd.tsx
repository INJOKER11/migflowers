/**
 * One place that writes a `<script type="application/ld+json">`. The payload is
 * ours, never user input, so `dangerouslySetInnerHTML` is safe here — but `<`
 * is still escaped, because a literal `</script>` inside JSON would close the
 * tag early and break the page.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
