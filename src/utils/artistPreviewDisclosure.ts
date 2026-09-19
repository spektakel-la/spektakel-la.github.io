const initializedRoots = new WeakSet<EventTarget>();

function getPreview(toggle: HTMLButtonElement): HTMLElement | null {
  const previewId = toggle.getAttribute('aria-controls');
  return previewId ? document.getElementById(previewId) : null;
}

function populatePreview(toggle: HTMLButtonElement, preview: HTMLElement) {
  if (preview.hasChildNodes()) return;

  const templateId = toggle.dataset.previewTemplateId;
  const template = templateId ? document.getElementById(templateId) : null;
  if (template instanceof HTMLTemplateElement) {
    preview.append(template.content.cloneNode(true));
  }
}

function loadPreviewImages(preview: HTMLElement) {
  preview.querySelectorAll<HTMLImageElement>('img[data-src]').forEach((image) => {
    const src = image.dataset.src;
    if (!src) return;

    image.src = src;
    delete image.dataset.src;
  });
}

function setArtistPreviewExpanded(toggle: HTMLButtonElement, expanded: boolean) {
  const preview = getPreview(toggle);
  if (!preview) return;

  if (expanded) {
    populatePreview(toggle, preview);
    loadPreviewImages(preview);
  }
  toggle.setAttribute('aria-expanded', String(expanded));
  const artistName = toggle.dataset.artistName ?? '';
  const label = expanded ? toggle.dataset.labelClose : toggle.dataset.labelOpen;
  toggle.setAttribute('aria-label', `${label ?? ''}: ${artistName}`);
  toggle.closest('[data-artist-preview-entry]')
    ?.querySelector('[data-artist-preview-chevron]')
    ?.classList.toggle('rotate-180', expanded);
  preview.hidden = !expanded;
}

export function initArtistPreviewDisclosures(root: Document | HTMLElement = document) {
  if (initializedRoots.has(root)) return;
  initializedRoots.add(root);

  root.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const toggle = target.closest<HTMLButtonElement>('[data-artist-preview-toggle]');
    if (!toggle || (root instanceof HTMLElement && !root.contains(toggle))) return;

    const shouldExpand = toggle.getAttribute('aria-expanded') !== 'true';
    const group = toggle.closest('[data-artist-preview-group]') ?? root;
    group.querySelectorAll<HTMLButtonElement>('[data-artist-preview-toggle][aria-expanded="true"]')
      .forEach((openToggle) => {
        if (openToggle !== toggle) setArtistPreviewExpanded(openToggle, false);
      });
    setArtistPreviewExpanded(toggle, shouldExpand);
  });
}
