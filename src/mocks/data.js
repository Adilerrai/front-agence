export const menuItems = [
  {
    isHeadr: true,
    title: "Navigation",
  },
  {
    title: "Dashboard",
    icon: "ph:house",
    link: "dashboard",
  },
    {
    title: "Achats",
    icon: "ph:shopping-bag",
    child: [
      {
        childtitle: "Commandes d'achat",
        childlink: "achats/commandes",
        childicon: "ph:shopping-cart",
      },
      {
        childtitle: "Réceptions",
        childlink: "achats/receptions",
        childicon: "ph:package",
      },
      {
        childtitle: "Factures fournisseurs",
        childlink: "achats/factures",
        childicon: "ph:receipt",
      },
      
    ],
  },
  {
    title: "Ventes",
    icon: "ph:storefront",
    child: [
      {
        childtitle: "Commandes clients",
        childlink: "ventes/commandes",
        childicon: "ph:shopping-cart",
      },
      {
        childtitle: "Devis",
        childlink: "ventes/devis",
        childicon: "ph:file-text",
      },
      {
        childtitle: "Factures clients",
        childlink: "ventes/factures",
        childicon: "ph:receipt",
      },
      {
        childtitle: "Livraisons",
        childlink: "ventes/livraisons",
        childicon: "ph:truck",
      },
      {
        childtitle: "Retours clients",
        childlink: "ventes/retours",
        childicon: "ph:arrow-clockwise",
      },
    ],
  },
  
  {
    title: "Gestion des Stocks",
    icon: "ph:warehouse",
    child: [
      {
        childtitle: "Stock",
        childlink: "stocks",
        childicon: "ph:package",
      },
      {
        childtitle: "Mouvements",
        childlink: "stocks/mouvements",
        childicon: "ph:arrows-clockwise",
      },
      {
        childtitle: "Alertes Stock",
        childlink: "stocks/alertes",
        childicon: "ph:warning",
      },
    ],
  },
  {
    title: "Gestion Produits",
    icon: "ph:package",
    link: "produits",
  },
  {
    title: "Fournisseurs",
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

// Menu horizontal (topMenu) - utilise les mêmes éléments que menuItems
export const topMenu = menuItems;

// ==================== MOCK DATA DTOs ====================

// Données produits réelles de l'API avec tous les champs
export const mockProduits = [
  {
    id: 1,
    reference: "CERAM001",
    designation: "Carrelage Céramique Premium 60x60",
    description: "Carrelage céramique premium 60x60",
    uniteMesureStock: "M2",
    prixAchat: 25.00,
    prixVente: 45.00,
    pointDeVenteId: 1,
    image: null,
    actif: true,
    groupeArticle: {
      id: 1,
      nom: "CARRELAGE_SOL",
      description: "Carrelage pour sol"
    },
    // Caractéristiques techniques
    longueurCm: 60.0,
    largeurCm: 60.0,
    epaisseurMm: 10.0,
    format: "60x60"
  },
  {
    id: 2,
    reference: "CERAM002",
    designation: "Faïence Murale Décorative",
    description: "Faïence murale décorative 30x60",
    uniteMesureStock: "M2",
    prixAchat: 15.00,
    prixVente: 28.00,
    pointDeVenteId: 1,
    image: null,
    actif: true,
    groupeArticle: {
      id: 1,
      nom: "PRODUIT_FINI",
      description: "Produit fini"
    },
    longueurCm: 30.0,
    largeurCm: 60.0,
    epaisseurMm: 8.0,
    format: "30x60"
  },
  {
    id: 3,
    reference: "CERAM003",
    designation: "Grès Cérame Antidérapant",
    description: "Grès cérame antidérapant 45x45",
    uniteMesureStock: "M2",
    prixAchat: 30.00,
    prixVente: 55.00,
    pointDeVenteId: 1,
    image: null,
    actif: true,
    groupeArticle: {
      id: 1,
      nom: "PRODUIT_FINI",
      description: "Produit fini"
    },
    longueurCm: 45.0,
    largeurCm: 45.0,
    epaisseurMm: 12.0,
    format: "45x45"
  },
  {
    id: 4,
    reference: "CERAM004",
    designation: "Mosaïque en Céramique",
    description: "Mosaïque en céramique 30x30",
    uniteMesureStock: "M2",
    prixAchat: 40.00,
    prixVente: 75.00,
    pointDeVenteId: 1,
    image: null,
    actif: true,
    groupeArticle: {
      id: 1,
      nom: "PRODUIT_FINI",
      description: "Produit fini"
    },
    longueurCm: 30.0,
    largeurCm: 30.0,
    epaisseurMm: 8.0,
    format: "30x30"
  },
  {
    id: 5,
    reference: "CERAM005",
    designation: "Carrelage Extérieur Résistant",
    description: "Carrelage extérieur résistant",
    uniteMesureStock: "M2",
    prixAchat: 35.00,
    prixVente: 65.00,
    pointDeVenteId: 1,
    image: null,
    actif: true,
    groupeArticle: {
      id: 1,
      nom: "PRODUIT_FINI",
      description: "Produit fini"
    },
    longueurCm: 60.0,
    largeurCm: 60.0,
    epaisseurMm: 15.0,
    format: "60x60"
  },
  {
    id: 6,
    reference: "BEJMAT-006",
    designation: "Bejmat Traditionnel",
    description: "Brique traditionnelle marocaine en terre cuite, format allongé",
    uniteMesureStock: "PIECE",
    prixAchat: 0.85,
    prixVente: 1.50,
    pointDeVenteId: 1,
    image: null,
    actif: true,
    groupeArticle: {
      id: 1,
      nom: "PRODUIT_FINI",
      description: "Produit fini"
    },
    longueurCm: 15.0,
    largeurCm: 5.0,
    epaisseurMm: 20.0,
    format: "15x5x2"
  },
  {
    id: 7,
    reference: "JOINT-007",
    designation: "Joint Carrelage",
    description: "Mortier de jointoiement pour carrelage, plusieurs coloris",
    uniteMesureStock: "KG",
    prixAchat: 12.00,
    prixVente: 20.00,
    pointDeVenteId: 1,
    image: null,
    actif: true,
    groupeArticle: {
      id: 4,
      nom: "CONSOMMABLE",
      description: "Consommable"
    },
    longueurCm: null,
    largeurCm: null,
    epaisseurMm: null,
    format: "Sac 5kg"
  }
];

// Mock data pour StockQualiteDTO (nouveau système de stock par qualité)
export const mockStockQualites = [
  {
    id: 1,
    qualite: "PREMIERE_QUALITE",
    quantiteDisponible: 150.5,
    quantiteReservee: 25.0,
    seuilAlerte: 50.0,
    derniereMaj: "2024-01-15T10:30:00",
    produitId: 1,
    produitDescription: "Carrelage Zellige Premium",
    depotId: 1,
    depotNom: "Dépôt Principal Casablanca"
  },
  {
    id: 2,
    qualite: "DEUXIEME_QUALITE",
    quantiteDisponible: 75.0,
    quantiteReservee: 10.0,
    seuilAlerte: 20.0,
    derniereMaj: "2024-01-15T10:30:00",
    produitId: 1,
    produitDescription: "Carrelage Zellige Premium",
    depotId: 1,
    depotNom: "Dépôt Principal Casablanca"
  },
  {
    id: 3,
    qualite: "PREMIERE_QUALITE",
    quantiteDisponible: 500.0,
    quantiteReservee: 0.0,
    seuilAlerte: 100.0,
    derniereMaj: "2024-01-14T16:45:00",
    produitId: 2,
    produitDescription: "Enduit Tadelakt",
    depotId: 1,
    depotNom: "Dépôt Principal Casablanca"
  },
  {
    id: 4,
    qualite: "PREMIERE_QUALITE",
    quantiteDisponible: 45.0,
    quantiteReservee: 15.0,
    seuilAlerte: 30.0,
    derniereMaj: "2024-01-16T09:15:00",
    produitId: 3,
    produitDescription: "Mosaïque Géométrique",
    depotId: 2,
    depotNom: "Dépôt Rabat"
  },
  {
    id: 5,
    qualite: "DEUXIEME_QUALITE",
    quantiteDisponible: 12.5,
    quantiteReservee: 2.5,
    seuilAlerte: 10.0,
    derniereMaj: "2024-01-16T09:15:00",
    produitId: 3,
    produitDescription: "Mosaïque Géométrique",
    depotId: 2,
    depotNom: "Dépôt Rabat"
  },
  {
    id: 6,
    qualite: "PREMIERE_QUALITE",
    quantiteDisponible: 2500.0,
    quantiteReservee: 500.0,
    seuilAlerte: 1000.0,
    derniereMaj: "2024-01-16T14:20:00",
    produitId: 6,
    produitDescription: "Bejmat Traditionnel",
    depotId: 1,
    depotNom: "Dépôt Principal Casablanca"
  },
  {
    id: 7,
    qualite: "DEUXIEME_QUALITE",
    quantiteDisponible: 800.0,
    quantiteReservee: 0.0,
    seuilAlerte: 500.0,
    derniereMaj: "2024-01-16T14:20:00",
    produitId: 6,
    produitDescription: "Bejmat Traditionnel",
    depotId: 1,
    depotNom: "Dépôt Principal Casablanca"
  },
  {
    id: 8,
    qualite: "PREMIERE_QUALITE",
    quantiteDisponible: 15.0,
    quantiteReservee: 5.0,
    seuilAlerte: 25.0,
    derniereMaj: "2024-01-17T08:30:00",
    produitId: 7,
    produitDescription: "Joint Carrelage",
    depotId: 2,
    depotNom: "Dépôt Rabat"
  },
  {
    id: 9,
    qualite: "TROISIEME_QUALITE",
    quantiteDisponible: 25.0,
    quantiteReservee: 0.0,
    seuilAlerte: 10.0,
    derniereMaj: "2024-01-17T08:30:00",
    produitId: 1,
    produitDescription: "Carrelage Zellige Premium",
    depotId: 2,
    depotNom: "Dépôt Rabat"
  }
];

// Mock data pour StockDTO (nouveau système avec liste de stocks par qualité)
export const mockStocks = [
  {
    id: 1,
    produitId: 1,
    produitDescription: "Carrelage Zellige Premium",
    depotId: 1,
    depotNom: "Dépôt Principal Casablanca",
    stocksQualite: [
      {
        id: 1,
        qualite: "PREMIERE_QUALITE",
        quantiteDisponible: 150.5,
        quantiteReservee: 25.0,
        seuilAlerte: 50.0,
        derniereMaj: "2024-01-15T10:30:00",
        produitId: 1,
        produitDescription: "Carrelage Zellige Premium",
        depotId: 1,
        depotNom: "Dépôt Principal Casablanca"
      },
      {
        id: 2,
        qualite: "DEUXIEME_QUALITE",
        quantiteDisponible: 75.0,
        quantiteReservee: 10.0,
        seuilAlerte: 20.0,
        derniereMaj: "2024-01-15T10:30:00",
        produitId: 1,
        produitDescription: "Carrelage Zellige Premium",
        depotId: 1,
        depotNom: "Dépôt Principal Casablanca"
      }
    ]
  },
  {
    id: 2,
    produitId: 2,
    produitDescription: "Enduit Tadelakt",
    depotId: 1,
    depotNom: "Dépôt Principal Casablanca",
    stocksQualite: [
      {
        id: 3,
        qualite: "PREMIERE_QUALITE",
        quantiteDisponible: 500.0,
        quantiteReservee: 0.0,
        seuilAlerte: 100.0,
        derniereMaj: "2024-01-14T16:45:00",
        produitId: 2,
        produitDescription: "Enduit Tadelakt",
        depotId: 1,
        depotNom: "Dépôt Principal Casablanca"
      }
    ]
  },
  {
    id: 3,
    produitId: 3,
    produitDescription: "Mosaïque Géométrique",
    depotId: 2,
    depotNom: "Dépôt Rabat",
    stocksQualite: [
      {
        id: 4,
        qualite: "PREMIERE_QUALITE",
        quantiteDisponible: 45.0,
        quantiteReservee: 15.0,
        seuilAlerte: 30.0,
        derniereMaj: "2024-01-16T09:15:00",
        produitId: 3,
        produitDescription: "Mosaïque Géométrique",
        depotId: 2,
        depotNom: "Dépôt Rabat"
      },
      {
        id: 5,
        qualite: "DEUXIEME_QUALITE",
        quantiteDisponible: 12.5,
        quantiteReservee: 2.5,
        seuilAlerte: 10.0,
        derniereMaj: "2024-01-16T09:15:00",
        produitId: 3,
        produitDescription: "Mosaïque Géométrique",
        depotId: 2,
        depotNom: "Dépôt Rabat"
      }
    ]
  },
  {
    id: 4,
    produitId: 6,
    produitDescription: "Bejmat Traditionnel",
    depotId: 1,
    depotNom: "Dépôt Principal Casablanca",
    stocksQualite: [
      {
        id: 6,
        qualite: "PREMIERE_QUALITE",
        quantiteDisponible: 2500.0,
        quantiteReservee: 500.0,
        seuilAlerte: 1000.0,
        derniereMaj: "2024-01-16T14:20:00",
        produitId: 6,
        produitDescription: "Bejmat Traditionnel",
        depotId: 1,
        depotNom: "Dépôt Principal Casablanca"
      },
      {
        id: 7,
        qualite: "DEUXIEME_QUALITE",
        quantiteDisponible: 800.0,
        quantiteReservee: 0.0,
        seuilAlerte: 500.0,
        derniereMaj: "2024-01-16T14:20:00",
        produitId: 6,
        produitDescription: "Bejmat Traditionnel",
        depotId: 1,
        depotNom: "Dépôt Principal Casablanca"
      }
    ]
  },
  {
    id: 5,
    produitId: 7,
    produitDescription: "Joint Carrelage",
    depotId: 2,
    depotNom: "Dépôt Rabat",
    stocksQualite: [
      {
        id: 8,
        qualite: "PREMIERE_QUALITE",
        quantiteDisponible: 15.0,
        quantiteReservee: 5.0,
        seuilAlerte: 25.0,
        derniereMaj: "2024-01-17T08:30:00",
        produitId: 7,
        produitDescription: "Joint Carrelage",
        depotId: 2,
        depotNom: "Dépôt Rabat"
      }
    ]
  }
];

// Mock data pour les dépôts
export const mockDepots = [
  {
    id: 1,
    nom: "Dépôt Principal Casablanca",
    description: "Dépôt principal pour la région de Casablanca",
    adresse: "Zone Industrielle Ain Sebaa, Casablanca",
    pointDeVenteId: 1,
    actif: true
  },
  {
    id: 2,
    nom: "Dépôt Rabat",
    description: "Dépôt secondaire pour la région de Rabat-Salé",
    adresse: "Zone Industrielle Salé, Rabat",
    pointDeVenteId: 1,
    actif: true
  },
  {
    id: 3,
    nom: "Dépôt Marrakech",
    description: "Dépôt pour la région de Marrakech",
    adresse: "Route de Safi, Marrakech",
    pointDeVenteId: 2,
    actif: false
  }
];

// Fonctions utilitaires pour les stocks
export const stockUtils = {
  // Calculer la quantité totale disponible pour un stock
  getQuantiteTotaleDisponible: (stock) => {
    return stock.stocksQualite.reduce((total, sq) => total + sq.quantiteDisponible, 0);
  },

  // Calculer la quantité totale réservée pour un stock
  getQuantiteTotaleReservee: (stock) => {
    return stock.stocksQualite.reduce((total, sq) => total + sq.quantiteReservee, 0);
  },

  // Obtenir le stock par qualité
  getStockByQualite: (stock, qualite) => {
    return stock.stocksQualite.find(sq => sq.qualite === qualite) || null;
  },

  // Vérifier si un stock est en alerte
  isStockEnAlerte: (stockQualite) => {
    return stockQualite.quantiteDisponible <= stockQualite.seuilAlerte;
  },

  // Obtenir tous les stocks en alerte
  getStocksEnAlerte: (stocks) => {
    const alertes = [];
    stocks.forEach(stock => {
      stock.stocksQualite.forEach(sq => {
        if (stockUtils.isStockEnAlerte(sq)) {
          alertes.push({
            ...sq,
            stockId: stock.id,
            produitDescription: stock.produitDescription,
            depotNom: stock.depotNom
          });
        }
      });
    });
    return alertes;
  }
};
