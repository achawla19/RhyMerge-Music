// Derives the full set of --rm-purple-* tokens from a single accent hex,
// so picking a new accent color in Settings re-themes buttons, borders,
// and highlight fills consistently — not just the raw --rm-purple value.

const hexToRgb = (hex) => {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const rgbToHsl = ({ r, g, b }) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToHex = ({ h, s, l }) => {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (v) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/** Lighten a hex color by a percentage of remaining headroom to white. */
const lighten = (hex, amount) => {
  const hsl = rgbToHsl(hexToRgb(hex));
  return hslToHex({ ...hsl, l: Math.min(100, hsl.l + amount) });
};

/**
 * Applies an accent hex to the document root as the full --rm-purple-*
 * token set: base, a lightened variant (for text/icon highlights), and
 * two alpha washes (dim fill, subtle border).
 */
export const applyAccentColor = (hex) => {
  if (!hex) return;
  const root = document.documentElement.style;
  const { r, g, b } = hexToRgb(hex);
  root.setProperty("--rm-purple", hex);
  root.setProperty("--rm-purple-light", lighten(hex, 22));
  root.setProperty("--rm-purple-dim", `rgba(${r}, ${g}, ${b}, 0.15)`);
  root.setProperty("--rm-purple-border", `rgba(${r}, ${g}, ${b}, 0.25)`);
};
