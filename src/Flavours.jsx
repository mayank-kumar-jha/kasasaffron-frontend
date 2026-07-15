import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { useAdmin } from './context/AdminContext';
import { getCurrentUserLocal } from './api/auth.service';
import SkeletonPage from './components/SkeletonPage';
import SEO from './components/SEO';

/* â”€â”€â”€ Static fallback data â”€â”€â”€ */
const FLAVOURS = [
  { 
    id: 1, 
    name: { en: "Iberian Ham Croquettes", es: "Croquetas de Jamón Ibérico", ca: "Croquetes de Pernil Ibèric" }, 
    tagline: { en: "The Soul of Spain", es: "El Alma de España", ca: "L'Ànima d'Espanya" }, 
    description: { 
      en: "Premium Iberian ham folded into a silky béchamel and coated in a golden, crunchy breadcrumb.", 
      es: "Exquisito jamón ibérico mezclado con una cremosa bechamel y un rebozado dorado y crujiente.", 
      ca: "Exquisit pernil ibèric barrejat amb una cremosa beixamel i un arrebossat daurat i cruixent." 
    }, 
    image: "https://kasasaffron.com/api/files/kasa-saffron/uploads/b673c1e0-5ef3-46e8-b80c-761dcb98a422.jpg", 
    spanishName: "Croquetas de Jamón Ibérico" 
  },
  { 
    id: 2, 
    name: { en: "Boletus Edulis Croquettes", es: "Croquetas de Boletus Edulis", ca: "Croquetes de Boletus Edulis" }, 
    tagline: { en: "Wild & Velvety", es: "Silvestre y Aterciopelada", ca: "Silvestre i Vellutada" }, 
    description: { 
      en: "Premium Boletus edulis mushrooms blended into a creamy béchamel for a rich, earthy flavour.", 
      es: "Selectas setas Boletus edulis integradas en una cremosa bechamel con un intenso sabor a bosque.", 
      ca: "Selectes bolets Boletus edulis integrats en una cremosa beixamel amb un intens sabor de bosc." 
    }, 
    image: "https://kasasaffron.com/api/files/kasa-saffron/uploads/05d19617-71ac-4d56-b725-7a97d472753a.jpg", 
    spanishName: "Croquetas de Boletus Edulis" 
  },
  { 
    id: 3, 
    name: { en: "Salt Cod Croquettes", es: "Croquetas de Bacalao", ca: "Croquetes de Bacallà" }, 
    tagline: { en: "A Coastal Heritage", es: "Herencia Costera", ca: "Herència Costanera" }, 
    description: { 
      en: "Delicate salt cod mixed into a creamy béchamel, coated in a light and crunchy golden crust.", 
      es: "Delicado bacalao incorporado a una suave bechamel y recubierto con un ligero rebozado crujiente.", 
      ca: "Delicat bacallà incorporat a una suau beixamel i recobert amb un lleuger arrebossat cruixent." 
    }, 
    image: "https://kasasaffron.com/api/files/kasa-saffron/uploads/aae40670-49c9-4429-a7ef-6b03d30f607d.jpg", 
    spanishName: "Croquetas de Bacalao" 
  },
  { 
    id: 4, 
    name: { en: "Roast Chicken Croquettes", es: "Croquetas de Pollo Rustido", ca: "Croquetes de Pollastre Rostit" }, 
    tagline: { en: "Infused with Elegance", es: "Infundida con Elegancia", ca: "Infundida amb Elegància" }, 
    description: { 
      en: "Tender roasted chicken combined with a velvety béchamel and finished with a crisp golden coating.", 
      es: "Tierno pollo rustido combinado con una cremosa bechamel y un crujiente acabado dorado.", 
      ca: "Tendre pollastre rostit combinat amb una cremosa beixamel i un cruixent acabat daurat." 
    }, 
    image: "https://kasasaffron.com/api/files/kasa-saffron/uploads/e498b324-4ad5-4846-ab19-090e600c327d.jpg", 
    spanishName: "Croquetas de Pollo Rustido" 
  },
  { 
    id: 5, 
    name: { en: "Blue Cheese Croquettes", es: "Croquetas de Queso Azul", ca: "Croquetes de Formatge Blau" }, 
    tagline: { en: "Bold & Indulgent", es: "Audaz e Indulgente", ca: "Audaç i Indulgent" }, 
    description: { 
      en: "Rich blue cheese folded into a smooth, creamy béchamel with a perfectly crisp golden coating.", 
      es: "Intenso queso azul integrado en una suave bechamel, con un irresistible rebozado crujiente.", 
      ca: "Intens formatge blau integrat en una suau beixamel amb un irresistible arrebossat cruixent." 
    }, 
    image: "https://kasasaffron.com/api/files/kasa-saffron/uploads/c524ba36-7841-4226-9dec-5f968db77dbe.jpg", 
    spanishName: "Croquetas de Queso Azul" 
  },
  { 
    id: 6, 
    name: { en: "Spinach, Edam Cheese & Sun-Dried Tomato Croquettes", es: "Croquetas de Espinaca, Queso Edam y Tomate Seco", ca: "Croquetes d'Espinacs, Formatge Edam i Tomàquet Sec" }, 
    tagline: { en: "Clean & Crispy", es: "Limpio y Crujiente", ca: "Net i Cruixent" }, 
    description: { 
      en: "Fresh spinach, creamy Edam cheese and sun-dried tomatoes blended into a rich béchamel with a crispy finish.", 
      es: "Espinacas frescas, queso Edam y tomate seco unidos en una cremosa bechamel con un crujiente rebozado.", 
      ca: "Espinacs frescos, formatge Edam i tomàquet sec units en una cremosa beixamel amb un cruixent arrebossat." 
    }, 
    image: "https://kasasaffron.com/api/files/kasa-saffron/uploads/d943190d-131f-4f4d-b77c-52fee772d387.png", 
    spanishName: "Croquetas de Espinaca, Queso Edam y Tomate Seco" 
  },
  { 
    id: 7, 
    name: { en: "Traditional Spanish Stew Croquettes", es: "Croquetas de Cocido", ca: "Croquetes de Carn d'Olla" }, 
    tagline: { en: "Rich & Deep", es: "Rico y Profundo", ca: "Ric i Profund" }, 
    description: { 
      en: "A comforting blend of slow-cooked meats in a creamy béchamel with a deliciously crispy crust.", 
      es: "Carnes de cocido cocinadas lentamente, mezcladas con una cremosa bechamel y un rebozado dorado.", 
      ca: "Carns cuinades lentament, barrejades amb una cremosa beixamel i un arrebossat daurat i cruixent." 
    }, 
    image: "https://kasasaffron.com/api/files/kasa-saffron/uploads/68a46dec-c542-41ba-a695-31b8e3934df3.jpeg", 
    spanishName: "Croquetas de Cocido" 
  },
  { 
    id: 8, 
    name: { en: "Monkfish & Shrimp Croquettes", es: "Croquetas de Rape y Gambas", ca: "Croquetes de Rap i Gambes" }, 
    tagline: { en: "Zesty Tapas Sensation", es: "Sensación Vibrante de Tapas", ca: "Sensació Vibrant de Tapes" }, 
    description: { 
      en: "Tender monkfish and succulent shrimp blended into a creamy béchamel and coated in a crispy golden breadcrumb.", 
      es: "Delicado rape y jugosas gambas mezclados con una cremosa bechamel y un crujiente rebozado dorado.", 
      ca: "Delicat rap i sucoses gambes barrejats amb una cremosa beixamel i un cruixent arrebossat daurat." 
    }, 
    image: "https://kasasaffron.com/api/files/kasa-saffron/uploads/9c49d2af-323a-454b-82f1-9301da2b74a7.jpg", 
    spanishName: "Croquetas de Rape y Gambas" 
  }
];

