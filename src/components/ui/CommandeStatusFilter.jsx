import React from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

/**
 * Composant de filtre par statut pour les commandes fournisseur
 * @param {string} selectedStatus - Le statut actuellement sélectionné
 * @param {function} onStatusChange - Callback quand le statut change
 * @param {object} statusCounts - Objet avec le nombre de commandes par statut
 */
const CommandeStatusFilter = ({ selectedStatus, onStatusChange, statusCounts = {} }) => {
  const statuses = [
    { value: "ALL", label: "Tous", icon: "ph:list" },
    { value: "BROUILLON", label: "Brouillon", icon: "ph:file-text" },
    { value: "PASSEE", label: "Passée", icon: "ph:paper-plane" },
    { value: "PARTIELLE", label: "Partiellement livrée", icon: "ph:truck" },
    { value: "LIVREE", label: "Livrée", icon: "ph:check-circle" },
    { value: "VALIDEE", label: "Validée", icon: "ph:seal-check" },
    { value: "ANNULEE", label: "Annulée", icon: "ph:x-circle" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {statuses.map((status) => (
        <Button
          key={status.value}
          icon={status.icon}
          text={`${status.label} ${statusCounts[status.value] ? `(${statusCounts[status.value]})` : ""}`}
          className={`btn-sm ${
            selectedStatus === status.value
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
          onClick={() => onStatusChange(status.value)}
        />
      ))}
    </div>
  );
};

export default CommandeStatusFilter;

