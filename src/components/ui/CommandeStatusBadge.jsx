import React from "react";
import Icon from "@/components/ui/Icon";

/**
 * Composant Badge pour afficher le statut d'une commande fournisseur
 * @param {string} statut - Le statut de la commande (BROUILLON, PASSEE, PARTIELLE, LIVREE, VALIDEE, ANNULEE)
 * @param {string} className - Classes CSS additionnelles
 */
const CommandeStatusBadge = ({ statut, className = "" }) => {
  const statusConfig = {
    BROUILLON: {
      label: "Brouillon",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      icon: "ph:file-text",
    },
    PASSEE: {
      label: "Passée",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      icon: "ph:paper-plane",
    },
    PARTIELLE: {
      label: "Partiellement livrée",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      icon: "ph:truck",
    },
    LIVREE: {
      label: "Livrée",
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      icon: "ph:check-circle",
    },
    VALIDEE: {
      label: "Validée",
      color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      icon: "ph:seal-check",
    },
    ANNULEE: {
      label: "Annulée",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      icon: "ph:x-circle",
    },
  };

  const config = statusConfig[statut] || statusConfig.BROUILLON;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${config.color} ${className}`}
    >
      <Icon icon={config.icon} className="mr-1 text-sm" />
      {config.label}
    </span>
  );
};

export default CommandeStatusBadge;

