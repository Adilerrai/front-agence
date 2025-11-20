import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { produitService, fournisseurService } from "@/services/apiService";

// Options pour les sélecteurs - correspondant au DTO Java
import {
  UNITE_MESURE_OPTIONS,
  FORMAT_CARRELAGE_OPTIONS,
  TYPE_CARRELAGE_OPTIONS,
  QUALITE_CARRELAGE_OPTIONS,
} from "@/constants/produits";

// Schéma de validation - correspondant au DTO Java ProduitDTO
// Note: La qualité est maintenant gérée au niveau du stock (StockDTO)
const produitSchema = yup.object({
  reference: yup.string().required("La référence est obligatoire"),
  libelle: yup.string().required("Le libellé est obligatoire"),
  description: yup.string(),
  format: yup.string().oneOf(FORMAT_CARRELAGE_OPTIONS.map(opt => opt.value), "Format invalide").required("Le format est obligatoire"),
  marque: yup.string(),
  epaisseurMm: yup.number().positive("L'épaisseur doit être positive").integer("L'épaisseur doit être un nombre entier"),
  typeCarrelage: yup.string().oneOf(TYPE_CARRELAGE_OPTIONS.map(opt => opt.value), "Type invalide").required("Le type est obligatoire"),
  uniteMesure: yup.string().oneOf(UNITE_MESURE_OPTIONS.map(opt => opt.value), "Unité invalide"),
  piecesParBoite: yup.number().positive("Le nombre de pièces par boîte doit être positif").integer("Le nombre de pièces par boîte doit être un nombre entier"),
  prixAchat: yup.number().positive("Le prix d'achat doit être positif"),
  prixVenteHT: yup.number().positive("Le prix de vente HT doit être positif"),
  tauxTVA: yup.number().min(0, "Le taux de TVA doit être positif ou nul").required("Le taux de TVA est obligatoire"),
  prixVenteTTC: yup.number().min(0, "Le prix TTC doit être positif ou nul"),
  fournisseurId: yup.number().nullable(),
});

