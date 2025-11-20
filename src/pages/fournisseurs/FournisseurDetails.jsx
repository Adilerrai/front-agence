import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import { fournisseurService } from "@/services/apiService";

const FournisseurDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fournisseur, setFournisseur] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les détails du fournisseur
  useEffect(() => {
    const fetchFournisseur = async () => {
      if (!id) {
        setError("ID du fournisseur manquant");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await fournisseurService.getFournisseurById(id);
        setFournisseur(data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement du fournisseur:", err);
        setError("Erreur lors du chargement du fournisseur");
        toast.error("Impossible de charger les détails du fournisseur");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFournisseur();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !fournisseur) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Icon icon="ph:warning-circle" className="text-6xl text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {error || "Fournisseur non trouvé"}
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
      {/* Header avec navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            icon="ph:arrow-left"
            className="btn-outline-secondary"
            onClick={() => navigate("/fournisseurs")}
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Détails du fournisseur
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button
            text="Modifier"
            icon="ph:pencil"
            className="btn-primary"
            onClick={() => navigate(`/fournisseurs/edit/${id}`)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2">
          <Card title="Informations du fournisseur">
            <div className="space-y-6">
              {/* Informations de base */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Informations générales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Raison Sociale
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {fournisseur.raisonSociale}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Principal
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {fournisseur.contactPrincipal || "Non renseigné"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ICE
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {fournisseur.ice || "Non renseigné"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date de création
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {fournisseur.dateCreation ? new Date(fournisseur.dateCreation).toLocaleDateString() : "Non renseigné"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations de contact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Informations de contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Téléphone
                    </label>
                    <div className="flex items-center space-x-2">
                      <Icon icon="ph:phone" className="text-blue-500" />
                      <p className="text-lg text-gray-900 dark:text-white">
                        {fournisseur.telephone || "Non renseigné"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <div className="flex items-center space-x-2">
                      <Icon icon="ph:envelope" className="text-blue-500" />
                      <p className="text-lg text-gray-900 dark:text-white">
                        {fournisseur.email || "Non renseigné"}
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Adresse
                    </label>
                    <div className="flex items-start space-x-2">
                      <Icon icon="ph:map-pin" className="text-blue-500 mt-1" />
                      <p className="text-gray-900 dark:text-white">
                        {fournisseur.adresse || "Non renseignée"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Statut et actions */}
        <div className="lg:col-span-1">
          <Card title="Statut et actions" className="sticky top-6">
            <div className="space-y-4">
              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Statut du fournisseur
                </label>
                <span
                  className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${
                    fournisseur.actif
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  <Icon 
                    icon={fournisseur.actif ? "ph:check-circle" : "ph:x-circle"} 
                    className="mr-2" 
                  />
                  {fournisseur.actif ? "Actif" : "Inactif"}
                </span>
              </div>

              {/* Actions rapides */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Actions rapides
                </h4>
                
                {fournisseur.telephone && (
                  <Button
                    text="Appeler"
                    icon="ph:phone"
                    className="btn-outline-primary w-full"
                    onClick={() => window.open(`tel:${fournisseur.telephone}`)}
                  />
                )}
                
                {fournisseur.email && (
                  <Button
                    text="Envoyer un email"
                    icon="ph:envelope"
                    className="btn-outline-primary w-full"
                    onClick={() => window.open(`mailto:${fournisseur.email}`)}
                  />
                )}
                
                <Button
                  text="Modifier"
                  icon="ph:pencil"
                  className="btn-primary w-full"
                  onClick={() => navigate(`/fournisseurs/edit/${id}`)}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Section pour les commandes/produits (à implémenter plus tard) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Commandes récentes" className="h-fit">
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Icon icon="ph:shopping-cart" className="text-4xl mb-2 mx-auto" />
            <p>Historique des commandes</p>
            <p className="text-sm">À implémenter</p>
          </div>
        </Card>

        <Card title="Produits fournis" className="h-fit">
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Icon icon="ph:package" className="text-4xl mb-2 mx-auto" />
            <p>Liste des produits</p>
            <p className="text-sm">À implémenter</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FournisseurDetails;
