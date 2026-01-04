import { SITE_SETTINGS } from './data';

export const optimizeImage = (url: string, width: number = 800, quality: number = 70) => {
  if (url && url.includes('images.unsplash.com')) {
    return `${url}?auto=format&fit=crop&q=${quality}&w=${width}`;
  }
  return url;
};

export const formatPrice = (price: number) => {
  if (isNaN(price)) return "0 FCFA";
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);
};

export const sanitizeInput = (input: string) => input.replace(/[<>]/g, ""); 

// Générateur de lien WhatsApp
export const generateWhatsAppLink = (type: string, data?: any) => {
  let message = "";
  
  const formatCartItems = (items: any[]) => {
      return items.map((i:any, index: number) => {
          let details = `*${index + 1}. ${i.tripTitle || i.trip.title}*\n   📅 ${i.date}\n   👥 ${i.participants} pers.`;
          const options = Object.keys(i.options).filter(k => i.options[k]).map(k => {
             const qty = typeof i.options[k] === 'number' ? i.options[k] : '';
             return `   + ${k} ${qty ? `(x${qty})` : ''}`;
          }).join('\n');
          if(options) details += `\n${options}`;
          return details;
      }).join('\n\n');
  };

  switch(type) {
    case 'advice_checkout':
      message = `Bonjour, je souhaite plus d'information sur cette commande:\n\n*Réf Panier:* ${data.orderId}\n*Montant Total:* ${formatPrice(data.total)}\n\n------------------\n*CONTENU DU PANIER:*\n\n${formatCartItems(data.items)}\n\n------------------\n\nJ'ai une question concernant : `;
      break;
    case 'custom_help':
      message = `Bonjour, je suis en train de créer un voyage sur mesure sur le site et j'ai besoin d'aide.`;
      break;
    case 'custom': 
      message = `Bonjour Life Travel, je souhaite organiser un voyage PRIVE et SUR-MESURE. J'aimerais un devis personnalisé.`; 
      break;
    case 'visa_help':
      message = `Bonjour, j'ai besoin d'assistance pour ma procédure de Visa E-Visa Cameroun.`;
      break;
    case 'partnership':
      message = `Bonjour, je représente une ONG ou je suis un investisseur. Je souhaite discuter de projets de développement local et touristique.`;
      break;
    case 'product_inquiry':
      message = `Bonjour, je suis intéressé par l'excursion : ${data?.title || 'Voyage'}. J'aimerais en savoir plus avant de réserver.`;
      break;
    default: 
      message = `Bonjour Life Travel.`;
  }
  return `https://wa.me/${SITE_SETTINGS.whatsappApiNumber}?text=${encodeURIComponent(message)}`;
};