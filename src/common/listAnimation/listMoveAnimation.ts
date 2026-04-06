export function animateScroll(delta: number, duration: number) {
  const scrollEl =
    document.scrollingElement ||
    document.documentElement ||
    (document.body as HTMLElement);
  if (!scrollEl || delta === 0) return;
  const startTop = scrollEl.scrollTop;
  const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;

  if (delta > 0 && Math.abs(maxScroll - startTop) < 2) return;
  if (delta < 0 && startTop <= 0) return;

  const start = performance.now();
  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / duration);
    let nextScroll = startTop + delta * progress;
    nextScroll = Math.max(0, Math.min(maxScroll, nextScroll));
    scrollEl.scrollTop = nextScroll;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function getNeighborHeight(neighbor: HTMLElement) {
  const styles = getComputedStyle(neighbor);
  return (
    neighbor.getBoundingClientRect().height +
    (parseFloat(styles.marginTop) || 0) +
    (parseFloat(styles.marginBottom) || 0)
  );
}

export function getAnimationDuration(neighborHeight: number) {
  return Math.max(50, Math.min(100, Math.round(neighborHeight * 3)));
}

export function runFlipAnimation({
  current,
  neighbor,
  beforeCurrent,
  beforeNeighbor,
  duration,
  onFinish,
}: {
  current: HTMLElement;
  neighbor: HTMLElement;
  beforeCurrent: DOMRect;
  beforeNeighbor: DOMRect;
  duration: number;
  onFinish: () => void;
}) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const afterCurrent = current.getBoundingClientRect();
      const afterNeighbor = neighbor.getBoundingClientRect();
      const deltaCurrent = beforeCurrent.top - afterCurrent.top;
      const deltaNeighbor = beforeNeighbor.top - afterNeighbor.top;
      current.style.transition = "none";
      neighbor.style.transition = "none";
      current.style.transform = `translateY(${deltaCurrent}px)`;
      neighbor.style.transform = `translateY(${deltaNeighbor}px)`;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      current.offsetHeight;
      current.style.transition = `transform ${duration}ms`;
      neighbor.style.transition = `transform ${duration}ms`;
      current.style.transform = "translateY(0)";
      neighbor.style.transform = "translateY(0)";
      setTimeout(() => {
        current.style.transition = "";
        neighbor.style.transition = "";
        current.style.transform = "";
        neighbor.style.transform = "";
        onFinish();
      }, 1);
    });
  });
}
