import type { Lang } from './types'

type Dict = Record<string, { fr: string; en: string }>

const dict: Dict = {
  // Nav
  'nav.home': { fr: 'Accueil', en: 'Home' },
  'nav.menu': { fr: 'Menu', en: 'Menu' },
  'nav.order': { fr: 'Commander', en: 'Order' },
  'nav.about': { fr: 'À propos', en: 'About' },
  'nav.contact': { fr: 'Contact', en: 'Contact' },

  // Header
  'header.callUs': { fr: 'Appelez-nous', en: 'Call us' },
  'header.openHours': { fr: 'Heures d\'ouverture', en: 'Opening hours' },
  'header.sunWed': { fr: 'Dimanche – Mercredi', en: 'Sunday – Wednesday' },
  'header.thuSat': { fr: 'Jeudi – Samedi', en: 'Thursday – Saturday' },
  'header.closed': { fr: 'Fermé', en: 'Closed' },

  // Home
  'home.welcome': { fr: 'Bienvenue chez', en: 'Welcome to' },
  'home.tagline': { fr: 'Pizzas artisanales, musique live & ambiance chaleureuse', en: 'Artisan pizzas, live music & warm atmosphere' },
  'home.orderNow': { fr: 'Commander maintenant', en: 'Order now' },
  'home.viewMenu': { fr: 'Voir le menu', en: 'View menu' },
  'home.freshFromOven': { fr: 'Tout frais du four', en: 'Fresh from the oven' },
  'home.freshFromOvenDesc': {
    fr: 'Nos pizzas ne sont peut-être pas toujours rondes, mais la pâte est travaillée à la main tous les matins pour un délice sans pareil.',
    en: 'Our pizzas may not always be round, but the dough is hand-crafted every morning for a delight like no other.'
  },
  'home.weeklyEvent': { fr: 'Événement de la semaine', en: 'Event of the week' },
  'home.eventDate': { fr: 'Date', en: 'Date' },
  'home.eventTime': { fr: 'Heure', en: 'Time' },
  'home.eventDesc': { fr: 'Description', en: 'Description' },
  'home.promotions': { fr: 'Promotions', en: 'Promotions' },
  'home.hoursAddress': { fr: 'Horaires & Adresse', en: 'Hours & Address' },
  'home.gallery': { fr: 'Notre univers', en: 'Our world' },
  'home.galleryDesc': {
    fr: 'Cuisiniers, serveurs, clients et musiciens — l\'âme de Pointe en folie',
    en: 'Cooks, servers, guests and musicians — the soul of Pointe en folie'
  },

  // Menu page
  'menu.title': { fr: 'Notre Menu', en: 'Our Menu' },
  'menu.intro': {
    fr: 'Les chefs-d\'œuvre de Louis, une pizza pour tous les goûts. L\'art culinaire de notre chef, digne du Roi Soleil, saura vous surprendre avec ses pointes en folie.',
    en: 'Louis\'s masterpieces, a pizza for every taste. Our chef\'s culinary art, worthy of the Sun King, will surprise you with his wild points.'
  },
  'menu.pizzas': { fr: 'Pizzas', en: 'Pizzas' },
  'menu.salads': { fr: 'Salades', en: 'Salads' },
  'menu.drinks': { fr: 'Boissons', en: 'Drinks' },
  'menu.desserts': { fr: 'Desserts', en: 'Desserts' },
  'menu.ingredients': { fr: 'Ingrédients', en: 'Ingredients' },
  'menu.sizes': { fr: 'Tailles', en: 'Sizes' },
  'menu.addToCart': { fr: 'Ajouter au panier', en: 'Add to cart' },
  'menu.veg': { fr: 'Végétarien', en: 'Vegetarian' },
  'menu.spicy': { fr: 'Épicé', en: 'Spicy' },
  'menu.dessertBadge': { fr: 'Dessert', en: 'Dessert' },
  'menu.small': { fr: 'Petite (P)', en: 'Small (S)' },
  'menu.medium': { fr: 'Moyenne (M)', en: 'Medium (M)' },
  'menu.large': { fr: 'Grande (G)', en: 'Large (L)' },

  // Order page
  'order.title': { fr: 'Commander en ligne', en: 'Order online' },
  'order.delivery': { fr: 'Livraison', en: 'Delivery' },
  'order.pickup': { fr: 'Cueillette', en: 'Pickup' },
  'order.date': { fr: 'Date', en: 'Date' },
  'order.time': { fr: 'Heure', en: 'Time' },
  'order.cart': { fr: 'Panier', en: 'Cart' },
  'order.emptyCart': { fr: 'Votre panier est vide', en: 'Your cart is empty' },
  'order.browseMenu': { fr: 'Parcourir le menu', en: 'Browse the menu' },
  'order.subtotal': { fr: 'Sous-total', en: 'Subtotal' },
  'order.promoCode': { fr: 'Code promo', en: 'Promo code' },
  'order.apply': { fr: 'Appliquer', en: 'Apply' },
  'order.discount': { fr: 'Rabais', en: 'Discount' },
  'order.total': { fr: 'Total', en: 'Total' },
  'order.customerInfo': { fr: 'Vos informations', en: 'Your information' },
  'order.name': { fr: 'Nom complet', en: 'Full name' },
  'order.phone': { fr: 'Téléphone', en: 'Phone' },
  'order.email': { fr: 'Courriel', en: 'Email' },
  'order.address': { fr: 'Adresse de livraison', en: 'Delivery address' },
  'order.notes': { fr: 'Notes / instructions', en: 'Notes / instructions' },
  'order.placeOrder': { fr: 'Confirmer la commande', en: 'Place order' },
  'order.paymentLater': {
    fr: 'Le paiement sera traité ultérieurement. Nous vous contacterons pour confirmer.',
    en: 'Payment will be processed later. We will contact you to confirm.'
  },
  'order.orderConfirmed': { fr: 'Commande confirmée !', en: 'Order confirmed!' },
  'order.confirmMsg': {
    fr: 'Merci ! Nous avons bien reçu votre commande et vous contacterons bientôt.',
    en: 'Thank you! We have received your order and will contact you soon.'
  },
  'order.invalidPromo': { fr: 'Code promo invalide', en: 'Invalid promo code' },
  'order.promoApplied': { fr: 'Code promo appliqué !', en: 'Promo code applied!' },
  'order.removeItem': { fr: 'Retirer', en: 'Remove' },
  'order.qty': { fr: 'Qté', en: 'Qty' },

  // About page
  'about.title': { fr: 'À propos de Pointe en folie', en: 'About Pointe en folie' },
  'about.p1': {
    fr: 'Pointe en folie est une pizzéria artisanale née de la passion du chef Louis pour la cuisine créative. Inspiré par l\'histoire française et l\'esprit du Roi Soleil, Louis a créé un lieu où chaque pizza est une œuvre d\'art — pas toujours ronde, mais toujours délicieuse.',
    en: 'Pointe en folie is an artisan pizzeria born from chef Louis\'s passion for creative cooking. Inspired by French history and the spirit of the Sun King, Louis created a place where every pizza is a work of art — not always round, but always delicious.'
  },
  'about.p2': {
    fr: 'La pâte est travaillée à la main tous les matins. Les ingrédients sont frais, locaux et choisis avec soin. Du fromage fondant aux sauces maison, chaque détail compte pour offrir une expérience culinaire hors du commun.',
    en: 'The dough is hand-crafted every morning. Ingredients are fresh, local and carefully selected. From melting cheese to homemade sauces, every detail matters to deliver an extraordinary culinary experience.'
  },
  'about.p3': {
    fr: 'Une fois par mois, la pizzéria se transforme en salle de concert. Nous accueillons des artistes musiciens pour des soirées où la musique et la gastronomie se rencontrent. Suivez notre bloc « Événement de la semaine » sur la page d\'accueil pour ne rien manquer.',
    en: 'Once a month, the pizzeria transforms into a concert hall. We welcome musicians for evenings where music and gastronomy meet. Follow our "Event of the week" block on the home page so you don\'t miss a thing.'
  },
  'about.chefTitle': { fr: 'Le chef Louis vous dit…', en: 'Chef Louis says…' },
  'about.chefQuote': {
    fr: 'Nos pizzas ne sont peut-être pas toujours rondes, mais la pâte est travaillée à la main tous les matins pour un délice sans pareil.',
    en: 'Our pizzas may not always be round, but the dough is hand-crafted every morning for a delight like no other.'
  },
  'about.values': { fr: 'Nos valeurs', en: 'Our values' },
  'about.handmade': { fr: 'Fait main', en: 'Handmade' },
  'about.handmadeDesc': {
    fr: 'La pâte est pétrie chaque matin, à la main, avec amour.',
    en: 'The dough is kneaded every morning, by hand, with love.'
  },
  'about.local': { fr: 'Ingrédients locaux', en: 'Local ingredients' },
  'about.localDesc': {
    fr: 'Nous privilégions les producteurs locaux pour des saveurs authentiques.',
    en: 'We favor local producers for authentic flavors.'
  },
  'about.music': { fr: 'Musique live', en: 'Live music' },
  'about.musicDesc': {
    fr: 'Un rendez-vous mensuel avec des artistes musiciens de talent.',
    en: 'A monthly date with talented musicians.'
  },

  // Contact page
  'contact.title': { fr: 'Nous joindre', en: 'Contact us' },
  'contact.address': { fr: 'Adresse', en: 'Address' },
  'contact.phone': { fr: 'Téléphone', en: 'Phone' },
  'contact.email': { fr: 'Courriel', en: 'Email' },
  'contact.hours': { fr: 'Heures d\'ouverture', en: 'Opening hours' },
  'contact.emailLink': { fr: 'Écrivez-nous', en: 'Email us' },

  // Footer
  'footer.rights': { fr: 'Tous droits réservés', en: 'All rights reserved' },
  'footer.address': { fr: '1642 chemin des Briques Jaunes, Montréal (Québec), Canada H4C 3V5', en: '1642 Yellow Bricks Road, Montreal (Quebec), Canada H4C 3V5' },
  'footer.phone': { fr: '(514) 888-8888', en: '(514) 888-8888' },
  'footer.email': { fr: 'info@pointeenfolie.com', en: 'info@pointeenfolie.com' },
}

export function t(key: string, lang: Lang): string {
  const entry = dict[key]
  if (!entry) return key
  return entry[lang]
}
