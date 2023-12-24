import React, { useMemo } from "react";
import { useTable, useFilters } from "react-table";
import "../../styles/Administrador/Usuarios.css";

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
  const data = useMemo(
    () => [
      {
        col1: "Usuario 1",
        col2: "Apellido 1",
        col3: "usuario1@example.com",
        col4: "Punto 1, Punto 2",
      },
      {
        col1: "Usuario 2",
        col2: "Apellido 2",
        col3: "usuario2@example.com",
        col4: "Punto 3, Punto 4",
      },
      {
        col1: "Usuario 3",
        col2: "Apellido 3",
        col3: "usuario3@example.com",
        col4: "Punto 5, Punto 6",
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: "Nombre",
        accessor: "col1", // accessor is the "key" in the data
      },
      {
        Header: "Apellido",
        accessor: "col2",
      },
      {
        Header: "Email",
        accessor: "col3",
      },
      {
        Header: "Puntos de Interés",
        accessor: "col4",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        defaultColumn: { Filter: TextFilter }, // Añade esto
      },
      useFilters // Añade esto
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
        {" "}
        {/* Añade este div */}
        <table {...getTableProps()} style={{ borderRadius: "50px 50px 25px 25px" }}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                    {/* Añade esto */}
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
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
      </div>{" "}
      {/* Cierra el div */}
    </div>
  );
};

export default Usuarios;
