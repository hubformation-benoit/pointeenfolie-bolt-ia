import type { MenuItem, Promotion, WeeklyEvent, OpenHours } from './types'

// Placeholder pizza images from Pexels — replace with real product photos later
export const pizzaImages: Record<string, string> = {
  'trois-mousquetaires': 'https://images.pexels.com/photos/5903100/pexels-photo-5903100.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'cardinal-richelieu': 'https://images.pexels.com/photos/31596394/pexels-photo-31596394.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'marie-antoinette': 'https://images.pexels.com/photos/19260842/pexels-photo-19260842.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'revolution-francaise': 'https://images.pexels.com/photos/26575528/pexels-photo-26575528.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'flotte-royale': 'https://images.pexels.com/photos/13457624/pexels-photo-13457624.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'vivante-campagne': 'https://images.pexels.com/photos/5848281/pexels-photo-5848281.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'bastille-en-danger': 'https://images.pexels.com/photos/19260836/pexels-photo-19260836.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'pouvoir-du-roi': 'https://images.pexels.com/photos/5903173/pexels-photo-5903173.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'la-guillotine': 'https://images.pexels.com/photos/5903100/pexels-photo-5903100.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'absolutisme-transparent': 'https://images.pexels.com/photos/19260728/pexels-photo-19260728.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
}

export const pizzas: MenuItem[] = [
  {
    id: 'trois-mousquetaires',
    name: 'Trois Mousquetaires',
    description: {
      fr: 'Saucisses chorizo, merguez, saucisses italiennes fortes, piments jalapeños, oignons, gruyère, cheddar fort et sauce tomate.',
      en: 'Chorizo sausage, merguez, hot Italian sausage, jalapeño peppers, onions, Gruyère, sharp cheddar and tomato sauce.'
    },
    prices: { P: 12, M: 16, G: 18 },
    image: pizzaImages['trois-mousquetaires'],
    badges: ['spicy'],
  },
  {
    id: 'cardinal-richelieu',
    name: 'Cardinal Richelieu',
    description: {
      fr: 'Nappée d\'une sauce tomate sucrée avec un soupçon de miel, pancetta grillé, parmesan, mozzarella et origan.',
      en: 'Topped with a sweet tomato sauce with a hint of honey, grilled pancetta, Parmesan, mozzarella and oregano.'
    },
    prices: { P: 12, M: 16, G: 18 },
    image: pizzaImages['cardinal-richelieu'],
    badges: [],
  },
  {
    id: 'marie-antoinette',
    name: 'Marie-Antoinette',
    description: {
      fr: 'Riche couche de prosciutto, aubergines grillées, boccoccini et une sauce tomates/pesto.',
      en: 'Rich layer of prosciutto, grilled eggplant, bocconcini and a tomato/pesto sauce.'
    },
    prices: { P: 12, M: 16, G: 18 },
    image: pizzaImages['marie-antoinette'],
    badges: [],
  },
  {
    id: 'revolution-francaise',
    name: 'Révolution Française',
    description: {
      fr: 'Poivrons verts, tomates séchées, oignons rouges, aubergines grillées, mozzarella, huile d\'olive et sauce blanche.',
      en: 'Green peppers, sun-dried tomatoes, red onions, grilled eggplant, mozzarella, olive oil and white sauce.'
    },
    prices: { P: 12, M: 16, G: 18 },
    image: pizzaImages['revolution-francaise'],
    badges: ['veg'],
  },
  {
    id: 'flotte-royale',
    name: 'Flotte Royale',
    description: {
      fr: 'Saumon fumé, crevettes fraîches, câpres, oignons rouges, gruyère, coriandre et sauce rosée.',
      en: 'Smoked salmon, fresh shrimp, capers, red onions, Gruyère, cilantro and pink sauce.'
    },
    prices: { P: 14, M: 18, G: 22 },
    image: pizzaImages['flotte-royale'],
    badges: [],
  },
  {
    id: 'vivante-campagne',
    name: 'Vivante Campagne',
    description: {
      fr: 'Oignons doux, viande fumée, pommes de terre et sauce chipotle.',
      en: 'Sweet onions, smoked meat, potatoes and chipotle sauce.'
    },
    prices: { P: 12, M: 16, G: 18 },
    image: pizzaImages['vivante-campagne'],
    badges: [],
  },
  {
    id: 'bastille-en-danger',
    name: 'Bastille en Danger',
    description: {
      fr: 'Tranches de poires, coulis de chocolat, crème anglaise avec un soupçon de kirsch.',
      en: 'Pear slices, chocolate coulis, custard with a hint of kirsch.'
    },
    prices: { P: 12, M: 16, G: 18 },
    image: pizzaImages['bastille-en-danger'],
    badges: ['dessert'],
  },
  {
    id: 'pouvoir-du-roi',
    name: 'Pouvoir du Roi',
    description: {
      fr: 'Merguez, bœuf haché, pepperoni, jambon, bacon, olives noires et sauce épicée aux tomates fraîches.',
      en: 'Merguez, ground beef, pepperoni, ham, bacon, black olives and spicy fresh tomato sauce.'
    },
    prices: { P: 12, M: 16, G: 18 },
    image: pizzaImages['pouvoir-du-roi'],
    badges: ['spicy'],
  },
  {
    id: 'la-guillotine',
    name: 'La Guillotine',
    description: {
      fr: 'Mozzarella, sauce piquante, chorizo, salami de Gênes et piments forts.',
      en: 'Mozzarella, spicy sauce, chorizo, Genoa salami and hot peppers.'
    },
    prices: { P: 12, M: 16, G: 18 },
    image: pizzaImages['la-guillotine'],
    badges: ['spicy'],
  },
  {
    id: 'absolutisme-transparent',
    name: 'Absolutisme Transparent',
    description: {
      fr: 'Mozzarella, parmesan, feta, cheddar vieilli, ricotta, épinards, ail rôti et sauce maison au vin blanc.',
      en: 'Mozzarella, Parmesan, feta, aged cheddar, ricotta, spinach, roasted garlic and homemade white wine sauce.'
    },
    prices: { P: 12, M: 16, G: 18 },
    image: pizzaImages['absolutisme-transparent'],
    badges: ['veg'],
  },
]

