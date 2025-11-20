import React, { useState, useMemo, useEffect, Suspense } from "react";
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
import { stockService } from "@/services/apiService";

const StockModal = React.lazy(() => import("./StockModal"));

const StocksPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStock, setEditingStock] = useState(null);

  // Fonction pour récupérer tous les stocks
  const fetchStocks = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      // Utiliser searchStocks avec des critères vides pour récupérer tous les stocks
      const data = await stockService.searchStocks({}, 0, 1000);

      // Vérifier que les données sont dans le bon format
      if (Array.isArray(data)) {
        setStocks(data);
      } else {
        console.warn("Format de données inattendu:", data);
        setStocks([]);
        toast.warning("Aucun stock trouvé ou format de données inattendu");
      }
    } catch (err) {
      setIsError(true);
      setError(err);
      console.error("Erreur lors du chargement des stocks:", err);
      toast.error(`Erreur lors du chargement des stocks: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les stocks au montage du composant
  useEffect(() => {
    fetchStocks();
  }, []);

  // Filtrer les stocks selon le terme de recherche
  const filteredStocks = useMemo(() => {
    if (!searchTerm) return stocks;
    return stocks.filter(
      (stock) =>
        stock.produitLibelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.produitReference?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stocks, searchTerm]);

  // Configuration des colonnes du tableau
  const columns = useMemo(
    () => [
      {
        Header: "Référence",
        accessor: "produitReference",
        Cell: ({ row }) => (
          <span className="font-medium">{row.original.produitReference}</span>
        ),
      },
      {
        Header: "Libellé",
        accessor: "produitLibelle",
        Cell: ({ row }) => (
          <span>{row.original.produitLibelle}</span>
        ),
      },
      {
        Header: "Quantité",
        accessor: "quantite",
        Cell: ({ row }) => (
          <span className="font-semibold text-blue-600">
            {parseFloat(row.original.quantite).toFixed(2)}
          </span>
        ),
      },
      {
        Header: "Stock Min",
        accessor: "stockMin",
        Cell: ({ row }) => (
          <span>{parseFloat(row.original.stockMin).toFixed(2)}</span>
        ),
      },
      {
        Header: "Stock Max",
        accessor: "stockMax",
        Cell: ({ row }) => (
          <span>{parseFloat(row.original.stockMax).toFixed(2)}</span>
        ),
      },
      {
        Header: "Dernière Modification",
        accessor: "dateModification",
        Cell: ({ row }) => (
          <span className="text-sm text-gray-600">
            {new Date(row.original.dateModification).toLocaleDateString('fr-FR')}
          </span>
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => {
          const stock = row.original;
          return (
            <div className="flex space-x-2">
              <Button
                icon="heroicons:pencil-square"
                className="bg-blue-500 text-white btn-sm"
                onClick={() => {
                  setEditingStock(stock);
                  setShowModal(true);
                }}
                title="Modifier"
              />
              <Button
                icon="heroicons:trash"
                className="bg-red-500 text-white btn-sm"
                onClick={() => handleDeleteStock(stock.id)}
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
      data: filteredStocks,
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

  const { pageIndex, pageSize } = state;

  // Gestionnaires d'événements
  const handleDeleteStock = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce stock ?")) {
      try {
        await stockService.deleteStock(id);
        toast.success("Stock supprimé avec succès");
        fetchStocks();
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        toast.error("Erreur lors de la suppression du stock");
      }
    }
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
          onClick={fetchStocks}
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
            Gestion des Stocks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez les stocks de vos produits
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            text="Nouveau Stock"
            icon="ph:plus"
            className="btn-primary"
            onClick={() => {
              setEditingStock(null);
              setShowModal(true);
            }}
          />
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Icon icon="ph:package" className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Stocks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stocks.length}
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Quantité Totale</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stocks.reduce((sum, s) => sum + parseFloat(s.quantite || 0), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Icon icon="ph:warning" className="text-2xl text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Stocks Bas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stocks.filter(s => parseFloat(s.quantite || 0) <= parseFloat(s.stockMin || 0)).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tableau des stocks */}
      <Card title="Liste des Stocks" noborder>
        <div className="md:flex pb-6 items-center">
          <h6 className="flex-1 md:mb-0 mb-3">Stocks</h6>
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
            <span className="flex space-x-2 rtl:space-x-reverse items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Afficher
              </span>
              <span>
                <select
                  className="form-control py-2 w-max"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  {[10, 25, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </span>
            </span>
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

      {/* Modal pour ajouter/modifier un stock */}
      <Suspense fallback={<LoadingIcon />}>
        <StockModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingStock(null);
          }}
          stock={editingStock}
          onSuccess={fetchStocks}
        />
      </Suspense>
    </div>
  );
};

export default StocksPage;
