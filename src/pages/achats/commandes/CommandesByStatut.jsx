import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import CommandeStatusBadge from "@/components/ui/CommandeStatusBadge";
import CommandeStatusFilter from "@/components/ui/CommandeStatusFilter";
import CommandeStatusTransition from "@/components/ui/CommandeStatusTransition";
import LoadingIcon from "@/components/LoadingIcon";
import { toast } from "react-toastify";
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useSortBy,
} from "react-table";
import { commandeFournisseurService } from "@/services/apiService";

const CommandesByStatutPage = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [commandes, setCommandes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [statusCounts, setStatusCounts] = useState({});

  // Récupérer les commandes
  const fetchCommandes = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      let data;
      if (selectedStatus === "ALL") {
        data = await commandeFournisseurService.getAllCommandes(0, 1000);
      } else {
        data = await commandeFournisseurService.getCommandesByStatut(selectedStatus, 0, 1000);
      }
      setCommandes(Array.isArray(data) ? data : []);

      // Calculer les comptes par statut
      if (selectedStatus === "ALL") {
        const counts = {
          ALL: data.length,
          BROUILLON: data.filter((c) => c.statut === "BROUILLON").length,
          PASSEE: data.filter((c) => c.statut === "PASSEE").length,
          PARTIELLE: data.filter((c) => c.statut === "PARTIELLE").length,
          LIVREE: data.filter((c) => c.statut === "LIVREE").length,
          VALIDEE: data.filter((c) => c.statut === "VALIDEE").length,
          ANNULEE: data.filter((c) => c.statut === "ANNULEE").length,
        };
        setStatusCounts(counts);
      }
    } catch (err) {
      setIsError(true);
      setError(err);
      console.error("Erreur lors du chargement des commandes:", err);
      toast.error("Erreur lors du chargement des commandes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, [selectedStatus]);

  // Filtrer les commandes selon le terme de recherche
  const filteredCommandes = useMemo(() => {
    if (!searchTerm) return commandes;
    return commandes.filter(
      (commande) =>
        commande.numeroCommande?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commande.fournisseurRaisonSociale?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [commandes, searchTerm]);

  // Configuration des colonnes du tableau
  const columns = useMemo(
    () => [
      {
        Header: "N° Commande",
        accessor: "numeroCommande",
        Cell: ({ row }) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {row.original.numeroCommande}
          </span>
        ),
      },
      {
        Header: "Fournisseur",
        accessor: "fournisseurRaisonSociale",
        Cell: ({ row }) => (
          <span className="text-gray-700 dark:text-gray-300">
            {row.original.fournisseurRaisonSociale}
          </span>
        ),
      },
      {
        Header: "Date Commande",
        accessor: "dateCommande",
        Cell: ({ row }) => (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(row.original.dateCommande).toLocaleDateString("fr-FR")}
          </span>
        ),
      },
      {
        Header: "Montant",
        accessor: "montantTotal",
        Cell: ({ row }) => (
          <span className="font-semibold text-green-600">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(row.original.montantTotal || 0)}
          </span>
        ),
      },
      {
        Header: "Statut",
        accessor: "statut",
        Cell: ({ row }) => <CommandeStatusBadge statut={row.original.statut} />,
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => {
          const commande = row.original;
          return (
            <div className="flex space-x-2">
              <Button
                icon="heroicons:eye"
                className="bg-blue-500 text-white btn-sm"
                onClick={() => navigate(`/achats/commandes/${commande.id}`)}
                title="Voir détails"
              />
              <CommandeStatusTransition
                commandeId={commande.id}
                currentStatus={commande.statut}
                onStatusChanged={() => fetchCommandes()}
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
      data: filteredCommandes,
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
          onClick={fetchCommandes}
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
            Commandes par Statut
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez vos commandes fournisseurs par statut
          </p>
        </div>
      </div>

      {/* Filtre par statut */}
      <CommandeStatusFilter
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        statusCounts={statusCounts}
      />

      {/* Tableau */}
      <Card noborder>
        <div className="md:flex pb-6 items-center">
          <Textinput
            className="lg:w-[300px]"
            placeholder="Rechercher par numéro ou fournisseur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
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
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Page {pageIndex + 1} sur {pageOptions.length}
            </span>
          </div>
          <div className="flex items-center space-x-2">
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
    </div>
  );
};

export default CommandesByStatutPage;

