/**
 * Funkcja przewijająca interfejs do samej góry.
 * Uwzględnia fakt, że w obecnej architekturze CSS głównym kontenerem
 * przewijania jest element #root, a nie okno (window).
 */
export const scrollToTop = () => {
  const rootElement = document.getElementById("root");

  if (rootElement) {
    // Przewijamy kontener Reacta, który ma overflow-y: scroll
    rootElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  } else {
    // Fallback dla standardowego przewijania okna
    window.scrollTo(0, 0);
  }
};
