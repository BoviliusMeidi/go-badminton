import { RefObject, useCallback } from "react";

/**
 * A custom React hook that enables drag-to-scroll functionality on an HTML element.
 *
 * This hook returns event handlers (`onMouseDown`, `onMouseLeave`, `onMouseUp`, `onMouseMove`)
 * that should be attached to the scrollable container (the "slider").
 *
 * It works by tracking the mouse-down state and calculating the scroll position
 * based on the mouse's horizontal movement (delta X).
 *
 * @param {RefObject<HTMLDivElement | null>} ref - A React ref pointing to the scrollable
 * container element (e.g., the `div` with `overflow-x-auto`).
 *
 * @returns {object} An object containing the event handlers to apply to the ref element.
 * @property {(e: React.MouseEvent) => void} handleMouseDown - The `onMouseDown` event handler.
 * @property {() => void} handleMouseLeaveOrUp - The `onMouseLeave` and `onMouseUp` event handler.
 * @property {(e: React.MouseEvent) => void} handleMouseMove - The `onMouseMove` event handler.
 *
 * @example
 * const scrollRef = useRef<HTMLDivElement>(null);
 * const { handleMouseDown, handleMouseLeaveOrUp, handleMouseMove } = useDragScroll(scrollRef);
 *
 * return (
 * <div
 * ref={scrollRef}
 * onMouseDown={handleMouseDown}
 * onMouseLeave={handleMouseLeaveOrUp}
 * onMouseUp={handleMouseLeaveOrUp}
 * onMouseMove={handleMouseMove}
 * className="overflow-x-auto cursor-grab active:cursor-grabbing"
 * >
 * ...scrollable content...
 * </div>
 * );
 */
export function useDragScroll(ref: RefObject<HTMLDivElement | null>) {
  /**
   * Handles the `onMouseDown` event.
   * Sets the slider to a "dragging" state and records the initial
   * mouse X position and scrollLeft position.
   *
   * @param {React.MouseEvent} e - The mouse event.
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const slider = ref.current;
      if (!slider) return;

      // Set "dragging" state using data attributes
      slider.dataset.dragging = "true";
      // Store the starting X position
      slider.dataset.startX = e.pageX.toString();
      // Store the initial scroll position
      slider.dataset.scrollLeft = slider.scrollLeft.toString();
    },
    [ref]
  );

  /**
   * Handles the `onMouseLeave` and `onMouseUp` events.
   * Resets the "dragging" state on the slider.
   */
  const handleMouseLeaveOrUp = useCallback(() => {
    const slider = ref.current;
    if (slider) slider.dataset.dragging = "false";
  }, [ref]);

  /**
   * Handles the `onMouseMove` event.
   * If the slider is in a "dragging" state, it calculates the new
   * scrollLeft position based on the mouse's movement delta (the "walk").
   *
   * @param {React.MouseEvent} e - The mouse event.
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const slider = ref.current;
      // Only run if dragging
      if (!slider || slider.dataset.dragging !== "true") return;

      e.preventDefault(); // Prevent default text selection
      const startX = Number(slider.dataset.startX);
      const scrollLeft = Number(slider.dataset.scrollLeft);

      // Calculate the distance the mouse has moved
      // Multiplied by 1.5 to make the scroll feel a bit faster
      const walk = (e.pageX - startX) * 1.5;

      // Set the new scroll position
      slider.scrollLeft = scrollLeft - walk;
    },
    [ref]
  );

  return { handleMouseDown, handleMouseLeaveOrUp, handleMouseMove };
}