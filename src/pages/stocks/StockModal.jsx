import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { stockService, produitService } from "@/services/apiService";
import { QUALITE_CARRELAGE_OPTIONS } from "@/constants/produits";

// Schéma de validation pour le stock
const stockSchema = yup.object({
  searchCriteria: yup.string().required("Le critère de recherche est obligatoire"),
  produitId: yup.number().required("Le produit est obligatoire"),
  qualite: yup.string().oneOf(QUALITE_CARRELAGE_OPTIONS.map(opt => opt.value), "Qualité invalide").required("La qualité est obligatoire"),
  quantite: yup.number().positive("La quantité doit être positive").required("La quantité est obligatoire"),
  stockMin: yup.number().min(0, "Le stock minimum doit être positif ou nul"),
  stockMax: yup.number().min(0, "Le stock maximum doit être positif ou nul"),
});

const SEARCH_CRITERIA_OPTIONS = [
  { value: 'reference', label: 'Référence' },
  { value: 'libelle', label: 'Libellé' },
  { value: 'typeCarrelage', label: 'Type de carrelage' },
  { value: 'format', label: 'Format' },
];

const StockModal = ({ isOpen, onClose, stock, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [produits, setProduits] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loadingProduits, setLoadingProduits] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState(null);

  const isEditing = !!stock;

  // Rechercher les produits selon les critères
  const searchProduits = async (criteria, value) => {
    if (!value || value.trim().length === 0) {
      setProduits([]);
      return;
    }

    try {
      setLoadingProduits(true);
      // Construire l'objet de critères dynamiquement
      const searchCriteria = {
        [criteria]: value
      };

      const data = await produitService.searchProduits(searchCriteria);
      const produitOptions = Array.isArray(data)
        ? data.map(p => ({ value: p.id, label: `${p.reference} - ${p.libelle}`, data: p }))
        : [];
      setProduits(produitOptions);
    } catch (error) {
      console.error('Erreur lors de la recherche des produits:', error);
      toast.error('Erreur lors de la recherche des produits');
      setProduits([]);
    } finally {
      setLoadingProduits(false);
    }
  };

  // Gérer le changement de la valeur de recherche
  const handleSearchValueChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    // Utiliser le critère de recherche du formulaire
    const criteria = watch("searchCriteria");
    searchProduits(criteria, value);
  };

  // Gérer la sélection d'un produit
  const handleProduitSelect = (produitId) => {
    const produit = produits.find(p => p.value === produitId);
    if (produit) {
      setSelectedProduit(produit.data);
      setValue("produitId", produitId);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(stockSchema),
    defaultValues: {
      searchCriteria: 'reference',
      produitId: null,
      qualite: QUALITE_CARRELAGE_OPTIONS[0].value,
      quantite: 0,
      stockMin: 0,
      stockMax: 0,
    },
  });

  // Effet pour remplir le formulaire lors de l'édition
  useEffect(() => {
    if (isEditing && stock) {
      setValue("produitId", stock.produitId || null);
      setValue("qualite", stock.qualite || QUALITE_CARRELAGE_OPTIONS[0].value);
      setValue("quantite", stock.quantite || 0);
      setValue("stockMin", stock.stockMin || 0);
      setValue("stockMax", stock.stockMax || 0);
    } else {
      reset();
    }
  }, [isEditing, stock, setValue, reset]);

  // Soumission du formulaire
  const onSubmit = async (data) => {
    console.log("Début de la soumission du formulaire", data);
    setIsLoading(true);
    try {
      // Préparation des données du stock - SEULEMENT les champs du StockDTO
      const stockData = {
        produitId: data.produitId,
        qualite: data.qualite,
        quantite: data.quantite,
        stockMin: data.stockMin,
        stockMax: data.stockMax,
      };

      // Ajouter l'ID si en édition
      if (isEditing) {
        stockData.id = stock?.id;
      }

      console.log("Données préparées pour l'envoi (StockDTO):", stockData);

      let result;
      if (isEditing) {
        console.log("Mode édition - Mise à jour du stock");
        result = await stockService.updateStock(stock.id, stockData);
      } else {
        console.log("Mode création - Création d'un nouveau stock");
        result = await stockService.createStock(stockData);
      }

      console.log("Résultat de l'opération:", result);

      if (result) {
        toast.success(isEditing ? "Stock modifié avec succès" : "Stock créé avec succès");
        if (onSuccess) {
          console.log("Appel du callback onSuccess");
          onSuccess(); // Recharger la liste des stocks
        }
        onClose();
      } else {
        throw new Error("Aucune réponse du serveur");
      }
    } catch (error) {
      console.error("Erreur détaillée:", error);
      const errorMessage = error.message || 
        (isEditing ? "Erreur lors de la modification du stock" : "Erreur lors de la création du stock");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      activeModal={isOpen}
      onClose={onClose}
      title={isEditing ? "Modifier le stock" : "Ajouter un stock"}
      className="max-w-2xl"
    >
      <form
        onSubmit={handleSubmit(onSubmit, (formErrors) => {
          console.warn("Validation échouée", formErrors);
        })}
        className="space-y-4"
      >
        {/* Critère de Recherche */}
        <div>
          <label className="form-label">Rechercher par *</label>
          <Select
            options={SEARCH_CRITERIA_OPTIONS}
            register={register}
            name="searchCriteria"
            error={errors.searchCriteria}
            placeholder="Sélectionnez un critère"
          />
        </div>

        {/* Valeur de Recherche */}
        <div>
          <label className="form-label">
            {SEARCH_CRITERIA_OPTIONS.find(opt => opt.value === watch("searchCriteria"))?.label || 'Valeur'} *
          </label>
          <Textinput
            placeholder={`Entrez la ${SEARCH_CRITERIA_OPTIONS.find(opt => opt.value === watch("searchCriteria"))?.label.toLowerCase()}`}
            value={searchValue}
            onChange={handleSearchValueChange}
            disabled={loadingProduits}
          />
          {loadingProduits && <p className="text-sm text-gray-500 mt-2">Recherche en cours...</p>}
        </div>

        {/* Sélection du Produit */}
        {produits.length > 0 && (
          <div>
            <label className="form-label">Sélectionnez un produit *</label>
            <Select
              options={produits}
              register={register}
              name="produitId"
              error={errors.produitId}
              placeholder="Sélectionnez un produit"
              onChange={(e) => handleProduitSelect(Number(e.target.value))}
            />
          </div>
        )}

        {/* Affichage du produit sélectionné */}
        {selectedProduit && (
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <p className="text-sm"><strong>Produit sélectionné:</strong> {selectedProduit.reference} - {selectedProduit.libelle}</p>
            <p className="text-sm"><strong>Type:</strong> {selectedProduit.typeCarrelage}</p>
            <p className="text-sm"><strong>Format:</strong> {selectedProduit.format}</p>
          </div>
        )}

        {/* Qualité */}
        <div>
          <label className="form-label">Qualité *</label>
          <Select
            options={QUALITE_CARRELAGE_OPTIONS}
            register={register}
            name="qualite"
            error={errors.qualite}
            placeholder="Sélectionnez la qualité"
          />
        </div>

        {/* Quantité */}
        <Textinput
          label="Quantité *"
          type="number"
          step="0.01"
          placeholder="0"
          register={register}
          name="quantite"
          error={errors.quantite}
        />

        {/* Stock Min et Max */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textinput
            label="Stock Minimum"
            type="number"
            step="0.01"
            placeholder="0"
            register={register}
            name="stockMin"
            error={errors.stockMin}
          />

          <Textinput
            label="Stock Maximum"
            type="number"
            step="0.01"
            placeholder="0"
            register={register}
            name="stockMax"
            error={errors.stockMax}
          />
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            text="Annuler"
            className="btn-outline-secondary"
            onClick={onClose}
          />
          <Button
            text={isEditing ? "Modifier" : "Créer"}
            type="submit"
            className="btn-primary"
            isLoading={isLoading}
          />
        </div>
      </form>
    </Modal>
  );
};

export default StockModal;

