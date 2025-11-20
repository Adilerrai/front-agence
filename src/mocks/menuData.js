export const menuItems = [
  {
    isHeadr: true,
    title: "Menu Principal",
  },
  {
    title: "Dashboard",
    icon: "heroicons-outline:home",
    link: "dashboard",
  },
  {
    title: "Accueil",
    icon: "ph:house",
    isHide: true,
    link: "dashboard",
  },
  {
    isHeadr: true,
    title: "Gestion",
  },
  {
    title: "Produit",
    icon: "ph:package",
    link: "produits",
  },
  {
    title: "Vente",
    icon: "ph:shopping-cart",
    link: "ventes",
  },
  {
    title: "Commande Fournisseur",
    icon: "ph:list",
    link: "achats/commandes",
  },
  {
    title: "Stock",
    icon: "ph:warehouse",
    link: "stocks",
  },
  {
    title: "Client",
    icon: "ph:users",
    link: "clients",
  },
  {
    title: "Fournisseur",
    icon: "ph:factory",
    link: "fournisseurs",
  },
];

// Données pour les notifications
import User1 from "@/assets/images/avatar/avatar-1.jpg";
import User2 from "@/assets/images/avatar/avatar-2.jpg";
import User3 from "@/assets/images/avatar/avatar-3.jpg";
import User4 from "@/assets/images/avatar/avatar-4.jpg";

export const notifications = [
  {
    title: "Nouveau produit ajouté <span class='font-medium'>avec succès</span>",
    icon: "ph:cube-light",
    status: "blue",
    link: "#",
  },
  {
    title: "Commande <span class='font-medium'>traitée</span>",
    icon: "ph:shopping-cart-light",
    status: "green",
    link: "#",
  },
];

export const message = [
  {
    title: "Équipe Support",
    desc: "Nouveau message concernant la gestion des produits",
    active: true,
    hasnotifaction: true,
    notification_count: 1,
    image: User1,
    link: "#",
  },
  {
    title: "Admin Système",
    desc: "Mise à jour de l'API disponible",
    active: false,
    hasnotifaction: true,
    image: User2,
    link: "#",
  },
];

export const colors = {
  primary: "#3b82f6",
  secondary: "#d946ef",
  danger: "#ef4444",
  black: "#000",
  warning: "#eab308",
  info: "#06b6d4",
  light: "#425466",
  success: "#22c55e",
  "gray-f7": "#F7F8FC",
  dark: "#1E293B",
  "dark-gray": "#0F172A",
  gray: "#68768A",
  gray2: "#EEF1F9",
  "dark-light": "#CBD5E1",
};

export const hexToRGB = (hex, alpha) => {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
};
