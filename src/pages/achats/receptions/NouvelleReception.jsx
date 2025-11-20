import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import LoadingIcon from "@/components/LoadingIcon";
import { toast } from "react-toastify";
import { commandeService } from "@/services/apiService";
import receptionFournisseurService from "@/services/receptionFournisseurService";
import { formatDateTime } from "@/constants/commandes";

const toLocalDatetimeValue = (d = new Date()) => {
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

const generateNumeroLivraison = () => {
  const now = new Date();
  return `LIV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}-${String(now.getTime()).slice(-6)}`;
};

const NouvelleReception = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [commandes, setCommandes] = useState([]);
  const [lignes, setLignes] = useState([]);
  const [commandeLocked, setCommandeLocked] = useState(false);

  const [form, setForm] = useState({
    numeroLivraison: generateNumeroLivraison(),
    commandeId: "",
    commandeNumero: "",
    dateLivraison: toLocalDatetimeValue(),
    transporteur: "",
    numeroSuivi: "",
    observations: "",
    fournisseurId: "",
    fournisseurRaisonSociale: "",
    codeSite: "",
  });

  const commandeOptions = useMemo(
    () =>
      (commandes || []).map((c) => ({
        value: String(c.id),
        label: `${c.numeroCommande} — ${c.fournisseurNom ?? ""}`,
        numero: c.numeroCommande,
      })),
    [commandes]
  );

  const loadCommandes = async () => {
    setIsLoading(true);
    try {
      // Utiliser searchCommandes avec des critères vides pour récupérer toutes les commandes
      const data = await commandeService.searchCommandes({}, 0, 1000);
      setCommandes(Array.isArray(data) ? data : []);
    } catch (e) {
      // Non bloquant: on peut créer une réception sans lier une commande
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCommandes();
  }, []);

  // Extraire les paramètres de la commande depuis l'URL et pré-remplir
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cmdId = params.get("commandeId");
    const cmdNumero = params.get("numero") || "";
    const fournisseur = params.get("fournisseur") || "";
    const codeSite = params.get("codeSite") || "";
    if (cmdId) {
      setForm((f) => ({
        ...f,
        commandeId: String(cmdId),
        commandeNumero: cmdNumero,
        fournisseurRaisonSociale: fournisseur,
        codeSite: codeSite,
      }));
      setCommandeLocked(true);
      // Charger la commande et transformer ses lignes en lignes de réception
      (async () => {
        try {
          setIsLoading(true);
          const commande = await commandeService.getCommandeById(cmdId);
          // Supporter 'lignes' ou 'lignesCommande'
          const srcLignes = Array.isArray(commande?.lignes)
            ? commande.lignes
            : Array.isArray(commande?.lignesCommande)
            ? commande.lignesCommande
            : [];
          // Pré-remplir fournisseurId si dispo
          setForm((f) => ({
            ...f,
            // Essayer plusieurs structures possibles renvoyées par le backend
            fournisseurId:
              commande?.fournisseurId ||
              commande?.fournisseur?.id ||
              commande?.idFournisseur ||
              f.fournisseurId,
            fournisseurRaisonSociale:
              commande?.fournisseurRaisonSociale ||
              commande?.fournisseurNom ||
              commande?.fournisseur?.raisonSociale ||
              commande?.fournisseur?.nom ||
              f.fournisseurRaisonSociale,
            codeSite: commande?.codeSite ?? f.codeSite,
          }));
          const mapped = srcLignes.map((l, idx) => ({
            // Champs d'affichage
            produitReference: l.produitReference || "",
            produitDesignation: l.produitDesignation || l.produitDescription || "",
            quantiteCommandee: Number(l.quantiteCommandee || 0),
            prixUnitaire: Number(l.prixUnitaire || 0),
            // Champs destinés au DTO de réception
            produitId: l.produitId,
            quantiteRecue: 0, // l'utilisateur saisit la quantité reçue
          }));
          setLignes(mapped);
        } catch (e) {
          console.error("Erreur chargement commande pour réception:", e);
          toast.error("Impossible de précharger les lignes de la commande");
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [location.search]);

  // Si l'utilisateur sélectionne une commande depuis le select (cas non verrouillé),
  // charger la commande et pré-remplir fournisseur + lignes.
  useEffect(() => {
    const loadFromSelectedCommande = async () => {
      if (!form.commandeId || commandeLocked) return;
      try {
        setIsLoading(true);
        const commande = await commandeService.getCommandeById(form.commandeId);
        const srcLignes = Array.isArray(commande?.lignes)
          ? commande.lignes
          : Array.isArray(commande?.lignesCommande)
          ? commande.lignesCommande
          : [];
        setForm((f) => ({
          ...f,
          fournisseurId:
            commande?.fournisseurId ||
            commande?.fournisseur?.id ||
            commande?.idFournisseur ||
            f.fournisseurId,
          fournisseurRaisonSociale:
            commande?.fournisseurRaisonSociale ||
            commande?.fournisseurNom ||
            commande?.fournisseur?.raisonSociale ||
            commande?.fournisseur?.nom ||
            f.fournisseurRaisonSociale,
          codeSite: commande?.codeSite ?? f.codeSite,
        }));
        const mapped = srcLignes.map((l) => ({
          produitReference: l.produitReference || "",
          produitDesignation: l.produitDesignation || l.produitDescription || "",
          quantiteCommandee: Number(l.quantiteCommandee || 0),
          prixUnitaire: Number(l.prixUnitaire || 0),
          produitId: l.produitId,
          quantiteRecue: 0,
        }));
        setLignes(mapped);
      } catch (e) {
        console.error("Erreur lors du chargement de la commande sélectionnée:", e);
        toast.error("Impossible de charger la commande sélectionnée");
      } finally {
        setIsLoading(false);
      }
    };
    loadFromSelectedCommande();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.commandeId, commandeLocked]);

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Validation minimale: fournisseur requis (le backend exige un fournisseur)
      if (!form.fournisseurId) {
        toast.error("Fournisseur manquant: sélectionnez une commande valide");
        setIsSubmitting(false);
        return;
      }
      // Validation: la quantité reçue ne doit pas dépasser la quantité commandée
      const invalidQty = lignes.some(
        (l) => Number(l.quantiteRecue || 0) > Number(l.quantiteCommandee || 0)
      );
      if (invalidQty) {
        toast.error("La quantité reçue ne peut pas dépasser la quantité commandée");
        setIsSubmitting(false);
        return;
      }
      // Prépare payload pour l'API (mapper vers le DTO backend)
      const lignesDTO = lignes
        .filter((l) => Number(l.quantiteRecue) > 0)
        .map((l) => ({
          produitId: l.produitId,
          quantiteRecue: Number(l.quantiteRecue),
          prixUnitaire: Number(l.prixUnitaire || 0),
        }));

      const montantTotal = lignesDTO.reduce(
        (sum, l) => sum + Number(l.quantiteRecue) * Number(l.prixUnitaire || 0),
        0
      );

      const payload = {
        numeroReception: form.numeroLivraison || generateNumeroLivraison(),
        fournisseurId: form.fournisseurId ? Number(form.fournisseurId) : null,
        fournisseurRaisonSociale: form.fournisseurRaisonSociale || null,
        codeSite: form.codeSite ? Number(form.codeSite) : null,
        statut: "EN_ATTENTE",
        dateReception: form.dateLivraison
          ? new Date(form.dateLivraison).toISOString()
          : null,
        montantTotal,
        userId: null,
        lignes: lignesDTO,
      };

      const created = await receptionFournisseurService.createReception(payload);
      toast.success("Réception créée avec succès");
      if (created?.id) {
        navigate(`/achats/receptions/${created.id}`);
      } else {
        navigate(`/achats/receptions`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création de la réception");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nouvelle Réception</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enregistrez la réception d'une commande fournisseur
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="btn-light" text="Annuler" onClick={() => navigate(-1)} />
          <Button className="btn-success" text="Enregistrer" onClick={handleSubmit} disabled={isSubmitting} />
        </div>
      </div>

      <Card title="Informations Réception" noborder>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingIcon />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Textinput
              label="Numéro de réception"
              value={form.numeroLivraison}
              onChange={(e) => handleChange("numeroLivraison", e.target.value)}
            />

            <div>
              <label className="form-label">
                Commande liée{commandeLocked ? "" : " (optionnel)"}
              </label>
              <Select
                placeholder="Sélectionner une commande"
                options={commandeOptions}
                value={form.commandeId}
                disabled={commandeLocked}
                onChange={(e) => {
                  const selected = commandeOptions.find((o) => String(o.value) === e.target.value);
                  handleChange("commandeId", e.target.value);
                  handleChange("commandeNumero", selected?.numero || "");
                }}
              />
              {commandeLocked && (
                <p className="text-xs text-gray-500 mt-1">Prérempli depuis la commande source</p>
              )}
            </div>

            <div>
              <label className="form-label">Date de réception</label>
              <input
                type="datetime-local"
                className="text-control py-2"
                value={form.dateLivraison}
                onChange={(e) => handleChange("dateLivraison", e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">{formatDateTime(form.dateLivraison)}</p>
            </div>

            <Textinput
              label="Transporteur"
              placeholder="Ex: DHL, Chronopost"
              value={form.transporteur}
              onChange={(e) => handleChange("transporteur", e.target.value)}
            />

            <Textinput
              label="Numéro de suivi"
              placeholder="Ex: 1Z999AA10123456784"
              value={form.numeroSuivi}
              onChange={(e) => handleChange("numeroSuivi", e.target.value)}
            />

            <div className="md:col-span-2">
              <label className="form-label">Observations</label>
              <textarea
                className="text-control"
                rows={4}
                value={form.observations}
                onChange={(e) => handleChange("observations", e.target.value)}
              />
            </div>

            {/* Lignes de réception pré-remplies depuis la commande */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-3">Lignes de réception</h3>
              {lignes.length === 0 ? (
                <div className="text-gray-500">Aucune ligne (sélectionnez une commande ou utilisez l'URL avec commandeId).</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="table-th">Référence</th>
                        <th className="table-th">Désignation</th>
                        <th className="table-th text-right">Qté commandée</th>
                        <th className="table-th text-right">Qté reçue</th>
                        <th className="table-th text-right">PU</th>
                        <th className="table-th text-right">Montant</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {lignes.map((l, idx) => (
                        <tr key={idx}>
                          <td className="table-td">{l.produitReference || "-"}</td>
                          <td className="table-td">{l.produitDesignation || "-"}</td>
                          <td className="table-td text-right">{l.quantiteCommandee}</td>
                          <td className="table-td text-right">
                            <input
                              type="number"
                              min={0}
                              max={l.quantiteCommandee}
                              className="text-control text-right w-28"
                              value={l.quantiteRecue}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setLignes((prev) => prev.map((it, i) => (i === idx ? { ...it, quantiteRecue: val } : it)));
                              }}
                            />
                          </td>
                          <td className="table-td text-right">{Number(l.prixUnitaire || 0).toFixed(2)}</td>
                          <td className="table-td text-right">{(Number(l.quantiteRecue || 0) * Number(l.prixUnitaire || 0)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end gap-2">
              <Button className="btn-light" text="Annuler" type="button" onClick={() => navigate(-1)} />
              <Button className="btn-success" text={isSubmitting ? "Enregistrement..." : "Enregistrer"} type="submit" disabled={isSubmitting} />
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default NouvelleReception;
