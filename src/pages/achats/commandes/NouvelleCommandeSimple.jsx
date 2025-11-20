import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { commandeFournisseurService } from "@/services/apiService";
import { produitService } from "@/services/produitService";
import { fournisseurService } from "@/services/fournisseurService";
import Badge from "@/components/ui/Badge";
import { QUALITE_PRODUIT_OPTIONS, getQualiteLabel, getQualiteBadgeColor } from "@/constants/stocks";

const NouvelleCommandeSimple = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchProduit, setSearchProduit] = useState("");
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [produits, setProduits] = useState([]);
  const [showProduitList, setShowProduitList] = useState(false);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loadingFournisseurs, setLoadingFournisseurs] = useState(true);

  const [formData, setFormData] = useState({
    numeroCommande: `CMD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    fournisseurId: "",
    dateCommande: new Date().toISOString().split("T")[0],
    montantTotal: 0,
    statut: "BROUILLON",
    dateLivraisonPrevue: "",
    commentaire: "",
    lignes: [],
  });

  const [ligneForm, setLigneForm] = useState({
    produitId: "",
    quantiteCommandee: "",
    prixUnitaire: "",
    qualite: "",
  });

  // Charger les fournisseurs au démarrage
  useEffect(() => {
    const loadFournisseurs = async () => {
      try {
        console.log("🏢 Chargement des fournisseurs actifs...");
        const fournisseursActifs = await fournisseurService.getActiveFournisseurs();
        console.log("✅ Fournisseurs chargés:", fournisseursActifs);
        setFournisseurs(fournisseursActifs);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des fournisseurs:", error);
        toast.error("Erreur lors du chargement des fournisseurs");
      } finally {
        setLoadingFournisseurs(false);
      }
    };

    loadFournisseurs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLigneInputChange = (e) => {
    const { name, value } = e.target;
    setLigneForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchProduit = async (e) => {
    const value = e.target.value;
    console.log("🔍 Recherche déclenchée:", value);
    setSearchProduit(value);
    
    if (value.length >= 1) {
      console.log("✅ Recherche active pour:", value);
      setShowProduitList(true);
      
      try {
        // Utiliser searchCriteria comme dans votre API
        const searchCriteria = {
          searchTerm: value  // ou le nom du champ que votre backend attend
        };
        
        console.log("🌐 Appel API avec searchCriteria:", searchCriteria);
        const resultats = await produitService.searchProduits(searchCriteria, 0, 50);
        
        console.log(`📦 ${resultats.length} produits trouvés via API:`, resultats);
        setProduits(resultats);
      } catch (error) {
        console.error("❌ Erreur lors de la recherche de produits:", error);
        toast.error("Erreur lors de la recherche de produits");
        setProduits([]);
      }
    } else {
      console.log("❌ Recherche vide, masquer la liste");
      setShowProduitList(false);
      setProduits([]);
    }
  };

  const handleSelectProduit = (produit) => {
    console.log("✅ Produit sélectionné:", produit);
    setSelectedProduit(produit);
    setLigneForm((prev) => ({
      ...prev,
      produitId: produit.id,
      prixUnitaire: produit.prixAchat || "", // Pré-remplir avec le prix d'achat
    }));
    setSearchProduit(produit.libelle || ""); // Afficher le nom du produit sélectionné
    setShowProduitList(false);
  };

  const handleAddLigne = () => {
    if (!ligneForm.produitId) {
      toast.error("Sélectionnez un produit");
      return;
    }

    if (!ligneForm.quantiteCommandee || parseInt(ligneForm.quantiteCommandee) <= 0) {
      toast.error("La quantité doit être supérieure à 0");
      return;
    }

    if (!ligneForm.prixUnitaire || parseFloat(ligneForm.prixUnitaire) <= 0) {
      toast.error("Le prix unitaire doit être supérieur à 0");
      return;
    }

    if (!ligneForm.qualite) {
      toast.error("Sélectionnez la qualité du produit");
      return;
    }

    const montantLigne = parseInt(ligneForm.quantiteCommandee) * parseFloat(ligneForm.prixUnitaire);

    const nouvelleLigne = {
      produitId: parseInt(ligneForm.produitId),
      produitDesignation: selectedProduit?.libelle || "Produit",
      produitReference: selectedProduit?.reference || "",
      quantiteCommandee: parseInt(ligneForm.quantiteCommandee),
      quantiteLivree: 0,
      prixUnitaire: parseFloat(ligneForm.prixUnitaire),
      montantLigne: montantLigne,
      qualite: ligneForm.qualite,
    };

    setFormData((prev) => ({
      ...prev,
      lignes: [...prev.lignes, nouvelleLigne],
      montantTotal: prev.montantTotal + montantLigne,
    }));

    setLigneForm({
      produitId: "",
      quantiteCommandee: "",
      prixUnitaire: "",
      qualite: "",
    });
    setSelectedProduit(null);
    toast.success("Ligne ajoutée");
  };

  const handleRemoveLigne = (index) => {
    const ligne = formData.lignes[index];
    setFormData((prev) => ({
      ...prev,
      lignes: prev.lignes.filter((_, i) => i !== index),
      montantTotal: prev.montantTotal - ligne.montantLigne,
    }));
    toast.success("Ligne supprimée");
  };

  const handleSubmit = async (e, shouldValidate = false) => {
    e.preventDefault();

    if (!formData.numeroCommande.trim()) {
      toast.error("Le numéro de commande est requis");
      return;
    }

    if (!formData.fournisseurId) {
      toast.error("Le fournisseur est requis");
      return;
    }

    if (formData.lignes.length === 0) {
      toast.error("Ajoutez au moins une ligne");
      return;
    }

    setIsLoading(true);

    try {
      // Mapper les lignes pour le backend (enlever les champs calculés côté client)
      // Et convertir la qualité si nécessaire vers l'enum backend (QualiteCarrelage)
      const QUALITE_TO_BACKEND = {
        PREMIERE_QUALITE: "PREMIER_CHOIX",
        DEUXIEME_QUALITE: "DEUXIEME_CHOIX",
        TROISIEME_QUALITE: "TROISIEME_CHOIX",
      };

      const lignesForBackend = formData.lignes.map(ligne => ({
        produitId: ligne.produitId,
        quantiteCommandee: ligne.quantiteCommandee,
        prixUnitaire: ligne.prixUnitaire,
        montantLigne: ligne.montantLigne,
        // IMPORTANT: envoyer la qualité attendue par le backend (QualiteCarrelage)
        // Ex: UI "PREMIERE_QUALITE" -> backend "PREMIER_CHOIX"
        qualite: QUALITE_TO_BACKEND[ligne.qualite] || ligne.qualite,
      }));

      const commandeData = {
        numeroCommande: formData.numeroCommande,
        fournisseurId: parseInt(formData.fournisseurId),
        dateCommande: formData.dateCommande,
        montantTotal: formData.montantTotal,
        statut: formData.statut,
        dateLivraisonPrevue: formData.dateLivraisonPrevue || null,
        commentaire: formData.commentaire,
        lignes: lignesForBackend,
      };

      console.log("📤 Envoi de la commande:", commandeData);
      const createdCommande = await commandeFournisseurService.createCommande(commandeData);
      console.log("✅ Commande créée:", createdCommande);
      console.log("📊 Nombre de lignes:", createdCommande.lignes?.length);

      // Afficher chaque ligne en détail
      if (createdCommande.lignes && createdCommande.lignes.length > 0) {
        console.log("📦 Détails des lignes:");
        createdCommande.lignes.forEach((ligne, index) => {
          console.log(`  Ligne ${index + 1}:`, {
            id: ligne.id,
            produitId: ligne.produitId,
            produitDesignation: ligne.produitDesignation,
            produitReference: ligne.produitReference,
            quantiteCommandee: ligne.quantiteCommandee,
            prixUnitaire: ligne.prixUnitaire,
            montantLigne: ligne.montantLigne,
            qualite: ligne.qualite,
          });
        });
      } else {
        console.warn("⚠️ Aucune ligne retournée par le backend!");
      }

      if (shouldValidate && createdCommande.id) {
        // Valider la commande (passer de BROUILLON à PASSEE)
        const validatedCommande = await commandeFournisseurService.validerCommande(createdCommande.id);
        console.log("✅ Commande validée:", validatedCommande);
        console.log("📦 Lignes après validation:", validatedCommande.lignes);
        toast.success("Commande créée et passée avec succès");
      } else {
        toast.success("Commande créée avec succès (Brouillon)");
      }

      navigate("/achats/commandes");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Créer une Commande Fournisseur
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Remplissez les informations et ajoutez les lignes
            </p>
          </div>
          <button
            onClick={() => navigate("/achats/commandes")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            ← Retour
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations Générales */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Informations Générales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* N° Commande (généré automatiquement) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  N° Commande (généré automatiquement)
                </label>
                <input
                  type="text"
                  name="numeroCommande"
                  value={formData.numeroCommande}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-100 dark:bg-gray-600"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fournisseur *
                </label>
                {loadingFournisseurs ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    Chargement des fournisseurs...
                  </div>
                ) : (
                  <select
                    name="fournisseurId"
                    value={formData.fournisseurId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="">Sélectionnez un fournisseur</option>
                    {fournisseurs.map((fournisseur) => (
                      <option key={fournisseur.id} value={fournisseur.id}>
                        {fournisseur.raisonSociale} - {fournisseur.telephone || 'N/A'}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Commande *
                </label>
                <input
                  type="date"
                  name="dateCommande"
                  value={formData.dateCommande}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Livraison Prévue
                </label>
                <input
                  type="date"
                  name="dateLivraisonPrevue"
                  value={formData.dateLivraisonPrevue}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Commentaire
                </label>
                <textarea
                  name="commentaire"
                  placeholder="Ajouter un commentaire..."
                  value={formData.commentaire}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Ajouter une Ligne */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Ajouter une Ligne</h3>

            {/* Recherche Produit */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rechercher un Produit *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tapez pour rechercher un produit..."
                  value={searchProduit}
                  onChange={handleSearchProduit}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />

                {/* Liste des produits */}
                {showProduitList && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {produits.length > 0 ? (
                      produits.map((produit) => (
                        <div
                          key={produit.id}
                          onClick={() => handleSelectProduit(produit)}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        >
                          <p className="font-medium">{produit.libelle}</p>
                          <p className="text-sm text-gray-500">{produit.reference}</p>
                          {produit.prixAchat && (
                            <p className="text-xs text-green-600">Prix: {produit.prixAchat}MAD</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">Aucun produit trouvé</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quantité, Qualité et Prix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantité *
                </label>
                <input
                  type="number"
                  name="quantiteCommandee"
                  placeholder="Ex: 10"
                  value={ligneForm.quantiteCommandee}
                  onChange={handleLigneInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Qualité *
                </label>
                <select
                  name="qualite"
                  value={ligneForm.qualite}
                  onChange={handleLigneInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Sélectionnez une qualité</option>
                  {QUALITE_PRODUIT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prix Unitaire (MAD) *
                </label>
                <input
                  type="number"
                  name="prixUnitaire"
                  placeholder="Ex: 25.50"
                  value={ligneForm.prixUnitaire}
                  onChange={handleLigneInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddLigne}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              + Ajouter la Ligne
            </button>
          </div>

          {/* Liste des Lignes */}
          {formData.lignes.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Lignes de Commande ({formData.lignes.length})</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2">Produit</th>
                      <th className="text-left py-2">Référence</th>
                      <th className="text-center py-2">Qualité</th>
                      <th className="text-right py-2">Qté</th>
                      <th className="text-right py-2">Prix Unit.</th>
                      <th className="text-right py-2">Total</th>
                      <th className="text-center py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.lignes.map((ligne, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-2">{ligne.produitDesignation}</td>
                        <td className="py-2 text-gray-500">{ligne.produitReference}</td>
                        <td className="py-2 text-center">
                          {ligne.qualite ? (
                            <Badge
                              label={getQualiteLabel(ligne.qualite)}
                              className={`text-xs ${getQualiteBadgeColor(ligne.qualite)}`}
                            />
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-2 text-right">{ligne.quantiteCommandee}</td>
                        <td className="py-2 text-right">{ligne.prixUnitaire.toFixed(2)}MAD</td>
                        <td className="py-2 text-right font-semibold">{ligne.montantLigne.toFixed(2)}MAD</td>
                        <td className="py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveLigne(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Montant Total :</span>
              <span className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                }).format(formData.montantTotal)}
              </span>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate("/achats/commandes")}
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              ← Annuler
            </button>

            <div className="flex space-x-3">
              <button
                type="submit"
                onClick={(e) => handleSubmit(e, false)}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                {isLoading ? "Création..." : "💾 Créer en Brouillon"}
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Création..." : "✅ Créer et Passer"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NouvelleCommandeSimple;
