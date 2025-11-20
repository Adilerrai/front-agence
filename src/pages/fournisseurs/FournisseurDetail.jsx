import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import LoadingIcon from "@/components/LoadingIcon";
import { toast } from "react-toastify";
import { fournisseurService } from "@/services/apiService";
import FournisseurModal from "./FournisseurModal";

const FournisseurDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fournisseur, setFournisseur] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Charger les détails du fournisseur
  const fetchFournisseurDetails = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await fournisseurService.getFournisseurById(id);
      setFournisseur(data);
    } catch (err) {
      setIsError(true);
      setError(err);
      console.error("Erreur lors du chargement du fournisseur:", err);
      toast.error("Erreur lors du chargement du fournisseur");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchFournisseurDetails();
    }
  }, [id]);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
  };

  const handleEditModalSuccess = () => {
    fetchFournisseurDetails(); // Recharger les données
    setShowEditModal(false);
    toast.success("Fournisseur modifié avec succès");
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?")) {
      try {
        await fournisseurService.deleteFournisseur(id);
        toast.success("Fournisseur supprimé avec succès");
        navigate("/fournisseurs");
      } catch (error) {
        toast.error("Erreur lors de la suppression du fournisseur");
        console.error("Erreur:", error);
      }
    }
  };

  const renderStatutBadge = () => {
    return (
      <Badge 
        label={fournisseur.actif ? "Actif" : "Inactif"} 
        className={fournisseur.actif ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} 
      />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non définie";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingIcon />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Icon icon="ph:warning-circle" className="text-6xl text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Erreur lors du chargement
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {error?.message || "Une erreur est survenue"}
        </p>
        <div className="flex space-x-2">
          <Button
            text="Réessayer"
            className="btn-primary"
            onClick={fetchFournisseurDetails}
          />
          <Button
            text="Retour"
            className="btn-outline-secondary"
            onClick={() => navigate("/fournisseurs")}
          />
        </div>
      </div>
    );
  }

  if (!fournisseur) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Icon icon="ph:building-office" className="text-6xl text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Fournisseur non trouvé
        </h2>
        <Button
          text="Retour à la liste"
          className="btn-primary"
          onClick={() => navigate("/fournisseurs")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            icon="ph:arrow-left"
            className="btn-outline-secondary"
            onClick={() => navigate("/fournisseurs")}
            title="Retour à la liste"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {fournisseur.raisonSocial}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              ID: {fournisseur.id}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {renderStatutBadge()}
          <Button
            text="Modifier"
            icon="ph:pencil"
            className="btn-warning"
            onClick={handleEdit}
          />
          <Button
            text="Supprimer"
            icon="ph:trash"
            className="btn-danger"
            onClick={handleDelete}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations principales */}
        <Card title="Informations générales">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Raison sociale</label>
              <p className="text-lg font-semibold">{fournisseur.raisonSocial}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Contact</label>
              <p className="text-lg">{fournisseur.contact || "Non défini"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg">
                {fournisseur.email ? (
                  <a 
                    href={`mailto:${fournisseur.email}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {fournisseur.email}
                  </a>
                ) : (
                  "Non défini"
                )}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Téléphone</label>
              <p className="text-lg">
                {fournisseur.telephone ? (
                  <a 
                    href={`tel:${fournisseur.telephone}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {fournisseur.telephone}
                  </a>
                ) : (
                  "Non défini"
                )}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Adresse</label>
              <p className="text-gray-700 dark:text-gray-300">
                {fournisseur.adresse || "Non définie"}
              </p>
            </div>
          </div>
        </Card>

        {/* Informations système */}
        <Card title="Informations système">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Date de création</label>
              <p className="text-lg">{formatDate(fournisseur.dateCreation)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Statut</label>
              <div className="mt-1">
                {renderStatutBadge()}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">ID</label>
              <p className="text-lg font-mono">{fournisseur.id}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card title="Actions rapides">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            text="Nouvelle commande"
            icon="ph:shopping-cart"
            className="btn-success w-full"
            onClick={() => navigate(`/achats/commandes/new?fournisseur=${fournisseur.id}`)}
          />
          <Button
            text="Historique des commandes"
            icon="ph:clock-clockwise"
            className="btn-outline-primary w-full"
            onClick={() => navigate(`/achats/commandes?fournisseur=${fournisseur.id}`)}
          />
          <Button
            text="Voir les livraisons"
            icon="ph:truck"
            className="btn-info w-full"
            onClick={() => navigate(`/achats/livraisons?fournisseur=${fournisseur.id}`)}
          />
        </div>
      </Card>

      {/* Modal de modification */}
      <FournisseurModal
        isOpen={showEditModal}
        onClose={handleEditModalClose}
        fournisseur={fournisseur}
        onSuccess={handleEditModalSuccess}
      />
    </div>
  );
};

export default FournisseurDetail;
