import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/Icon";

const QuickAccessFab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const quickLinks = [
    {
      title: "Produits",
      icon: "ph:package",
      color: "bg-blue-500 hover:bg-blue-600",
      link: "/produits",
    },
    {
      title: "Fournisseurs",
      icon: "ph:truck",
      color: "bg-green-500 hover:bg-green-600",
      link: "/fournisseurs",
    },
    {
      title: "Stocks",
      icon: "ph:warehouse",
      color: "bg-purple-500 hover:bg-purple-600",
      link: "/stocks",
    },
  ];

  const handleNavigation = (link) => {
    navigate(link);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Boutons d'accès rapide */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3 mb-2">
          {quickLinks.map((link, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 animate-in slide-in-from-right duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Label */}
              <div className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg">
                {link.title}
              </div>
              
              {/* Bouton */}
              <button
                onClick={() => handleNavigation(link.link)}
                className={`w-12 h-12 rounded-full ${link.color} text-white shadow-lg transform transition-all duration-200 hover:scale-110 flex items-center justify-center`}
                title={link.title}
              >
                <Icon icon={link.icon} className="text-xl" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bouton principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transform transition-all duration-200 flex items-center justify-center ${
          isOpen ? "rotate-45" : "hover:scale-110"
        }`}
        title="Accès rapide"
      >
        <Icon icon={isOpen ? "ph:x" : "ph:grid-four"} className="text-2xl" />
      </button>

      {/* Overlay pour fermer */}
      {isOpen && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default QuickAccessFab;
