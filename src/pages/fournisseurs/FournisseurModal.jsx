import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { fournisseurService } from "@/services/apiService";

// Schéma de validation
const fournisseurSchema = yup.object({
  raisonSociale: yup.string().required("La raison sociale est obligatoire"),
  contactPrincipal: yup.string(),
  telephone: yup.string(),
  email: yup.string().email("Email invalide"),
  adresse: yup.string(),
  ville: yup.string(),
  codePostal: yup.string(),
  ice: yup.string(),
  soldeCompte: yup.number(),
  actif: yup.boolean(),
});

const FournisseurModal = ({ isOpen, onClose, fournisseur, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!fournisseur;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(fournisseurSchema),
    defaultValues: {
      raisonSociale: "",
      contactPrincipal: "",
      telephone: "",
      email: "",
      adresse: "",
      ville: "",
      codePostal: "",
      ice: "",
      soldeCompte: 0,
      actif: true,
    },
  });

  // Effet pour remplir le formulaire lors de l'édition
  useEffect(() => {
    if (isEditing && fournisseur) {
      setValue("raisonSociale", fournisseur.raisonSociale || "");
      setValue("contactPrincipal", fournisseur.contactPrincipal || "");
      setValue("telephone", fournisseur.telephone || "");
      setValue("email", fournisseur.email || "");
      setValue("adresse", fournisseur.adresse || "");
      setValue("ville", fournisseur.ville || "");
      setValue("codePostal", fournisseur.codePostal || "");
      setValue("ice", fournisseur.ice || "");
      setValue("soldeCompte", fournisseur.soldeCompte || 0);
      setValue("actif", fournisseur.actif !== undefined ? fournisseur.actif : true);
    } else {
      reset({
        raisonSociale: "",
        contactPrincipal: "",
        telephone: "",
        email: "",
        adresse: "",
        ville: "",
        codePostal: "",
        ice: "",
        soldeCompte: 0,
        actif: true,
      });
    }
  }, [isEditing, fournisseur, setValue, reset]);

  // Soumission du formulaire
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const fournisseurData = {
        ...data,
        soldeCompte: Number(data.soldeCompte),
      };

      let result;
      if (isEditing) {
        result = await fournisseurService.updateFournisseur(fournisseur.id, fournisseurData);
      } else {
        result = await fournisseurService.createFournisseur(fournisseurData);
      }

      toast.success(
        isEditing
          ? "Fournisseur modifié avec succès"
          : "Fournisseur créé avec succès"
      );

      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(
        isEditing
          ? "Erreur lors de la modification du fournisseur"
          : "Erreur lors de la création du fournisseur"
      );
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      activeModal={isOpen}
      onClose={onClose}
      title={isEditing ? "Modifier le fournisseur" : "Ajouter un fournisseur"}
      className="max-w-3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Raison Sociale */}
          <Textinput
            label="Raison Sociale *"
            placeholder="Nom de l'entreprise"
            register={register}
            name="raisonSociale"
            error={errors.raisonSociale}
          />

          {/* Contact Principal */}
          <Textinput
            label="Contact Principal"
            placeholder="Nom du contact"
            register={register}
            name="contactPrincipal"
            error={errors.contactPrincipal}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Téléphone */}
          <Textinput
            label="Téléphone"
            placeholder="Numéro de téléphone"
            register={register}
            name="telephone"
            error={errors.telephone}
          />

          {/* Email */}
          <Textinput
            label="Email"
            type="email"
            placeholder="adresse@email.com"
            register={register}
            name="email"
            error={errors.email}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ville */}
          <Textinput
            label="Ville"
            placeholder="Ville"
            register={register}
            name="ville"
            error={errors.ville}
          />

          {/* Code Postal */}
          <Textinput
            label="Code Postal"
            placeholder="Code postal"
            register={register}
            name="codePostal"
            error={errors.codePostal}
          />
        </div>

        {/* Adresse */}
        <Textarea
          label="Adresse"
          placeholder="Adresse complète du fournisseur"
          register={register}
          name="adresse"
          error={errors.adresse}
          row={3}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ICE */}
          <Textinput
            label="ICE"
            placeholder="Identifiant Commun de l'Entreprise"
            register={register}
            name="ice"
            error={errors.ice}
          />

          {/* Solde Compte */}
          <Textinput
            label="Solde Compte"
            type="number"
            placeholder="0.00"
            register={register}
            name="soldeCompte"
            error={errors.soldeCompte}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Statut actif */}
          <div>
            <label className="form-label">Statut</label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="true"
                  {...register("actif")}
                  className="form-radio"
                />
                <span className="ml-2">Actif</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="false"
                  {...register("actif")}
                  className="form-radio"
                />
                <span className="ml-2">Inactif</span>
              </label>
            </div>
            {errors.actif && (
              <div className="text-red-500 text-sm mt-1">
                {errors.actif.message}
              </div>
            )}
          </div>
        </div>

        {/* Note d'information */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Les champs marqués d'un astérisque (*) sont obligatoires.
            L'email sera utilisé pour les communications automatiques.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            text="Annuler"
            className="btn-outline-secondary"
            onClick={onClose}
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

export default FournisseurModal;
