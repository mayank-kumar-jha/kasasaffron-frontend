export const FLAVOUR_IMAGES = {
  jamon: '/assets/flavours/croquetas-jamon-iberico-kasa-saffron.webp',
  boletus: '/assets/flavours/croquetas-boletus-edulis-kasa-saffron.webp',
  bacalao: '/assets/flavours/croquetas-bacalao-puerro-tomate-seco-kasa-saffron.webp',
  pollo: '/assets/flavours/croquetas-pollo-rustico-kasa-saffron.webp',
  queso: '/assets/flavours/croquetas-queso-azul-nueces-kasa-saffron.webp',
  espinaca: '/assets/flavours/croquetas-espinacas-tomate-seco-queso-emmental-kasa-saffron.webp',
  cocido: '/assets/flavours/croquetas-cocido-kasa-saffron.webp',
  rape: '/assets/flavours/croquetas-rape-gamba-kasa-saffron.webp',
};

export const getFlavourImage = (flavour) => {
  if (!flavour) return FLAVOUR_IMAGES.jamon;
  const str = `${flavour.slug || ''} ${flavour.spanishName || ''} ${typeof flavour.name === 'object' && flavour.name !== null ? Object.values(flavour.name).join(' ') : flavour.name || ''}`.toLowerCase();
  if (str.includes('jamon') || str.includes('jamón') || str.includes('ibérico') || str.includes('iberic') || str.includes('pernil')) return FLAVOUR_IMAGES.jamon;
  if (str.includes('boletus') || str.includes('edulis') || str.includes('ceps') || str.includes('mushroom')) return FLAVOUR_IMAGES.boletus;
  if (str.includes('bacalao') || str.includes('bacallà') || str.includes('cod')) return FLAVOUR_IMAGES.bacalao;
  if (str.includes('pollo') || str.includes('chicken') || str.includes('pollastre') || str.includes('rustid') || str.includes('rustic')) return FLAVOUR_IMAGES.pollo;
  if (str.includes('azul') || str.includes('blau') || str.includes('blue cheese') || str.includes('cabrales')) return FLAVOUR_IMAGES.queso;
  if (str.includes('espinac') || str.includes('spinach') || str.includes('edam') || str.includes('emmental')) return FLAVOUR_IMAGES.espinaca;
  if (str.includes('cocido') || str.includes("d'olla") || str.includes('stew')) return FLAVOUR_IMAGES.cocido;
  if (str.includes('rape') || str.includes('rap ') || str.includes('gamba') || str.includes('shrimp') || str.includes('monkfish')) return FLAVOUR_IMAGES.rape;
  return flavour.image && flavour.image.startsWith('/') ? flavour.image : FLAVOUR_IMAGES.jamon;
};