/* â”€â”€â”€ Allergen data per flavour â€” matched by name keyword â”€â”€â”€ */
const ALLERGEN_DATA = [
  {
    keywords: ['jamÃ³n', 'jamon', 'ham', 'ibÃ©rico', 'iberico'],
    rows: [
      { langCode: 'en', allergens: 'Gluten (Wheat), Milk' },
      { langCode: 'es', allergens: 'Gluten (Trigo), Leche' },
      { langCode: 'ca', allergens: 'Gluten (Blat), Llet' },
    ],
    notice: 'Produced in a facility that handles milk, gluten (wheat), fish and crustaceans. Cross-contact may occur.',
  },
  {
    keywords: ['boletus', 'mushroom', 'cep', 'mush'],
    rows: [
      { langCode: 'en', allergens: 'Gluten (Wheat), Milk' },
      { langCode: 'es', allergens: 'Gluten (Trigo), Leche' },
      { langCode: 'ca', allergens: 'Gluten (Blat), Llet' },
    ],
    notice: 'Produced in a facility that handles milk, gluten (wheat), fish and crustaceans. Cross-contact may occur.',
  },
  {
    keywords: ['cod', 'bacalao', 'bacallÃ '],
    rows: [
      { langCode: 'en', allergens: 'Gluten (Wheat), Milk, Fish' },
      { langCode: 'es', allergens: 'Gluten (Trigo), Leche, Pescado' },
      { langCode: 'ca', allergens: 'Gluten (Blat), Llet, Peix' },
    ],
    notice: 'Produced in a facility that handles milk, gluten (wheat), fish and crustaceans. Cross-contact may occur.',
  },
  {
    keywords: ['chicken', 'pollo', 'pollastre', 'saffron', 'azafrÃ¡n'],
    rows: [
      { langCode: 'en', allergens: 'Gluten (Wheat), Milk' },
      { langCode: 'es', allergens: 'Gluten (Trigo), Leche' },
      { langCode: 'ca', allergens: 'Gluten (Blat), Llet' },
    ],
    notice: 'Produced in a facility that handles milk, gluten (wheat), fish and crustaceans. Cross-contact may occur.',
  },
  {
    keywords: ['blue cheese', 'queso azul', 'formatge blau', 'cabrales', 'cheese'],
    rows: [
      { langCode: 'en', allergens: 'Gluten (Wheat), Milk' },
      { langCode: 'es', allergens: 'Gluten (Trigo), Leche' },
      { langCode: 'ca', allergens: 'Gluten (Blat), Llet' },
    ],
    notice: 'Produced in a facility that handles milk, gluten (wheat), fish and crustaceans. Cross-contact may occur.',
  },
  {
    keywords: ['spinach', 'espinaca', 'espinac', 'pine nut', 'pine'],
    rows: [
      { langCode: 'en', allergens: 'Gluten (Wheat), Milk' },
      { langCode: 'es', allergens: 'Gluten (Trigo), Leche' },
      { langCode: 'ca', allergens: 'Gluten (Blat), Llet' },
    ],
    notice: 'Produced in a facility that handles milk, gluten (wheat), fish and crustaceans. Cross-contact may occur.',
  },
  {
    keywords: ['oxtail', 'rabo', 'cocido', "carn d'olla", 'slow-cook'],
    rows: [
      { langCode: 'en', allergens: 'Gluten (Wheat), Milk' },
      { langCode: 'es', allergens: 'Gluten (Trigo), Leche' },
      { langCode: 'ca', allergens: 'Gluten (Blat), Llet' },
    ],
    notice: 'Produced in a facility that handles milk, gluten (wheat), fish and crustaceans. Cross-contact may occur.',
  },
  {
    keywords: ['monkfish', 'prawn', 'shrimp', 'rape', 'gamba', 'crustacean'],
    rows: [
      { langCode: 'en', allergens: 'Gluten (Wheat), Milk, Fish, Crustaceans' },
      { langCode: 'es', allergens: 'Gluten (Trigo), Leche, Pescado, CrustÃ¡ceos' },
      { langCode: 'ca', allergens: 'Gluten (Blat), Llet, Peix, Crustacis' },
    ],
    notice: 'Produced in a facility that handles milk, gluten (wheat), fish and crustaceans. Cross-contact may occur.',
  },
];

/* ─── Ingredients Data ─── */
const PREP_DATA = {
  prep: {
    en: 'Fry directly (or previously thawed) in abundant oil at 170º-180ºC.',
    es: 'Freír directamente (o previa descongelación) en aceite abundante a 170º-180ºC.',
    ca: 'Fregir directament (o prèvia descongelació) en oli abundant a 170º-180ºC.'
  },
  cons: {
    en: 'At -18ºC (once thawed do not refreeze, cook and consume within 48h.)',
    es: 'A -18ºC (una vez descongelado no volver a congelar, cocinar y consumir antes de 48h.)',
    ca: 'A -18ºC (un cop descongelat no tornar a congelar, cuinar i consumir abans de 48h.)'
  },
  qty: {
    en: '15 units (approx. 500g)',
    es: '15 udes. (500g aprox.)',
    ca: '15 udes. (500g aprox.)'
  }
};

