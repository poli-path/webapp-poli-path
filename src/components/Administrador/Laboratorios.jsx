import React, { useMemo, useState } from "react";
import { useTable, useFilters } from "react-table";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "../../styles/Administrador/Laboratorios.css";
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

const Laboratorios = () => {
  const [Laboratorios, setLaboratorios] = useState([
    {
      edificio: "Laboratorio 1",
      nombre: "Laboratorio de Ciencias",
    },
  ]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalEditarIsOpen, setModalEditarIsOpen] = useState(false);
  const [LaboratorioEditado, setLaboratorioEditado] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    Swal.fire({
      title: "¿Estás seguro de agregar este Laboratorio?",
      showDenyButton: true,
      confirmButtonText: `Continuar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setLaboratorios([...Laboratorios, data]);
        setModalIsOpen(false);
        toast.success("Laboratorio agregado exitosamente!");
        reset();
      }
    });
  };

  const editarLaboratorio = (index) => {
    setLaboratorioEditado(index);
    setValue("edificio", Laboratorios[index].edificio);
    setValue("nombre", Laboratorios[index].nombre);
    setModalEditarIsOpen(true);
  };

  const onSubmitEditar = (data) => {
    Swal.fire({
      title: "¿Estás seguro de editar este Laboratorio?",
      showDenyButton: true,
      confirmButtonText: `Continuar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedLaboratorios = [...Laboratorios];
        updatedLaboratorios[LaboratorioEditado] = data;
        setLaboratorios(updatedLaboratorios);
        setModalEditarIsOpen(false);
        toast.success("Laboratorio editado exitosamente!");
        reset();
      }
    });
  };
  const eliminarLaboratorio = (index) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar este Laboratorio?",
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setLaboratorios(Laboratorios.filter((_, i) => i !== index));
        toast.error("Laboratorio eliminado exitosamente!");
      }
    });
  };

  const data = useMemo(() => Laboratorios, [Laboratorios]);

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
              onClick={() => editarLaboratorio(index)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              className="botonEyD"
              title="Eliminar"
              onClick={() => eliminarLaboratorio(index)}
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
    <div className="Laboratorios">
      <h2>Laboratorios</h2>
      <p>
        ¡Bienvenido a la sección de administración de Laboratorios! Aquí
        podrás administrar una lista de laboratorios en tu aplicación. Con él, puedes
        agregar nuevos laboratorios, editar sus detalles existentes y
        eliminarlos individualmente. La interfaz está diseñada para facilitar la
        gestión eficiente de la información de los laboratorios, brindándote
        opciones claras para mantener y actualizar los registros en tu sistema.
      </p>
      <br />
      <button onClick={() => setModalIsOpen(true)}>Agregar Laboratorio</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modalContent"
        overlayClassName="modalOverlay"
      >
        <h2>Agregar nuevo Laboratorio</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Edificio:
            <input
              className="Laboratorios input modalInput"
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
              className="Laboratorios input modalInput"
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
        <h2>Editar Laboratorio</h2>
        <form onSubmit={handleSubmit(onSubmitEditar)}>
          <label>
            Edificio:
            <input
              className="Laboratorios input modalInput"
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
              className="Laboratorios input modalInput"
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
      <div className="tablaLaboratorios">
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

export default Laboratorios;
