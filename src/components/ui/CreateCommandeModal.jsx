import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { commandeFournisseurService } from "@/services/apiService";

const CreateCommandeModal = ({ isOpen, onClose, onCommandeCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    numeroCommande: "",
    fournisseurId: "",
    dateCommande: new Date().toISOString().split("T")[0],
    montantTotal: "",
    statut: "BROUILLON",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.numeroCommande.trim()) {
      toast.error("Le numéro de commande est requis");
      return;
    }

    if (!formData.fournisseurId) {
      toast.error("Le fournisseur est requis");
      return;
    }

    if (!formData.montantTotal || parseFloat(formData.montantTotal) <= 0) {
      toast.error("Le montant doit être supérieur à 0");
      return;
    }

    setIsLoading(true);

    try {
      const commandeData = {
        numeroCommande: formData.numeroCommande,
        fournisseurId: parseInt(formData.fournisseurId),
        dateCommande: formData.dateCommande,
        montantTotal: parseFloat(formData.montantTotal),
        statut: formData.statut,
      };

      await commandeFournisseurService.createCommande(commandeData);
      toast.success("Commande créée avec succès");

      // Réinitialiser le formulaire
      setFormData({
        numeroCommande: "",
        fournisseurId: "",
        dateCommande: new Date().toISOString().split("T")[0],
        montantTotal: "",
        statut: "BROUILLON",
      });

      // Fermer le modal et rafraîchir la liste
      onClose();
      if (onCommandeCreated) {
        onCommandeCreated();
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Erreur lors de la création de la commande");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Créer une Commande Fournisseur"
      activeModal={isOpen}
      onClose={onClose}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Numéro Commande */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            N° Commande *
          </label>
          <input
            type="text"
            name="numeroCommande"
            placeholder="Ex: CMD-2024-001"
            value={formData.numeroCommande}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Fournisseur ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ID Fournisseur *
          </label>
          <input
            type="number"
            name="fournisseurId"
            placeholder="Ex: 1"
            value={formData.fournisseurId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Date Commande */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date Commande *
          </label>
          <input
            type="date"
            name="dateCommande"
            value={formData.dateCommande}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Montant Total */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Montant Total (€) *
          </label>
          <input
            type="number"
            name="montantTotal"
            placeholder="Ex: 1000.00"
            step="0.01"
            value={formData.montantTotal}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Statut
          </label>
          <select
            name="statut"
            value={formData.statut}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="BROUILLON">Brouillon</option>
            <option value="PASSEE">Passée</option>
            <option value="PARTIELLE">Partiellement livrée</option>
            <option value="LIVREE">Livrée</option>
            <option value="VALIDEE">Validée</option>
            <option value="ANNULEE">Annulée</option>
          </select>
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            text="Annuler"
            className="btn-outline-light"
            onClick={onClose}
            disabled={isLoading}
          />
          <Button
            text={isLoading ? "Création..." : "Créer"}
            className="btn-primary"
            type="submit"
            disabled={isLoading}
          />
        </div>
      </form>
    </Modal>
  );
};

export default CreateCommandeModal;

