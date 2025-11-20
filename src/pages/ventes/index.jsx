import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

const VentesPage = () => {
  const navigate = useNavigate();

  const ventesModules = [
    {
      title: "Commandes clients",
      description: "Gérer les commandes et ventes clients",
      icon: "ph:shopping-cart",
      color: "bg-blue-500",
      link: "/ventes/commandes",
      stats: "18 en cours",
    },
    {
      title: "Devis",
      description: "Créer et suivre les devis clients",
      icon: "ph:file-text",
      color: "bg-indigo-500",
      link: "/ventes/devis",
      stats: "7 en attente",
    },
    {
      title: "Factures clients",
      description: "Gérer la facturation et encaissements",
      icon: "ph:receipt",
      color: "bg-green-500",
      link: "/ventes/factures",
      stats: "15 émises",
    },
    {
      title: "Livraisons",
      description: "Organiser et suivre les livraisons",
      icon: "ph:truck",
      color: "bg-purple-500",
      link: "/ventes/livraisons",
      stats: "12 programmées",
    },
    {
      title: "Retours clients",
      description: "Gérer les retours et remboursements",
      icon: "ph:arrow-clockwise",
      color: "bg-orange-500",
      link: "/ventes/retours",
      stats: "3 en cours",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des Ventes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez vos ventes, commandes clients et livraisons
          </p>
        </div>
        <Button
          text="Nouvelle vente"
          icon="ph:plus"
          className="btn-primary"
          onClick={() => navigate("/ventes/commandes/nouveau")}
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Ventes du mois</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">67</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Icon  className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">CA du mois</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">dhs42,850</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Icon icon="ph:users" className="text-2xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Clients actifs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Icon icon="ph:truck" className="text-2xl text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Livraisons</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Modules de ventes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ventesModules.map((module, index) => (
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button
            text="Nouveau devis"
            icon="ph:file-text"
            className="btn-primary w-full"
            onClick={() => navigate("/ventes/devis/nouveau")}
          />
          <Button
            text="Nouvelle commande"
            icon="ph:shopping-cart"
            className="btn-success w-full"
            onClick={() => navigate("/ventes/commandes/nouveau")}
          />
          <Button
            text="Créer une facture"
            icon="ph:receipt"
            className="btn-warning w-full"
            onClick={() => navigate("/ventes/factures/nouveau")}
          />
          <Button
            text="Programmer livraison"
            icon="ph:truck"
            className="btn-info w-full"
            onClick={() => navigate("/ventes/livraisons/nouveau")}
          />
        </div>
      </Card>

      {/* Graphiques et tableaux de bord (à implémenter) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Ventes récentes">
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Icon icon="ph:chart-line" className="text-4xl mb-2 mx-auto" />
            <p>Graphique des ventes</p>
            <p className="text-sm">À implémenter</p>
          </div>
        </Card>

        <Card title="Top produits vendus">
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Icon icon="ph:ranking" className="text-4xl mb-2 mx-auto" />
            <p>Classement des produits</p>
            <p className="text-sm">À implémenter</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VentesPage;
