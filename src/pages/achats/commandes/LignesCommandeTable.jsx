import React from "react";
import Card from "@/components/ui/Card";
import LigneCommandeRow from "./LigneCommandeRow";
import { formatMontant } from "@/constants/commandes";

const LignesCommandeTable = ({ 
  lignes = [], 
  title = "Lignes de commande",
  showActions = false,
  showQuantiteLivree = false,
  onEditLigne,
  onDeleteLigne,
  className = ""
}) => {
  const totalGeneral = lignes.reduce((sum, ligne) => {
    return sum + (ligne.montantLigne || (ligne.quantiteCommandee * ligne.prixUnitaire));
  }, 0);

  const totalQuantiteCommandee = lignes.reduce((sum, ligne) => {
    return sum + Number(ligne.quantiteCommandee || 0);
  }, 0);

  const totalQuantiteLivree = lignes.reduce((sum, ligne) => {
    return sum + Number(ligne.quantiteLivree || 0);
  }, 0);

  if (lignes.length === 0) {
    return (
      <Card title={title} className={className}>
        <div className="text-center py-8 text-gray-500">
          Aucune ligne de commande
        </div>
      </Card>
    );
  }

  return (
    <Card title={title} className={className}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Produit
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Qualité
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Qté commandée
              </th>
              {showQuantiteLivree && (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Qté livrée
                </th>
              )}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Prix unitaire
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Montant
              </th>
              {showActions && (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {lignes.map((ligne, index) => (
              <LigneCommandeRow
                key={ligne.id || index}
                ligne={ligne}
                showActions={showActions}
                onEdit={onEditLigne}
                onDelete={onDeleteLigne}
              />
            ))}
          </tbody>
          
          <tfoot className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <td className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                Total ({lignes.length} ligne{lignes.length > 1 ? 's' : ''})
              </td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">
                {totalQuantiteCommandee.toFixed(2)}
              </td>
              {showQuantiteLivree && (
                <td className="px-6 py-4 text-center text-sm font-bold text-green-600">
                  {totalQuantiteLivree.toFixed(2)}
                </td>
              )}
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4 text-right text-lg font-bold text-gray-900 dark:text-white">
                {formatMontant(totalGeneral)}
              </td>
              {showActions && <td className="px-6 py-4"></td>}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Résumé par qualité */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
            Résumé par qualité
          </h4>
          <div className="space-y-1 text-sm">
            {Object.entries(
              lignes.reduce((acc, ligne) => {
                const qualite = ligne.qualiteProduit;
                if (!acc[qualite]) {
                  acc[qualite] = { quantite: 0, montant: 0 };
                }
                acc[qualite].quantite += Number(ligne.quantiteCommandee || 0);
                acc[qualite].montant += ligne.montantLigne || (ligne.quantiteCommandee * ligne.prixUnitaire);
                return acc;
              }, {})
            ).map(([qualite, data]) => (
              <div key={qualite} className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">{qualite}:</span>
                <span className="font-medium">
                  {data.quantite.toFixed(2)} - {formatMontant(data.montant)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
            Quantités
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-green-700 dark:text-green-300">Commandée:</span>
              <span className="font-medium">{totalQuantiteCommandee.toFixed(2)}</span>
            </div>
            {showQuantiteLivree && (
              <>
                <div className="flex justify-between">
                  <span className="text-green-700 dark:text-green-300">Livrée:</span>
                  <span className="font-medium">{totalQuantiteLivree.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="text-green-700 dark:text-green-300">Restante:</span>
                  <span className="font-medium">{(totalQuantiteCommandee - totalQuantiteLivree).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 dark:text-gray-300 mb-2">
            Montants
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Sous-total:</span>
              <span className="font-medium">{formatMontant(totalGeneral)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">TVA (20%):</span>
              <span className="font-medium">{formatMontant(totalGeneral * 0.2)}</span>
            </div>
            <div className="flex justify-between border-t pt-1 text-lg font-bold">
              <span className="text-gray-900 dark:text-white">Total TTC:</span>
              <span className="text-gray-900 dark:text-white">{formatMontant(totalGeneral * 1.2)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LignesCommandeTable;
