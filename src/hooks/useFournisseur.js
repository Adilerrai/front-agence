import { useState, useEffect } from "react";
import { fournisseurService } from "@/services/apiService";

export const useFournisseur = (id) => {
  const [fournisseur, setFournisseur] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFournisseur = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await fournisseurService.getFournisseurById(id);
        setFournisseur(data);
      } catch (err) {
        setError(err);
        console.error("Erreur lors du chargement du fournisseur:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFournisseur();
  }, [id]);

  const refetch = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await fournisseurService.getFournisseurById(id);
      setFournisseur(data);
    } catch (err) {
      setError(err);
      console.error("Erreur lors du rechargement du fournisseur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fournisseur,
    isLoading,
    error,
    refetch,
  };
};

export const useFournisseurs = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFournisseurs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fournisseurService.searchFournisseurs({}, 0, 1000);
      setFournisseurs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
      console.error("Erreur lors du chargement des fournisseurs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const refetch = () => {
    fetchFournisseurs();
  };

  const addFournisseur = async (fournisseurData) => {
    try {
      const newFournisseur = await fournisseurService.createFournisseur(fournisseurData);
      setFournisseurs(prev => [...prev, newFournisseur]);
      return newFournisseur;
    } catch (err) {
      console.error("Erreur lors de l'ajout du fournisseur:", err);
      throw err;
    }
  };

  const updateFournisseur = async (id, fournisseurData) => {
    try {
      const updatedFournisseur = await fournisseurService.updateFournisseur(id, fournisseurData);
      setFournisseurs(prev => 
        prev.map(f => f.id === id ? updatedFournisseur : f)
      );
      return updatedFournisseur;
    } catch (err) {
      console.error("Erreur lors de la mise à jour du fournisseur:", err);
      throw err;
    }
  };

  const deleteFournisseur = async (id) => {
    try {
      await fournisseurService.deleteFournisseur(id);
      setFournisseurs(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression du fournisseur:", err);
      throw err;
    }
  };

  return {
    fournisseurs,
    isLoading,
    error,
    refetch,
    addFournisseur,
    updateFournisseur,
    deleteFournisseur,
  };
};
