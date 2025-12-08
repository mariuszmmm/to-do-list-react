import { useTokenCountdown, useTokenValidation } from "../hooks";

/**
 * Komponent który zarządza tokenem bez renderowania czegokolwiek
 * Zawiera hooki które aktualizują Redux, ale sam się nie renderuje
 */
export const TokenManager = () => {
  // Single countdown timer that updates Redux state every second
  useTokenCountdown();
  // Monitor token validity and logout when expired
  useTokenValidation();

  return null;
};
