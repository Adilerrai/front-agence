// Statuts de réception fournisseur
export const STATUT_RECEPTION_OPTIONS = [
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'PARTIELLE', label: 'Partiellement reçue' },
  { value: 'RECUE', label: 'Complètement reçue' },
  { value: 'VALIDEE', label: 'Validée' },
  { value: 'ANNULEE', label: 'Annulée' },
];

// Couleurs pour les statuts
export const STATUT_RECEPTION_COLORS = {
  EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
  PARTIELLE: 'bg-blue-100 text-blue-800',
  RECUE: 'bg-green-100 text-green-800',
  VALIDEE: 'bg-purple-100 text-purple-800',
  ANNULEE: 'bg-red-100 text-red-800',
};

// Icônes pour les statuts
export const STATUT_RECEPTION_ICONS = {
  EN_ATTENTE: 'ph:clock',
  PARTIELLE: 'ph:package',
  RECUE: 'ph:check-circle',
  VALIDEE: 'ph:seal-check',
  ANNULEE: 'ph:x-circle',
};

