import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Loading from "@/components/Loading";
import { useProduit } from "@/hooks/useProduit";
import { stockService } from "@/services/apiService";
import { getUniteMesureLabel } from "@/constants/produits";

const ProduitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { produit, isLoading, error } = useProduit(id);
  const [stocks, setStocks] = useState([]);
  const [stocksLoading, setStocksLoading] = useState(false);

  // Récupérer les stocks du produit
  useEffect(() => {
    const fetchStocks = async () => {
      if (!id) return;

      setStocksLoading(true);
      try {
        const stocksData = await stockService.getStockByProduit(id);
        setStocks(Array.isArray(stocksData) ? [stocksData] : []);
      } catch (error) {
        console.error("Erreur lors du chargement des stocks:", error);
      } finally {
        setStocksLoading(false);
      }
    };

    fetchStocks();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !produit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Icon icon="ph:warning-circle" className="text-6xl text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {error || "Produit non trouvé"}
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
      {/* Header avec navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            icon="ph:arrow-left"
            className="btn-outline-secondary"
            onClick={() => navigate("/produits")}
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Détails du produit
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button
            text="Modifier"
            icon="ph:pencil"
            className="btn-primary"
            onClick={() => navigate(`/produits/edit/${id}`)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Toutes les informations dans une seule card - 3 colonnes */}
        <div className="lg:col-span-3">
          <Card title="Informations du produit">
            <div className="space-y-8">
              {/* Informations générales */}
              <div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Référence
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {produit.reference}
                    </p>
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Point de vente ID
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {produit.pointDeVenteId}
                    </p>
                  </div> */}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {produit.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Prix */}
              <div>
               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                      Prix d'achat
                    </label>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {produit.prixAchat ? `${produit.prixAchat.toFixed(2)} MAD` : "Non défini"}
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                      Prix de vente
                    </label>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {produit.prixVente ? `${produit.prixVente.toFixed(2)} MAD` : "Non défini"}
                    </p>
                  </div>
                </div>

                {/* Marge bénéficiaire */}
                {produit.prixAchat && produit.prixVente && (
                  <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-1">
                      Marge bénéficiaire
                    </label>
                    <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                      {(produit.prixVente - produit.prixAchat).toFixed(2)} 
                      <span className="text-sm font-normal ml-2">
                        ({(((produit.prixVente - produit.prixAchat) / produit.prixAchat) * 100).toFixed(1)}%)
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Unités de mesure */}
              <div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Unité de stock
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {getUniteMesureLabel(produit.uniteMesureStock) || "Non défini"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ({produit.uniteMesureStock || "N/A"})
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Unité d'achat
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {getUniteMesureLabel(produit.uniteMesureAchat) || "Non défini"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ({produit.uniteMesureAchat || "N/A"})
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Unité de vente
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {getUniteMesureLabel(produit.uniteVente) || "Non défini"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ({produit.uniteVente || "N/A"})
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Image du produit - 1 colonne à droite */}
        <div className="lg:col-span-1">
          <Card title="Image du produit" className="sticky top-6">
            <div className="flex justify-center">
              {produit.image && (produit.image.base64Data || produit.image.imageData) ? (
                <img
                  src={
                    produit.image.base64Data
                      ? `data:${produit.image.contentType};base64,${produit.image.base64Data}`
                      : `data:${produit.image.contentType};base64,${btoa(String.fromCharCode(...produit.image.imageData))}`
                  }
                  alt={produit.description}
                  className="w-full h-auto rounded-lg shadow-lg max-h-96 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Icon icon="ph:image" className="text-6xl text-gray-400" />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Section Stocks */}
      <div className="grid grid-cols-1 gap-6">
        {/* Stocks du produit */}
        <Card title="Stocks du produit" className="h-fit">
          {stocksLoading ? (
            <div className="flex justify-center py-4">
              <Loading />
            </div>
          ) : stocks.length > 0 ? (
            <div className="space-y-3">
              {stocks.map((stock) => (
                <div
                  key={stock.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon icon="ph:package" className="text-green-500" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {stock.depotNom}
                      </span>
                    </div>
                    {stock.seuilAlerte && stock.quantiteDisponible <= stock.seuilAlerte && (
                      <Icon icon="ph:warning" className="text-red-500" title="Stock en alerte" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Disponible:</span>
                      <span className="ml-1 font-semibold text-green-600">
                        {stock.quantiteDisponible || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Réservé:</span>
                      <span className="ml-1 font-semibold text-orange-600">
                        {stock.quantiteReservee || 0}
                      </span>
                    </div>
                    {stock.seuilAlerte && (
                      <div className="col-span-2">
                        <span className="text-gray-500 dark:text-gray-400">Seuil d'alerte:</span>
                        <span className="ml-1 font-semibold text-red-600">
                          {stock.seuilAlerte}
                        </span>
                      </div>
                    )}
                  </div>

                  {stock.derniereMaj && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Dernière MAJ: {new Date(stock.derniereMaj).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                <Button
                  text="Gérer les stocks"
                  icon="ph:package"
                  className="btn-outline-primary w-full"
                  onClick={() => navigate("/stocks")}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Icon icon="ph:package" className="text-4xl mb-2 mx-auto" />
              <p>Aucun stock configuré pour ce produit</p>
              <Button
                text="Initialiser le stock"
                icon="ph:plus"
                className="btn-primary mt-3"
                onClick={() => navigate("/stocks")}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProduitDetails;