export const salads: MenuItem[] = [
  { id: 'salade-cesar', name: 'Salade César', description: { fr: 'Laitue romaine, croûtons, parmesan, sauce César.', en: 'Romaine lettuce, croutons, Parmesan, Caesar dressing.' }, price: 8, badges: [] },
  { id: 'salade-nicoise', name: 'Salade Niçoise', description: { fr: 'Thon, haricots verts, tomates, œufs, olives, anchois.', en: 'Tuna, green beans, tomatoes, eggs, olives, anchovies.' }, price: 9, badges: [] },
  { id: 'salade-quinoa', name: 'Salade de Quinoa', description: { fr: 'Quinoa, légumes grillés, feta, vinaigrette au citron.', en: 'Quinoa, grilled vegetables, feta, lemon vinaigrette.' }, price: 10, badges: ['veg'] },
]

export const drinks: MenuItem[] = [
  { id: 'coca-cola', name: 'Coca-Cola', description: { fr: '33 cl', en: '12 oz' }, price: 2, badges: [] },
  { id: 'sprite', name: 'Sprite', description: { fr: '33 cl', en: '12 oz' }, price: 2, badges: [] },
  { id: 'fanta', name: 'Fanta', description: { fr: '33 cl', en: '12 oz' }, price: 2, badges: [] },
  { id: 'eau-minerale', name: 'Eau minérale', description: { fr: 'Pétillante ou plate', en: 'Sparkling or still' }, price: 1, badges: [] },
  { id: 'jus-orange', name: 'Jus d\'orange', description: { fr: 'Fraîchement pressé', en: 'Freshly squeezed' }, price: 3, badges: [] },
]

export const desserts: MenuItem[] = [
  { id: 'tiramisu', name: 'Tiramisu', description: { fr: 'Mascarpone, café, cacao, biscuits savoiardi.', en: 'Mascarpone, coffee, cocoa, ladyfingers.' }, price: 9, badges: ['dessert'] },
  { id: 'gateau-fromage', name: 'Gâteau au fromage', description: { fr: 'Cheesecake maison, coulis de fruits rouges.', en: 'Homemade cheesecake, berry coulis.' }, price: 9, badges: ['dessert'] },
  { id: 'creme-brulee', name: 'Crème brûlée', description: { fr: 'Vanille de Madagascar, caramel craquant.', en: 'Madagascar vanilla, crackling caramel.' }, price: 6, badges: ['dessert'] },
]

