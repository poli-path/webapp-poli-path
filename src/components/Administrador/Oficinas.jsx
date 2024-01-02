import React, { useMemo, useState } from "react";
import { useTable, useFilters } from "react-table";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "../../styles/Administrador/Oficinas.css";
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

const Oficinas = () => {
  const [Oficinas, setOficinas] = useState([
    {
      edificio: "Oficina 1",
      numero: "1",
      nombre: "Oficina de Ciencias",
    },
  ]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalEditarIsOpen, setModalEditarIsOpen] = useState(false);
  const [OficinaEditada, setOficinaEditada] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    Swal.fire({
      title: "¿Estás seguro de agregar esta Oficina?",
      showDenyButton: true,
      confirmButtonText: `Continuar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setOficinas([...Oficinas, data]);
        setModalIsOpen(false);
        toast.success("Oficina agregada exitosamente!");
        reset();
      }
    });
  };

  const editarOficina = (index) => {
    setOficinaEditada(index);
    setValue("edificio", Oficinas[index].edificio);
    setValue("numero", Oficinas[index].numero);
    setValue("nombre", Oficinas[index].nombre);
    setModalEditarIsOpen(true);
  };

  const onSubmitEditar = (data) => {
    Swal.fire({
      title: "¿Estás seguro de editar esta Oficina?",
      showDenyButton: true,
      confirmButtonText: `Continuar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedOficinas = [...Oficinas];
        updatedOficinas[OficinaEditada] = data;
        setOficinas(updatedOficinas);
        setModalEditarIsOpen(false);
        toast.success("Oficina editada exitosamente!");
        reset();
      }
    });
  };
  const eliminarOficina = (index) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar esta Oficina?",
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setOficinas(Oficinas.filter((_, i) => i !== index));
        toast.error("Oficina eliminado exitosamente!");
      }
    });
  };

  const data = useMemo(() => Oficinas, [Oficinas]);

  const columns = useMemo(
    () => [
      {
        Header: "Edificio",
        accessor: "edificio",
      },
      {
        Header: "Número",
        accessor: "numero",
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
              onClick={() => editarOficina(index)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              className="botonEyD"
              title="Eliminar"
              onClick={() => eliminarOficina(index)}
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
    <div className="Oficinas">
      <h2>Oficinas</h2>
      <p>
        ¡Bienvenido a la sección de administración de Oficinas! Aquí podrás
        administrar una lista de oficinas en tu aplicación. Puedes agregar
        nuevas oficinas, editar los detalles existentes de cada una y
        eliminarlas individualmente. La interfaz está diseñada para facilitar la
        gestión eficiente de la información de las oficinas, ofreciéndote
        opciones claras para mantener y actualizar los registros en tu sistema.
      </p>
      <br />
      <button onClick={() => setModalIsOpen(true)}>Agregar Oficina</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modalContent"
        overlayClassName="modalOverlay"
      >
        <h2>Agregar nuevo Oficina</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Edificio:
            <input
              className="Oficinas input modalInput"
              {...register("edificio", { required: true })}
              placeholder="Edificio al que pertenece"
            />
            {errors.edificio && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Número:
            <input
              className="Oficinas input modalInput"
              {...register("numero", { required: true })}
              placeholder="Numero de oficina"
            />
            {errors.numero && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Nombre:
            <input
              className="Oficinas input modalInput"
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
        <h2>Editar Oficina</h2>
        <form onSubmit={handleSubmit(onSubmitEditar)}>
          <label>
            Edificio:
            <input
              className="Oficinas input modalInput"
              {...register("edificio", { required: true })}
              placeholder="Edificio"
            />
            {errors.edificio && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Edificio:
            <input
              className="Oficinas input modalInput"
              {...register("numero", { required: true })}
              placeholder="Numero"
            />
            {errors.numero && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Nombre:
            <input
              className="Oficinas input modalInput"
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
      <div className="tablaOficinas">
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

export default Oficinas;
