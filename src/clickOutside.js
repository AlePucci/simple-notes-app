/** Dispatch event on click outside of node */
export const clickOutside = (node) => {
  const handleClick = (event) => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent("click_outside", node));
    }
  };

  document.addEventListener("mousedown", handleClick, true);
  return {
    destroy() {
      document.removeEventListener("mousedown", handleClick, true);
    },
  };
};