export const promotions: Promotion[] = [
  {
    id: 'promo-2pour1',
    title: { fr: '2 pour 1', en: '2 for 1' },
    description: {
      fr: 'Profitez d\'un spécial deux pour un sur le petit format lors de l\'achat d\'un breuvage quelconque.',
      en: 'Enjoy a two-for-one special on small pizzas with the purchase of any beverage.'
    }
  },
  {
    id: 'promo-festin',
    title: { fr: 'Pour seulement 25 $', en: 'Only $25' },
    description: {
      fr: 'Profitez d\'un festin incluant : une bière au choix parmi notre sélection, une pizza de format moyen et une portion de pommes de terre frites.',
      en: 'Enjoy a feast including: a beer of your choice from our selection, a medium pizza and a side of seasoned fries.'
    }
  },
  {
    id: 'promo-quatre',
    title: { fr: 'À l\'achat de quatre pizzas', en: 'Buy four pizzas' },
    description: {
      fr: 'Peu importe le format, obtenez automatiquement un rabais sur votre prochain achat. Nos grands clients sont récompensés.',
      en: 'Any size, automatically get a discount on your next purchase. Our loyal customers are rewarded.'
    }
  },
]

export const weeklyEvent: WeeklyEvent = {
  bandName: 'Les Folies Solaires',
  description: {
    fr: 'Un trio jazz-gypsy qui mêle swing manouche et compositions originales. Venez vibrer au son des cordes et des cuivres dans une ambiance intime et chaleureuse.',
    en: 'A jazz-gypsy trio blending gypsy swing with original compositions. Come vibrate to the sound of strings and brass in an intimate, warm atmosphere.'
  },
  date: '2026-09-12',
  time: '19:00',
  image: 'https://images.pexels.com/photos/8040838/pexels-photo-8040838.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
}

export const openHours: OpenHours[] = [
  { days: { fr: 'Dimanche – Mercredi', en: 'Sunday – Wednesday' }, hours: '11:00 – 21:00' },
  { days: { fr: 'Jeudi – Samedi', en: 'Thursday – Saturday' }, hours: '11:00 – 22:00' },
]

export const siteInfo = {
  address: {
    fr: '1642 chemin des Briques Jaunes, Montréal (Québec), Canada H4C 3V5',
    en: '1642 Yellow Bricks Road, Montreal (Quebec), Canada H4C 3V5'
  },
  phone: '(514) 888-8888',
  email: 'info@pointeenfolie.com',
}

// Masonry gallery images — placeholder photos from Pexels
export const galleryImages = [
  { url: 'https://images.pexels.com/photos/24357593/pexels-photo-24357593.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: { fr: 'Le chef en cuisine', en: 'Chef in the kitchen' } },
  { url: 'https://images.pexels.com/photos/8440072/pexels-photo-8440072.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: { fr: 'Notre serveuse', en: 'Our waitress' } },
  { url: 'https://images.pexels.com/photos/37121079/pexels-photo-37121079.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: { fr: 'Clients heureux', en: 'Happy guests' } },
  { url: 'https://images.pexels.com/photos/8040838/pexels-photo-8040838.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: { fr: 'Musiciens live', en: 'Live musicians' } },
  { url: 'https://images.pexels.com/photos/4253292/pexels-photo-4253292.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: { fr: 'Préparation des ingrédients', en: 'Preparing ingredients' } },
  { url: 'https://images.pexels.com/photos/9961850/pexels-photo-9961850.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: { fr: 'Client savourant son repas', en: 'Guest enjoying a meal' } },
  { url: 'https://images.pexels.com/photos/3984830/pexels-photo-3984830.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: { fr: 'Le groupe en concert', en: 'The band performing' } },
  { url: 'https://images.pexels.com/photos/29129767/pexels-photo-29129767.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: { fr: 'Service à table', en: 'Table service' } },
  { url: 'https://images.pexels.com/photos/15441279/pexels-photo-15441279.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: { fr: 'L\'équipe en cuisine', en: 'The kitchen team' } },
  { url: 'https://images.pexels.com/photos/7968583/pexels-photo-7968583.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', alt: { fr: 'Amis au restaurant', en: 'Friends at the restaurant' } },
]

// Carousel images — pizza photos with names overlaid
export const carouselPizzas = pizzas.slice(0, 6).map(p => ({
  id: p.id,
  name: p.name,
  image: p.image!,
  description: p.description,
}))

// Valid promo codes for the order module
export const promoCodes: Record<string, number> = {
  'FOLIE10': 0.10,
  'BIENVENUE': 0.15,
  'PIZZA25': 0.25,
}
