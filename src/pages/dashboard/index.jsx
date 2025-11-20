import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import History from "@/components/partials/widget/chart/history";
import RadarChart from "@/components/partials/widget/chart/radar-chart";

// image import
import Usa from "@/assets/images/flags/usa.svg";
import Brasil from "@/assets/images/flags/bra.svg";
import Japan from "@/assets/images/flags/japan.svg";
import Italy from "@/assets/images/flags/italy.svg";
import Chin from "@/assets/images/flags/chin.svg";
import India from "@/assets/images/flags/india.svg";
import Earnings from "@/components/partials/widget/chart/Earnings";
import RecentOrderTable from "@/components/partials/Table/order-table";

// Données mock pour le dashboard Point de Vente
const dashboardStats = [
  {
    title: "Ventes du jour",
    value: "2,847 dhs",
    icon: "ph:shopping-cart",
    color: "bg-indigo-500",
    change: "+12.5%",
    changeType: "increase",
    description: "Depuis hier"
  },
  {
    title: "Produits vendus",
    value: "156",
    icon: "ph:package",
    color: "bg-green-500",
    change: "+8.2%",
    changeType: "increase",
    description: "Depuis hier"
  },
  {
    title: "Commandes",
    value: "89",
    icon: "ph:receipt",
    color: "bg-yellow-500",
    change: "+15.3%",
    changeType: "increase",
    description: "Depuis hier"
  },
  {
    title: "Stock faible",
    value: "12",
    icon: "ph:warning",
    color: "bg-red-500",
    change: "-2",
    changeType: "decrease",
    description: "Produits à réapprovisionner"
  }
];

const recentSales = [
  {
    id: "CMD001",
    customer: "Marie Dubois",
    amount: "125.50 dhs",
    status: "Payé",
    time: "Il y a 5 min"
  },
  {
    id: "CMD002",
    customer: "Jean Martin",
    amount: "89.90 dhs",
    status: "Payé",
    time: "Il y a 12 min"
  },
  {
    id: "CMD003",
    customer: "Sophie Laurent",
    amount: "234.75 dhs",
    status: "En attente",
    time: "Il y a 25 min"
  },
  {
    id: "CMD004",
    customer: "Pierre Moreau",
    amount: "67.20 dhs",
    status: "Payé",
    time: "Il y a 1h"
  }
];

const topProducts = [
  {
    name: "Ordinateur portable Dell",
    sales: 45,
    revenue: "2,250 dhs",
    trend: "up"
  },
  {
    name: "Smartphone Samsung",
    sales: 38,
    revenue: "1,900 dhs",
    trend: "up"
  },
  {
    name: "Casque audio Bluetooth",
    sales: 29,
    revenue: "580 dhs",
    trend: "down"
  },
  {
    name: "T-shirt coton bio",
    sales: 67,
    revenue: "335 dhs",
    trend: "up"
  }
];

