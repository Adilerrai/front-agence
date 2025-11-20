import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Loading from "@/components/Loading";
import Icon from "@/components/ui/Icon";
import { toast } from "react-toastify";
import { commandeFournisseurService } from "@/services/apiService";
import { formatDate, formatMontant, getStatutLabel, getStatutColor, STATUT_COMMANDE_OPTIONS } from "@/constants/commandes";
import { getQualiteLabel, getQualiteBadgeColor } from "@/constants/stocks";

const CommandeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        setIsLoading(true);
        const data = await commandeFournisseurService.getCommandeById(id);
        console.log("📦 Commande chargée:", data);
        console.log("📊 Lignes:", data.lignes);
        setCommande(data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement de la commande:", err);
        setError("Erreur lors du chargement");
        toast.error("Impossible de charger la commande");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCommande();
  }, [id]);
  const handleValiderCommande = async () => {
    if (!window.confirm("Confirmer cette commande ?")) return;

    setIsValidating(true);
    try {
      const updatedCommande = await commandeFournisseurService.validerCommande(id);
      setCommande(updatedCommande);
      toast.success("Commande validée avec succès");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la validation de la commande");
    } finally {
      setIsValidating(false);
    }
  };

  const handlePrintCommande = async () => {
    setIsPrinting(true);
    try {
      // TODO: Implémenter l'impression
      toast.info("Fonction d'impression à implémenter");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'impression");
    } finally {
      setIsPrinting(false);
    }
  };

  // Ouverture de la page de nouvelle réception (pas de création directe)
  const handleCreateReceptionFromCommande = () => {
    if (!commande) return;
    navigate(`/achats/receptions/nouveau?commandeId=${commande.id}&numero=${encodeURIComponent(commande.numeroCommande || '')}`);
  };

  if (isLoading) return <Loading />;

  if (error || !commande) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Icon icon="ph:warning-circle" className="text-6xl text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {error || "Commande non trouvée"}
        </h2>
        <Button text="Retour à la liste" className="btn-primary" onClick={() => navigate("/achats/commandes")} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button icon="ph:arrow-left" className="btn-outline-secondary" onClick={() => navigate("/achats/commandes")} />
          <h1 className="text-2xl font-bold">Commande {commande.numeroCommande || `#${commande.id}`}</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            text="Imprimer"
            icon="ph:printer"
            className="btn-secondary"
            onClick={handlePrintCommande}
            disabled={isPrinting}
          />
          {(commande.statut === "EN_ATTENTE" || commande.statut === "BROUILLON") && (
            <Button
              text="Valider"
              icon="ph:check"
              className="btn-primary"
              onClick={handleValiderCommande}
              disabled={isValidating}
            />
          )}
          { ([
              "PASSEE",
              "PARTIELLE",
              "PARTIELLEMENT_LIVREE",
              "CONFIRMEE",
              "EN_COURS",
              "LIVREE",
              "VALIDEE",
            ].includes(commande.statut)) && (
            <Button
              text="Réceptionner"
              icon="ph:truck"
              className="btn-success"
              onClick={() => navigate(`/achats/receptions/nouveau?commandeId=${commande.id}&numero=${encodeURIComponent(commande.numeroCommande || '')}`)}
            />
          )}
          {/* Un seul bouton d'accès à la page de création de réception suffit */}
        </div>
      </div>

      <Card title="Informations commande" noborder>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Numéro</p>
            <p className="text-base font-medium">{commande.numeroCommande || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fournisseur</p>
            {/* Supporter plusieurs noms de champs renvoyés par le backend */}
            <p className="text-base font-medium">{commande.fournisseurRaisonSociale || commande.fournisseurNom || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="text-base font-medium">{formatDate(commande.dateCommande)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Montant</p>
            <p className="text-base font-medium">{formatMontant(commande.montantTotal || 0)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Statut</p>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(commande.statut)}`}>
              {getStatutLabel(commande.statut)}
            </span>
          </div>
        </div>
      </Card>

      {/* Utiliser indifféremment 'lignes' (nouveau backend) ou 'lignesCommande' (ancien) */}
      {(() => {
        const lignes = Array.isArray(commande?.lignesCommande)
          ? commande.lignesCommande
          : Array.isArray(commande?.lignes)
          ? commande.lignes
          : [];
        return (
          <Card title={`Lignes de commande (${lignes.length})`} noborder>
        {lignes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Aucune ligne
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="table-th">Référence</th>
                      <th className="table-th">Description</th>
                      <th className="table-th text-center">Qualité</th>
                      <th className="table-th text-right">Qté</th>
                      <th className="table-th text-right">PU</th>
                      <th className="table-th text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {lignes.map((l, idx) => {
                      // Debug: afficher la structure de la ligne pour vérifier les champs disponibles
                      console.log('Ligne commande:', l);
                      return (
                      <tr key={idx}>
                        <td className="table-td">{l.produitReference || '-'}</td>
                        <td className="table-td">{l.produitDesignation || l.produitDescription || '-'}</td>
                        <td className="table-td text-center">
                          {l.qualiteProduit || l.qualite || l.produitQualite ? (
                            <Badge
                              label={getQualiteLabel(l.qualiteProduit || l.qualite || l.produitQualite)}
                              className={`text-xs ${getQualiteBadgeColor(l.qualiteProduit || l.qualite || l.produitQualite)}`}
                            />
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        <td className="table-td text-right">{l.quantiteCommandee}</td>
                        <td className="table-td text-right">{Number(l.prixUnitaire ?? 0).toFixed(2)}</td>
                        <td className="table-td text-right">{Number(l.montantLigne ?? 0).toFixed(2)}</td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Card>
        );
      })()}
    </div>
  );
};

export default CommandeDetails;

