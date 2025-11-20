import React, { useState, useMemo, useEffect, Suspense, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import LoadingIcon from "@/components/LoadingIcon";
import { toast } from "react-toastify";
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useSortBy,
} from "react-table";
const ProduitModal = React.lazy(() => import("./ProduitModal"));
import { produitService, authService, imageMetadataService } from "@/services/apiService";
import Modal from "@/components/ui/Modal";
import { getUniteMesureLabel } from "@/constants/produits";

const ProduitsPage = () => {
  // Mini composant pour charger l'image protégée via fetch + token
  const ProduitThumb = ({ produitId, alt }) => {
    const [src, setSrc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
      let objUrl;
      const load = async () => {
        if (!produitId) return;
        try {
          setLoading(true);
          setError(false);
          const url = imageMetadataService.getContentByProduitIdUrl(Number(produitId));
          const token = authService.getAccessToken();
          const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
          if (!resp.ok) {
            setError(true);
            setSrc(null);
            return;
          }
          const blob = await resp.blob();
          objUrl = URL.createObjectURL(blob);
          setSrc(objUrl);
        } catch (e) {
          console.error('Erreur vignette produit:', e);
          setError(true);
          setSrc(null);
        } finally {
          setLoading(false);
        }
      };
      load();
      return () => {
        if (objUrl) URL.revokeObjectURL(objUrl);
      };
    }, [produitId]);

    return (
      <>
        <div
          className={`w-12 h-12 ${src ? 'cursor-zoom-in' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (src && !error) setShow(true);
          }}
          title={src ? 'Agrandir' : ''}
        >
          {src && !error ? (
            <img src={src} alt={alt} className="w-full h-full object-cover rounded" />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
              <Icon icon={loading ? 'ph:spinner-gap' : 'ph:image'} className={`text-gray-400 ${loading ? 'animate-spin text-lg' : ''}`} />
            </div>
          )}
        </div>

        <Modal
          activeModal={show}
          onClose={() => setShow(false)}
          title="Aperçu de l'image"
          className="max-w-4xl"
        >
          <div className="w-full flex items-center justify-center">
            {src ? (
              <img src={src} alt={alt} className="max-h-[80vh] w-auto object-contain rounded" />
            ) : (
              <div className="text-gray-500">Aucune image</div>
            )}
          </div>
        </Modal>
      </>
    );
  };
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduit, setEditingProduit] = useState(null);
  const [produits, setProduits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const DEFAULT_PAGE_SIZE = 50;
  const DEFAULT_SORT = "libelle,asc";

  const buildSearchCriteria = useCallback((term) => {
    const trimmed = term?.trim();
    if (!trimmed) {
      return {};
    }

    return {
      reference: trimmed,
      libelle: trimmed,
    };
  }, []);

  // Fonction pour récupérer tous les produits
  const fetchProduits = useCallback(async (criteria = {}, page = 0) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await produitService.searchProduits(
        criteria,
        page,
        DEFAULT_PAGE_SIZE,
        DEFAULT_SORT
      );

      setProduits(Array.isArray(response) ? response : []);
    } catch (err) {
      setIsError(true);
      setError(err);
      console.error("Erreur lors du chargement des produits:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger les produits au montage du composant
  useEffect(() => {
    fetchProduits(buildSearchCriteria(searchTerm));
  }, [fetchProduits, buildSearchCriteria, searchTerm]);

  // Filtrer les produits selon le terme de recherche
  const filteredProduits = useMemo(() => {
    if (!searchTerm) return produits;
    if (!searchTerm) return produits;
    return produits.filter((produit) => {
      const term = searchTerm.toLowerCase();
      return (
        produit.reference?.toLowerCase().includes(term) ||
        produit.libelle?.toLowerCase().includes(term) ||
        produit.description?.toLowerCase().includes(term) ||
        produit.designation?.toLowerCase().includes(term)
      );
    });
  }, [produits, searchTerm]);

  // Configuration des colonnes du tableau
  const columns = useMemo(
    () => [
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ row }) => {
          const produit = row.original;
          return (
            <ProduitThumb produitId={produit.id} alt={produit.designation || produit.libelle || produit.reference} />
          );
        },
      },
      {
        Header: "Référence",
        accessor: "reference",
        Cell: ({ row }) => (
          <span className="font-medium">{row.original.reference}</span>
        ),
      },
      {
        Header: "Désignation",
        accessor: "designation",
        Cell: ({ row }) => (
          <div className="max-w-xs">
            <div className="font-medium text-gray-900 dark:text-white">
              {row.original.designation || "Non définie"}
            </div>
          </div>
        ),
      },
      {
        Header: "Prix Achat",
        accessor: "prixAchat",
        Cell: ({ row }) => (
          <span className="text-green-600 font-medium">
            {row.original.prixAchat ? `${row.original.prixAchat} dhs` : "-"}
          </span>
        ),
      },
      {
        Header: "Prix Vente",
        accessor: "prixVente",
        Cell: ({ row }) => (
          <span className="text-blue-600 font-medium">
            {row.original.prixVente ? `${row.original.prixVente} dhs` : "-"}
          </span>
        ),
      },
     
      {
        Header: "Dimensions",
        accessor: "dimensions",
        Cell: ({ row }) => {
          const produit = row.original;
          const dimensions = [];

          if (produit.longueurCm) dimensions.push(`L: ${produit.longueurCm}cm`);
          if (produit.largeurCm) dimensions.push(`l: ${produit.largeurCm}cm`);
          if (produit.epaisseurMm) dimensions.push(`E: ${produit.epaisseurMm}mm`);

          return (
            <div className="text-sm">
              {dimensions.length > 0 ? (
                <div>
                  {dimensions.map((dim, index) => (
                    <div key={index} className="text-gray-600">{dim}</div>
                  ))}
                  {produit.format && (
                    <div className="text-blue-600 font-medium mt-1">
                      Format: {produit.format}
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-gray-400">Non défini</span>
              )}
            </div>
          );
        },
      },
      {
        Header: "Fournisseur",
        accessor: "fournisseurRaisonSociale",
        Cell: ({ row }) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {row.original.fournisseurRaisonSociale || "-"}
          </span>
        ),
      },

      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => {
          const produit = row.original;
          return (
            <div className="flex space-x-2">
              <Button
                icon="heroicons:eye"
                className="bg-blue-500 text-white btn-sm"
                onClick={() => navigate(`/produits/${produit.id}`)}
                title="Voir détails"
              />
              
              <Button
                icon="heroicons:pencil-square"
                className="bg-yellow-500 text-white btn-sm"
                onClick={() => handleEdit(produit)}
                title="Modifier"
              />
              <Button
                icon="heroicons:trash"
                className="bg-red-500 text-white btn-sm"
                onClick={() => handleDelete(produit.id)}
                title="Supprimer"
              />
            </div>
          );
        },
      },
    ],
    []
  );

  // Configuration de la table
  const tableInstance = useTable(
    {
      columns,
      data: filteredProduits,
      initialState: {
        pageSize: 10,
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  // Gestionnaires d'événements
  const handleAdd = () => {
    setEditingProduit(null);
    setShowModal(true);
  };

  const handleEdit = (produit) => {
    setEditingProduit(produit);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await produitService.deleteProduit(id);
        toast.success("Produit supprimé avec succès");
        // Recharger la liste des produits
        fetchProduits(buildSearchCriteria(searchTerm));
      } catch (error) {
        toast.error("Erreur lors de la suppression du produit");
        console.error("Erreur:", error);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProduit(null);
  };

  const handleModalSuccess = () => {
    fetchProduits(buildSearchCriteria(searchTerm));
    handleModalClose();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingIcon />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 p-4">
        Erreur lors du chargement des produits: {error?.message}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Card>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">Gestion des Produits</h4>
          <div className="flex space-x-3">
            <div className="flex-1">
              <Textinput
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon="heroicons:magnifying-glass"
              />
            </div>
            <Button
              text="Fournisseurs"
              icon="ph:truck"
              className="btn-outline-primary"
              onClick={() => navigate("/fournisseurs")}
            />
            <Button
              icon="heroicons:plus"
              text="Ajouter Produit"
              className="btn-primary"
              onClick={handleAdd}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                className="min-w-full divide-y divide-gray-100 table-fixed dark:divide-gray-700"
                {...getTableProps()}
              >
                <thead className="bg-gray-100 dark:bg-gray-700">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          className="table-th"
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:divide-gray-700"
                  {...getTableBodyProps()}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()} className="table-td">
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="flex space-x-2 rtl:space-x-reverse items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Aller à la page:
              </span>
              <span>
                <input
                  type="number"
                  className="form-control py-2"
                  defaultValue={pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                    gotoPage(page);
                  }}
                  style={{ width: "50px" }}
                />
              </span>
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Page{" "}
              <span>
                {pageIndex + 1} sur {pageOptions.length}
              </span>
            </span>
          </div>
          <ul className="flex items-center space-x-3 rtl:space-x-reverse">
            <li className="text-xl leading-4 text-gray-900 dark:text-white rtl:rotate-180">
              <button
                className={`${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons-outline:chevron-left" />
              </button>
            </li>
            <li className="text-xl leading-4 text-gray-900 dark:text-white rtl:rotate-180">
              <button
                className={`${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                <Icon icon="heroicons-outline:chevron-right" />
              </button>
            </li>
          </ul>
        </div>
      </Card>

      {/* Modal pour ajouter/modifier un produit */}
      <Suspense fallback={<LoadingIcon />}>
        {showModal && (
          <ProduitModal
            isOpen={showModal}
            onClose={handleModalClose}
            produit={editingProduit}
            onSuccess={handleModalSuccess}
          />
        )}
      </Suspense>
    </div>
  );
};

export default ProduitsPage;
