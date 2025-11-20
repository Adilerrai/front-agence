import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import LoadingIcon from "@/components/LoadingIcon";
import { toast } from "react-toastify";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import { receptionFournisseurService } from "@/services/apiService";
import { formatDateTime } from "@/constants/commandes";
import { STATUT_RECEPTION_COLORS } from "@/constants/receptions";

const ReceptionsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [receptions, setReceptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const fetchReceptions = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      // Récupérer toutes les réceptions fournisseur
      const data = await receptionFournisseurService.getAllReceptions();
      setReceptions(Array.isArray(data) ? data : []);
    } catch (err) {
      setIsError(true);
      setError(err);
      console.error("Erreur lors du chargement des réceptions:", err);

      // Fallback : afficher une liste vide en cas d'erreur JSON
      if (err.message && err.message.includes('JSON')) {
        setReceptions([]);
        setIsError(false); // Ne pas afficher l'erreur pour les problèmes JSON
        toast.error("Problème de données côté serveur. Liste vide affichée.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReceptions();
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm) return receptions;
    return receptions.filter((l) =>
      [
        l.numeroReception,
        l.fournisseurRaisonSociale,
        l.numeroBonLivraisonFournisseur,
        l.numeroFactureFournisseur,
      ]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [receptions, searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette réception ?")) return;
    try {
      await receptionFournisseurService.annulerReception(id);
      toast.success("Réception annulée");
      fetchReceptions();
    } catch (e) {
      toast.error("Erreur lors de l'annulation");
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "N° Réception",
        accessor: "numeroReception",
        Cell: ({ row }) => (
          <div>
            <span className="font-medium text-gray-900 dark:text-white">
              {row.original.numeroReception}
            </span>
            <div className="text-xs text-gray-500">ID: {row.original.id}</div>
          </div>
        ),
      },
      {
        Header: "Fournisseur",
        accessor: "fournisseurRaisonSociale",
      },
      {
        Header: "Date réception",
        accessor: "dateReception",
        Cell: ({ row }) => (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {formatDateTime(row.original.dateReception)}
          </span>
        ),
      },
      {
        Header: "Statut",
        accessor: "statut",
        Cell: ({ row }) => (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUT_RECEPTION_COLORS[row.original.statut] || 'bg-gray-100 text-gray-800'}`}>
            {row.original.statut}
          </span>
        ),
      },
      {
        Header: "Montant",
        accessor: "montantTotal",
        Cell: ({ row }) => (
          <span className="text-sm font-medium">{row.original.montantTotal?.toFixed(2) || '0.00'} DH</span>
        ),
      },
      {
        Header: "Lignes",
        accessor: "lignes",
        Cell: ({ row }) => (
          <span className="text-sm">{row.original.lignes?.length || 0}</span>
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <Button
              icon="ph:eye"
              className="bg-blue-500 text-white btn-sm"
              onClick={() => navigate(`/achats/receptions/${row.original.id}`)}
              title="Voir détails"
            />
            <Button
              icon="ph:pencil"
              className="bg-yellow-500 text-white btn-sm"
              onClick={() => navigate(`/achats/receptions/${row.original.id}/edit`)}
              title="Modifier"
            />
            <Button
              icon="ph:trash"
              className="bg-red-500 text-white btn-sm"
              onClick={() => handleDelete(row.original.id)}
              title="Annuler"
            />
          </div>
        ),
      },
    ],
    [navigate]
  );

  const tableInstance = useTable(
    {
      columns,
      data: filtered,
      initialState: { pageSize: 10 },
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
        <Button text="Réessayer" className="btn-primary" onClick={fetchReceptions} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Réceptions Fournisseur</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enregistrez et consultez les réceptions de marchandises des fournisseurs
          </p>
        </div>
        <Button
          text="Nouvelle Réception"
          icon="ph:plus"
          className="btn-success"
          onClick={() => navigate("/achats/receptions/nouvelle")}
        />
      </div>

      {/* Tableau */}
      <Card title="Liste des Réceptions" noborder>
        <div className="md:flex pb-6 items-center">
          <h6 className="flex-1 md:mb-0 mb-3">Réceptions</h6>
          <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
            <Textinput
              className="lg:w-[300px]"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed" {...getTableProps()}>
                <thead className="bg-gray-50 dark:bg-gray-700">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())} className="table-th">
                          {column.render("Header")}
                          <span>
                            {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700" {...getTableBodyProps()}>
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
              Page <span>{pageIndex + 1} sur {pageOptions.length}</span>
            </span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button text="Précédent" className="btn-outline-light" disabled={!canPreviousPage} onClick={() => previousPage()} />
            <Button text="Suivant" className="btn-outline-light" disabled={!canNextPage} onClick={() => nextPage()} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReceptionsPage;