const INGREDIENTS_DATA = [
  {
    keywords: ['jamón', 'jamon', 'ham', 'ibérico', 'iberico'],
    ingredients: {
      en: 'Milk, 50% Iberian breed bait ham (12%) (salt, preservatives: E-252; E-250), onion, breadcrumbs (wheat flour, water, wheat gluten, salt, olive oil and yeast), wheat flour, extra virgin olive oil, binder (wheat flour, wheat starch, water, thickener E-412), gelatin, garlic, salt and pepper.',
      es: 'Leche, jamón cebo ibérico 50% raza ibérica (12%) (sal, conservantes: E-252; E-250), cebolla, pan rallado (harina de trigo, agua, gluten de trigo, sal, aceite de oliva y levadura), harina de trigo, aceite de oliva virgen extra, encolante (harina de trigo, almidón de trigo, agua, espesante E-412), gelatina, ajo, sal y pimienta.',
      ca: 'Llet, pernil cebo ibèric 50% raça ibèrica (12%)(sal, conservants: E-252; E-250), ceba, pa ratllat (farina de blat, aigua, gluten de blat, sal, oli d\'oliva i llevat), farina de blat, oli d\'oliva verge extra, encolant (farina de blat, midó de blat, aigua, espessant E-412), gelatina, all, sal i pebre.'
    }
  },
  {
    keywords: ['boletus', 'mushroom', 'cep', 'mush'],
    ingredients: {
      en: 'Milk, boletus edulis (14%), onion, breadcrumbs (wheat flour, water, wheat gluten, salt, olive oil and yeast), wheat flour, extra virgin olive oil, binder (wheat flour, wheat starch, water, thickener E-412), butter, salt, garlic, boletus edulis powder, vegetable gelling agent and pepper.',
      es: 'Leche, boletus edulis (14%), cebolla, pan rallado (harina de trigo, agua, gluten de trigo, sal, aceite de oliva y levadura), harina de trigo, aceite de oliva virgen extra, encolante (harina de trigo, almidón de trigo, agua, espesante E-412), mantequilla, sal, ajo, boletus edulis en polvo, gelificante vegetal y pimienta.',
      ca: 'Llet, boletus edulis (14%), ceba, pa ratllat (farina de blat, aigua, gluten de blat, sal, oli d\'oliva i llevat), farina de blat, oli d\'oliva verge extra, encolant (farina de blat, midó de blat, aigua, espesant E-412), mantega, sal, all, boletus edulis en pols, gelificant vegetal i pebre.'
    }
  },
  {
    keywords: ['cod', 'bacalao', 'bacallà'],
    ingredients: {
      en: 'Milk, cod (14%), onion, breadcrumbs (wheat flour, water, wheat gluten, salt, olive oil and yeast), wheat flour, extra virgin olive oil, binder (wheat flour, wheat starch, water, thickener E-412), butter, gelatin, salt, garlic and pepper.',
      es: 'Leche, bacalao (14%), cebolla, pan rallado (harina de trigo, agua, gluten de trigo, sal, aceite de oliva y levadura), harina de trigo, aceite de oliva virgen extra, encolante (harina de trigo, almidón de trigo, agua, espesante E-412), mantequilla, gelatina, sal, ajo y pimienta.',
      ca: 'Llet, bacallà (14%), ceba, pa ratllat (farina de blat, aigua, gluten de blat, sal, oli d\'oliva i llevat), farina de blat, oli d\'oliva verge extra, encolant (farina de blat, midó de blat, aigua, espesant E-412), mantega, gelatina, sal, all i pebre.'
    }
  },
  {
    keywords: ['chicken', 'pollo', 'pollastre'],
    ingredients: {
      en: 'Milk, chicken (22%) (water, sunflower oil, salt, dextrose, starch, wine, spices, olive oil, yeast extract, acidity regulator (citric acid) and natural flavoring), onion, breadcrumbs (wheat flour, water, wheat gluten, salt, olive oil and yeast), wheat flour, extra virgin olive oil, binder (wheat flour, wheat starch, water, thickener E-412), butter, gelatin, salt, garlic and pepper.',
      es: 'Leche, pollo (22%) (agua, aceite de girasol, sal, dextrosa, almidón, vino, especias, aceite de oliva, extracto de levadura, corrector de acidez (acido citrico) y aroma natural), cebolla, pan rallado (harina de trigo, agua, gluten de trigo, sal, aceite de oliva y levadura), harina de trigo, aceite de oliva virgen extra, encolante (harina de trigo, almidón de trigo, agua, espesante E-412), mantequilla, gelatina, sal, ajo y pimienta.',
      ca: 'Llet, pollastre (22%) (aigua, oli de girasol, sal, dextrosa, midó, vi, espècies, oli d\'oliva, extracte de llevat, corrector d\'acidesa (acid citric) i aroma natural), ceba, pa ratllat (farina de blat, aigua, gluten de blat, sal, llevat), farina de blat, oli d\'oliva verge extra, encolant (farina de blat, midó de blat, aigua, espessant E-412), mantega, gelatina, sal, all i pebre.'
    }
  },
  {
    keywords: ['blue cheese', 'queso azul', 'formatge blau', 'cabrales', 'cheese'],
    ingredients: {
      en: 'Milk, blue cheese (15%) (pasteurized cow\'s milk, salt, microbial rennet, lactic ferments and mold cultures (Penicillium Roqueforti)), onion, breadcrumbs (wheat flour, water, wheat gluten, salt, olive oil and yeast), wheat flour, extra virgin olive oil, binder (wheat flour, wheat starch, water, thickener E-412), butter, salt, vegetable gelling agent and pepper.',
      es: 'Leche, queso azul (15%)(leche de vaca pasteurizada, sal, cuajo microbiano, fermentos lácticos y cultivos floridura (Penicillium Roqueforti)), cebolla, pan rallado (harina de trigo, agua, gluten de trigo, sal, aceite de oliva y levadura), harina de trigo, aceite de oliva virgen extra, encolante (harina de trigo, almidón de trigo, agua, espesante E-412), mantequilla, sal, gelificante vegetal y pimienta.',
      ca: 'Llet, formatge blau (15%)(llet de vaca pasteuritzada, sal, quall microbià, ferments làctics i cultius floridura (Penicillium Roqueforti)), ceba, pa ratllat (farina de blat, aigua, gluten de blat, sal, oli d\'oliva i llevat), farina de blat, oli d\'oliva verge extra, encolant (farina de blat, midó de blat, aigua, espesant E-412), mantega, sal, gelificant vegetal i pebre.'
    }
  },
  {
    keywords: ['spinach', 'espinaca', 'espinac', 'pine nut', 'pine'],
    ingredients: {
      en: 'Milk 54%, Spinach (21%) Butter 3% Sun-dried tomato 2% (E-320 and E-321), paprika, salt, ripening regulators (sugar and dextrose), stabilizer (E-451), spices, antioxidant (E-301) and preservative (E-252)), onion, breadcrumbs (wheat flour, water, wheat gluten, salt, olive oil and yeast), wheat flour, extra virgin olive oil, binder (wheat flour, wheat starch, water, thickener E-412), EDAM cheese (6%) (milk, salt, lactic and ripening ferments), gelatin, salt, garlic and pepper.',
      es: 'Leche 54%, Espinaca (21%) Mantequilla 3% Tomate seco 2% (E-320 y E-321), pimentón, sal, reguladores de maduración (azúcar y dextrosa), estabilizador (E-451), especias, antioxidante (E-301) y conservador (E-252)), cebolla, pan rallado (harina de trigo, agua, gluten de trigo, sal, aceite de oliva y levadura), harina de trigo, aceite de oliva virgen extra, encolante (harina de trigo, almidón de trigo, agua, espesante E-412), queso EDAM (6%) (leche, sal, fermentos lácticos y de maduración), gelatina, sal, ajo y pimienta.',
      ca: 'Llet 54%, Espinac (21%) Mantega 3% Tomaquet sec 2% (antioxidants E-320 i E-321, pebre vermell, sal, reguladors de maduració (sucre i dextrosa), estabilitzador (E-451), espècies, antioxidant (E-301) i conservador (E-252)), ceba, pa ratllat (farina de blat, aigua, gluten de blat, sal, oli d\'oliva i llevat), farina de blat, oli d\'oliva verge extra, encolant (farina de blat, midó de blat, aigua, espesant E-412), Queso Edam (6%) (llet, sal, ferments làctics i de maduració), gelatina, sal, all i pebre.'
    }
  },
  {
    keywords: ['oxtail', 'rabo', 'cocido', "carn d'olla", 'slow-cook'],
    ingredients: {
      en: 'Milk, Pork (5.0%), chicken (3%), Iberian bait shoulder (2.7%) (salt, antioxidants: E-331iii, E-301, preservatives: E-250, sugars and dextrose), chickpeas (2.5%), cabbage (2.2%), carrot (1%), leek (0.3%), onion, breadcrumbs (wheat flour, water, wheat gluten, salt, olive oil and yeast), wheat flour, extra virgin olive oil, binder (wheat flour, breadcrumbs, water, thickener E-412), E-415 and E-464, gelatin, garlic, salt and pepper.',
      es: 'Leche, Cerdo (5.0%), pollo (3%), paleta ibérica cebo (2,7%) (sal, antioxidantes: E-331iii, E-301, conservantes: E-250, azúcares y dextrosa), garbanzos (2,5%), col (2,2%), zanahoria (1%), puerro (0,3%), cebolla, pan rallado (harina de trigo, agua, gluten de trigo, sal, aceite de oliva y levadura), harina de trigo, aceite de oliva virgen extra, encolante (harina de trigo, pan rallado, agua, espesante E-412), E-415 Y E-464, gelatina, ajo, sal y pimienta.',
      ca: 'llet, Porc (5,0%), pollastre (3%), paleta ibèrica cebo (2,7%) (sal, antioxidants: E-331iii, E-301, conservants: E-250, sucres i dextrosa), cigrons (2,5%), col (2,2%), pastanaga (1%), porro (0,3%), ceba, pa ratllat (farina de blat, aigua, gluten de blat, sal, oli d\'oliva i llevat), farina de blat, oli d\'oliva verge extra, encolant (pa ratllat (farina de BLAT, aigua, sal i llevat), sal, estabilitzants (E-412, E-415 i E-464), conservant (E-202)), gelatina, all, sal i pebre.'
    }
  },
  {
    keywords: ['monkfish', 'prawn', 'shrimp', 'rape', 'gamba', 'crustacean'],
    ingredients: {
      en: 'Milk, monkfish (12.5%), onion, breadcrumbs (wheat flour, water, wheat gluten, salt, olive oil and yeast), wheat flour, binder (wheat flour, wheat starch, water, thickener E-412), extra virgin olive oil, prawn (4.2%), butter, shrimp (1.6%), salt, gelatin, garlic, prawn extract and pepper.',
      es: 'Leche, rape (12,5%), cebolla, pan rallado (harina de trigo, agua, gluten de trigo, sal, aceite de oliva y levadura), harina de trigo, encolante (harina de trigo, almidón de trigo, agua, espesante E-412), aceite de oliva virgen extra, gamba (4,2%), mantequilla, camarón (1,6%), sal, gelatina, ajo, extracto de gamba y pimienta.',
      ca: 'Llet, rap (12,5%), ceba, pa ratllat (farina de blat, aigua, gluten de blat, sal, oli d\'oliva i llevat), farina de blat, encolant (farina de blat, midó de blat, aigua, espessant E-412), oli d\'oliva verge extra, gamba (4,2%), mantega, gambeta (1,6%), sal, gelatina, all, extracte de gamba i pebre.'
    }
  }
];

function getIngredientsData(flavour) {
  if (!flavour) return null;
  const nameParts = [
    typeof flavour.name === 'object' && flavour.name !== null
      ? Object.values(flavour.name).join(' ')
      : (flavour.name || ''),
    flavour.spanishName || '',
  ].join(' ').toLowerCase();
  return INGREDIENTS_DATA.find((entry) =>
    entry.keywords.some((kw) => nameParts.includes(kw.toLowerCase()))
  ) || null;
}

/** Return the allergen entry that best matches a flavour object (works for both
 *  static fallback IDs and API-loaded flavours with arbitrary IDs). */
function getAllergenData(flavour) {
  if (!flavour) return null;
  const nameParts = [
    typeof flavour.name === 'object' && flavour.name !== null
      ? Object.values(flavour.name).join(' ')
      : (flavour.name || ''),
    flavour.spanishName || '',
  ].join(' ').toLowerCase();
  return ALLERGEN_DATA.find((entry) =>
    entry.keywords.some((kw) => nameParts.includes(kw.toLowerCase()))
  ) || null;
}

