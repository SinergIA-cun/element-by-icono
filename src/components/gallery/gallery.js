import './gallery.css';
import { t } from '../../lib/i18n.js';

/* Bento asimétrico: una celda protagonista + cuatro de apoyo. Las imágenes
   con texto horneado en un borde se recortan vía object-position. */
const ITEMS = [
  { src: '/media/interior-cocina-pasillo-crop-1600.webp', small: '/media/interior-cocina-pasillo-crop-800.webp', altKey: 'gallery.alt1', w: 1080, h: 1134, cell: 'main', pos: 'center' },
  { src: '/media/exterior-edificio-noche-crop-640.webp', small: '/media/exterior-edificio-noche-crop-640.webp', altKey: 'gallery.alt2', w: 512, h: 486, cell: 'tall', pos: 'center 30%' },
  { src: '/media/exterior-fachada-detalle-640.webp', small: '/media/exterior-fachada-detalle-640.webp', altKey: 'gallery.alt3', w: 512, h: 640, cell: 'wide', pos: 'center 40%' },
  { src: '/media/interior-escritorio-640.webp', small: '/media/interior-escritorio-640.webp', altKey: 'gallery.alt4', w: 512, h: 640, cell: 'sq', pos: 'center' },
  { src: '/media/ficha-1rec-interior-1600.webp', small: '/media/ficha-1rec-interior-800.webp', altKey: 'gallery.alt5', w: 1080, h: 1350, cell: 'sq2', pos: 'center 12%' },
];

/** @param {HTMLElement} el */
export function render(el) {
  if (!el) return;

  el.innerHTML = `
    <div class="gallery">
      <header class="gallery__head reveal">
        <p class="gallery__eyebrow">${t('gallery.eyebrow')}</p>
        <h2 class="gallery__heading">${t('gallery.heading')}</h2>
        <p class="gallery__lede">${t('gallery.lede')}</p>
      </header>
      <div class="gallery__grid reveal">
        ${ITEMS.map(
          (item, i) => `
          <button class="gallery__cell gallery__cell--${item.cell}" data-idx="${i}" aria-label="${t(item.altKey)}">
            <img src="${item.small}" alt="${t(item.altKey)}" width="${item.w}" height="${item.h}"
              loading="lazy" style="object-position: ${item.pos}" />
          </button>`
        ).join('')}
      </div>
      <dialog class="gallery__lightbox">
        <img alt="" />
        <button class="gallery__close" autofocus>${t('gallery.lightboxClose')} ✕</button>
      </dialog>
    </div>
  `;

  const dialog = el.querySelector('dialog');
  const dialogImg = dialog.querySelector('img');

  el.querySelectorAll('.gallery__cell').forEach((cell) => {
    cell.addEventListener('click', () => {
      const item = ITEMS[Number(cell.dataset.idx)];
      dialogImg.src = item.src;
      dialogImg.alt = t(item.altKey);
      dialog.showModal();
    });
  });
  dialog.querySelector('.gallery__close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
}
