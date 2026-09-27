// Flat, friendly toy illustrations (viewBox 200×200).
const shadow = '<ellipse cx="100" cy="186" rx="64" ry="7" fill="#2B1B4A" opacity=".08"/>';
const shine = (x, y, w, h, r = 6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#fff" opacity=".35"/>`;

export const art = {
  stacker: () => `
    ${shadow}
    <rect x="94" y="36" width="12" height="140" rx="6" fill="#E3B27A"/>
    <rect x="30" y="170" width="140" height="14" rx="7" fill="#D39A5E"/>
    <rect x="38" y="146" width="124" height="26" rx="13" fill="#FF5A4E"/>${shine(48, 150, 30, 6, 3)}
    <rect x="48" y="122" width="104" height="26" rx="13" fill="#FF9F43"/>${shine(58, 126, 24, 6, 3)}
    <rect x="58" y="98" width="84" height="26" rx="13" fill="#FFC53D"/>${shine(68, 102, 20, 6, 3)}
    <rect x="68" y="74" width="64" height="26" rx="13" fill="#3DD6A5"/>${shine(76, 78, 16, 6, 3)}
    <rect x="78" y="50" width="44" height="26" rx="13" fill="#5BB8FF"/>${shine(86, 54, 12, 6, 3)}
    <circle cx="100" cy="36" r="17" fill="#8B6CFF"/><circle cx="94" cy="30" r="5" fill="#fff" opacity=".5"/>`,

  bear: () => `
    ${shadow}
    <circle cx="58" cy="50" r="21" fill="#C98B55"/><circle cx="142" cy="50" r="21" fill="#C98B55"/>
    <circle cx="58" cy="50" r="10" fill="#F2C29B"/><circle cx="142" cy="50" r="10" fill="#F2C29B"/>
    <ellipse cx="100" cy="146" rx="54" ry="42" fill="#C98B55"/>
    <ellipse cx="100" cy="154" rx="30" ry="26" fill="#F2C29B"/>
    <ellipse cx="46" cy="138" rx="15" ry="24" fill="#B87B47" transform="rotate(25 46 138)"/>
    <ellipse cx="154" cy="138" rx="15" ry="24" fill="#B87B47" transform="rotate(-25 154 138)"/>
    <circle cx="68" cy="178" r="17" fill="#B87B47"/><circle cx="132" cy="178" r="17" fill="#B87B47"/>
    <circle cx="100" cy="80" r="48" fill="#D69A63"/>
    <ellipse cx="100" cy="98" rx="21" ry="16" fill="#F2C29B"/>
    <ellipse cx="100" cy="90" rx="8" ry="6" fill="#3B2416"/>
    <path d="M92 102 Q100 109 108 102" stroke="#3B2416" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="80" cy="74" r="6" fill="#3B2416"/><circle cx="120" cy="74" r="6" fill="#3B2416"/>
    <circle cx="82" cy="72" r="2" fill="#fff"/><circle cx="122" cy="72" r="2" fill="#fff"/>
    <circle cx="68" cy="94" r="8" fill="#FF8FC7" opacity=".55"/><circle cx="132" cy="94" r="8" fill="#FF8FC7" opacity=".55"/>
    <path d="M100 126 L80 116 L80 136 Z M100 126 L120 116 L120 136 Z" fill="#FF5A4E"/><circle cx="100" cy="126" r="6" fill="#E0463B"/>`,

  train: () => `
    ${shadow}
    <g class="art-puff"><circle cx="58" cy="34" r="10" fill="#fff" stroke="#2B1B4A" stroke-opacity=".1"/><circle cx="44" cy="22" r="7" fill="#fff" stroke="#2B1B4A" stroke-opacity=".1"/></g>
    <rect x="54" y="52" width="18" height="36" rx="3" fill="#FFC53D"/><rect x="48" y="46" width="30" height="12" rx="5" fill="#FF9F43"/>
    <rect x="30" y="86" width="100" height="56" rx="10" fill="#5BB8FF"/>${shine(38, 92, 40, 8, 4)}
    <rect x="104" y="56" width="62" height="86" rx="8" fill="#FF5A4E"/>
    <rect x="96" y="46" width="78" height="14" rx="7" fill="#8B6CFF"/>
    <rect x="116" y="70" width="38" height="28" rx="6" fill="#fff" opacity=".85"/>
    <rect x="18" y="128" width="20" height="12" rx="4" fill="#FFC53D"/>
    <circle cx="62" cy="152" r="20" fill="#2B1B4A"/><circle cx="62" cy="152" r="8" fill="#FFC53D"/>
    <circle cx="138" cy="152" r="20" fill="#2B1B4A"/><circle cx="138" cy="152" r="8" fill="#FFC53D"/>
    <rect x="60" y="148" width="80" height="8" rx="4" fill="#E3B27A"/>`,

  blocks: () => `
    ${shadow}
    <g transform="rotate(-7 62 138)"><rect x="26" y="102" width="72" height="72" rx="14" fill="#FF5A4E"/><rect x="32" y="108" width="60" height="60" rx="10" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3"/><text x="62" y="156" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="46" fill="#fff">A</text></g>
    <g transform="rotate(5 140 138)"><rect x="104" y="102" width="72" height="72" rx="14" fill="#3DD6A5"/><rect x="110" y="108" width="60" height="60" rx="10" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3"/><text x="140" y="156" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="46" fill="#fff">B</text></g>
    <g transform="rotate(-3 100 64)"><rect x="64" y="28" width="72" height="72" rx="14" fill="#FFC53D"/><rect x="70" y="34" width="60" height="60" rx="10" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3"/><text x="100" y="82" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="46" fill="#fff">C</text></g>`,

  rocket: () => `
    <g class="art-flame"><path d="M82 142 Q100 198 118 142 Z" fill="#FFC53D"/><path d="M90 142 Q100 176 110 142 Z" fill="#FF5A4E"/></g>
    <path d="M72 112 L42 152 L74 144 Z" fill="#8B6CFF"/><path d="M128 112 L158 152 L126 144 Z" fill="#8B6CFF"/>
    <path d="M100 14 C134 44 140 104 128 146 L72 146 C60 104 66 44 100 14 Z" fill="#F4F1FF" stroke="#2B1B4A" stroke-opacity=".08" stroke-width="2"/>
    <path d="M100 14 C114 26 123 42 128 58 L72 58 C77 42 86 26 100 14 Z" fill="#FF5A4E"/>
    <circle cx="100" cy="90" r="18" fill="#8B6CFF"/><circle cx="100" cy="90" r="12" fill="#5BB8FF"/><circle cx="95" cy="85" r="4" fill="#fff" opacity=".7"/>
    <rect x="94" y="116" width="12" height="30" rx="6" fill="#8B6CFF"/>
    <circle cx="30" cy="40" r="3" fill="#FFC53D"/><circle cx="170" cy="70" r="4" fill="#FF8FC7"/><circle cx="160" cy="24" r="3" fill="#3DD6A5"/>`,

  duck: () => `
    <path d="M10 170 Q30 160 50 170 T90 170 T130 170 T170 170 T210 170 V200 H10 Z" fill="#5BB8FF" opacity=".35"/>
    <path d="M168 110 L190 92 L180 128 Z" fill="#FFB319"/>
    <ellipse cx="112" cy="134" rx="66" ry="40" fill="#FFC53D"/>
    <ellipse cx="124" cy="128" rx="32" ry="18" fill="#FFB319" transform="rotate(-12 124 128)"/>
    <circle cx="74" cy="78" r="36" fill="#FFC53D"/>
    <ellipse cx="38" cy="86" rx="20" ry="10" fill="#FF9F43"/>
    <circle cx="68" cy="70" r="6" fill="#2B1B4A"/><circle cx="70" cy="68" r="2" fill="#fff"/>
    <circle cx="84" cy="90" r="7" fill="#FF8FC7" opacity=".5"/>
    <ellipse cx="80" cy="60" rx="10" ry="5" fill="#fff" opacity=".4"/>`,

  xylophone: () => `
    ${shadow}
    <rect x="22" y="58" width="156" height="10" rx="5" fill="#D39A5E" transform="rotate(8 100 63)"/>
    <rect x="22" y="136" width="156" height="10" rx="5" fill="#D39A5E" transform="rotate(-8 100 141)"/>
    ${['#FF5A4E', '#FF9F43', '#FFC53D', '#3DD6A5', '#5BB8FF', '#8B6CFF']
      .map((c, i) => {
        const h = 116 - i * 13, x = 30 + i * 24;
        return `<rect x="${x}" y="${102 - h / 2}" width="20" height="${h}" rx="6" fill="${c}"/><circle cx="${x + 10}" cy="${102 - h / 2 + 10}" r="2.5" fill="#fff" opacity=".7"/><circle cx="${x + 10}" cy="${102 + h / 2 - 10}" r="2.5" fill="#fff" opacity=".7"/>`;
      })
      .join('')}
    <g class="art-mallet"><rect x="120" y="150" width="60" height="7" rx="3.5" fill="#E3B27A" transform="rotate(-30 120 153)"/><circle cx="120" cy="154" r="11" fill="#FF5A4E"/></g>`,

  kite: () => `
    <path class="art-tail" d="M100 150 C90 170 116 178 102 196" stroke="#2B1B4A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M92 164 l-12 -6 l2 12 Z M112 176 l12 -6 l-2 12 Z" fill="#FF8FC7"/>
    <path d="M100 16 L156 80 L100 80 Z" fill="#FF5A4E"/><path d="M100 16 L44 80 L100 80 Z" fill="#FFC53D"/>
    <path d="M44 80 L100 150 L100 80 Z" fill="#5BB8FF"/><path d="M156 80 L100 150 L100 80 Z" fill="#3DD6A5"/>
    <path d="M100 16 V150 M44 80 H156" stroke="#fff" stroke-width="3" opacity=".7"/>`,

  star: () => `<path d="M100 18 L122 74 L182 76 L134 112 L152 170 L100 136 L48 170 L66 112 L18 76 L78 74 Z" fill="#FFC53D" stroke="#FF9F43" stroke-width="6" stroke-linejoin="round"/><circle cx="84" cy="98" r="6" fill="#2B1B4A"/><circle cx="116" cy="98" r="6" fill="#2B1B4A"/><path d="M88 116 Q100 126 112 116" stroke="#2B1B4A" stroke-width="4" fill="none" stroke-linecap="round"/>`,

  ball: () => `<circle cx="100" cy="100" r="80" fill="#fff"/><path d="M100 20 A80 80 0 0 1 180 100 L100 100 Z" fill="#FF5A4E"/><path d="M100 180 A80 80 0 0 1 20 100 L100 100 Z" fill="#5BB8FF"/><path d="M20 100 A80 80 0 0 1 100 20 L100 100 Z" fill="#FFC53D"/><path d="M180 100 A80 80 0 0 1 100 180 L100 100 Z" fill="#3DD6A5"/><circle cx="100" cy="100" r="14" fill="#fff"/><ellipse cx="66" cy="56" rx="18" ry="10" fill="#fff" opacity=".45" transform="rotate(-35 66 56)"/>`,
};

export const svg = (key, cls = '') => `<svg class="art ${cls}" viewBox="0 0 200 200" aria-hidden="true">${art[key]()}</svg>`;