const ProduitModal = ({ isOpen, onClose, produit, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loadingFournisseurs, setLoadingFournisseurs] = useState(false);

  const isEditing = !!produit;

  // Charger les fournisseurs au montage du composant
  useEffect(() => {
    const loadFournisseurs = async () => {
      if (!isOpen) return;

      try {
        setLoadingFournisseurs(true);
        // Utiliser searchFournisseursNotPaged avec des critères vides pour récupérer tous les fournisseurs
        const data = await fournisseurService.searchFournisseursNotPaged({});
        const fournisseurOptions = Array.isArray(data)
          ? data.map(f => ({ value: f.id, label: f.raisonSociale }))
          : [];
        setFournisseurs(fournisseurOptions);
      } catch (error) {
        console.error('Erreur lors du chargement des fournisseurs:', error);
        toast.error('Erreur lors du chargement des fournisseurs');
      } finally {
        setLoadingFournisseurs(false);
      }
    };

    loadFournisseurs();
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(produitSchema),
    defaultValues: {
      id: null,
      reference: "",
      libelle: "",
      description: "",
      format: FORMAT_CARRELAGE_OPTIONS[0].value,
      marque: "",
      epaisseurMm: 0,
      typeCarrelage: TYPE_CARRELAGE_OPTIONS[0].value,
      uniteMesure: UNITE_MESURE_OPTIONS[0].value,
      piecesParBoite: 0,
      prixAchat: 0,
      prixVenteHT: 0,
      tauxTVA: 20, // Taux par défaut
      prixVenteTTC: 0,
      fournisseurId: null,
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
    },
  });

  // Effet pour remplir le formulaire lors de l'édition
  useEffect(() => {
    if (isEditing && produit) {
      setValue("reference", produit.reference || "");
      setValue("libelle", produit.libelle || "");
      setValue("description", produit.description || "");
      setValue("format", produit.format || FORMAT_CARRELAGE_OPTIONS[0].value);
      setValue("marque", produit.marque || "");
      setValue("epaisseurMm", produit.epaisseurMm || 0);
      setValue("typeCarrelage", produit.typeCarrelage || TYPE_CARRELAGE_OPTIONS[0].value);
      setValue("uniteMesure", produit.uniteMesure || UNITE_MESURE_OPTIONS[0].value);
      setValue("piecesParBoite", produit.piecesParBoite || 0);
      setValue("prixAchat", produit.prixAchat || 0);
      setValue("prixVenteHT", produit.prixVenteHT || 0);
      setValue("tauxTVA", produit.tauxTVA || 20);
      setValue("prixVenteTTC", produit.prixVenteTTC || 0);
      setValue("fournisseurId", produit.fournisseurId || null);

    } else {
      reset();
    }
  }, [isEditing, produit, setValue, reset]);

  // Soumission du formulaire
  const onSubmit = async (data) => {
    console.log("Début de la soumission du formulaire", data);
    setIsLoading(true);
    try {
      // Calcul du prix TTC
      const prixVenteTTC = data.prixVenteHT ? data.prixVenteHT * (1 + (data.tauxTVA / 100)) : 0;

      // Préparation des données du produit - SEULEMENT les champs du ProduitDTO
      const produitData = {
        reference: data.reference,
        libelle: data.libelle,
        description: data.description || null,
        format: data.format,
        marque: data.marque || null,
        epaisseurMm: data.epaisseurMm,
        typeCarrelage: data.typeCarrelage,
        uniteMesure: data.uniteMesure,
        piecesParBoite: data.piecesParBoite,
        prixAchat: data.prixAchat,
        prixVenteHT: data.prixVenteHT,
        tauxTVA: data.tauxTVA,
        prixVenteTTC: prixVenteTTC,
        fournisseurId: data.fournisseurId || null,
      };

      // Ajouter les dates si en édition
      if (isEditing) {
        produitData.id = produit?.id;
        produitData.dateCreation = produit?.dateCreation;
        produitData.dateModification = new Date().toISOString();
      }

      console.log("Données préparées pour l'envoi (ProduitDTO):", produitData);

      let result;
      if (isEditing) {
        console.log("Mode édition - Mise à jour du produit");
        result = await produitService.updateProduit(produit.id, produitData);
      } else {
        console.log("Mode création - Création d'un nouveau produit");
        result = await produitService.createProduit(produitData);
      }

      console.log("Résultat de l'opération:", result);

      if (result) {
        toast.success(isEditing ? "Produit modifié avec succès" : "Produit créé avec succès");
        if (onSuccess) {
          console.log("Appel du callback onSuccess");
          onSuccess(); // Recharger la liste des produits
        }
        onClose();
      } else {
        throw new Error("Aucune réponse du serveur");
      }
    } catch (error) {
      console.error("Erreur détaillée:", error);
      const errorMessage = error.message ||
        (isEditing ? "Erreur lors de la modification du produit" : "Erreur lors de la création du produit");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les données du produit lors de l'édition
  useEffect(() => {
    if (isEditing && produit) {
      reset({
        ...produit,
        uniteMesureStock: produit.uniteMesureStock || null,
        uniteMesureAchat: produit.uniteMesureAchat || null,
        uniteVente: produit.uniteVente || null,
      });
    } else {
      reset({
        id: null,
        reference: "",
        description: "",
        uniteMesureStock: UNITE_MESURE_OPTIONS[0],
        uniteMesureAchat: UNITE_MESURE_OPTIONS[0],
        uniteVente: UNITE_MESURE_OPTIONS[0],
        pointDeVenteId: 1,
        prixAchat: null,
        prixVente: null,
      });
    }
  }, [isEditing, produit, reset]);

  // Calculer automatiquement le prix TTC
  const watchPrixVenteHT = watch("prixVenteHT");
  const watchTauxTVA = watch("tauxTVA");

  useEffect(() => {
    if (watchPrixVenteHT && watchTauxTVA) {
      const prixTTC = watchPrixVenteHT * (1 + (watchTauxTVA / 100));
      setValue("prixVenteTTC", prixTTC);
    }
  }, [watchPrixVenteHT, watchTauxTVA, setValue]);

  return (
    <Modal
      activeModal={isOpen}
      onClose={onClose}
      title={isEditing ? "Modifier le carrelage" : "Ajouter un carrelage"}
      className="max-w-4xl"
    >
      <form
        onSubmit={handleSubmit(onSubmit, (formErrors) => {
          console.warn("Validation échouée", formErrors);
        })}
        className="space-y-4"
      >
        {/* Référence */}
        <Textinput
          label="Référence *"
          placeholder="Entrez la référence"
          register={register}
          name="reference"
          error={errors.reference}
        />

        {/* Libellé */}
        <Textinput
          label="Libellé *"
          placeholder="Entrez le libellé du produit"
          register={register}
          name="libelle"
          error={errors.libelle}
        />

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Entrez la description du produit"
          register={register}
          name="description"
          error={errors.description}
          row={3}
        />

        {/* Fournisseur */}
        <div>
          <label className="form-label">Fournisseur</label>
          <Select
            options={fournisseurs}
            register={register}
            name="fournisseurId"
            error={errors.fournisseurId}
            placeholder={loadingFournisseurs ? "Chargement..." : "Sélectionnez un fournisseur"}
            disabled={loadingFournisseurs}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type de carrelage */}
          <div>
            <label className="form-label">Type de carrelage *</label>
            <Select
              options={TYPE_CARRELAGE_OPTIONS}
              register={register}
              name="typeCarrelage"
              error={errors.typeCarrelage}
              placeholder="Sélectionnez le type"
            />
          </div>

          {/* Format */}
          <div>
            <label className="form-label">Format *</label>
            <Select
              options={FORMAT_CARRELAGE_OPTIONS}
              register={register}
              name="format"
              error={errors.format}
              placeholder="Sélectionnez le format"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Marque */}
          <Textinput
            label="Marque"
            placeholder="Entrez la marque"
            register={register}
            name="marque"
            error={errors.marque}
          />

          {/* Unité de mesure */}
          <div>
            <label className="form-label">Unité de mesure</label>
            <Select
              options={UNITE_MESURE_OPTIONS}
              register={register}
              name="uniteMesure"
              error={errors.uniteMesure}
              placeholder="Sélectionnez l'unité"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Épaisseur */}
          <Textinput
            label="Épaisseur (mm) *"
            type="number"
            step="1"
            placeholder="0"
            register={register}
            name="epaisseurMm"
            error={errors.epaisseurMm}
          />

          {/* Pièces par boîte */}
          <Textinput
            label="Pièces par boîte *"
            type="number"
            step="1"
            placeholder="0"
            register={register}
            name="piecesParBoite"
            error={errors.piecesParBoite}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Prix d'achat */}
          <Textinput
            label="Prix d'achat (dhs) *"
            type="number"
            step="0.01"
            placeholder="0.00"
            register={register}
            name="prixAchat"
            error={errors.prixAchat}
          />

          {/* Prix de vente HT */}
          <Textinput
            label="Prix de vente HT (dhs) *"
            type="number"
            step="0.01"
            placeholder="0.00"
            register={register}
            name="prixVenteHT"
            error={errors.prixVenteHT}
          />

          {/* Taux TVA */}
          <Textinput
            label="Taux TVA (%) *"
            type="number"
            step="0.1"
            placeholder="20.0"
            register={register}
            name="tauxTVA"
            error={errors.tauxTVA}
          />
        </div>

        {/* Prix de vente TTC (calculé) */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
          <div className="flex justify-between items-center">
            <span className="font-medium">Prix de vente TTC :</span>
            <span className="text-lg font-bold text-primary-500">
              {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' })
                .format(watch("prixVenteTTC") || 0)}
            </span>
          </div>
        </div>
        {/* Image supprimée du flux de création/modification. Utilisez le composant de gestion d'images dédié. */}

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            text="Annuler"
            className="btn-outline-secondary"
            onClick={(e) => {
              e.preventDefault();
              console.log("Bouton Annuler cliqué");
              onClose();
            }}
            type="button"
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

export default ProduitModal;
