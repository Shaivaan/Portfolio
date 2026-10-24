// Animated developer at a laptop for the hero, drawn after Shivanshu: thick black hair with
// a fringe, round thin-framed glasses, light stubble and a black-and-white striped tee.
// Pure SVG + CSS (animations in globals.css), colored with theme tokens where it can follow
// dark/light mode.

const SKIN = "#c98e6a";
const SKIN_SHADE = "#a86f4f";
const HAIR = "#15110f";
const TEE = "#1a1a1a";
const STRIPE = "#e5e7eb";

// Code lines in the floating editor: x offset (indent), width, color
const codeLines = [
  { x: 0, w: 110, color: "#c084fc" },
  { x: 14, w: 140, color: "var(--accent)" },
  { x: 14, w: 96, color: "#4ade80" },
  { x: 14, w: 124, color: "var(--accent)" },
  { x: 0, w: 40, color: "#c084fc" },
];

const stripeRows = Array.from({ length: 10 }, (_, index) => 222 + index * 9);

export function CoderIllustration() {
  return (
    <svg
      viewBox="0 0 420 360"
      role="img"
      aria-label="Illustration of Shivanshu writing code on a laptop"
      className="h-auto w-full max-w-sm"
    >
      <defs>
        <clipPath id="coder-tee">
          <path d="M228 302 C228 238 250 214 300 214 C350 214 372 238 372 302 Z" />
        </clipPath>
      </defs>

      {/* Floating code editor */}
      <g className="coder-float">
        <rect x="16" y="20" width="230" height="140" rx="14" fill="var(--card)" stroke="var(--border)" strokeWidth="2" />
        <circle cx="36" cy="40" r="5" fill="#f87171" />
        <circle cx="52" cy="40" r="5" fill="#fbbf24" />
        <circle cx="68" cy="40" r="5" fill="#4ade80" />
        {codeLines.map((line, index) => (
          <rect
            key={index}
            className="coder-line"
            style={{ animationDelay: `${index * 0.6}s` }}
            x={36 + line.x}
            y={62 + index * 18}
            width={line.w}
            height="8"
            rx="4"
            fill={line.color}
          />
        ))}
        <rect className="coder-cursor" x="82" y="134" width="3" height="12" fill="var(--foreground)" />
      </g>

      {/* "Build passed" chip, pops in once the code is typed */}
      <g className="coder-chip">
        <rect x="270" y="44" width="128" height="34" rx="17" fill="var(--card)" stroke="var(--border)" strokeWidth="2" />
        <circle cx="290" cy="61" r="8" fill="#22c55e" />
        <path d="M286 61l3 3 5-6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="304" y="66" fontSize="13" fontWeight="600" fill="var(--foreground)" fontFamily="var(--font-inter), sans-serif">
          Build passed
        </text>
      </g>

      {/* Striped tee */}
      <path d="M228 302 C228 238 250 214 300 214 C350 214 372 238 372 302 Z" fill={TEE} />
      <g clipPath="url(#coder-tee)" stroke={STRIPE} strokeWidth="2.6">
        {stripeRows.map((y) => (
          <path key={y} d={`M220 ${y} H380`} />
        ))}
      </g>

      {/* Forearms reaching the keyboard */}
      <path className="coder-hand-left" d="M242 250 C236 272 240 290 254 300" fill="none" stroke={SKIN} strokeWidth="14" strokeLinecap="round" />
      <path className="coder-hand-right" d="M358 250 C364 272 360 290 346 300" fill="none" stroke={SKIN} strokeWidth="14" strokeLinecap="round" />

      {/* Head, nodding gently */}
      <g className="coder-head">
        <rect x="290" y="196" width="20" height="24" rx="6" fill={SKIN} />
        <path d="M286 216 q14 12 28 0" fill="none" stroke="#0a0a0a" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="268" cy="174" rx="5" ry="8" fill={SKIN} />
        <ellipse cx="332" cy="174" rx="5" ry="8" fill={SKIN} />
        <ellipse cx="300" cy="170" rx="31" ry="37" fill={SKIN} />

        {/* Stubble: jaw and moustache */}
        <path d="M272 184 C276 202 288 210 300 210 C312 210 324 202 328 184 C322 198 312 204 300 204 C288 204 278 198 272 184 Z" fill={HAIR} opacity="0.28" />
        <path d="M290 192 q10 -5 20 0 q-10 3 -20 0 Z" fill={HAIR} opacity="0.5" />
        <path d="M292 198 q8 4 16 0" fill="none" stroke="#6b3f2a" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M300 174 q-4 9 2 11" fill="none" stroke={SKIN_SHADE} strokeWidth="2" strokeLinecap="round" />

        {/* Thick hair: volume on top, fringe dipping onto the forehead, forehead visible */}
        <path
          d="M269 162 C259 130 276 105 302 105 C331 105 345 128 333 160 C330 150 326 143 320 140 C312 146 300 147 292 142 C286 147 279 150 273 152 C271 155 270 158 269 162 Z"
          fill={HAIR}
        />

        {/* Eyebrows */}
        <path d="M279 159 q8 -3 15 0 M306 159 q8 -3 15 0" fill="none" stroke={HAIR} strokeWidth="2.6" strokeLinecap="round" />

        {/* Round thin-framed glasses */}
        <g stroke="#3f3f46" strokeWidth="1.6">
          <circle cx="287" cy="172" r="10" fill="#ffffff" fillOpacity="0.12" />
          <circle cx="313" cy="172" r="10" fill="#ffffff" fillOpacity="0.12" />
          <path d="M297 171 q3 -2 6 0 M277 170 l-8 -2 M323 170 l8 -2" fill="none" />
        </g>
        <g className="coder-eyes">
          <circle cx="287" cy="173" r="2.4" fill={HAIR} />
          <circle cx="313" cy="173" r="2.4" fill={HAIR} />
        </g>
      </g>

      {/* Laptop (seen from behind) */}
      <path d="M240 240 h120 l-8 60 h-104 Z" fill="var(--chip)" stroke="var(--border)" strokeWidth="2" />
      <text
        className="coder-logo"
        x="300"
        y="277"
        textAnchor="middle"
        fontSize="20"
        fontWeight="700"
        fill="var(--accent)"
        fontFamily="ui-monospace, monospace"
      >
        {"</>"}
      </text>

      {/* Desk */}
      <rect x="140" y="304" width="270" height="8" rx="4" fill="var(--border)" />
      <rect x="226" y="298" width="148" height="6" rx="3" fill="var(--muted)" opacity="0.5" />

      {/* Coffee mug with steam */}
      <g>
        <path className="coder-steam" d="M168 262 q-5 -8 0 -16 q5 -8 0 -16" fill="none" stroke="var(--muted)" strokeWidth="2.5" strokeLinecap="round" />
        <path
          className="coder-steam"
          style={{ animationDelay: "1.2s" }}
          d="M182 262 q-5 -8 0 -16 q5 -8 0 -16"
          fill="none"
          stroke="var(--muted)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect x="158" y="268" width="34" height="36" rx="6" fill="var(--accent)" />
        <path d="M192 276 h6 a8 8 0 0 1 0 16 h-6" fill="none" stroke="var(--accent)" strokeWidth="5" />
      </g>

      {/* Floating braces */}
      <text
        className="coder-float"
        style={{ animationDelay: "0.6s" }}
        x="372"
        y="168"
        fontSize="26"
        fontWeight="700"
        fill="var(--muted)"
        fontFamily="ui-monospace, monospace"
      >
        {"{ }"}
      </text>
    </svg>
  );
}
