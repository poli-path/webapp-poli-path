import React, { useMemo, useState } from "react";
import { useTable, useFilters } from "react-table";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import "../../styles/Administrador/Administradores.css";

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
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    Swal.fire({
      title: '¿Estás seguro de agregar este administrador?',
      showDenyButton: true,
      confirmButtonText: `Agregar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setAdministradores([...administradores, data]);
        setModalIsOpen(false);
        toast.success("Administrador agregado exitosamente!");
      }
    })
  };

  const eliminarAdministrador = (index) => {
    Swal.fire({
      title: '¿Estás seguro de eliminar este administrador?',
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setAdministradores(administradores.filter((_, i) => i !== index));
        toast.error("Administrador eliminado exitosamente!");
      }
    })
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
            <button onClick={() => eliminarAdministrador(index)}>Borrar</button>
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
        ¡Bienvenido a la sección de administración de usuarios! Aquí encontrarás
        una lista completa de todos los usuarios registrados, proporcionándote
        una visión integral de nuestra creciente comunidad. Puedes utilizar esta
        lista para identificar tendencias, entender mejor a nuestra base de
        usuarios y tomar decisiones informadas para mejorar nuestra aplicación.
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
              {...register('col1', { required: true })}
              placeholder="Nombre"
            />
            {errors.col1 && <p>Este campo es requerido</p>}
          </label>
          <label>
            Apellido:
            <input
              className="administradores input modalInput"
              {...register('col2', { required: true })}
              placeholder="Apellido"
            />
            {errors.col2 && <p>Este campo es requerido</p>}
          </label>
          <label>
            Email:
            <input
              className="administradores input modalInput"
              {...register('col3', { required: true })}
              placeholder="Email"
            />
            {errors.col3 && <p>Este campo es requerido</p>}
          </label>
          <div className="btnContainer">
            <button type="submit" className="agregarBtn">Agregar</button>
            <button className="cancelarBtn" onClick={() => setModalIsOpen(false)}>
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
