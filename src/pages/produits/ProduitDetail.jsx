import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import LoadingIcon from "@/components/LoadingIcon";
import { toast } from "react-toastify";
import { produitService, imageMetadataService, authService } from "@/services/apiService";
import { getUniteMesureLabel } from "@/constants/produits";
import ProduitModal from "./ProduitModal";

const ProduitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produit, setProduit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [imageBust, setImageBust] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Charger les détails du produit
  const fetchProduitDetails = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await produitService.getProduitById(id);
      setProduit(data);
    } catch (err) {
      setIsError(true);
      setError(err);
      console.error("Erreur lors du chargement du produit:", err);
      toast.error("Erreur lors du chargement du produit");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduitDetails();
    }
  }, [id]);

  const handleClickUploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    try {
      setIsUploading(true);
  await imageMetadataService.upload(Number(id), file);
      toast.success("Image ajoutée au produit");
  setImageError(false);
  setImageBust(Date.now());
      // Clear input value to allow reselecting same file later
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Erreur upload image produit:", err);
      toast.error("Échec de l'ajout de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
  };

  const handleEditModalSuccess = () => {
    fetchProduitDetails(); // Recharger les données
    setShowEditModal(false);
    toast.success("Produit modifié avec succès");
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await produitService.deleteProduit(id);
        toast.success("Produit supprimé avec succès");
        navigate("/produits");
      } catch (error) {
        toast.error("Erreur lors de la suppression du produit");
        console.error("Erreur:", error);
      }
    }
  };

  const renderImage = () => {
    if (imageError) {
      return (
        <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <Icon icon="ph:image" className="text-6xl text-gray-400" />
          <span className="ml-2 text-gray-500">Aucune image</span>
        </div>
      );
    }

    if (imageLoading) {
      return (
        <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <Icon icon="ph:spinner-gap" className="text-3xl animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Chargement de l'image…</span>
        </div>
      );
    }

    if (!imageSrc) {
      return (
        <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <Icon icon="ph:image" className="text-6xl text-gray-400" />
          <span className="ml-2 text-gray-500">Aucune image</span>
        </div>
      );
    }

    return (
      <button
        type="button"
        className="w-full h-64 focus:outline-none"
        onClick={() => setShowImageModal(true)}
        title="Agrandir"
      >
        <img
          src={imageSrc}
          alt={produit.designation || produit.description}
          className="w-full h-64 object-cover rounded-lg cursor-zoom-in"
        />
      </button>
    );
  };

  // Charger l'image via fetch (avec Authorization) car <img> ne peut pas ajouter le header
  useEffect(() => {
    let revokeUrl;
    const loadImage = async () => {
      if (!id) return;
      try {
        setImageLoading(true);
        setImageError(false);
        const url = imageMetadataService.getContentByProduitIdUrl(Number(id));
        const token = authService.getAccessToken();
        const resp = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!resp.ok) {
          // 404: pas d'image pour ce produit
          setImageSrc(null);
          setImageError(true);
          return;
        }
        const blob = await resp.blob();
        const objUrl = URL.createObjectURL(blob);
        revokeUrl = objUrl;
        setImageSrc(objUrl);
      } catch (e) {
        console.error('Erreur chargement image produit:', e);
        setImageSrc(null);
        setImageError(true);
      } finally {
        setImageLoading(false);
      }
    };
    loadImage();
    return () => {
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [id, imageBust]);

  const renderStatutBadge = () => {
    const actif = produit.actif;
    if (actif === null || actif === undefined) {
      return (
        <Badge label="Non défini" className="bg-gray-100 text-gray-600" />
      );
    }
    return (
      <Badge 
        label={actif ? "Actif" : "Inactif"} 
        className={actif ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} 
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
            onClick={fetchProduitDetails}
          />
          <Button
            text="Retour"
            className="btn-outline-secondary"
            onClick={() => navigate("/produits")}
          />
        </div>
      </div>
    );
  }

  if (!produit) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Icon icon="ph:package" className="text-6xl text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Produit non trouvé
        </h2>
        <Button
          text="Retour à la liste"
          className="btn-primary"
          onClick={() => navigate("/produits")}
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
            onClick={() => navigate("/produits")}
            title="Retour à la liste"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {produit.designation || produit.description}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Référence: {produit.reference}
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
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            text={isUploading ? "Envoi..." : "Ajouter image"}
            icon="ph:paperclip"
            className="btn-outline-primary"
            onClick={handleClickUploadImage}
            disabled={isUploading}
          />
          <Button
            text="Supprimer"
            icon="ph:trash"
            className="btn-danger"
            onClick={handleDelete}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image */}
        <div className="lg:col-span-1">
          <Card title="Image du produit">
            {renderImage()}
          </Card>
        </div>

        {/* Informations principales */}
        <div className="lg:col-span-2">
          <Card title="Informations générales">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">ID</label>
                  <p className="text-lg font-semibold">{produit.id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Référence</label>
                  <p className="text-lg font-semibold">{produit.reference}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Désignation</label>
                  <p className="text-lg">{produit.designation || "Non définie"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-700 dark:text-gray-300">{produit.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Unité de mesure (Stock)</label>
                  <p className="text-lg">{getUniteMesureLabel(produit.uniteMesureStock)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Prix d'achat</label>
                  <p className="text-lg font-semibold text-green-600">
                    {produit.prixAchat ? `${produit.prixAchat} dhs` : "Non défini"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Prix de vente</label>
                  <p className="text-lg font-semibold text-blue-600">
                    {produit.prixVente ? `${produit.prixVente} dhs` : "Non défini"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Point de vente ID</label>
                  <p className="text-lg">{produit.pointDeVenteId || "Non défini"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Groupe d'article</label>
                  <p className="text-lg">
                    {produit.groupeArticle 
                      ? (produit.groupeArticle.nom || produit.groupeArticle.description)
                      : "Non défini"
                    }
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Statut</label>
                  <div className="mt-1">
                    {renderStatutBadge()}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Caractéristiques techniques */}
      <Card title="Caractéristiques techniques">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Longueur</label>
            <p className="text-lg font-semibold">
              {produit.longueurCm ? `${produit.longueurCm} cm` : "Non définie"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Largeur</label>
            <p className="text-lg font-semibold">
              {produit.largeurCm ? `${produit.largeurCm} cm` : "Non définie"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Épaisseur</label>
            <p className="text-lg font-semibold">
              {produit.epaisseurMm ? `${produit.epaisseurMm} mm` : "Non définie"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Format</label>
            <p className="text-lg font-semibold">
              {produit.format || "Non défini"}
            </p>
          </div>
        </div>

        {/* Calcul automatique des dimensions si disponibles */}
        {(produit.longueurCm && produit.largeurCm) && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
              Calculs automatiques
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Surface par unité:</span>
                <span className="ml-2 font-medium">
                  {((produit.longueurCm * produit.largeurCm) / 10000).toFixed(4)} m²
                </span>
              </div>
              {produit.epaisseurMm && (
                <div>
                  <span className="text-gray-600">Volume par unité:</span>
                  <span className="ml-2 font-medium">
                    {((produit.longueurCm * produit.largeurCm * produit.epaisseurMm) / 1000000).toFixed(6)} m³
                  </span>
                </div>
              )}
              {produit.prixVente && (
                <div>
                  <span className="text-gray-600">Prix au m²:</span>
                  <span className="ml-2 font-medium text-green-600">
                    {(produit.prixVente / ((produit.longueurCm * produit.largeurCm) / 10000)).toFixed(2)} dhs/m²
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Actions et liens rapides */}
      <Card title="Actions rapides">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            text="Voir les stocks"
            icon="ph:package"
            className="btn-info w-full"
            onClick={() => navigate(`/stocks?produit=${produit.id}`)}
          />
          <Button
            text="Historique des mouvements"
            icon="ph:clock-clockwise"
            className="btn-outline-primary w-full"
            onClick={() => navigate(`/stocks/mouvements?produit=${produit.id}`)}
          />
          <Button
            text="Créer une commande"
            icon="ph:shopping-cart"
            className="btn-success w-full"
            onClick={() => navigate(`/commandes/new?produit=${produit.id}`)}
          />
        </div>
      </Card>

      {/* Modal de modification */}
      <ProduitModal
        isOpen={showEditModal}
        onClose={handleEditModalClose}
        produit={produit}
        onSuccess={handleEditModalSuccess}
      />

      {/* Modal d'aperçu grande image */}
      <Modal
        activeModal={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="Aperçu de l'image"
        className="max-w-5xl"
      >
        <div className="w-full flex items-center justify-center">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={produit?.designation || produit?.description}
              className="max-h-[80vh] w-auto object-contain rounded"
            />
          ) : (
            <div className="text-gray-500">Aucune image</div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ProduitDetail;
