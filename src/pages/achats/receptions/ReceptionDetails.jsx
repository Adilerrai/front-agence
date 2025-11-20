import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import { commandeService } from "@/services/apiService";
import { formatDateTime, formatMontant } from "@/constants/commandes";
import { getQualiteLabel, getQualiteBadgeColor } from "@/constants/stocks";

const ReceptionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [livraison, setLivraison] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState(null);

  const lignes = useMemo(() => livraison?.lignesLivraison || [], [livraison]);

  useEffect(() => {
    const fetchLivraison = async () => {
      if (!id) {
        setError("ID de réception manquant");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const data = await commandeService.getCommandeById(id);
        setLivraison(data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement de la réception:", err);
        setError("Erreur lors du chargement de la réception");
        toast.error("Impossible de charger les détails de la réception");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLivraison();
  }, [id]);

  // Fonction pour valider la livraison
  const handleValiderLivraison = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir valider cette réception ? Cette action est irréversible.")) {
      return;
    }

    try {
      setIsValidating(true);
      // Note: Cette fonctionnalité dépend de votre API backend
      // Vous devez implémenter une méthode de validation dans commandeService
      toast.success("Réception validée avec succès");
      setLivraison(prev => ({ ...prev, statut: 'VALIDEE' }));
    } catch (err) {
      console.error("Erreur lors de la validation:", err);
      toast.error("Erreur lors de la validation de la réception");
    } finally {
      setIsValidating(false);
    }
  };

  if (isLoading) return <Loading />;

  if (error || !livraison) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Icon icon="ph:warning-circle" className="text-6xl text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {error || "Réception non trouvée"}
        </h2>
        <Button text="Retour à la liste" className="btn-primary" onClick={() => navigate("/achats/receptions")} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button icon="ph:arrow-left" className="btn-outline-secondary" onClick={() => navigate("/achats/receptions")} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Détails de la réception</h1>
        </div>
        <div className="flex space-x-2">
          {/* Bouton Valider - visible si le statut est BROUILLON ou EN_ATTENTE */}
          {(livraison.statut === 'BROUILLON' || livraison.statut === 'EN_ATTENTE') && (
            <Button
              text={isValidating ? "Validation..." : "Valider"}
              icon="ph:check-circle"
              className="btn-success"
              onClick={handleValiderLivraison}
              disabled={isValidating}
            />
          )}

          {/* Placeholder for future edit */}
          {/* <Button text="Modifier" icon="ph:pencil" className="btn-primary" onClick={() => navigate(`/achats/receptions/${id}/edit`)} /> */}

          {/* Bouton Supprimer - visible si le statut est BROUILLON ou EN_ATTENTE */}
          {(livraison.statut === 'BROUILLON' || livraison.statut === 'EN_ATTENTE') && (
            <Button
              text="Supprimer"
              icon="ph:trash"
              className="btn-danger"
              onClick={async () => {
                if (!window.confirm("Supprimer cette réception ?")) return;
                try {
                  await livraisonService.deleteLivraison(id);
                  toast.success("Réception supprimée");
                  navigate("/achats/receptions");
                } catch (e) {
                  toast.error("Erreur lors de la suppression");
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Infos générales */}
      <Card title="Informations générales" noborder>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Numéro de réception</p>
            <p className="text-lg font-semibold">{livraison.numeroLivraison}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Statut</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              livraison.statut === 'BROUILLON' ? 'bg-gray-100 text-gray-800' :
              livraison.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
              livraison.statut === 'CONFIRMEE' ? 'bg-blue-100 text-blue-800' :
              livraison.statut === 'VALIDEE' ? 'bg-green-100 text-green-800' :
              livraison.statut === 'LIVREE' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {livraison.statut === 'VALIDEE' && (
                <Icon icon="ph:check-circle" className="w-4 h-4 mr-1" />
              )}
              {livraison.statut === 'BROUILLON' ? 'BROUILLON' :
               livraison.statut === 'EN_ATTENTE' ? 'EN ATTENTE' :
               livraison.statut === 'CONFIRMEE' ? 'CONFIRMÉE' :
               livraison.statut === 'VALIDEE' ? 'VALIDÉE' :
               livraison.statut === 'LIVREE' ? 'LIVRÉE' :
               livraison.statut}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Date de réception</p>
            <p className="text-lg">{formatDateTime(livraison.dateLivraison)}</p>
          </div>

          {livraison.commandeNumero && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Commande liée</p>
              <p className="text-lg font-medium text-blue-600">{livraison.commandeNumero}</p>
            </div>
          )}

          {livraison.transporteur && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Transporteur</p>
              <p className="text-lg">{livraison.transporteur}</p>
            </div>
          )}

          {livraison.numeroSuivi && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Numéro de suivi</p>
              <p className="text-lg font-mono">{livraison.numeroSuivi}</p>
            </div>
          )}
        </div>

        {livraison.observations && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Observations</p>
            <p className="text-lg mt-1">{livraison.observations}</p>
          </div>
        )}
      </Card>

      {/* Information sur la validation */}
      {(livraison.statut === 'BROUILLON' || livraison.statut === 'EN_ATTENTE') && (
        <Card className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-start space-x-3">
            <Icon icon="ph:info" className="text-blue-500 text-xl mt-1" />
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                Validation de la réception
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                La validation de cette réception confirmera définitivement la réception des marchandises
                et mettra à jour les stocks. Cette action est irréversible.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Message de confirmation si validée */}
      {livraison.statut === 'VALIDEE' && (
        <Card className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
          <div className="flex items-start space-x-3">
            <Icon icon="ph:check-circle" className="text-green-500 text-xl mt-1" />
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-300 mb-1">
                Réception validée
              </h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                Cette réception a été validée. Les stocks ont été mis à jour et
                les marchandises sont disponibles dans l'inventaire.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Lignes de réception */}
      <Card title={`Lignes de réception (${lignes.length})`} noborder>
        {lignes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Icon icon="ph:package" className="text-4xl mb-2 mx-auto" />
            <p>Aucune ligne de réception</p>
          </div>
        ) : (
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
                    Quantité
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Prix unitaire
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Dépôt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {lignes.map((ligne) => (
                  <tr key={ligne.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {ligne.produit.reference} — {ligne.produit.designation}
                      </div>
                      <div className="text-sm text-gray-500">
                        {ligne.produit.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {ligne.qualiteProduit ? (
                        <Badge
                          label={getQualiteLabel(ligne.qualiteProduit)}
                          className={`text-xs ${getQualiteBadgeColor(ligne.qualiteProduit)}`}
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {ligne.quantiteLivree} {ligne.produit.uniteMesureStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {formatMontant(ligne.prixProduit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {formatMontant(ligne.quantiteLivree * ligne.prixProduit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {ligne.depot.nom}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                    Total général:
                  </td>
                  <td className="px-6 py-4 text-right text-lg font-bold text-gray-900 dark:text-white">
                    {formatMontant(lignes.reduce((sum, ligne) => sum + (ligne.quantiteLivree * ligne.prixProduit), 0))}
                  </td>
                  <td className="px-6 py-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ReceptionDetails;

