import React from "react";
import { UNITE_MESURE_OPTIONS, getUniteMesureLabel } from "@/constants/produits";

const TestUniteMesure = () => {
  // Exemples de données comme elles viendraient de l'API
  const exemplesProduits = [
    {
      id: 1,
      reference: "ZELLIJ-15",
      description: "Carrelage Sol Premium",
      uniteMesureStock: "M2",
      uniteMesureAchat: "M2",
      uniteVente: "M2",
      prixAchat: 25.50,
      prixVente: 35.00,
    },
    {
      id: 2,
      reference: "PIECE-001",
      description: "Produit à l'unité",
      uniteMesureStock: "PIECE",
      uniteMesureAchat: "PIECE",
      uniteVente: "PIECE",
      prixAchat: 10.00,
      prixVente: 15.00,
    },
    {
      id: 3,
      reference: "LIQUIDE-001",
      description: "Produit liquide",
      uniteMesureStock: "LITRE",
      uniteMesureAchat: "LITRE",
      uniteVente: "LITRE",
      prixAchat: 5.00,
      prixVente: 8.00,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Test des Unités de Mesure (Enum)
      </h2>

      {/* Options disponibles */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Options d'unités de mesure disponibles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {UNITE_MESURE_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="bg-white dark:bg-gray-800 p-3 rounded border"
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {option.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {option.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test avec des exemples de produits */}
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
          Exemples de produits avec unités de mesure
        </h3>
        <div className="space-y-4">
          {exemplesProduits.map((produit) => (
            <div
              key={produit.id}
              className="bg-white dark:bg-gray-800 p-4 rounded border"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {produit.reference} - {produit.description}
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Stock:</span>
                  <div className="font-medium">
                    {getUniteMesureLabel(produit.uniteMesureStock)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Enum: {produit.uniteMesureStock}
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Achat:</span>
                  <div className="font-medium">
                    {getUniteMesureLabel(produit.uniteMesureAchat)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Enum: {produit.uniteMesureAchat}
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Vente:</span>
                  <div className="font-medium">
                    {getUniteMesureLabel(produit.uniteVente)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Enum: {produit.uniteVente}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex space-x-4 text-sm">
                  <span>
                    <span className="text-gray-600 dark:text-gray-400">Prix achat:</span>
                    <span className="ml-1 font-medium text-blue-600">
                      {produit.prixAchat.toFixed(2)} dhs
                    </span>
                  </span>
                  <span>
                    <span className="text-gray-600 dark:text-gray-400">Prix vente:</span>
                    <span className="ml-1 font-medium text-green-600">
                      {produit.prixVente.toFixed(2)} dhs
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test de la fonction utilitaire */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
          Test de la fonction getUniteMesureLabel()
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              getUniteMesureLabel("M2")
            </code>
            <span className="ml-2">→ {getUniteMesureLabel("M2")}</span>
          </div>
          <div>
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              getUniteMesureLabel("PIECE")
            </code>
            <span className="ml-2">→ {getUniteMesureLabel("PIECE")}</span>
          </div>
          <div>
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              getUniteMesureLabel("INEXISTANT")
            </code>
            <span className="ml-2">→ {getUniteMesureLabel("INEXISTANT")}</span>
          </div>
          <div>
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              getUniteMesureLabel(null)
            </code>
            <span className="ml-2">→ {getUniteMesureLabel(null)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestUniteMesure;
