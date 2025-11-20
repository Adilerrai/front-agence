import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Icon from "@/components/ui/Icon";
import { toast } from "react-toastify";
import { commandeFournisseurService } from "@/services/apiService";

/**
 * Composant pour gérer la transition de statut d'une commande
 * @param {number} commandeId - ID de la commande
 * @param {string} currentStatus - Statut actuel
 * @param {function} onStatusChanged - Callback après changement de statut
 */
const CommandeStatusTransition = ({ commandeId, currentStatus, onStatusChanged }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Définir les transitions possibles selon le statut actuel
  const getAvailableTransitions = () => {
    const transitions = {
      BROUILLON: ["PASSEE", "ANNULEE"],
      PASSEE: ["PARTIELLE", "LIVREE", "ANNULEE"],
      PARTIELLE: ["LIVREE", "ANNULEE"],
      LIVREE: ["VALIDEE", "ANNULEE"],
      VALIDEE: ["ANNULEE"],
      ANNULEE: [],
    };
    return transitions[currentStatus] || [];
  };

  const statusLabels = {
    BROUILLON: "Brouillon",
    PASSEE: "Passée",
    PARTIELLE: "Partiellement livrée",
    LIVREE: "Livrée",
    VALIDEE: "Validée",
    ANNULEE: "Annulée",
  };

  const statusIcons = {
    BROUILLON: "ph:file-text",
    PASSEE: "ph:paper-plane",
    PARTIELLE: "ph:truck",
    LIVREE: "ph:check-circle",
    VALIDEE: "ph:seal-check",
    ANNULEE: "ph:x-circle",
  };

  const availableTransitions = getAvailableTransitions();

  const handleStatusChange = async (newStatus) => {
    setIsLoading(true);
    try {
      await commandeFournisseurService.updateStatut(commandeId, newStatus);
      toast.success(`Statut changé en ${statusLabels[newStatus]}`);
      setIsOpen(false);
      setSelectedStatus(null);
      if (onStatusChanged) {
        onStatusChanged(newStatus);
      }
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      toast.error("Erreur lors du changement de statut");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertToReception = async () => {
    if (currentStatus !== "LIVREE") {
      toast.error("Seules les commandes livrées peuvent être converties en réception");
      return;
    }

    setIsLoading(true);
    try {
      const receptionId = await commandeFournisseurService.convertToReception(commandeId);
      toast.success(`Réception créée avec succès (ID: ${receptionId})`);
      setIsOpen(false);
      if (onStatusChanged) {
        onStatusChanged("LIVREE");
      }
    } catch (error) {
      console.error("Erreur lors de la conversion:", error);
      toast.error("Erreur lors de la conversion en réception");
    } finally {
      setIsLoading(false);
    }
  };

  if (availableTransitions.length === 0 && currentStatus !== "LIVREE") {
    return null;
  }

  return (
    <>
      <Button
        icon="ph:arrow-right"
        text="Changer le statut"
        className="bg-indigo-600 text-white btn-sm"
        onClick={() => setIsOpen(true)}
      />

      <Modal
        title="Changer le statut de la commande"
        activeModal={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedStatus(null);
        }}
        className="max-w-md"
      >
        <div className="space-y-4">
          {/* Statut actuel */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Statut actuel</p>
            <div className="flex items-center space-x-2">
              <Icon icon={statusIcons[currentStatus]} className="text-xl" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {statusLabels[currentStatus]}
              </span>
            </div>
          </div>

          {/* Transitions disponibles */}
          {availableTransitions.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Transitions disponibles
              </p>
              <div className="space-y-2">
                {availableTransitions.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                      selectedStatus === status
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:border-indigo-400"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon icon={statusIcons[status]} className="text-lg" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {statusLabels[status]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bouton Convertir en réception */}
          {currentStatus === "LIVREE" && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
              <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
                ✨ Action spéciale disponible
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                Convertir cette commande en réception fournisseur
              </p>
              <Button
                text="Convertir en réception"
                icon="ph:arrow-right"
                className="w-full bg-green-600 text-white"
                onClick={handleConvertToReception}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex space-x-3 pt-4">
            <Button
              text="Annuler"
              className="flex-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              onClick={() => {
                setIsOpen(false);
                setSelectedStatus(null);
              }}
              disabled={isLoading}
            />
            {selectedStatus && (
              <Button
                text="Confirmer"
                className="flex-1 bg-indigo-600 text-white"
                onClick={() => handleStatusChange(selectedStatus)}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CommandeStatusTransition;

