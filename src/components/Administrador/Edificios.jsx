import React, { useMemo, useState } from "react";
import { useTable, useFilters } from "react-table";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "../../styles/Administrador/Edificios.css";
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

const Edificios = () => {
  const [edificios, setEdificios] = useState([
    {
      numero: "1",
      nombre: "Edificio 1",
      longitud: "0.0",
      latitud: "0.0",
    },
  ]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalEditarIsOpen, setModalEditarIsOpen] = useState(false);
  const [edificioEditado, setEdificioEditado] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    Swal.fire({
      title: "¿Estás seguro de agregar este edificio?",
      showDenyButton: true,
      confirmButtonText: `Continuar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setEdificios([...edificios, data]);
        setModalIsOpen(false);
        toast.success("Edificio agregado exitosamente!");
        reset();
      }
    });
  };

  const editarEdificio = (index) => {
    setEdificioEditado(edificios[index]);
    setValue("numero", edificios[index].numero);
    setValue("nombre", edificios[index].nombre);
    setValue("longitud", edificios[index].longitud);
    setValue("latitud", edificios[index].latitud);
    setModalEditarIsOpen(true);
  };

  const onSubmitEditar = (data) => {
    Swal.fire({
      title: "¿Estás seguro de editar este edificio?",
      showDenyButton: true,
      confirmButtonText: `Continuar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setEdificios(
          edificios.map((edif) => (edif === edificioEditado ? data : edif))
        );
        setModalEditarIsOpen(false);
        toast.success("Edificio editado exitosamente!");
        reset();
      }
    });
  };

  const eliminarEdificio = (index) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar este edificio?",
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setEdificios(edificios.filter((_, i) => i !== index));
        toast.error("Edificio eliminado exitosamente!");
      }
    });
  };

  const data = useMemo(() => edificios, [edificios]);

  const columns = useMemo(
    () => [
      {
        Header: "Número",
        accessor: "numero",
      },
      {
        Header: "Nombre",
        accessor: "nombre",
      },
      {
        Header: "Longitud",
        accessor: "longitud",
      },
      {
        Header: "Latitud",
        accessor: "latitud",
      },
      {
        Header: "Acciones",
        Cell: ({ row: { index } }) => (
          <div>
            <button
              className="botonEyD"
              title="Editar"
              onClick={() => editarEdificio(index)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              className="botonEyD"
              title="Eliminar"
              onClick={() => eliminarEdificio(index)}
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
    <div className="edificios">
      <h2>Edificios</h2>
      <p>
        ¡Bienvenido a la sección de administración de Edificios! Aquí podrás
        administrar una lista de edificios, visualizando sus números, nombres y
        ubicación en una tabla interactiva. Puedes agregar nuevos edificios,
        editar sus detalles existentes con confirmación y eliminarlos
        individualmente. Esta herramienta facilita la gestión eficiente de la
        información relacionada con los edificios en tu aplicación, brindando
        opciones claras para mantener y actualizar los registros según sea
        necesario.
      </p>
      <br />
      <button onClick={() => setModalIsOpen(true)}>Agregar Edificio</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modalContent"
        overlayClassName="modalOverlay"
      >
        <h2>Agregar nuevo edificio</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Número:
            <input
              className="edificios input modalInput"
              {...register("numero", { required: true })}
              placeholder="Número"
            />
            {errors.numero && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Nombre:
            <input
              className="edificios input modalInput"
              {...register("nombre", { required: true })}
              placeholder="Nombre"
            />
            {errors.nombre && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Longitud:
            <input
              className="edificios input modalInput"
              {...register("longitud", { required: true })}
              placeholder="Longitud"
            />
            {errors.longitud && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Latitud:
            <input
              className="edificios input modalInput"
              {...register("latitud", { required: true })}
              placeholder="Latitud"
            />
            {errors.latitud && (
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
        <h2>Editar edificio</h2>
        <form onSubmit={handleSubmit(onSubmitEditar)}>
          <label>
            Número:
            <input
              className="edificios input modalInput"
              {...register("numero", { required: true })}
              placeholder="Número"
            />
            {errors.numero && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Nombre:
            <input
              className="edificios input modalInput"
              {...register("nombre", { required: true })}
              placeholder="Nombre"
            />
            {errors.nombre && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Longitud:
            <input
              className="edificios input modalInput"
              {...register("longitud", { required: true })}
              placeholder="Longitud"
            />
            {errors.longitud && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Latitud:
            <input
              className="edificios input modalInput"
              {...register("latitud", { required: true })}
              placeholder="Latitud"
            />
            {errors.latitud && (
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
      <div className="tablaEdificios">
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

export default Edificios;
