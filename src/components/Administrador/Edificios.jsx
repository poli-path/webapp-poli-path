import React, { useMemo, useState, useEffect } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "../../styles/Administrador/Edificios.css";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTable, usePagination, useFilters } from "react-table";
import Cookies from "js-cookie";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

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
  const [edificios, setEdificios] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalEditarIsOpen, setModalEditarIsOpen] = useState(false);
  const [edificioEditado, setEdificioEditado] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [defaultPageSize, setDefaultPageSize] = useState(5);
  const [loading, setLoading] = useState(true); // Nuevo estado para manejar la carga de datos

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetchBuildings(token);
    }
  }, []);

  const fetchBuildings = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/buildings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEdificios(response.data);
      setLoading(false); // Una vez que se cargan los datos, establecemos loading en false
    } catch (error) {
      console.error("Error fetching buildings:", error);
      setLoading(false); // En caso de error, también establecemos loading en false
    }
  };

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
        accessor: "no",
      },
      {
        Header: "Imagenes",
        accessor: "imageUrls",
        Cell: ({ value }) => (
          <div>
            {value.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Imagen ${index + 1}`}
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            ))}
          </div>
        ),
        disableFilters: true, // Deshabilita los filtros para esta columna
      },
      {
        Header: "Nombre",
        accessor: "name",
      },
      {
        Header: "Dirección",
        accessor: "address",
      },
      {
        Header: "Descripcion",
        accessor: "description",
      },
      {
        Header: "Ubicación",
        accessor: "location", 
        Cell: ({ row }) => {
          const { longitude, latitude } = row.original;
          const locationUrl = `https://www.google.com/maps/search/?api=1&query=${longitude},${latitude}`;
          return (
            <a href={locationUrl} target="_blank" rel="noopener noreferrer">
              Ver en Google Maps
            </a>
          );
        },
        disableFilters: true, // Deshabilita los filtros para esta columna
      },
      {
        Header: "Facultades",
        accessor: "faculties",
        Cell: ({ value }) => (
          <ul>
            {value.map((faculty) => (
              <li key={faculty.id}>{faculty.name}</li>
            ))}
          </ul>
        ),
      },
      {
        Header: "Laboratorios",
        accessor: "laboratories",
        Cell: ({ value }) => (
          <ul>
            {value.map((lab) => (
              <li key={lab.id}>{lab.name}</li>
            ))}
          </ul>
        ),
      },
      {
        Header: "Oficinas",
        accessor: "offices",
        Cell: ({ value }) => (
          <ul>
            {value.map((office) => (
              <li key={office.id}>{office.name}</li>
            ))}
          </ul>
        ),
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
        {loading ? (
          <div className="botones">
            <ClipLoader color="#3d8463" loading={loading} size={"90px"} />
            <div style={{ fontSize: "30px" }}>
              Actualizando Datos de la Tabla...
            </div>
          </div>
        ) : (
          <>
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
                    let pageNumber = e.target.value
                      ? Number(e.target.value)
                      : 1;
                    pageNumber = Math.min(
                      Math.max(pageNumber, 1),
                      pageCount || 1
                    ); // Limita el valor entre 1 y pageCount o 1 si pageCount no está disponible
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
          </>
        )}
      </div>
    </div>
  );
};

export default Edificios;
