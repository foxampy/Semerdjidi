import React from 'react';

interface EthosiumTotemProps {
  size?: number;
  className?: string;
}

export const EthosiumTotem: React.FC<EthosiumTotemProps> = ({ size = 28, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 ${className}`}
      aria-label="EthOSium Universal Totem"
    >
      <defs>
        {/* Golden Totem Gradient */}
        <linearGradient id="totemGold" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F0E2C8" />
          <stop offset="35%" stopColor="#BA9470" />
          <stop offset="70%" stopColor="#8F6A44" />
          <stop offset="100%" stopColor="#BA9470" />
        </linearGradient>

        {/* Sage Spiritual Gradient */}
        <linearGradient id="totemSage" x1="15" y1="50" x2="85" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7E8A63" />
          <stop offset="50%" stopColor="#A9B489" />
          <stop offset="100%" stopColor="#7E8A63" />
        </linearGradient>

        <filter id="totemGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#BA9470" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Outer Sacred Harmonic Orbit Ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="url(#totemSage)"
        strokeWidth="1.2"
        strokeDasharray="2 4"
        opacity="0.6"
      />

      {/* Secondary Concentric Harmonic Shield */}
      <circle
        cx="50"
        cy="50"
        r="36"
        stroke="#A9B489"
        strokeWidth="0.8"
        opacity="0.4"
      />

      {/* Central Totem Axis: Vertical Spire of Balance */}
      <line
        x1="50"
        y1="8"
        x2="50"
        y2="92"
        stroke="url(#totemGold)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Horizontal Horizon Equator */}
      <line
        x1="22"
        y1="50"
        x2="78"
        y2="50"
        stroke="#BA9470"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Upper Diamond Crown (System & Mind - LabForge / Spire) */}
      <path
        d="M50 12 L66 32 L50 44 L34 32 Z"
        stroke="url(#totemGold)"
        strokeWidth="1.8"
        fill="#3c402f"
        fillOpacity="0.7"
        strokeLinejoin="round"
      />

      {/* Lower Diamond Vessel (Grounding & Roots - Semerdzhidi / Roots) */}
      <path
        d="M50 56 L66 68 L50 88 L34 68 Z"
        stroke="url(#totemGold)"
        strokeWidth="1.8"
        fill="#3c402f"
        fillOpacity="0.7"
        strokeLinejoin="round"
      />

      {/* Totem Stepped Wings (Upper Consciousness & Lower Grounding) */}
      <path
        d="M26 38 L38 38 L44 32"
        stroke="url(#totemSage)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M74 38 L62 38 L56 32"
        stroke="url(#totemSage)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M26 62 L38 62 L44 68"
        stroke="url(#totemSage)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M74 62 L62 62 L56 68"
        stroke="url(#totemSage)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sacred Central Nexus Totem Core */}
      <circle
        cx="50"
        cy="50"
        r="8"
        stroke="url(#totemGold)"
        strokeWidth="1.6"
        fill="#453d2d"
        filter="url(#totemGlow)"
      />
      {/* Central Inner Seed / Eye of Totem */}
      <circle
        cx="50"
        cy="50"
        r="3.2"
        fill="#F0E2C8"
      />

      {/* Cardinal Totem Points */}
      <circle cx="50" cy="8" r="2" fill="#BA9470" />
      <circle cx="50" cy="92" r="2" fill="#BA9470" />
      <circle cx="22" cy="50" r="1.8" fill="#A9B489" />
      <circle cx="78" cy="50" r="1.8" fill="#A9B489" />
    </svg>
  );
};
