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
import { clientService } from "@/services/apiService";

const ClientsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour récupérer tous les clients
  const fetchClients = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      // Utiliser searchClients avec des critères vides pour récupérer tous les clients
      const data = await clientService.searchClients({}, 0, 1000);
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      setIsError(true);
      setError(err);
      console.error("Erreur lors du chargement des clients:", err);
      toast.error("Erreur lors du chargement des clients");
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les clients au montage du composant
  useEffect(() => {
    fetchClients();
  }, []);

  // Filtrer les clients selon le terme de recherche
  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    return clients.filter(
      (client) =>
        client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.telephone.includes(searchTerm)
    );
  }, [clients, searchTerm]);

  // Configuration du tableau
  const columns = useMemo(
    () => [
      {
        Header: "Nom",
        accessor: "nom",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Téléphone",
        accessor: "telephone",
      },
      {
        Header: "Ville",
        accessor: "ville",
      },
      {
        Header: "Statut",
        accessor: "statut",
        Cell: ({ value }) => (
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              value === "Actif"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Actions",
        accessor: "id",
        Cell: ({ value }) => (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/clients/${value}`)}
              className="text-blue-600 hover:text-blue-800"
              title="Voir détails"
            >
              <Icon icon="ph:eye" />
            </button>
            <button
              onClick={() => handleDelete(value)}
              className="text-red-600 hover:text-red-800"
              title="Supprimer"
            >
              <Icon icon="ph:trash" />
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageCount,
  } = useTable(
    {
      columns,
      data: filteredClients,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        await clientService.deleteClient(id);
        setClients(clients.filter((c) => c.id !== id));
        toast.success("Client supprimé avec succès");
      } catch (err) {
        console.error("Erreur lors de la suppression du client:", err);
        toast.error("Erreur lors de la suppression du client");
      }
    }
  };

  return (
    <div className="space-y-5">
      <Card title="Gestion des Clients">
        <div className="flex justify-between items-center mb-6">
          <Textinput
            name="search"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="ph:magnifying-glass"
          />
          <Button
            text="Ajouter Client"
            icon="ph:plus"
            className="btn-primary"
            onClick={() => toast.info("Fonctionnalité à implémenter")}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingIcon />
          </div>
        ) : isError ? (
          <div className="text-red-600 text-center py-8">
            Erreur lors du chargement des clients
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table {...getTableProps()} className="w-full">
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr
                      {...headerGroup.getHeaderGroupProps()}
                      className="border-b border-gray-200"
                    >
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
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
                <tbody {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Page {pageIndex + 1} sur {pageCount}
              </div>
              <div className="flex gap-2">
                <Button
                  text="Précédent"
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                  className="btn-secondary"
                />
                <Button
                  text="Suivant"
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                  className="btn-secondary"
                />
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ClientsPage;

