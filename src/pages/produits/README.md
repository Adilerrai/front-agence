# Module Gestion des Produits

Ce module permet la gestion complète des produits dans l'application SaaS de point de vente.

## Fonctionnalités

### ✅ Fonctionnalités implémentées

- **Liste des produits** : Affichage en tableau avec pagination
- **Recherche** : Recherche par référence, description et type d'article
- **Ajout de produit** : Formulaire modal complet avec validation
- **Modification de produit** : Édition des produits existants
- **Suppression de produit** : Suppression avec confirmation
- **Upload d'images** : Glisser-déposer avec prévisualisation
- **Validation des formulaires** : Validation côté client avec Yup
- **Gestion des erreurs** : Messages d'erreur et de succès

### 📋 Champs gérés

- **Référence** (obligatoire)
- **Description** (obligatoire)
- **Type d'article** (obligatoire)
- **Groupe d'article** (obligatoire)
- **Prix d'achat**
- **Prix de vente**
- **Unités de mesure** (stock, achat, vente)
- **Statuts** : Acheté, Vendu, Stocké, Géré par lot
- **Image du produit**

## Structure des fichiers

```
src/pages/produits/
├── index.jsx              # Page principale avec tableau
├── ProduitModal.jsx       # Formulaire modal d'ajout/modification
└── README.md             # Documentation

src/store/api/app/
└── produitApiSlice.js    # API slice pour les appels CRUD

src/components/ui/
├── ImageUpload.jsx       # Composant d'upload d'images
└── ...

src/constants/
└── produits.js          # Constantes et options
```

## API Endpoints utilisés

- `GET /api/v1/produit/all` - Récupérer tous les produits
- `GET /api/v1/produit/get/{id}` - Récupérer un produit par ID
- `POST /api/v1/produit/add` - Créer un nouveau produit
- `POST /api/v1/produit/update` - Mettre à jour un produit
- `DELETE /api/v1/produit/{id}` - Supprimer un produit

## Configuration

### URL de l'API

L'URL de base de l'API est configurée dans `src/store/api/apiSlice.js` :

```javascript
baseUrl: "https://point_vente/"
```

### Authentification

Les requêtes incluent automatiquement le token d'authentification JWT dans les headers.

## Utilisation

### Accès au module

Le module est accessible via le menu de navigation :
- **Menu** > **Gestion** > **Produits**
- **URL** : `/produits`

### Actions disponibles

1. **Voir la liste** : Tableau avec pagination et recherche
2. **Ajouter un produit** : Bouton "Ajouter Produit"
3. **Modifier un produit** : Icône crayon dans le tableau
4. **Supprimer un produit** : Icône poubelle avec confirmation

### Upload d'images

- **Formats supportés** : JPG, PNG, GIF, WebP
- **Taille maximale** : 5MB
- **Méthodes** : Glisser-déposer ou clic pour parcourir
- **Prévisualisation** : Aperçu immédiat de l'image

## Validation des données

### Champs obligatoires
- Référence
- Description
- Type d'article
- Groupe d'article

### Validation des prix
- Les prix doivent être des nombres positifs
- Validation côté client et serveur

## Messages utilisateur

Tous les messages sont en français et centralisés dans `src/constants/produits.js` :

- Messages de succès
- Messages d'erreur
- Labels et options

## Technologies utilisées

- **React** avec hooks
- **Redux Toolkit Query** pour l'API
- **React Hook Form** pour les formulaires
- **Yup** pour la validation
- **React Table** pour le tableau
- **React Toastify** pour les notifications
- **Tailwind CSS** pour le styling

## Prochaines améliorations possibles

- [ ] Export des données (CSV, Excel)
- [ ] Import en masse
- [ ] Gestion des catégories
- [ ] Historique des modifications
- [ ] Gestion des stocks
- [ ] Code-barres
- [ ] Variantes de produits
