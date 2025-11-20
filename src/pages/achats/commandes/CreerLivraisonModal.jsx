import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import { toast } from "react-toastify";
import { commandeService } from "@/services/apiService";
import { getQualiteLabel, getQualiteColor } from "@/constants/stocks";
import { formatMontant } from "@/constants/commandes";

const CreerLivraisonModal = ({ isOpen, onClose, commande, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    numeroLivraison: "",
    dateLivraison: new Date().toISOString().split('T')[0],
    depotId: 1, // Dépôt par défaut
    observations: "",
    lignesLivraison: []
  });

  // Initialiser les lignes de livraison à partir des lignes de commande
  React.useEffect(() => {
    if (commande && commande.lignesCommande) {
      const lignesLivraison = commande.lignesCommande.map(ligneCmd => ({
        ligneCommandeId: ligneCmd.id,
        produitId: ligneCmd.produitId,
        produitDescription: ligneCmd.produitDescription,
        produitReference: ligneCmd.produitReference,
        qualiteProduit: ligneCmd.qualiteProduit,
        quantiteCommandee: ligneCmd.quantiteCommandee,
        quantiteLivree: ligneCmd.quantiteCommandee, // Par défaut, livrer toute la quantité
        prixUnitaire: ligneCmd.prixUnitaire,
        montantLigne: ligneCmd.quantiteCommandee * ligneCmd.prixUnitaire,
        depotId: 1 // Dépôt par défaut
      }));
      
      setFormData(prev => ({
        ...prev,
        lignesLivraison,
        numeroLivraison: `LIV-${Date.now()}`
      }));
    }
  }, [commande]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLigneChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      lignesLivraison: prev.lignesLivraison.map((ligne, i) => 
        i === index 
          ? { 
              ...ligne, 
              [field]: value,
              montantLigne: field === 'quantiteLivree' 
                ? value * ligne.prixUnitaire 
                : ligne.montantLigne
            }
          : ligne
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.numeroLivraison.trim()) {
      toast.error("Le numéro de livraison est obligatoire");
      return;
    }

    if (formData.lignesLivraison.length === 0) {
      toast.error("Au moins une ligne de livraison est requise");
      return;
    }

    // Vérifier que toutes les quantités sont valides
    const hasInvalidQuantity = formData.lignesLivraison.some(ligne =>
      ligne.quantiteLivree <= 0 || ligne.quantiteLivree > ligne.quantiteCommandee
    );

    if (hasInvalidQuantity) {
      toast.error("Les quantités livrées doivent être positives et ne pas dépasser les quantités commandées");
      return;
    }

    // Vérifier que toutes les qualités sont valides
    const validQualities = ["PREMIERE_QUALITE", "DEUXIEME_QUALITE", "TROISIEME_QUALITE"];
    const hasInvalidQuality = formData.lignesLivraison.some(ligne =>
      !validQualities.includes(ligne.qualiteProduit)
    );

    if (hasInvalidQuality) {
      toast.error("Toutes les lignes doivent avoir une qualité valide");
      return;
    }

    try {
      setIsLoading(true);
      
      const livraisonData = {
        numeroLivraison: formData.numeroLivraison,
        dateLivraison: formData.dateLivraison,
        commandeId: commande.id,
        fournisseurId: commande.fournisseurId,
        depotId: formData.depotId,
        observations: formData.observations,
        statut: "BROUILLON",
        lignesLivraison: formData.lignesLivraison.map(ligne => ({
          ligneCommandeId: ligne.ligneCommandeId,
          produitId: ligne.produitId,
          produitDescription: ligne.produitDescription,
          produitReference: ligne.produitReference,
          qualiteProduit: ligne.qualiteProduit,
          quantiteLivree: parseFloat(ligne.quantiteLivree),
          prixUnitaire: parseFloat(ligne.prixUnitaire),
          montantLigne: parseFloat(ligne.quantiteLivree) * parseFloat(ligne.prixUnitaire),
          depotId: ligne.depotId
        }))
      };

      await commandeService.createCommande(livraisonData);
      toast.success("Livraison créée avec succès");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création de la livraison:", error);
      toast.error("Erreur lors de la création de la livraison");
    } finally {
      setIsLoading(false);
    }
  };

  const totalMontant = formData.lignesLivraison.reduce((sum, ligne) => 
    sum + (ligne.quantiteLivree * ligne.prixUnitaire), 0
  );

  if (!commande) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Créer une livraison - Commande ${commande.numeroCommande}`}
      footerContent={
        <div className="flex justify-end space-x-2">
          <Button
            text="Annuler"
            className="btn-outline-secondary"
            onClick={onClose}
            disabled={isLoading}
          />
          <Button
            text={isLoading ? "Création..." : "Créer la livraison"}
            className="btn-primary"
            onClick={handleSubmit}
            disabled={isLoading}
          />
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textinput
            label="Numéro de livraison *"
            value={formData.numeroLivraison}
            onChange={(e) => handleInputChange('numeroLivraison', e.target.value)}
            placeholder="LIV-..."
            required
          />
          
          <Textinput
            label="Date de livraison *"
            type="date"
            value={formData.dateLivraison}
            onChange={(e) => handleInputChange('dateLivraison', e.target.value)}
            required
          />
        </div>

        <Textarea
          label="Observations"
          value={formData.observations}
          onChange={(e) => handleInputChange('observations', e.target.value)}
          placeholder="Observations sur la livraison..."
          rows={3}
        />

        {/* Lignes de livraison */}
        <div>
          <h3 className="text-lg font-medium mb-4">Lignes de livraison</h3>

          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Note :</strong> Vous pouvez ajuster les quantités à livrer et modifier la qualité
              si elle diffère de celle commandée (par exemple, en cas de changement de qualité lors de la réception).
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Produit
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Qualité
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Qté Cmd
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Qté à livrer
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Prix unit.
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Montant
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {formData.lignesLivraison.map((ligne, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {ligne.produitDescription}
                      </div>
                      <div className="text-xs text-gray-500">
                        Réf: {ligne.produitReference}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Select
                        options={[
                          { value: "PREMIERE_QUALITE", label: "Première qualité" },
                          { value: "DEUXIEME_QUALITE", label: "Deuxième qualité" },
                          { value: "TROISIEME_QUALITE", label: "Troisième qualité" }
                        ]}
                        value={ligne.qualiteProduit}
                        onChange={(e) => handleLigneChange(index, 'qualiteProduit', e.target.value)}
                        className="text-xs"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-medium">
                        {ligne.quantiteCommandee}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max={ligne.quantiteCommandee}
                        step="0.01"
                        value={ligne.quantiteLivree}
                        onChange={(e) => handleLigneChange(index, 'quantiteLivree', parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm">
                        {formatMontant(ligne.prixUnitaire)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium">
                        {formatMontant(ligne.quantiteLivree * ligne.prixUnitaire)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    Total:
                  </td>
                  <td className="px-4 py-3 text-right text-lg font-bold text-gray-900 dark:text-white">
                    {formatMontant(totalMontant)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Résumé par qualité */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                Résumé par qualité
              </h4>
              <div className="space-y-1 text-sm">
                {Object.entries(
                  formData.lignesLivraison.reduce((acc, ligne) => {
                    const qualite = ligne.qualiteProduit;
                    if (!acc[qualite]) {
                      acc[qualite] = { quantite: 0, montant: 0 };
                    }
                    acc[qualite].quantite += Number(ligne.quantiteLivree || 0);
                    acc[qualite].montant += Number(ligne.quantiteLivree || 0) * Number(ligne.prixUnitaire || 0);
                    return acc;
                  }, {})
                ).map(([qualite, data]) => (
                  <div key={qualite} className="flex justify-between">
                    <span className="text-green-700 dark:text-green-300">
                      {getQualiteLabel(qualite)}:
                    </span>
                    <span className="font-medium">
                      {data.quantite.toFixed(2)} - {formatMontant(data.montant)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                Quantités totales
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Commandée:</span>
                  <span className="font-medium">
                    {formData.lignesLivraison.reduce((sum, ligne) => sum + Number(ligne.quantiteCommandee || 0), 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">À livrer:</span>
                  <span className="font-medium">
                    {formData.lignesLivraison.reduce((sum, ligne) => sum + Number(ligne.quantiteLivree || 0), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 dark:text-gray-300 mb-2">
                Montant total
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">HT:</span>
                  <span className="font-medium">{formatMontant(totalMontant)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">TVA (20%):</span>
                  <span className="font-medium">{formatMontant(totalMontant * 0.2)}</span>
                </div>
                <div className="flex justify-between border-t pt-1 text-base font-bold">
                  <span className="text-gray-900 dark:text-white">TTC:</span>
                  <span className="text-gray-900 dark:text-white">{formatMontant(totalMontant * 1.2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreerLivraisonModal;
