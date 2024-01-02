import React, { useMemo, useState } from "react";
import { useTable, useFilters } from "react-table";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "../../styles/Administrador/Facultades.css";
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

const Facultades = () => {
  const [facultades, setFacultades] = useState([
    {
      edificio: "Facultad 1",
      nombre: "Esfot",
    },
  ]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalEditarIsOpen, setModalEditarIsOpen] = useState(false);
  const [FacultadEditado, setFacultadEditado] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    Swal.fire({
      title: "¿Estás seguro de agregar esta Facultad?",
      showDenyButton: true,
      confirmButtonText: `Continuar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setFacultades([...facultades, data]);
        setModalIsOpen(false);
        toast.success("Facultad agregada exitosamente!");
        reset();
      }
    });
  };

  const editarFacultad = (index) => {
    setFacultadEditado(index);
    setValue("edificio", facultades[index].edificio);
    setValue("nombre", facultades[index].nombre);
    setModalEditarIsOpen(true);
  };

  const onSubmitEditar = (data) => {
    Swal.fire({
      title: "¿Estás seguro de editar esta Facultad?",
      showDenyButton: true,
      confirmButtonText: `Continuar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedFacultades = [...facultades];
        updatedFacultades[FacultadEditado] = data;
        setFacultades(updatedFacultades);
        setModalEditarIsOpen(false);
        toast.success("Facultad editada exitosamente!");
        reset();
      }
    });
  };
  const eliminarFacultad = (index) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar esta Facultad?",
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setFacultades(facultades.filter((_, i) => i !== index));
        toast.error("Facultad eliminada exitosamente!");
      }
    });
  };

  const data = useMemo(() => facultades, [facultades]);

  const columns = useMemo(
    () => [
      {
        Header: "Edificio",
        accessor: "edificio",
      },
      {
        Header: "Nombre",
        accessor: "nombre",
      },
      {
        Header: "Acciones",
        Cell: ({ row: { index } }) => (
          <div>
            <button
              className="botonEyD"
              title="Editar"
              onClick={() => editarFacultad(index)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              className="botonEyD"
              title="Eliminar"
              onClick={() => eliminarFacultad(index)}
            >
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
    <div className="facultades">
      <h2>Facultades</h2>
      <p>
        ¡Bienvenido a la sección de administración de Facultades! Aquí podrás
        administrar y visualizar una lista de facultades en tu aplicación.
        Puedes agregar nuevas facultades, editar sus detalles existentes y
        eliminarlas individualmente. Esta herramienta ofrece una interfaz
        amigable para mantener y actualizar la información de las facultades,
        proporcionando opciones claras para gestionar eficientemente los
        registros en tu sistema.
      </p>
      <br />
      <button onClick={() => setModalIsOpen(true)}>Agregar Facultad</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modalContent"
        overlayClassName="modalOverlay"
      >
        <h2>Agregar nuevo Facultad</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Edificio:
            <input
              className="facultades input modalInput"
              {...register("edificio", { required: true })}
              placeholder="Edificio al que pertenece"
            />
            {errors.edificio && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Nombre:
            <input
              className="facultades input modalInput"
              {...register("nombre", { required: true })}
              placeholder="Nombre"
            />
            {errors.nombre && (
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
      <Modal
        isOpen={modalEditarIsOpen}
        onRequestClose={() => setModalEditarIsOpen(false)}
        className="modalContent"
        overlayClassName="modalOverlay"
      >
        <h2>Editar Facultad</h2>
        <form onSubmit={handleSubmit(onSubmitEditar)}>
          <label>
            Edificio:
            <input
              className="facultades input modalInput"
              {...register("edificio", { required: true })}
              placeholder="Edificio"
            />
            {errors.edificio && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Nombre:
            <input
              className="facultades input modalInput"
              {...register("nombre", { required: true })}
              placeholder="Nombre"
            />
            {errors.nombre && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>

          <div className="btnContainer">
            <button type="submit" className="agregarBtn">
              Editar
            </button>
            <button
              className="cancelarBtn"
              onClick={() => setModalEditarIsOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
      <ToastContainer />
      <div className="tablafacultades">
        <table {...getTableProps()}>
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

export default Facultades;
