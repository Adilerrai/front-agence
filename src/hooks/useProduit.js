import { useState, useEffect, useCallback } from "react";
import { produitService } from "@/services/apiService";

/**
 * Hook personnalisé pour récupérer un produit par son ID
 * @param {string|number} id - L'ID du produit à récupérer
 * @returns {{ produit: any, isLoading: boolean, error: string|null, refetch: () => Promise<void> }}
 */
export const useProduit = (id) => {
  const [produit, setProduit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduit = useCallback(async () => {
    if (!id) {
      setError("ID du produit manquant");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await produitService.getProduitById(id);
      setProduit(data);
    } catch (err) {
      console.error("Erreur lors du chargement du produit:", err);
      setError(err instanceof Error ? err.message : "Erreur lors du chargement du produit");
      setProduit(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduit();
  }, [fetchProduit]);

  return {
    produit,
    isLoading,
    error,
    refetch: fetchProduit,
  };
};

/**
 * Hook personnalisé pour rechercher les produits avec des critères
 * @param {Object} initialCriteria - Critères de recherche initiaux
 * @param {number} initialPage - Page initiale (défaut: 0)
 * @param {number} initialSize - Nombre d'éléments par page (défaut: 10)
 * @param {string} initialSort - Tri initial sous forme "champ,ordre"
 * @returns {Object} - { produits, isLoading, error, page, setPage, size, setSize, sort, setSort, criteria, setCriteria, pageMeta, refetch }
 */
export const useProduits = (
  initialCriteria = {},
  initialPage = 0,
  initialSize = 10,
  initialSort = "libelle,asc"
) => {
  const [produits, setProduits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [criteria, setCriteria] = useState(initialCriteria);
  const [sort, setSort] = useState(initialSort);
  const [pageMeta, setPageMeta] = useState({ totalElements: 0, totalPages: 0 });

  const fetchProduits = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await produitService.searchProduits(
        {
          ...criteria,
          reference: criteria.reference ?? "",
          libelle: criteria.libelle ?? "",
          codeSite: criteria.codeSite ?? null,
          format: criteria.format ?? null,
          qualite: criteria.qualite ?? null,
        },
        page,
        size,
        sort
      );

      setProduits(Array.isArray(response) ? response : []);
      setPageMeta({
        totalElements: response?.totalElements ?? 0,
        totalPages: response?.totalPages ?? 0,
      });
    } catch (err) {
      console.error("Erreur lors du chargement des produits:", err);
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des produits");
      setProduits([]);
      setPageMeta({ totalElements: 0, totalPages: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [criteria, page, size, sort]);

  useEffect(() => {
    fetchProduits();
  }, [fetchProduits]);

  return {
    produits,
    isLoading,
    error,
    page,
    setPage,
    size,
    setSize,
    sort,
    setSort,
    criteria,
    setCriteria,
    pageMeta,
    refetch: fetchProduits,
  };
};


export default useProduit;
