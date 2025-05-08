interface ScrollOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
}

export function scrollToElementById(
  elementId: string,
  options: ScrollOptions = {
    behavior: 'smooth',
    block: 'center',
  },
) {
  const target = document.getElementById(elementId);
  target?.scrollIntoView(options);
}
