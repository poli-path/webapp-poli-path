import React, { useMemo, useState } from "react";
import { useTable, useFilters } from "react-table";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "../../styles/Administrador/Administradores.css";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

Modal.setAppElement("#root");

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

const Administradores = () => {
  const [administradores, setAdministradores] = useState([
    {
      col1: "Administrador 1",
      col2: "Apellido 1",
      col3: "admin1@example.com",
    },
  ]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    Swal.fire({
      title: "¿Estás seguro de agregar este administrador?",
      showDenyButton: true,
      confirmButtonText: `Continuar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setAdministradores([...administradores, data]);
        setModalIsOpen(false);
        toast.success("Administrador agregado exitosamente!");
        reset(); // Esta línea reinicia los campos del formulario
      }
    });
  };

  const eliminarAdministrador = (index) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar este administrador?",
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setAdministradores(administradores.filter((_, i) => i !== index));
        toast.error("Administrador eliminado exitosamente!");
      }
    });
  };

  const data = useMemo(() => administradores, [administradores]);

  const columns = useMemo(
    () => [
      {
        Header: "Nombre",
        accessor: "col1",
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
        Header: "Acciones",
        Cell: ({ row: { index } }) => (
          <div>
            <button
              className="botonEyD"
              title="Eliminar"
              onClick={() => eliminarAdministrador(index)}
            >
              {" "}
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        defaultColumn: { Filter: TextFilter },
      },
      useFilters
    );

  return (
    <div className="administradores">
      <h2>Administradores</h2>
      <br />
      <p>
        ¡Bienvenido a la sección de administración de Administradores! Aquí podrás
        ver y gestionar una lista de administradores en la aplicación. Puedes
        agregar nuevos administradores introduciendo sus detalles en un
        formulario, eliminar registros existentes y buscar información
        específica utilizando la función de búsqueda. Es una herramienta simple
        pero poderosa para controlar y mantener a los administradores de la
        aplicación de manera eficiente.
      </p>
      <br />
      <button onClick={() => setModalIsOpen(true)}>
        Agregar Administrador
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modalContent"
        overlayClassName="modalOverlay"
      >
        <h2>Agregar nuevo administrador</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Nombre:
            <input
              className="administradores input modalInput"
              {...register("col1", { required: true })}
              placeholder="Nombre"
            />
            {errors.col1 && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Apellido:
            <input
              className="administradores input modalInput"
              {...register("col2", { required: true })}
              placeholder="Apellido"
            />
            {errors.col2 && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Email:
            <input
              className="administradores input modalInput"
              {...register("col3", { required: true })}
              placeholder="Email"
            />
            {errors.col3 && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <div className="btnContainer">
            <button type="submit" className="agregarBtn">
              Agregar
            </button>
            <button
              className="cancelarBtn"
              onClick={() => setModalIsOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
      <ToastContainer />
      <div className="tablaAdministradores">
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
      </div>
    </div>
  );
};

export default Administradores;