/* â”€â”€â”€ SVG icons keyed by first word of allergen (lowercase, no parens) â”€â”€â”€ */
const AllergenSVG = {
  gluten: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 2C8 5 6 8 6 12s2 7 6 10c4-3 6-6 6-10S16 5 12 2z"/>
      <path d="M12 2v20M9 7l3-2 3 2M9 12l3-2 3 2M9 17l3-2 3 2"/>
    </svg>
  ),
  milk: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M8 3h8l1 4H7L8 3z"/><path d="M7 7l-2 13h14L17 7"/>
      <circle cx="12" cy="14" r="2"/>
    </svg>
  ),
  fish: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M22 12C18 6 10 4 4 8l4 4-4 4c6 4 14 2 18-4z"/><circle cx="18" cy="10" r="1" fill="currentColor"/>
    </svg>
  ),
  crustaceans: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 8c-2 0-4 1.5-4 4s2 4 4 4 4-1.5 4-4-2-4-4-4z"/>
      <path d="M8 8L5 5M16 8l3-3M8 16l-3 3M16 16l3 3M12 8V4M12 20v-4M4 12H2M22 12h-2"/>
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/>
    </svg>
  ),
};

const ALLERGEN_ICONS = {
  gluten: AllergenSVG.gluten,
  milk: AllergenSVG.milk,
  fish: AllergenSVG.fish,
  crustaceans: AllergenSVG.crustaceans,
  default: AllergenSVG.default,
};

