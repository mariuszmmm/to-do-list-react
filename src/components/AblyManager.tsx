import { useAblyManager } from "../hooks/useAblyManager";

/**
 * Komponent który zarządza wszystkimi subskrypcjami Ably
 * Inicjalizuje kanały, setup listenery, nie renderuje nic
 * Eksponuje API przez context lub direct hook usage
 */
export const AblyManager = () => {
  // Inicjalizuj manager i setup wszystkie kanały
  useAblyManager();

  return null;
};
