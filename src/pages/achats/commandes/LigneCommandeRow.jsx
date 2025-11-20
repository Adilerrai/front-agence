import React from "react";
import Badge from "@/components/ui/Badge";
import { getQualiteLabel, getQualiteColor } from "@/constants/stocks";
import { formatMontant } from "@/constants/commandes";

const LigneCommandeRow = ({ ligne, showActions = false, onEdit, onDelete }) => {
  const renderQualiteBadge = (qualite) => {
    return (
      <Badge 
        label={getQualiteLabel(qualite)} 
        className={`text-xs ${getQualiteColor(qualite)}`}
      />
    );
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {ligne.produitDescription}
        </div>
        <div className="text-xs text-gray-500">
          Réf: {ligne.produitReference}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-center">
        {renderQualiteBadge(ligne.qualiteProduit)}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span className="text-sm font-medium">
          {Number(ligne.quantiteCommandee).toFixed(2)}
        </span>
      </td>
      
      {ligne.quantiteLivree !== undefined && (
        <td className="px-6 py-4 whitespace-nowrap text-center">
          <span className="text-sm font-medium text-green-600">
            {Number(ligne.quantiteLivree || 0).toFixed(2)}
          </span>
        </td>
      )}
      
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <span className="text-sm font-medium">
          {formatMontant(ligne.prixUnitaire)}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {formatMontant(ligne.montantLigne || (ligne.quantiteCommandee * ligne.prixUnitaire))}
        </span>
      </td>
      
      {showActions && (
        <td className="px-6 py-4 whitespace-nowrap text-center">
          <div className="flex justify-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(ligne)}
                className="text-blue-600 hover:text-blue-900 text-sm"
                title="Modifier"
              >
                Modifier
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(ligne)}
                className="text-red-600 hover:text-red-900 text-sm"
                title="Supprimer"
              >
                Supprimer
              </button>
            )}
          </div>
        </td>
      )}
    </tr>
  );
};

export default LigneCommandeRow;
