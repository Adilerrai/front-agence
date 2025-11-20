import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import LoadingIcon from "@/components/LoadingIcon";
import { toast } from "react-toastify";
import { commandeAchatService } from "@/services/apiService";
import { formatDate, formatMontant, getStatutColor, getStatutLabel } from "@/constants/commandes";
import LignesCommandeTable from "./LignesCommandeTable";
import CreerLivraisonModal from "./CreerLivraisonModal";

const CommandeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [commande, setCommande] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [showCreerLivraisonModal, setShowCreerLivraisonModal] = useState(false);

  // Charger les détails de la commande
  const fetchCommandeDetails = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await commandeAchatService.getCommandeById(id);
      setCommande(data);
    } catch (err) {
      setIsError(true);
      setError(err);
      console.error("Erreur lors du chargement de la commande:", err);
      toast.error("Erreur lors du chargement de la commande");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCommandeDetails();
    }
  }, [id]);

  // Ouvrir automatiquement le modal si l'action est spécifiée dans l'URL
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'creer-livraison' && commande && commande.statut === 'CONFIRMEE') {
      setShowCreerLivraisonModal(true);
      // Nettoyer l'URL
      navigate(`/achats/commandes/${id}`, { replace: true });
    }
  }, [commande, searchParams, navigate, id]);

  const handleValider = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir valider cette commande ?")) {
      try {
        await commandeAchatService.validerCommande(id);
        toast.success("Commande validée avec succès");
        fetchCommandeDetails(); // Recharger les données
      } catch (error) {
        toast.error("Erreur lors de la validation de la commande");
        console.error("Erreur:", error);
      }
    }
  };

  const handleAnnuler = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
      try {
        await commandeAchatService.annulerCommande(id);
        toast.success("Commande annulée avec succès");
        fetchCommandeDetails(); // Recharger les données
      } catch (error) {
        toast.error("Erreur lors de l'annulation de la commande");
        console.error("Erreur:", error);
      }
    }
  };

  const handleCreerLivraison = () => {
    setShowCreerLivraisonModal(true);
  };

  const handleCreerLivraisonSuccess = () => {
    setShowCreerLivraisonModal(false);
    toast.success("Livraison créée avec succès");
    // Optionnel: recharger les données de la commande
    fetchCommandeDetails();
  };

  const renderStatutBadge = () => {
    return (
      <Badge 
        label={getStatutLabel(commande.statut)} 
        className={getStatutColor(commande.statut)}
      />
    );
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
            onClick={fetchCommandeDetails}
          />
          <Button
            text="Retour"
            className="btn-outline-secondary"
            onClick={() => navigate("/achats/commandes")}
          />
        </div>
      </div>
    );
  }

  if (!commande) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Icon icon="ph:shopping-cart" className="text-6xl text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Commande non trouvée
        </h2>
        <Button
          text="Retour à la liste"
          className="btn-primary"
          onClick={() => navigate("/achats/commandes")}
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
            onClick={() => navigate("/achats/commandes")}
            title="Retour à la liste"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Commande #{commande.numeroCommande}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {commande.fournisseurNom}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {renderStatutBadge()}

          {/* Bouton Créer livraison - visible si commande confirmée */}
          {commande.statut === "CONFIRMEE" && (
            <Button
              text="Créer livraison"
              icon="ph:truck"
              className="btn-primary"
              onClick={handleCreerLivraison}
            />
          )}

          {commande.statut === "EN_ATTENTE" && (
            <>
              <Button
                text="Valider"
                icon="ph:check"
                className="btn-success"
                onClick={handleValider}
              />
              <Button
                text="Annuler"
                icon="ph:x"
                className="btn-danger"
                onClick={handleAnnuler}
              />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations générales */}
        <Card title="Informations générales">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Numéro de commande</label>
              <p className="text-lg font-semibold">{commande.numeroCommande}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Fournisseur</label>
              <p className="text-lg">{commande.fournisseurNom}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Date de commande</label>
              <p className="text-lg">{formatDate(commande.dateCommande)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Date de livraison prévue</label>
              <p className="text-lg">{formatDate(commande.dateLivraisonPrevue)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Statut</label>
              <div className="mt-1">
                {renderStatutBadge()}
              </div>
            </div>
          </div>
        </Card>

        {/* Montants */}
        <Card title="Montants">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Montant HT</label>
              <p className="text-lg font-semibold text-green-600">
                {formatMontant(commande.montantHT)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">TVA</label>
              <p className="text-lg">{formatMontant(commande.montantTVA)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Montant TTC</label>
              <p className="text-xl font-bold text-blue-600">
                {formatMontant(commande.montantTTC)}
              </p>
            </div>

            {commande.commentaires && (
              <div>
                <label className="text-sm font-medium text-gray-500">Commentaires</label>
                <p className="text-gray-700 dark:text-gray-300">{commande.commentaires}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Lignes de commande avec qualités */}
      <LignesCommandeTable
        lignes={commande.lignesCommande || []}
        title={`Lignes de commande (${commande.lignesCommande?.length || 0})`}
        showQuantiteLivree={commande.statut !== "EN_ATTENTE"}
      />

      {/* Actions rapides */}
      <Card title="Actions rapides">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button
            text="Modifier"
            icon="ph:pencil"
            className="btn-warning w-full"
            onClick={() => navigate(`/achats/commandes/edit/${commande.id}`)}
            disabled={commande.statut !== "EN_ATTENTE"}
          />
          <Button
            text="Dupliquer"
            icon="ph:copy"
            className="btn-info w-full"
            onClick={() => navigate(`/achats/commandes/new?duplicate=${commande.id}`)}
          />
          <Button
            text="Voir livraisons"
            icon="ph:truck"
            className="btn-outline-primary w-full"
            onClick={() => navigate(`/achats/livraisons?commande=${commande.id}`)}
          />
          <Button
            text="Imprimer"
            icon="ph:printer"
            className="btn-outline-secondary w-full"
            onClick={() => window.print()}
          />
        </div>
      </Card>

      {/* Modal pour créer une livraison */}
      <CreerLivraisonModal
        isOpen={showCreerLivraisonModal}
        onClose={() => setShowCreerLivraisonModal(false)}
        commande={commande}
        onSuccess={handleCreerLivraisonSuccess}
      />
    </div>
  );
};

export default CommandeDetail;