const ALLERGEN_SUBTITLES = {
  gluten: 'Wheat based',
  milk: 'Dairy product',
  fish: 'Seafood origin',
  crustaceans: 'Shellfish',
  default: 'Allergen',
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: 'easeOut', delay },
});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MOBILE CARD â€” Fully optimized: CSS transforms only, no Framer Motion
   Large image display, beautiful PNGs, swipe-friendly
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const MobileCard = React.memo(function MobileCard({ flavour, index, isActive, diff, lang, t, onClick }) {
  const dbLang = lang === 'cat' ? 'ca' : lang;
  const name = typeof flavour.name === 'object' && flavour.name !== null ? (flavour.name[dbLang] || flavour.name.en || flavour.name.es) : flavour.name;
  const tagline = typeof flavour.tagline === 'object' && flavour.tagline !== null ? (flavour.tagline[dbLang] || flavour.tagline.en || flavour.tagline.es) : flavour.tagline;
  const description = typeof flavour.description === 'object' && flavour.description !== null ? (flavour.description[dbLang] || flavour.description.en || flavour.description.es) : flavour.description;

  const displayName = name || t(`flavoursPage.items.${index}.name`);
  const displayTagline = tagline || t(`flavoursPage.items.${index}.tagline`);
  const displayDescription = description || t(`flavoursPage.items.${index}.description`);
  const absDiff = Math.abs(diff);

  const offsetPct = diff * 90;
  const scale = isActive ? 1 : 0.80;
  const opacity = isActive ? 1 : absDiff === 1 ? 0.4 : 0;
  const zIdx = isActive ? 10 : absDiff === 1 ? 5 : 0;

  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        transform: `translateX(${offsetPct}%) scale(${scale})`,
        opacity,
        zIndex: zIdx,
        transition: 'transform 0.38s cubic-bezier(.4,0,.2,1), opacity 0.35s ease',
        width: '210px',
        willChange: 'transform, opacity',
      }}
      className="cursor-pointer"
    >
      <div
        className={`relative rounded-2xl overflow-hidden shadow-2xl border ${isActive ? 'border-[#E6C587]/60 shadow-[0_8px_30px_rgba(44,1,7,0.35)]' : 'border-[#E6C587]/15'}`}
        style={{ background: 'linear-gradient(160deg,#2c0107 55%,#1a0003)' }}
      >
        {/* Corner ornaments */}
        <svg viewBox="0 0 40 40" fill="none" className="absolute top-0 left-0 w-8 h-8 text-[#E6C587] opacity-25 pointer-events-none z-10">
          <path d="M2 36 L2 5 Q2 2 5 2 L36 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
        </svg>
        <svg viewBox="0 0 40 40" fill="none" className="absolute bottom-0 right-0 w-8 h-8 text-[#E6C587] opacity-25 pointer-events-none rotate-180 z-10">
          <path d="M2 36 L2 5 Q2 2 5 2 L36 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
        </svg>

        {/* Tagline header */}
        <div className="px-3 pt-3 pb-2 border-b border-[#E6C587]/10 flex items-center justify-between relative z-10">
          <span className="text-[7px] tracking-[0.2em] font-bold text-[#E6C587]/70 uppercase">{displayTagline}</span>
          <svg className="w-3.5 h-3.5 text-[#E6C587] opacity-60 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
            <path d="M10 18 L10 6"/><path d="M10 6 C8 4 5 1.5 4 1"/><path d="M10 6 C12 4 15 1.5 16 1"/>
            <circle cx="10" cy="6" r="1.2" fill="currentColor" opacity="0.8"/>
          </svg>
        </div>

        {/* Full image â€” large & beautiful */}
        <div className="relative w-full overflow-hidden" style={{ height: '155px' }}>
          <img
            src={flavour.image}
            alt={displayName}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          {/* Flower watermark */}
          <img src="/Images/FLOWER.png" alt="" className="absolute -bottom-2 -right-3 w-14 h-14 object-contain opacity-[0.07] pointer-events-none select-none" aria-hidden="true"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#2c0107]/85 via-[#2c0107]/5 to-transparent pointer-events-none"/>
        </div>

        {/* Name & details */}
        <div className="px-3 pb-3 pt-1 text-center relative z-10">
          {/* Diamond divider */}
          <div className="flex items-center justify-center gap-2 mb-2 mt-1">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#E6C587]/40"/>
            <svg viewBox="0 0 10 10" className="w-1.5 h-1.5 text-[#E6C587] opacity-60" fill="currentColor"><polygon points="5,0 10,5 5,10 0,5"/></svg>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#E6C587]/40"/>
          </div>
          <p className="text-[8px] font-serif italic text-[#E6C587]/80 tracking-wider mb-0.5">{flavour.spanishName}</p>
          <h3 className="text-[11px] font-bold text-white font-serif leading-snug tracking-wide">{displayName}</h3>
          <p className="text-[6px] text-[#E6C587]/30 font-bold tracking-widest uppercase mt-1.5">Kasa Saffron Â· #{flavour.id}</p>
        </div>
      </div>
    </div>
  );
});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MAIN COMPONENT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function Flavours() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'en').split('-')[0];
  const dbLang = lang === 'cat' ? 'ca' : lang;
  const { addToCart } = useCart();
  const { flavours, isDataLoading } = useAdmin();
  const displayFlavours = flavours && flavours.length > 0 ? flavours : FLAVOURS;

  useEffect(() => {
    console.log("DEBUG FLAVOURS:", displayFlavours);
    console.log("DEBUG GALLERY:", typeof galleryImages !== 'undefined' ? galleryImages : "galleryImages not found");
  }, [displayFlavours]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedCard, setExpandedCard] = useState(null);
  const [flippedCard, setFlippedCard] = useState(null);
  const [selectedSize, setSelectedSize] = useState('1kg');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showIngredients, setShowIngredients] = useState(false);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const navigate = useNavigate();

  // Touch swipe state for mobile
  const touchStartX = useRef(null);

  useEffect(() => {
    let raf;
    const handleResize = () => { raf = requestAnimationFrame(() => setWindowWidth(window.innerWidth)); };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(raf); };
  }, []);

  // Override body background on mobile so no beige gap appears when content overflows viewport
  useEffect(() => {
    if (windowWidth >= 768) return; // desktop: do nothing
    const prevBg = document.body.style.background;
    document.body.style.background = '#140003';
    document.documentElement.style.background = '#140003';
    return () => {
      document.body.style.background = prevBg;
      document.documentElement.style.background = '';
    };
  }, [windowWidth]);


  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? displayFlavours.length - 1 : prev - 1));
  }, [displayFlavours.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === displayFlavours.length - 1 ? 0 : prev + 1));
  }, [displayFlavours.length]);

  useEffect(() => {
    if (isCarouselHovered || expandedCard || displayFlavours.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === displayFlavours.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [isCarouselHovered, expandedCard, displayFlavours.length]);

  const handleCardClick = (index) => {
    if (index === activeIndex) {
      setExpandedCard(displayFlavours[index]);
      setFlippedCard(null);
      setSelectedQuantity(1);
      setSelectedSize('1kg');
    } else {
      setActiveIndex(index);
      setFlippedCard(null);
    }
  };

  // Desktop drag handler
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) handleNext();
    else if (info.offset.x > swipeThreshold) handlePrev();
  };

  // Mobile native touch swipe
  const onTouchStart = useCallback((e) => { touchStartX.current = e.touches[0].clientX; }, []);
  const onTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 45) { delta > 0 ? handleNext() : handlePrev(); }
    touchStartX.current = null;
  }, [handleNext, handlePrev]);

  const getDiff = (index) => {
    const n = displayFlavours.length;
    let diff = ((index - activeIndex) % n + n) % n;
    if (diff > n / 2) diff -= n;
    return diff;
  };

  // â”€â”€ DESKTOP card styles (original) â”€â”€
  const getCardStyles = (index) => {
    const diff = getDiff(index);
    const absDiff = Math.abs(diff);
    if (diff === 0) return { x: 0, scale: 1.05, opacity: 1, zIndex: 10, rotateY: 0, pointerEvents: 'auto' };
    if (isTablet) {
      if (absDiff > 2) return { x: diff > 0 ? diff * 150 : diff * 150, scale: 0.6, opacity: 0, zIndex: 0, rotateY: diff > 0 ? -25 : 25, pointerEvents: 'none' };
      return { x: diff * 140, scale: 1 - absDiff * 0.1, opacity: absDiff === 1 ? 0.65 : 0.35, zIndex: 10 - absDiff, rotateY: diff > 0 ? -18 : 18, pointerEvents: 'auto' };
    }
    // Desktop
    if (absDiff > 2) return { x: diff * 200, scale: 0.65, opacity: 0, zIndex: 0, rotateY: diff > 0 ? -25 : 25, pointerEvents: 'none' };
    return { x: diff * 210, scale: 1 - absDiff * 0.09, opacity: absDiff === 1 ? 0.7 : 0.35, zIndex: 10 - absDiff, rotateY: diff > 0 ? -18 : 18, pointerEvents: 'auto' };
  };

  return (
    <>
      <SEO title="Our Flavours" description="Explore our handcrafted gourmet saffron croquettes." />
      {/* Fixed Background â€” deep maroon on mobile, cream on desktop */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Mobile: deep maroon gradient matching home page */}
        <div className="block md:hidden w-full h-full" style={{ background: 'linear-gradient(160deg, #140003 0%, #1a0008 40%, #0d0002 100%)' }}>
          {/* Subtle radial glow like home page */}
          <div className="absolute top-0 left-0 w-[70vw] h-[70vw] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #4A0E1A 0%, transparent 70%)', transform: 'translate(-20%, -20%)' }}/>
          <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #BD561A 0%, transparent 70%)', transform: 'translate(20%, 20%)' }}/>
        </div>
        {/* Desktop: original cream/image background */}
        <div className="hidden md:block w-full h-full bg-[#f0ddd2]">
          <img src="/assets/Casasoul-bg.jpg" alt="" className="w-full h-full object-cover object-center" />
        </div>
      </div>

      <section className="flavours-content-wrapper relative z-10 w-full h-auto min-h-screen flex flex-col py-6 lg:py-8 pt-[120px] overflow-x-hidden">

        {/* Header */}
        <motion.div {...fadeUp(0.2)} className="relative flex flex-col items-center text-center px-6 pt-4 md:pt-8 mt-[20px] z-10">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-normal leading-tight font-serif uppercase tracking-wide text-[#E6C587] md:text-[#720303] mt-3 mb-3 drop-shadow-sm" style={{ fontFamily: "'Cinzel', serif" }}>
            {t('flavoursPage.title')}
          </h2>
          <div className="w-24 h-[1px] bg-[#E6C587] md:bg-[#BD561A] my-4 opacity-50"></div>
        </motion.div>

        {/* Carousel Area */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col items-center justify-center mt-2 overflow-visible">
          <div className="relative w-full flex items-center justify-center overflow-visible -mt-5">

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-0 md:left-4 z-40 w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#BD561A]/30 bg-[#f6e5dd]/95 hover:bg-[#BD561A] text-[#BD561A] hover:text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 hover:-translate-x-[2px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>

            {/* â•â• MOBILE carousel stage â•â• */}
            {isMobile ? (
              <div
                className="relative w-full flex items-center justify-center select-none overflow-hidden"
                style={{ height: '310px' }}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                {displayFlavours.map((flavour, index) => {
                  const diff = getDiff(index);
                  return (
                    <MobileCard
                      key={flavour.id}
                      flavour={flavour}
                      index={index}
                      isActive={diff === 0}
                      diff={diff}
                      lang={lang}
                      t={t}
                      onClick={() => handleCardClick(index)}
                    />
                  );
                })}
              </div>
            ) : (
              /* â•â• DESKTOP carousel stage â€” ORIGINAL UNCHANGED â•â• */
              <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center overflow-visible select-none" style={{ perspective: '1400px' }}>
                {displayFlavours.map((flavour, index) => {
                  const styles = getCardStyles(index);
                  const diff = getDiff(index);
                  const isActive = diff === 0;
                  const isFlipped = flippedCard === index;

                  const nameObj = typeof flavour.name === 'object' && flavour.name !== null ? flavour.name : null;
                  const taglineObj = typeof flavour.tagline === 'object' && flavour.tagline !== null ? flavour.tagline : null;
                  const descObj = typeof flavour.description === 'object' && flavour.description !== null ? flavour.description : null;

                  const nameStr = nameObj ? (nameObj[dbLang] || nameObj.en || nameObj.es) : flavour.name;
                  const taglineStr = taglineObj ? (taglineObj[dbLang] || taglineObj.en || taglineObj.es) : flavour.tagline;
                  const descStr = descObj ? (descObj[dbLang] || descObj.en || descObj.es) : flavour.description;

                  const displayName = nameStr || t(`flavoursPage.items.${index}.name`);
                  const displayTagline = taglineStr || t(`flavoursPage.items.${index}.tagline`);
                  const displayDescription = descStr || t(`flavoursPage.items.${index}.description`);

                  return (
                    <motion.div
                      key={flavour.id}
                      style={{
                        position: 'absolute',
                        width: isTablet ? '200px' : '230px',
                        height: '290px',
                        zIndex: styles.zIndex,
                        pointerEvents: styles.pointerEvents,
                      }}
                      animate={{
                        x: styles.x,
                        scale: styles.scale,
                        opacity: styles.opacity,
                        rotateY: styles.rotateY,
                        filter: isActive ? 'brightness(1)' : 'blur(0.5px) brightness(0.6)',
                      }}
                      transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 1 }}
                      drag={isActive ? 'x' : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.3}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleCardClick(index)}
                      onMouseEnter={() => { if (isActive) { setIsCarouselHovered(true); setFlippedCard(index); } }}
                      onMouseLeave={() => { setIsCarouselHovered(false); setFlippedCard(null); }}
                      className={`border rounded-2xl shadow-2xl cursor-pointer relative ${isActive ? 'border-[#E6C587] shadow-[0_0_40px_rgba(230,197,135,0.2)]' : 'border-[#E6C587]/15'}`}
                    >
                      <div className={`flip-card-inner rounded-2xl h-full w-full${isFlipped ? ' is-flipped' : ''}`}>
                        {/* FRONT FACE */}
                        <div className="flip-face rounded-2xl bg-[#2c0107] p-3 md:p-4 flex flex-col justify-between h-full w-full absolute top-0 left-0 overflow-hidden">

                          {/* TOP-LEFT corner ornament */}
                          <svg className="absolute top-0 left-0 w-10 h-10 text-[#E6C587] opacity-20 pointer-events-none" viewBox="0 0 40 40" fill="none">
                            <path d="M2 38 L2 6 Q2 2 6 2 L38 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                            <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
                            <path d="M8 2 L8 8 M2 8 L8 8" stroke="currentColor" strokeWidth="0.7" opacity="0.6"/>
                          </svg>

                          {/* BOTTOM-RIGHT corner ornament */}
                          <svg className="absolute bottom-0 right-0 w-10 h-10 text-[#E6C587] opacity-20 pointer-events-none rotate-180" viewBox="0 0 40 40" fill="none">
                            <path d="M2 38 L2 6 Q2 2 6 2 L38 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                            <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
                            <path d="M8 2 L8 8 M2 8 L8 8" stroke="currentColor" strokeWidth="0.7" opacity="0.6"/>
                          </svg>

                          {/* TOP-RIGHT tiny diamond */}
                          <svg className="absolute top-2.5 right-2.5 w-3 h-3 text-[#E6C587] opacity-25 pointer-events-none" viewBox="0 0 12 12" fill="none">
                            <rect x="2" y="2" width="8" height="8" rx="0.5" transform="rotate(45 6 6)" stroke="currentColor" strokeWidth="0.8"/>
                            <rect x="4" y="4" width="4" height="4" rx="0.2" transform="rotate(45 6 6)" fill="currentColor" opacity="0.4"/>
                          </svg>

                          {/* BOTTOM-LEFT tiny diamond */}
                          <svg className="absolute bottom-2.5 left-2.5 w-3 h-3 text-[#E6C587] opacity-25 pointer-events-none" viewBox="0 0 12 12" fill="none">
                            <rect x="2" y="2" width="8" height="8" rx="0.5" transform="rotate(45 6 6)" stroke="currentColor" strokeWidth="0.8"/>
                            <rect x="4" y="4" width="4" height="4" rx="0.2" transform="rotate(45 6 6)" fill="currentColor" opacity="0.4"/>
                          </svg>

                          <div className="flex justify-between items-center mb-2 border-b border-[#E6C587]/10 pb-1.5 relative z-10">
                            <span className="text-[7px] md:text-[8px] tracking-[0.25em] font-extrabold text-[#E6C587]/70 uppercase font-sans">{displayTagline}</span>
                            {/* Premium saffron stamen SVG */}
                            <svg className="w-3.5 h-3.5 text-[#E6C587] opacity-60" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                              <path d="M10 18 L10 6"/>
                              <path d="M10 6 C10 6 7 3 5 1"/>
                              <path d="M10 6 C10 6 13 3 15 1"/>
                              <path d="M10 9 C10 9 6 7 4 7"/>
                              <path d="M10 9 C10 9 14 7 16 7"/>
                              <circle cx="10" cy="6" r="1.2" fill="currentColor" opacity="0.7"/>
                            </svg>
                          </div>

                          <div className="flex-1 flex items-center justify-center my-1 relative z-10">
                            <div className="relative inline-flex items-center justify-center">
                              {/* Spinning dashed orbit ring */}
                              <motion.svg
                                className="absolute text-[#E6C587] opacity-20 pointer-events-none"
                                style={{ width: isTablet ? 116 : 132, height: isTablet ? 116 : 132 }}
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
                                viewBox="0 0 100 100" fill="none"
                              >
                                <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 6"/>
                              </motion.svg>

                              {/* Compass diamond dots */}
                              <svg className="absolute text-[#E6C587] opacity-50 pointer-events-none w-2 h-2" style={{ top: '-3px', left: '50%', transform: 'translateX(-50%)' }} viewBox="0 0 8 8"><rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" fill="currentColor"/></svg>
                              <svg className="absolute text-[#E6C587] opacity-50 pointer-events-none w-2 h-2" style={{ bottom: '-3px', left: '50%', transform: 'translateX(-50%)' }} viewBox="0 0 8 8"><rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" fill="currentColor"/></svg>
                              <svg className="absolute text-[#E6C587] opacity-50 pointer-events-none w-2 h-2" style={{ right: '-3px', top: '50%', transform: 'translateY(-50%)' }} viewBox="0 0 8 8"><rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" fill="currentColor"/></svg>
                              <svg className="absolute text-[#E6C587] opacity-50 pointer-events-none w-2 h-2" style={{ left: '-3px', top: '50%', transform: 'translateY(-50%)' }} viewBox="0 0 8 8"><rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" fill="currentColor"/></svg>

                              <div className="relative p-1 rounded-full border border-[#E6C587]/25 bg-[#2c0107]">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border border-[#E6C587] shadow-md bg-[#1c0004]">
                                  <img src={flavour.image} alt={flavour.name} loading="lazy" className="w-full h-full object-cover select-none" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-center relative z-10">
                            {/* Ornamental divider */}
                            <div className="flex items-center justify-center gap-1.5 mb-1.5">
                              <svg className="w-6 h-[6px] text-[#E6C587] opacity-40" viewBox="0 0 24 6" fill="none">
                                <path d="M0 3 L8 3" stroke="currentColor" strokeWidth="0.8"/>
                                <polygon points="10,1 14,3 10,5" fill="currentColor" opacity="0.6"/>
                                <path d="M16 3 L24 3" stroke="currentColor" strokeWidth="0.8"/>
                              </svg>
                              <div className="w-1 h-1 rotate-45 border border-[#E6C587]/50 bg-[#E6C587]/20"/>
                              <svg className="w-6 h-[6px] text-[#E6C587] opacity-40 rotate-180" viewBox="0 0 24 6" fill="none">
                                <path d="M0 3 L8 3" stroke="currentColor" strokeWidth="0.8"/>
                                <polygon points="10,1 14,3 10,5" fill="currentColor" opacity="0.6"/>
                                <path d="M16 3 L24 3" stroke="currentColor" strokeWidth="0.8"/>
                              </svg>
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-serif italic text-[#E6C587]/90 tracking-wide font-light block mb-1">{flavour.spanishName || t(`flavoursPage.items.${index}.spanishName`)}</span>
                            <h3 className="text-sm sm:text-base font-bold text-white font-serif tracking-wide text-center leading-tight">{displayName}</h3>
                          </div>

                          <div className="mt-1.5 flex justify-between items-center text-[6px] font-bold tracking-widest text-[#E6C587]/30 font-sans uppercase relative z-10">
                            <span>Kasa Saffron</span>
                            <svg className="w-5 h-3 text-[#E6C587] opacity-20" viewBox="0 0 20 10" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round">
                              <path d="M1 5 C3 2 5 2 7 5 C5 8 3 8 1 5Z"/>
                              <path d="M13 5 C15 2 17 2 19 5 C17 8 15 8 13 5Z"/>
                              <path d="M7 5 L13 5"/>
                              <circle cx="10" cy="5" r="0.8" fill="currentColor"/>
                            </svg>
                            <span>#{flavour.id}</span>
                          </div>
                        </div>

                        {/* BACK FACE */}
                        <div className="flip-face flip-face-back rounded-2xl bg-[#140003] flex flex-col overflow-hidden h-full w-full absolute top-0 left-0">
                          <div className="w-full h-[50%] relative shrink-0">
                            <img src={flavour.image} alt={displayName} loading="lazy" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#140003] opacity-90" />
                          </div>
                          <div className="flex-1 p-3 flex flex-col items-center justify-center text-center border-t border-[#E6C587]/15">
                            <h3 className="text-xs sm:text-sm font-bold text-[#E6C587] font-serif tracking-wide mb-1.5">{displayName}</h3>
                            <p className="text-[9px] sm:text-[10px] text-[#f6e5dd]/85 font-sans leading-relaxed line-clamp-4">{displayDescription}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-0 md:right-4 z-40 w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#BD561A]/30 bg-[#f6e5dd]/95 hover:bg-[#BD561A] text-[#BD561A] hover:text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 hover:translate-x-[2px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>

          {/* â”€â”€ MOBILE ONLY: dot indicators + active name + CTA â”€â”€ */}
          {isMobile && (
            <div className="flex flex-col items-center mt-4 px-4 w-full">
              {/* Dots */}
              <div className="flex gap-1.5 mb-5">
                {displayFlavours.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    style={{
                      width: i === activeIndex ? '20px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      background: i === activeIndex ? '#E6C587' : 'rgba(230,197,135,0.25)',
                      transition: 'all 0.3s ease',
                    }}
                    aria-label={`Flavour ${i + 1}`}
                  />
                ))}
              </div>

              {/* Active flavour info */}
              {displayFlavours[activeIndex] && (
                <div className="text-center w-full max-w-xs">
                  <p className="text-[9px] tracking-[0.35em] text-[#E6C587]/60 font-bold uppercase mb-1">
                    {displayFlavours[activeIndex].spanishName}
                  </p>
                  <h2 className="text-lg font-serif text-[#E6C587] tracking-wide leading-snug mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                    {typeof displayFlavours[activeIndex].name === 'object' && displayFlavours[activeIndex].name !== null ? (displayFlavours[activeIndex].name[dbLang] || displayFlavours[activeIndex].name.en || displayFlavours[activeIndex].name.es) : (displayFlavours[activeIndex].name || t(`flavoursPage.items.${activeIndex}.name`))}
                  </h2>
                  <p className="text-[11px] text-white/50 font-sans leading-relaxed mb-4 line-clamp-2">
                    {typeof displayFlavours[activeIndex].description === 'object' && displayFlavours[activeIndex].description !== null ? (displayFlavours[activeIndex].description[dbLang] || displayFlavours[activeIndex].description.en || displayFlavours[activeIndex].description.es) : (displayFlavours[activeIndex].description || t(`flavoursPage.items.${activeIndex}.description`))}
                  </p>
                  <button
                    onClick={() => { setExpandedCard(displayFlavours[activeIndex]); setSelectedQuantity(1); setSelectedSize('1kg'); }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#E6C587]/40 bg-[#E6C587]/10 text-[#E6C587] text-[11px] font-bold uppercase tracking-widest shadow-lg hover:bg-[#E6C587]/20 transition-colors active:scale-95 backdrop-blur-sm"
                  >
                    {t('flavoursPage.addToOrder', 'Add to Order')}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* â•â• EXPANDED CARD MODAL â•â• */}
      <AnimatePresence>
        {expandedCard && (() => {
          const allergenDisclaimer = {
            en: "Production notice: Produced in a facility that handles milk, gluten (wheat), fish and crustaceans. Cross-contact may occur.",
            es: "Aviso de producción: Elaborado en unas instalaciones que procesan leche, gluten (trigo), pescado y crustáceos. Puede haber contacto cruzado.",
            ca: "Avís de producció: Elaborat en unes instal·lacions que processen llet, gluten (blat), peix i crustacis. Hi pot haver contacte creuat."
          };
          const handcraftedText = {
            en: "Handcrafted with Care",
            es: "Elaborado a Mano con Cuidado",
            ca: "Elaborat a Mà amb Cura"
          };
          const ae = getAllergenData(expandedCard);
          const allergenRow = ae ? (ae.rows.find(r => r.langCode === dbLang) || ae.rows[0]) : null;
          const allergenItems = allergenRow ? allergenRow.allergens.split(',').map(s => s.trim()) : [];
          
          const ingData = getIngredientsData(expandedCard);
          const ingText = ingData ? (ingData.ingredients[dbLang] || ingData.ingredients.en) : '';
          const prepText = PREP_DATA.prep[dbLang] || PREP_DATA.prep.en;
          const consText = PREP_DATA.cons[dbLang] || PREP_DATA.cons.en;
          const qtyText = PREP_DATA.qty[dbLang] || PREP_DATA.qty.en;

          const cardName = typeof expandedCard.name === 'object' && expandedCard.name !== null
            ? (expandedCard.name[dbLang] || expandedCard.name.en || expandedCard.name.es || '')
            : expandedCard.name;
          const cardTagline = typeof expandedCard.tagline === 'object' && expandedCard.tagline !== null
            ? (expandedCard.tagline[dbLang] || expandedCard.tagline.en || '')
            : expandedCard.tagline;
          const cardDesc = typeof expandedCard.description === 'object' && expandedCard.description !== null
            ? (expandedCard.description[dbLang] || expandedCard.description.en || '')
            : expandedCard.description;
          const price = selectedSize === '500g' ? expandedCard.price500g || 12 : expandedCard.price1kg || 20;

          return (
            <div key="modal" className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#140003]/70 backdrop-blur-md cursor-pointer"
                onClick={() => { setExpandedCard(null); setShowIngredients(false); }} />

              {isMobile ? (
                <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  className="relative z-10 w-full bg-[#08000f] rounded-t-[2rem] border-t border-[#E6C587]/20 shadow-[0_-24px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden"
                  style={{ maxHeight: '90dvh' }} onClick={e => e.stopPropagation()}>
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-[#E6C587]/25 rounded-full pointer-events-none z-10" />
                  <button onClick={() => { setExpandedCard(null); setShowIngredients(false); }} className="absolute top-3 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-[#E6C587]/15 text-[#E6C587]/70 hover:bg-[#E6C587]/15">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="relative w-full shrink-0" style={{ height: '42vw', maxHeight: '180px', minHeight: '110px' }}>
                    <img src={expandedCard.image} alt={cardName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08000f] via-[#08000f]/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 px-5 pb-3">
                      <p className="text-[7px] tracking-[0.3em] text-[#E6C587]/55 uppercase font-bold mb-0.5">{cardTagline}</p>
                      <h3 className="text-2xl font-serif text-[#E6C587] leading-tight">{cardName}</h3>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-3 pb-28 flex flex-col gap-3">
                    <p className="text-white/45 text-[11px] leading-relaxed line-clamp-2">{cardDesc}</p>
                    {allergenItems.length > 0 && (
                      <div className="relative">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-[7.5px] font-extrabold tracking-[0.25em] text-[#E6C587]/35 uppercase">Contains Allergens</p>
                          {ingText && (
                            <button onClick={() => setShowIngredients(!showIngredients)} className="text-[7px] font-bold tracking-widest text-[#E6C587] underline decoration-[#E6C587]/30 hover:decoration-[#E6C587] transition-all">
                              {dbLang === 'es' ? 'VER INGREDIENTES' : dbLang === 'ca' ? 'VEURE INGREDIENTS' : 'VIEW INGREDIENTS'}
                            </button>
                          )}
                        </div>
                        <AnimatePresence>
                          {showIngredients && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-3">
                              <div className="p-4 rounded-xl bg-[#2c0107] border border-[#E6C587]/15 shadow-xl">
                                <h4 className="text-[8px] font-bold text-[#E6C587] uppercase tracking-widest mb-1.5">{dbLang === 'es' ? 'Ingredientes' : dbLang === 'ca' ? 'Ingredients' : 'Ingredients'}</h4>
                                <p className="text-[#E6C587]/70 text-[9.5px] leading-relaxed mb-3">{ingText}</p>
                                <h4 className="text-[8px] font-bold text-[#E6C587] uppercase tracking-widest mb-1.5">{dbLang === 'es' ? 'Preparación / Conservación' : dbLang === 'ca' ? 'Preparació / Conservació' : 'Preparation / Conservation'}</h4>
                                <p className="text-[#E6C587]/70 text-[9.5px] leading-relaxed mb-1">{prepText}</p>
                                <p className="text-[#E6C587]/70 text-[9.5px] leading-relaxed mb-1">{consText}</p>
                                <p className="text-[#E6C587]/70 text-[9.5px] leading-relaxed font-bold mt-2">{qtyText}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div className="flex flex-wrap gap-1.5">
                          {allergenItems.map((item, i) => {
                            const key = item.toLowerCase().replace(/[()]/g, '').split(' ')[0];
                            return (
                              <div key={i} className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1.5 rounded-full border border-[#E6C587]/15 bg-[#E6C587]/5">
                                <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#E6C587]/10 text-[#E6C587]/70 shrink-0">{ALLERGEN_ICONS[key] || ALLERGEN_ICONS.default}</div>
                                <span className="text-[9px] font-bold text-[#E6C587]/75 uppercase tracking-wider">{item}</span>
                              </div>
                            );
                          })}
                        </div>
                        {ae && <p className="text-[8px] text-[#E6C587]/60 italic mt-2 leading-relaxed">{allergenDisclaimer[dbLang] || allergenDisclaimer.en}</p>}
                      </div>
                    )}
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <p className="text-[7.5px] font-bold text-[#E6C587]/35 uppercase tracking-[0.2em] mb-1.5">Size</p>
                        <div className="flex gap-2">
                          {['500g', '1kg'].map(s => (
                            <button key={s} onClick={() => setSelectedSize(s)} className={`flex-1 py-2 rounded-lg border text-[11px] font-bold uppercase tracking-wide transition-all ${selectedSize === s ? 'border-[#E6C587] bg-[#E6C587] text-[#140003]' : 'border-[#E6C587]/18 bg-transparent text-[#E6C587]/50'}`}>{s}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[7.5px] font-bold text-[#E6C587]/35 uppercase tracking-[0.2em] mb-1.5">Qty</p>
                        <div className="flex items-center bg-[#130004] border border-[#E6C587]/18 rounded-lg overflow-hidden">
                          <button onClick={() => setSelectedQuantity(q => Math.max(1, q - 1))} disabled={selectedQuantity <= 1} className="w-9 h-8 flex items-center justify-center text-[#E6C587]/80 text-lg font-light hover:bg-[#E6C587]/10 disabled:opacity-30">-</button>
                          <span className="w-8 h-8 flex items-center justify-center text-white font-bold text-xs bg-black/20">{selectedQuantity}</span>
                          <button onClick={() => setSelectedQuantity(q => Math.min(99, q + 1))} className="w-9 h-8 flex items-center justify-center text-[#E6C587]/80 text-lg font-light hover:bg-[#E6C587]/10">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-[#08000f] via-[#08000f]/98 to-transparent border-t border-[#E6C587]/8">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[7px] font-bold text-[#E6C587]/35 uppercase tracking-widest mb-0.5">Total</p>
                        <span className="text-[1.6rem] font-serif text-[#E6C587] leading-none">€{(price * selectedQuantity).toFixed(2)}</span>
                      </div>
                      <button onClick={() => { addToCart({ id: expandedCard.id, name: cardName, image: expandedCard.image, size: selectedSize, price, quantity: selectedQuantity }); setExpandedCard(null); }}
                        className="flex-1 max-w-[175px] py-3 bg-[#E6C587] text-[#140003] text-[10.5px] font-bold tracking-widest uppercase rounded-full shadow-[0_4px_20px_rgba(230,197,135,0.25)] active:scale-95 transition-transform flex items-center justify-center gap-2">
                        Add to Cart
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </button>
                    </div>
                  </div>
                </motion.div>

              ) : (
                <motion.div
                  initial={{ y: 20, scale: 0.97, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 20, scale: 0.97, opacity: 0 }}
                  transition={{ type: 'spring', damping: 30, stiffness: 320 }}
                  className="relative z-10 w-full max-w-[1000px] rounded-[1.75rem] shadow-[0_32px_80px_rgba(20,0,3,0.7)] flex flex-row bg-[#fdfaf5]"
                  style={{ height: 'min(75vh, 500px)' }} onClick={e => e.stopPropagation()}>
                  {/* Left: image */}
                  <div className="relative w-[42%] shrink-0 overflow-hidden rounded-l-[1.75rem]">
                    <img src={expandedCard.image} alt={cardName} className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#fdfaf5]/10" />
                    <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#E6C587]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      <span className="text-[9px] font-bold text-white uppercase tracking-widest">{handcraftedText[dbLang] || handcraftedText.en}</span>
                    </div>
                  </div>
                  {/* Right: details */}
                  <div className="flex-1 flex flex-col justify-center py-2 relative">
                    <button onClick={() => { setExpandedCard(null); setShowIngredients(false); }} className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-[#2c0107]/10 text-[#2c0107] hover:bg-[#2c0107] hover:text-[#E6C587] transition-all shadow-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <div className="px-7 pt-7 pb-4 shrink-0 border-b border-[#2c0107]/6">
                      <h3 className="text-3xl font-serif text-[#2c0107] leading-tight mb-1">{cardName}</h3>
                      <div className="w-8 h-[2px] bg-[#E6C587] mb-3 mt-3" />
                      <p className="text-[#2c0107]/60 text-[12.5px] leading-relaxed line-clamp-3">{cardDesc}</p>
                    </div>
                    {allergenItems.length > 0 && (
                      <div className="px-7 py-4 shrink-0 border-b border-[#2c0107]/6 relative">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3 h-3 text-[#BD561A] shrink-0" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 110 1.5A.75.75 0 018 4zm0 3.25a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V8a.75.75 0 01.75-.75z"/></svg>
                            <span className="text-[8px] font-extrabold tracking-[0.25em] text-[#BD561A] uppercase">Allergen Information</span>
                          </div>
                          {ingText && (
                            <div className="relative" onMouseEnter={() => setShowIngredients(true)} onMouseLeave={() => setShowIngredients(false)}>
                              <button className="text-[7.5px] font-bold tracking-widest text-[#2c0107] border border-[#2c0107]/20 rounded-full px-3 py-1.5 hover:bg-[#2c0107] hover:text-[#E6C587] transition-all">
                                {dbLang === 'es' ? 'VER INGREDIENTES' : dbLang === 'ca' ? 'VEURE INGREDIENTS' : 'VIEW INGREDIENTS'}
                              </button>
                              <AnimatePresence>
                                {showIngredients && (
                                  <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.95 }} transition={{ duration: 0.2 }}
                                    className="absolute top-full right-0 mt-3 w-[380px] p-5 rounded-2xl bg-[#2c0107] border border-[#E6C587]/15 shadow-[0_20px_60px_rgba(44,1,7,0.45)] z-50 cursor-default">
                                    <div className="absolute -top-2 right-8 w-4 h-4 bg-[#2c0107] border-t border-l border-[#E6C587]/15 rotate-45" />
                                    <h4 className="text-[9px] font-bold text-[#E6C587] uppercase tracking-widest mb-2">{dbLang === 'es' ? 'Ingredientes' : dbLang === 'ca' ? 'Ingredients' : 'Ingredients'}</h4>
                                    <p className="text-[#E6C587]/80 text-[10px] leading-relaxed mb-4">{ingText}</p>
                                    <h4 className="text-[9px] font-bold text-[#E6C587] uppercase tracking-widest mb-2">{dbLang === 'es' ? 'Preparación / Conservación' : dbLang === 'ca' ? 'Preparació / Conservació' : 'Preparation / Conservation'}</h4>
                                    <p className="text-[#E6C587]/80 text-[10px] leading-relaxed mb-1.5">{prepText}</p>
                                    <p className="text-[#E6C587]/80 text-[10px] leading-relaxed mb-3">{consText}</p>
                                    <p className="text-[#E6C587]/90 text-[9.5px] leading-relaxed font-bold tracking-wide">{qtyText}</p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {allergenItems.map((item, i) => {
                            const key = item.toLowerCase().replace(/[()]/g, '').split(' ')[0];
                            return (
                              <div key={i} className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl bg-white border border-[#2c0107]/8 shadow-[0_1px_4px_rgba(44,1,7,0.05)]">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#BD561A]/8 text-[#BD561A] shrink-0">{ALLERGEN_ICONS[key] || ALLERGEN_ICONS.default}</div>
                                <div className="leading-none">
                                  <p className="text-[9px] font-extrabold text-[#2c0107] tracking-wide uppercase">{item}</p>
                                  <p className="text-[7px] text-[#2c0107]/40 font-medium mt-0.5">{ALLERGEN_SUBTITLES[key] || 'Allergen'}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {ae && <p className="text-[8px] text-[#2c0107]/70 italic mt-2.5 leading-relaxed font-medium">{allergenDisclaimer[dbLang] || allergenDisclaimer.en}</p>}
                      </div>
                    )}
                    <div className="flex flex-col px-7 py-6 gap-4">
                      <div className="flex gap-5 items-end">
                        <div className="flex-1">
                          <p className="text-[8px] font-bold text-[#2c0107]/40 uppercase tracking-[0.2em] mb-1.5">Size</p>
                          <div className="flex gap-2">
                            {['500g', '1kg'].map(s => (
                              <button key={s} onClick={() => setSelectedSize(s)} className={`flex-1 py-2.5 rounded-lg border text-xs font-bold tracking-wide transition-all duration-200 ${selectedSize === s ? 'border-[#2c0107] bg-[#2c0107] text-[#E6C587]' : 'border-[#2c0107]/10 bg-white text-[#2c0107]/55 hover:border-[#2c0107]/25 hover:bg-[#f6e5dd]/50'}`}>{s}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-[#2c0107]/40 uppercase tracking-[0.2em] mb-1.5">Qty</p>
                          <div className="flex items-center bg-white border border-[#2c0107]/10 rounded-lg overflow-hidden shadow-sm">
                            <button onClick={() => setSelectedQuantity(q => Math.max(1, q - 1))} disabled={selectedQuantity <= 1} className="w-10 h-9 flex items-center justify-center text-[#2c0107] text-xl font-light hover:bg-[#f6e5dd]/70 disabled:opacity-30">-</button>
                            <span className="w-10 h-9 flex items-center justify-center text-[#140003] font-bold text-sm border-x border-[#2c0107]/8 bg-gray-50/40">{selectedQuantity}</span>
                            <button onClick={() => setSelectedQuantity(q => Math.min(99, q + 1))} className="w-10 h-9 flex items-center justify-center text-[#2c0107] text-xl font-light hover:bg-[#f6e5dd]/70">+</button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#2c0107]/8">
                        <div>
                          <p className="text-[7.5px] font-bold text-[#2c0107]/35 uppercase tracking-widest mb-0.5">Total</p>
                          <span className="text-[1.9rem] font-serif text-[#140003] leading-none">€{(price * selectedQuantity).toFixed(2)}</span>
                        </div>
                        <button onClick={() => { addToCart({ id: expandedCard.id, name: cardName, image: expandedCard.image, size: selectedSize, price, quantity: selectedQuantity }); setExpandedCard(null); }}
                          className="group relative px-7 py-3.5 bg-[#2c0107] text-[#E6C587] text-[11px] font-bold tracking-[0.18em] uppercase rounded-xl overflow-hidden shadow-[0_8px_22px_rgba(44,1,7,0.25)] hover:shadow-[0_12px_30px_rgba(44,1,7,0.35)] transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2.5">
                          <span className="relative z-10">Add to Cart</span>
                          <svg className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          <div className="absolute inset-0 bg-gradient-to-r from-[#4a020d] to-[#1a0003] opacity-0 group-hover:opacity-100 transition-opacity duration-250" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })()}
      </AnimatePresence>
    </>
  );
}