const country = [
  {
    name: "Usa",
    flag: Usa,
    count: "$6.41",
    icon: "heroicons:arrow-small-up",
  },
  {
    name: "Brazil",
    flag: Brasil,
    count: "$2.33",
    icon: "heroicons:arrow-small-up",
  },
  {
    name: "Japan",
    flag: Japan,
    count: "$7.12",
    icon: "heroicons:arrow-small-down",
  },
  {
    name: "Italy",
    flag: Italy,
    count: "$754",
    icon: "heroicons:arrow-small-down",
  },
  {
    name: "India",
    flag: India,
    count: "$699",
    icon: "heroicons:arrow-small-up",
  },
  {
    name: "India",
    flag: India,
    count: "$624",
    icon: "heroicons:arrow-small-up",
  },
];
const source = [
  {
    name: "Direct Source",
    flag: "ph:circle-half",
    count: "1.2k",
    icon: "heroicons:arrow-small-down",
  },
  {
    name: "Social Network",
    flag: "ph:share-network",
    count: "0.33k",
    icon: "heroicons:arrow-small-down",
  },
  {
    name: "Email Newsletter",
    flag: "ph:chat-text",
    count: "31.12k",
    icon: "heroicons:arrow-small-up",
  },
  {
    name: "Referrals",
    flag: "ph:arrow-square-out",
    count: "890",
    icon: "heroicons:arrow-small-down",
  },
  {
    name: "ADVT",
    flag: "ph:percent",
    count: "765",
    icon: "heroicons:arrow-small-up",
  },
  {
    name: "Other",
    flag: "ph:star-four",
    count: "3.4k",
    icon: "heroicons:arrow-small-up",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  // Boutons d'accès rapide
  const quickAccessButtons = [
    {
      title: "Gestion des Produits",
      description: "Ajouter, modifier et gérer vos produits",
      icon: "ph:package",
      color: "bg-blue-500",
      link: "/produits",
    },
    {
      title: "Gestion des Fournisseurs",
      description: "Gérer vos fournisseurs et contacts",
      icon: "ph:truck",
      color: "bg-green-500",
      link: "/fournisseurs",
    },
    {
      title: "Gestion des Stocks",
      description: "Suivre et gérer vos stocks",
      icon: "ph:warehouse",
      color: "bg-purple-500",
      link: "/stocks",
    },
  ];

  return (
    <div className=" space-y-5">
      {/* Section d'accès rapide */}
      {/* <Card title="Accès Rapide" className="mb-6">
        <div className="grid xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
          {quickAccessButtons.map((button, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(button.link)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`h-10 w-10 rounded-full ${button.color} text-white text-xl flex items-center justify-center`}>
                  <Icon icon={button.icon} />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {button.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {button.description}
              </p>
              <div className="mt-3">
                <Button
                  text="Accéder"
                  className="btn-outline-primary btn-sm w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(button.link);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card> */}

      {/* Statistiques existantes */}
      <div className="grid xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5">
        {dashboardStats.map((stat, index) => (
          <Card key={index}>
            <div>
              <div className="flex">
                <div className="flex-1 text-base font-medium">{stat.title}</div>
                <div className="flex-none">
                  <div className={`h-10 w-10 rounded-full ${stat.color} text-white text-2xl flex items-center justify-center`}>
                    <Icon icon={stat.icon} />
                  </div>
                </div>
              </div>
              <div>
                <span className=" text-2xl font-medium text-gray-800  dark:text-white">
                  {stat.value}
                </span>
                <span className="  space-x-2 block mt-4 ">
                  <span className={`badge ${stat.changeType === 'increase' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {stat.change}
                  </span>
                  <span className=" text-sm text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </span>
                </span>
              </div>
            </div>
          </Card>
        ))}



      </div>

      {/* Section Ventes Récentes et Produits Populaires */}
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
        <Card title="Ventes Récentes">
          <div className="space-y-4">
            {recentSales.map((sale, i) => (
              <div
                className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0 last:pb-0"
                key={i}
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {sale.customer}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {sale.id} • {sale.time}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {sale.amount}
                  </div>
                  <span className={`badge ${sale.status === 'Payé' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {sale.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Produits Populaires">
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div
                className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0 last:pb-0"
                key={i}
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {product.sales} ventes
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {product.revenue}
                  </div>
                  <div
                    className={`text-xs ${
                      product.trend === "up"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    <Icon icon={product.trend === "up" ? "heroicons:arrow-small-up" : "heroicons:arrow-small-down"} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* end grid */}
      <div className="grid   grid-cols-12 gap-5">
        <div className="xl:col-span-7 col-span-12">
          <Card
            className="!bg-indigo-500 "
            title="Sell History"
            titleClass="!text-white"
            noborder
          >
            <History />
          </Card>
        </div>
        <div className="xl:col-span-5 col-span-12">
          <Card title="Support Tracker" subscribe>
            <RadarChart />

            <div className="grid  grid-cols-3 gap-2 py-4">
              <div className=" text-center">
                <div>
                  <div className="h-10 w-10 mb-2 mx-auto rounded-md bg-indigo-500/10 text-indigo-500 text-xl flex items-center justify-center">
                    <Icon icon="ph:ticket" />
                  </div>
                </div>
                <div>
                  <div className=" font-medium text-gray-800 dark:text-white text-sm truncate mb-[2px]">
                    New Tickets
                  </div>
                  <div className=" text-xs text-gray-400">100</div>
                </div>
              </div>
              {/* end single */}
              <div className=" text-center">
                <div>
                  <div className="h-10 w-10 mb-2 mx-auto rounded-md bg-green-500/10 text-green-500 text-xl flex items-center justify-center">
                    <Icon icon="ph:check" />
                  </div>
                </div>
                <div>
                  <div className=" font-medium text-gray-800 dark:text-white text-sm truncate mb-[2px]">
                    Open Tickets
                  </div>
                  <div className=" text-xs text-gray-400">16</div>
                </div>
              </div>
              {/* end single */}
              <div className=" text-center">
                <div>
                  <div className="h-10 w-10 mb-2 mx-auto rounded-md bg-yellow-500/10 text-yellow-500 text-xl flex items-center justify-center">
                    <Icon icon="ph:clock-countdown" />
                  </div>
                </div>
                <div>
                  <div className=" font-medium text-gray-800 dark:text-white text-sm truncate mb-[2px]">
                    Response Time
                  </div>
                  <div className=" text-xs text-gray-400">1 day</div>
                </div>
              </div>
              {/* end single */}
            </div>
            {/* end support ticket */}
          </Card>
        </div>
      </div>
      {/* end grid */}
      <div className="grid xl:grid-cols-3 gap-5 ">
        <Card title="Top Countries" subtitle="Monthly Sales Overview">
          <ul className=" space-y-4">
            {country?.map((item, i) => (
              <li key={i} className="flex justify-between items-center">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="flex-none">
                    <div className="h-[34px] w-[34px] rounded-full">
                      <img
                        src={item.flag}
                        alt=""
                        className=" w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className=" text-sm ">{item.name}</div>
                  </div>
                </div>
                <div className="text-gray-800 dark:text-white   flex items-center space-x-[2px] rtl:space-x-reverse">
                  <span className=" text-sm  ">{item.count}</span>
                  <Icon
                    icon={item.icon}
                    className={`${
                      item.icon === "heroicons:arrow-small-up"
                        ? " text-green-500 "
                        : " text-red-500"
                    }  text-lg`}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Source Visits" subtitle="28.2k Visitors">
          <ul className=" space-y-4">
            {source?.map((item, i) => (
              <li key={i} className="flex justify-between items-center">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="flex-none">
                    <div className="h-[34px] w-[34px] bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300 flex  items-center justify-center rounded-full">
                      <Icon icon={item.flag} className="text-xl" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className=" text-sm ">{item.name}</div>
                  </div>
                </div>
                <div className="text-gray-800 dark:text-white   flex items-center space-x-[2px] rtl:space-x-reverse">
                  <span className=" text-sm  ">{item.count}</span>
                  <Icon
                    icon={item.icon}
                    className={`${
                      item.icon === "heroicons:arrow-small-up"
                        ? " text-green-500 "
                        : " text-red-500"
                    }  text-lg`}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Total Earning">
          <Earnings />
        </Card>
      </div>
      {/* end grid */}
      <div>
        <div className="card-title mb-5">Latest Order</div>
        <RecentOrderTable />
      </div>
    </div>
  );
};

export default Dashboard;
