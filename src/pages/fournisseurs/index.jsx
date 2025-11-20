import React, { useState, useMemo, useEffect } from "react";
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
import { fournisseurService } from "@/services/apiService";
import FournisseurModal from "./FournisseurModal";

const FournisseursPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingFournisseur, setEditingFournisseur] = useState(null);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour récupérer tous les fournisseurs
  const fetchFournisseurs = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      // Utiliser searchFournisseurs avec des critères vides pour récupérer tous les fournisseurs
      const data = await fournisseurService.searchFournisseurs({}, 0, 1000);
      setFournisseurs(Array.isArray(data) ? data : []);
    } catch (err) {
      setIsError(true);
      setError(err);
      console.error("Erreur lors du chargement des fournisseurs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les fournisseurs au montage du composant
  useEffect(() => {
    fetchFournisseurs();
  }, []);

  // Filtrer les fournisseurs selon le terme de recherche
  const filteredFournisseurs = useMemo(() => {
    if (!searchTerm) return fournisseurs;
    return fournisseurs.filter(
      (fournisseur) =>
        fournisseur.raisonSociale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fournisseur.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fournisseur.contactPrincipal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fournisseur.telephone?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [fournisseurs, searchTerm]);

  // Configuration des colonnes du tableau
  const columns = useMemo(
    () => [
      {
        Header: "Raison Sociale",
        accessor: "raisonSociale",
        Cell: ({ row }) => (
          <div>
            <span className="font-medium text-gray-900 dark:text-white">
              {row.original.raisonSociale}
            </span>
          </div>
        ),
      },
      {
        Header: "Contact Principal",
        accessor: "contactPrincipal",
        Cell: ({ row }) => (
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {row.original.contactPrincipal || "-"}
            </div>
            <div className="text-sm text-gray-500">
              {row.original.email || "-"}
            </div>
          </div>
        ),
      },
      {
        Header: "Téléphone",
        accessor: "telephone",
        Cell: ({ row }) => (
          <span className="text-gray-600 dark:text-gray-300">
            {row.original.telephone || "-"}
          </span>
        ),
      },
      {
        Header: "Ville",
        accessor: "ville",
        Cell: ({ row }) => (
          <div className="max-w-xs truncate text-gray-600 dark:text-gray-300">
            {row.original.ville || "-"}
          </div>
        ),
      },
   
      {
        Header: "Statut",
        accessor: "actif",
        Cell: ({ row }) => (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              row.original.actif
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {row.original.actif ? "Actif" : "Inactif"}
          </span>
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => {
          const fournisseur = row.original;
          return (
            <div className="flex space-x-2">
              <Button
                icon="heroicons:eye"
                className="bg-blue-500 text-white btn-sm"
                onClick={() => navigate(`/fournisseurs/${fournisseur.id}`)}
                title="Voir détails"
              />
              <Button
                icon="heroicons:pencil-square"
                className="bg-yellow-500 text-white btn-sm"
                onClick={() => handleEdit(fournisseur)}
                title="Modifier"
              />
              <Button
                icon="heroicons:trash"
                className="bg-red-500 text-white btn-sm"
                onClick={() => handleDelete(fournisseur.id)}
                title="Supprimer"
              />
            </div>
          );
        },
      },
    ],
    [navigate]
  );

  // Configuration de la table
  const tableInstance = useTable(
    {
      columns,
      data: filteredFournisseurs,
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
    prepareRow,
  } = tableInstance;

  const { pageIndex } = state;

  // Gestionnaires d'événements
  const handleAdd = () => {
    setEditingFournisseur(null);
    setShowModal(true);
  };

  const handleEdit = (fournisseur) => {
    setEditingFournisseur(fournisseur);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?")) {
      try {
        await fournisseurService.deleteFournisseur(id);
        toast.success("Fournisseur supprimé avec succès");
        fetchFournisseurs();
      } catch (error) {
        toast.error("Erreur lors de la suppression du fournisseur");
        console.error("Erreur:", error);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingFournisseur(null);
  };

  const handleModalSuccess = () => {
    fetchFournisseurs();
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
      <div className="flex flex-col items-center justify-center h-64">
        <Icon icon="ph:warning-circle" className="text-6xl text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Erreur lors du chargement
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {error?.message || "Une erreur est survenue"}
        </p>
        <Button
          text="Réessayer"
          className="btn-primary"
          onClick={fetchFournisseurs}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des Fournisseurs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez vos fournisseurs et leurs informations
          </p>
        </div>
        <Button
          text="Ajouter Fournisseur"
          icon="ph:plus"
          className="btn-primary"
          onClick={handleAdd}
        />
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Icon icon="ph:users" className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Fournisseurs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {fournisseurs.length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Icon icon="ph:check-circle" className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fournisseurs Actifs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {fournisseurs.filter(f => f.actif).length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Icon icon="ph:x-circle" className="text-2xl text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fournisseurs Inactifs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {fournisseurs.filter(f => !f.actif).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tableau des fournisseurs */}
      <Card title="Liste des Fournisseurs" noborder>
      

        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed"
                {...getTableProps()}
              >
                <thead className="bg-gray-50 dark:bg-gray-700">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(column.getSortByToggleProps())}
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
                  className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
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
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Page{" "}
              <span>
                {pageIndex + 1} sur {pageOptions.length}
              </span>
            </span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button
              text="Précédent"
              className="btn-outline-light"
              disabled={!canPreviousPage}
              onClick={() => previousPage()}
            />
            <Button
              text="Suivant"
              className="btn-outline-light"
              disabled={!canNextPage}
              onClick={() => nextPage()}
            />
          </div>
        </div>
      </Card>

      {/* Modal pour ajouter/modifier un fournisseur */}
      <FournisseurModal
        isOpen={showModal}
        onClose={handleModalClose}
        fournisseur={editingFournisseur}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default FournisseursPage;
