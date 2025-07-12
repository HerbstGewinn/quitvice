// Font family constants
export const FONT_FAMILY = {
  REGULAR: 'Space Grotesk',
  BOLD: 'Space Grotesk-Bold',
  MEDIUM: 'Space Grotesk-Medium',
  LIGHT: 'Space Grotesk-Light',
};

// Fallback font families for different platforms
export const getFontFamily = (fontFamily: string) => {
  // Return the font family with system fallbacks
  return `${fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
}; 