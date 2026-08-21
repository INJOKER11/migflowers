
export function ShopMap() {
  return (
    <div
      style={{
        marginTop: 28,
        border: '1px solid var(--color-divider)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'var(--color-neutral-200)',
        position: 'relative',
        aspectRatio: '3/2',
      }}
    >
      <svg
        viewBox="0 0 300 200"
        style={{ width: '100%', height: '100%', display: 'block' }}
        role="img"
        aria-label="Схема: крамниця на Соборній площі, 14"
      >
        <rect width="300" height="200" fill="#eae7e7" />
        <path
          d="M0 60 H300 M0 132 H300 M74 0 V200 M196 0 V200"
          stroke="#d7d3d3"
          strokeWidth="9"
          fill="none"
        />
        <path
          d="M0 60 H300 M0 132 H300 M74 0 V200 M196 0 V200"
          stroke="#f8f4f4"
          strokeWidth="5"
          fill="none"
        />
        <rect x="96" y="76" width="80" height="42" fill="#d7d3d3" />
        <text x="112" y="101" fontFamily="Lora, serif" fontSize="9" fill="#7d7979">
          Соборна пл.
        </text>
        <circle cx="182" cy="70" r="7" fill="none" stroke="#b68235" strokeWidth="2" />
        <circle cx="182" cy="70" r="2.5" fill="#b68235" />
        <text x="196" y="74" fontFamily="Lora, serif" fontSize="9" fill="#201f1d">
          MIG Flowers
        </text>
      </svg>
    </div>
  );
}
