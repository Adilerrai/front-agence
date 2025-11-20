import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { 
  mockStocks, 
  mockStockQualites, 
  mockProduits, 
  mockDepots,
  stockUtils 
} from "@/mocks/data";
import { 
  QUALITE_PRODUIT_OPTIONS,
  getQualiteLabel,
  getQualiteColor,
  getQualiteBadgeColor,
  getNiveauAlerte,
  NIVEAU_ALERTE_STOCK
} from "@/constants/stocks";
import { 
  stockCalculations,
  createStockDTO,
  createStockQualiteDTO 
} from "@/types/stock.types";

/**
 * Composant d'exemple pour démontrer l'utilisation des nouveaux DTOs de stock avec qualité
 */
const StockQualiteExample = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [alertes, setAlertes] = useState([]);

  useEffect(() => {
    // Charger les données mock
    setStocks(mockStocks);
    
    // Calculer les alertes
    const stocksEnAlerte = stockCalculations.getStocksEnAlerte(mockStocks);
    setAlertes(stocksEnAlerte);
  }, []);

  const handleSelectStock = (stock) => {
    setSelectedStock(stock);
  };

  const renderQualiteBadge = (qualite) => {
    const badgeColor = getQualiteBadgeColor(qualite);
    const label = getQualiteLabel(qualite);
    
    return (
      <Badge 
        label={label} 
        className={`text-xs ${getQualiteColor(qualite)}`}
      />
    );
  };

  const renderNiveauAlerte = (stockQualite) => {
    const niveau = getNiveauAlerte(stockQualite.quantiteDisponible, stockQualite.seuilAlerte);
    
    return (
      <div className={`px-2 py-1 rounded text-xs font-medium ${niveau.bgColor} ${niveau.color}`}>
        {niveau.label}
      </div>
    );
  };

  const renderStockCard = (stock) => {
    const quantiteTotaleDisponible = stockCalculations.getQuantiteTotaleDisponible(stock);
    const quantiteTotaleReservee = stockCalculations.getQuantiteTotaleReservee(stock);

    return (
      <Card key={stock.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
        <div onClick={() => handleSelectStock(stock)}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-lg">{stock.produitDescription}</h3>
              <p className="text-gray-600 text-sm">{stock.depotNom}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">
                {quantiteTotaleDisponible.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                Réservé: {quantiteTotaleReservee.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Stocks par qualité:</h4>
            {stock.stocksQualite.map((sq) => (
              <div key={sq.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  {renderQualiteBadge(sq.qualite)}
                  <span className="text-sm">
                    {sq.quantiteDisponible.toFixed(2)} disponible
                  </span>
                  {sq.quantiteReservee > 0 && (
                    <span className="text-xs text-orange-600">
                      ({sq.quantiteReservee.toFixed(2)} réservé)
                    </span>
                  )}
                </div>
                {renderNiveauAlerte(sq)}
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  const renderStockDetail = (stock) => {
    if (!stock) return null;

    return (
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold">{stock.produitDescription}</h2>
            <p className="text-gray-600">{stock.depotNom}</p>
          </div>
          <Button 
            text="Fermer" 
            className="btn-outline-secondary btn-sm"
            onClick={() => setSelectedStock(null)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations générales */}
          <div>
            <h3 className="font-semibold mb-3">Informations générales</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Produit ID:</span>
                <span className="font-medium">{stock.produitId}</span>
              </div>
              <div className="flex justify-between">
                <span>Dépôt ID:</span>
                <span className="font-medium">{stock.depotId}</span>
              </div>
              <div className="flex justify-between">
                <span>Total disponible:</span>
                <span className="font-medium text-green-600">
                  {stockCalculations.getQuantiteTotaleDisponible(stock).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total réservé:</span>
                <span className="font-medium text-orange-600">
                  {stockCalculations.getQuantiteTotaleReservee(stock).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Détail par qualité */}
          <div>
            <h3 className="font-semibold mb-3">Détail par qualité</h3>
            <div className="space-y-3">
              {stock.stocksQualite.map((sq) => (
                <div key={sq.id} className="border rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    {renderQualiteBadge(sq.qualite)}
                    {renderNiveauAlerte(sq)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Disponible:</span>
                      <div className="font-medium">{sq.quantiteDisponible.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Réservé:</span>
                      <div className="font-medium">{sq.quantiteReservee.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Seuil alerte:</span>
                      <div className="font-medium">{sq.seuilAlerte || 'Non défini'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Dernière MAJ:</span>
                      <div className="font-medium">
                        {new Date(sq.derniereMaj).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Stocks par Qualité</h1>
        <div className="text-sm text-gray-600">
          {alertes.length} alerte(s) de stock
        </div>
      </div>

      {/* Alertes */}
      {alertes.length > 0 && (
        <Card className="p-4 border-l-4 border-red-500 bg-red-50">
          <h3 className="font-semibold text-red-800 mb-2">Alertes de stock</h3>
          <div className="space-y-1">
            {alertes.slice(0, 3).map((alerte, index) => (
              <div key={index} className="text-sm text-red-700">
                {alerte.produitDescription} - {getQualiteLabel(alerte.qualite)} 
                ({alerte.depotNom}): {alerte.quantiteDisponible.toFixed(2)} restant
              </div>
            ))}
            {alertes.length > 3 && (
              <div className="text-sm text-red-600 font-medium">
                ... et {alertes.length - 3} autre(s) alerte(s)
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Vue détaillée d'un stock sélectionné */}
      {selectedStock && renderStockDetail(selectedStock)}

      {/* Liste des stocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.map(renderStockCard)}
      </div>

      {/* Informations sur les DTOs utilisés */}
      <Card className="p-4 bg-blue-50">
        <h3 className="font-semibold text-blue-800 mb-2">DTOs utilisés dans cet exemple</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <div>• <strong>StockDTO</strong>: Contient les informations de base du stock et une liste de StockQualiteDTO</div>
          <div>• <strong>StockQualiteDTO</strong>: Détaille le stock pour chaque qualité de produit</div>
          <div>• <strong>ProduitDTO</strong>: Informations sur le produit (référence, description, etc.)</div>
          <div>• <strong>DepotDTO</strong>: Informations sur le dépôt de stockage</div>
        </div>
      </Card>
    </div>
  );
};

export default StockQualiteExample;
