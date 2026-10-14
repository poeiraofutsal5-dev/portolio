import React from 'react';

interface JPXLogoProps {
  className?: string;
  height?: number | string;
}

export const JPXLogo: React.FC<JPXLogoProps> = ({ className = '', height = 28 }) => {
  return (
    <svg
      viewBox="0 0 320 180"
      fill="currentColor"
      className={`inline-block ${className}`}
      style={{ height, width: 'auto' }}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="JPXSTUDIO Logo"
    >
      {/* 
        Custom Vector Rendering of JPXSTUDIO official logo (from white.png):
        Features the calligraphic stylized 'jpx' with the extended bottom loop
        and bold geometric 'STUDIO' text underneath.
      */}
      <g fill="#FFFFFF">
        {/* Letter 'j' with sweeping left loop and gothic chisel serif */}
        {/* Top chisel head of j */}
        <path d="M125 60 L140 46 L130 68 L124 105 L118 106 Z" />
        <path d="M124 53 C132 46 138 43 145 42 L138 60 C132 60 128 58 124 53 Z" />

        {/* Long swooping loop of 'j' extending to the far left */}
        <path d="M124 102 C120 120 105 136 78 136 C35 136 20 118 20 102 C20 88 45 88 78 88 C98 88 116 94 124 102 Z M78 126 C100 126 114 114 116 102 C108 98 94 96 78 96 C48 96 34 100 34 106 C34 116 50 126 78 126 Z" />

        {/* Stem of 'j' joining to 'p' */}
        <path d="M117 72 L127 68 L119 116 L108 118 Z" />

        {/* Letter 'p': Gothic/Chisel calligraphy */}
        {/* Main stem of 'p' */}
        <path d="M136 64 L152 50 L142 135 L128 138 L136 64 Z" />
        {/* Arch and bowl of 'p' */}
        <path d="M142 66 C155 52 172 50 178 68 C182 82 175 106 162 118 C154 125 146 122 142 115 L144 95 C149 104 156 106 160 98 C165 88 166 74 158 64 C153 58 146 60 142 66 Z" />

        {/* Letter 'x': Dynamic crossed ribbons with flared ends */}
        {/* Diagonal stroke from top-left to bottom-right */}
        <path d="M174 65 C176 56 182 50 190 48 L185 64 L225 130 C234 142 245 138 252 132 L245 144 C234 150 220 148 212 134 L180 82 L172 108 L164 106 Z" />

        {/* Swooping counter-stroke of 'x' from bottom-left to top-right */}
        <path d="M175 125 C186 136 204 138 218 126 L212 118 C202 126 190 124 182 115 L215 76 C226 62 238 52 254 48 L256 60 C244 64 235 72 226 84 L196 124 Z" />

        {/* Top-right flourish of 'x' */}
        <path d="M236 50 C246 44 256 46 260 58 C255 70 245 74 238 68 C242 60 242 54 236 50 Z" />

        {/* Bottom-left flourish of 'x' */}
        <path d="M182 120 C180 126 182 132 188 136 L178 138 C172 134 172 126 176 120 Z" />

        {/* STUDIO Wordmark underneath (bold geometric extended) */}
        <g transform="translate(182, 148)">
          <text
            x="0"
            y="18"
            fontFamily="'Syne', 'Plus Jakarta Sans', sans-serif"
            fontWeight="800"
            fontSize="21"
            letterSpacing="3"
            fill="#FFFFFF"
          >
            STUDIO
          </text>
        </g>
      </g>
    </svg>
  );
};
