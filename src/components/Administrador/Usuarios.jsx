import { useTable, usePagination, useFilters } from "react-table";
import "../../styles/Administrador/Usuarios.css";
import React, { useMemo, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ClipLoader from "react-spinners/ClipLoader";
import Defaultimg from "../../assets/Default.webp";

function TextFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Buscar ${count} registros...`}
    />
  );
}

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [defaultPageSize, setDefaultPageSize] = useState(5); // Cambia el nombre de la variable de estado a defaultPageSize

  useEffect(() => {
    const fetchUsuarios = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/users`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const modifiedUsers = response.data.map((user) => ({
            ...user,
            favoriteBuildings: user.favoriteBuildings.map((building) => ({
              no: building.no,
              name: building.name,
            })),
          }));
          const filteredUsers = modifiedUsers.filter(
            (user) => !user.roles.includes("admin")
          );
          setUsuarios(filteredUsers);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching users:", error);
          setLoading(false);
        }
      }
    };

    fetchUsuarios();
  }, []);
  const data = useMemo(() => usuarios, [usuarios]);

  const columns = useMemo(
    () => [
      {
        Header: "Foto",
        accessor: "imageUrl", // Key para la imagen
        Cell: ({ value }) => (
          <img
            src={value || Defaultimg}
            alt="Avatar"
            style={{ width: "50px", height: "50px", borderRadius: "50%",
            objectFit: 'cover'  }}
          />
        ),
        disableFilters: true, // Deshabilita los filtros para esta columna
      },
      {
        Header: "Nombre",
        accessor: "name",
      },
      {
        Header: "Apellido",
        accessor: "lastname",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Estado",
        accessor: "isActive",
        Cell: ({ value }) => (
          <span className={value ? "activo" : "inactivo"}>
            {value ? "Activo" : "Inactivo"}
          </span>
        ),
        disableFilters: true, // Deshabilita los filtros para esta columna
      },
      {
        Header: "Fecha de Registro",
        accessor: "registerDate",
      },
      {
        Header: "Favoritos",
        accessor: "favoriteBuildings",
        Cell: ({ value }) => (
          <div>
            {value.length > 0 ? (
              value.map((building) => (
                <div key={building.no}>
                  Edificio {building.no}. {building.name}
            <br />
            <br />
                </div>
                
              ))
            ) : (
              <p className="requerido">No existen edificios favoritos aún</p>
            )}
          </div>
        ),
        disableFilters: true,

      },
      
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: TextFilter },
      initialState: { pageIndex: pageNumber, pageSize: defaultPageSize },
    },
    useFilters,
    usePagination
  );

  return (
    <div className="usuarios">
      <h2>Usuarios</h2>
      <br />
      <p>
        ¡Bienvenido a la sección de administración de usuarios! Aquí encontrarás
        una lista completa de todos los usuarios registrados, proporcionándote
        una visión integral de nuestra creciente comunidad. Puedes utilizar esta
        lista para identificar tendencias, entender mejor a nuestra base de
        usuarios y tomar decisiones informadas para mejorar nuestra aplicación.
      </p>
      <br />
      <div className="tablaUsuarios">
        {loading ? (
          <div className="botones">
            <ClipLoader color="#3d8463" loading={loading} size={"90px"} />
            <div style={{ fontSize: "30px" }}>
              Actualizando Datos de la Tabla...
            </div>
          </div>
        ) : (
          <>
            <table
              {...getTableProps()}
              style={{ borderRadius: "50px 50px 25px 25px" }}
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        {column.render("Header")}
                        <div>
                          {column.canFilter ? column.render("Filter") : null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
      <div className="botones2">
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="pagination-button"
        >
          {"<"}
        </button>{" "}
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="pagination-button"
        >
          {">"}
        </button>{" "}
        <span>
          Página{" "}
          <strong>
            {pageIndex + 1} de {pageCount}
          </strong>{" "}
        </span>
        <span>
          | Ir a la página:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              let pageNumber = e.target.value ? Number(e.target.value) : 1;
              pageNumber = Math.min(Math.max(pageNumber, 1), pageCount || 1); // Limita el valor entre 1 y pageCount o 1 si pageCount no está disponible
              pageNumber -= 1;
              gotoPage(pageNumber);
              setPageNumber(pageNumber);
            }}
            style={{ width: "75px" }}
            min={1}
            max={pageCount || 1}
          />
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Mostrar {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Usuarios;
