import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

const AchatsPage = () => {
  const navigate = useNavigate();

  const achatsModules = [
    {
      title: "Commandes d'achat",
      description: "Créer et gérer les commandes fournisseurs",
      icon: "ph:shopping-cart",
      color: "bg-blue-500",
      link: "/achats/commandes",
      stats: "12 en cours",
    },
    {
      title: "Réceptions",
      description: "Enregistrer les réceptions de marchandises",
      icon: "ph:package",
      color: "bg-green-500",
      link: "/achats/receptions",
      stats: "5 en attente",
    },
    {
      title: "Factures fournisseurs",
      description: "Gérer les factures et paiements",
      icon: "ph:receipt",
      color: "bg-purple-500",
      link: "/achats/factures",
      stats: "8 à traiter",
    },
    {
      title: "Retours fournisseurs",
      description: "Gérer les retours de marchandises",
      icon: "ph:arrow-counter-clockwise",
      color: "bg-orange-500",
      link: "/achats/retours",
      stats: "2 en cours",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des Achats
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez vos achats, commandes fournisseurs et réceptions
          </p>
        </div>
        <Button
          text="Nouvelle commande"
          icon="ph:plus"
          className="btn-primary"
          onClick={() => navigate("/achats/commandes/nouveau")}
        />
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Icon icon="ph:shopping-cart" className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Commandes du mois</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">45</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Icon icon="ph:package" className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Réceptions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">38</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Icon icon="ph:receipt" className="text-2xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Factures</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">32</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Icon  className="text-2xl text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Montant total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">dhs25,430</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Modules d'achats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achatsModules.map((module, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <div 
              className="p-6"
              onClick={() => navigate(module.link)}
            >
              <div className="flex items-start space-x-4">
                <div className={`h-12 w-12 rounded-lg ${module.color} text-white text-2xl flex items-center justify-center`}>
                  <Icon icon={module.icon} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {module.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {module.stats}
                    </span>
                    <Button
                      text="Accéder"
                      className="btn-outline-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(module.link);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Actions rapides */}
      <Card title="Actions rapides">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            text="Nouvelle commande d'achat"
            icon="ph:plus"
            className="btn-primary w-full"
            onClick={() => navigate("/achats/commandes/nouveau")}
          />
          <Button
            text="Enregistrer une réception"
            icon="ph:package"
            className="btn-success w-full"
            onClick={() => navigate("/achats/receptions/nouveau")}
          />
          <Button
            text="Voir les factures en attente"
            icon="ph:receipt"
            className="btn-warning w-full"
            onClick={() => navigate("/achats/factures?status=pending")}
          />
        </div>
      </Card>
    </div>
  );
};

export default AchatsPage;
