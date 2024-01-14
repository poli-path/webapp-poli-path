import React, { useMemo, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useTable, usePagination, useFilters } from "react-table";

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
  const [Oficinas, setOficinas] = useState([]);
  const [edificios, setEdificios] = useState([]); // Nuevo estado para almacenar la lista de edificios

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalEditarIsOpen, setModalEditarIsOpen] = useState(false);
  const [OficinaEditado, setOficinaEditado] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const buildingId = data.edificio;
    const payload = {
      buildingId,
      name: data.nombre,
      codeOrNo: Number(data.codeOrNo), // Agrega el campo "code_or_no"
    };
  console.log(payload)
    try {
      setLoadingOficina(true);
      const token = Cookies.get("token");
  
      const result = await Swal.fire({
        title: "¿Estás seguro de agregar esta Oficina?",
        showDenyButton: true,
        confirmButtonText: `Continuar`,
        denyButtonText: `Cancelar`,
      });
  
      if (result.isConfirmed) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/offices`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoading(true);

        console.log(response.data)
        setOficinas([...Oficinas, response.data]);
        setModalIsOpen(false);
        await fetchoffices(token);
        setPageSize(defaultPageSize);
        setPageNumber(0);
        toast.success("Oficina agregada exitosamente!");
        reset();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al agregar la Oficina",
      });
      console.log(error)
    } finally {
      setLoadingOficina(false);
    }
  };

  const editarOficina = (index) => {
    setOficinaEditado(index);
    setValue("edificio", Oficinas[index].edificio);
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
        updatedOficinas[OficinaEditado] = data;
        setOficinas(updatedOficinas);
        setModalEditarIsOpen(false);
        toast.success("Oficina editada exitosamente!");
        reset();
      }
    });
  };

  const eliminarOficina= async (oficinaId) => {
    try {
      const result = await Swal.fire({
        title: "Confirmar eliminación",
        text: "¿Estás seguro de eliminar esta Oficina?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Eliminar`,
        cancelButtonText: "Cancelar",
        dangerMode: true,
      });

      if (result.isConfirmed) {
        setLoading(true);

        const token = Cookies.get("token");
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/offices/${oficinaId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await fetchoffices(token);

        Swal.fire("Oficina eliminada correctamente!", "", "info");
        setPageSize(defaultPageSize);
        setPageNumber(0);
      }
    } catch (error) {
      console.error("Error al eliminar Oficina:", error);
      Swal.fire({
        title: "Error",
        text:
          error.response.data.message ||
          "Hubo un error al eliminar la Oficina",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(true);
  const [loadingOficina, setLoadingOficina] = useState(false); // Modificado: Inicializado en "false"

  const [selectedImages, setSelectedImages] = useState([]);
  const [modalImagesIsOpen, setModalImagesIsOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [defaultPageSize, setDefaultPageSize] = useState(5);

  const openImagesModal = (images) => {
    setSelectedImages(images);
    setModalImagesIsOpen(true);
  };
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetchoffices(token);
      fetchBuildings(token); // Llamada a la función para obtener la lista de edificios
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
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  };

  const fetchBuildingInfo = async (OficinaId) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/offices/${OficinaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const buildingInfo = response.data.building;
      return buildingInfo;
    } catch (error) {
      console.error("Error fetching building info:", error);
      return null;
    }
  };
  const fetchoffices = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/offices`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const OficinasWithBuildingInfo = await Promise.all(
        response.data.map(async (Oficina) => {
          const buildingInfo = await fetchBuildingInfo(Oficina.id);
          return {
            ...Oficina,
            edificioId: buildingInfo ? buildingInfo.id : null,
            edificioNombre: buildingInfo ? buildingInfo.name : null,
          };
        })
      );

      setOficinas(OficinasWithBuildingInfo);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      setLoading(false);
    }
  };

  const data = useMemo(() => Oficinas, [Oficinas]);

  const columns = useMemo(
    () => [
      {
        Header: "Edificio",
        accessor: "edificioNombre",
        Cell: ({ value }) => <div>{value}</div>,
      },

      {
        Header: "Código o Número",
        accessor: "codeOrNo", // Cambia a "code_or_no"
      },
      {
        Header: "Nombre",
        accessor: "name",
      },
      {
        Header: "Profesor",
        accessor: "teacherName", // Cambia a "teacherName"
      },
      {
        Header: "Imagenes",
        accessor: "imageUrls",
        Cell: ({ value }) => (
          <div>
            {value.length > 0 ? (
              <button onClick={() => openImagesModal(value)}>
                Ver Imágenes
              </button>
            ) : (
              <p className="requerido">Sin imágenes aún</p>
            )}
          </div>
        ),
      },
      {
        Header: "Acciones",
        Cell: ({ row: { original } }) => (
          <div>
            <button
              className="botonEyD"
              title="Editar"
              onClick={() => editarOficina(original.id)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              className="botonEyD"
              title="Eliminar"
              onClick={() => eliminarOficina(original.id)}
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
    <div className="Oficinas">
      <h2>Oficinas</h2>
      <p>
        ¡Bienvenido a la sección de administración de Oficinas! Aquí podrás
        administrar y visualizar una lista de Oficinas en tu aplicación.
        Puedes agregar nuevas Oficinas, editar sus detalles existentes y
        eliminarlas individualmente. Esta herramienta ofrece una interfaz
        amigable para mantener y actualizar la información de las Oficinas,
        proporcionando opciones claras para gestionar eficientemente los
        registros en tu sistema.
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
            <select
              className="Oficinas input modalInput"
              {...register("edificio", { required: true })}
            >
              {edificios.map((edificio) => (
                <option key={edificio.id} value={edificio.id}>
                  {edificio.name}
                </option>
              ))}
            </select>
            {errors.edificio && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Nombre:
            <input
              className="Oficinas input modalInput"
              {...register("nombre", {
                required: true,
                validate: (value) => value.trim().length > 3, // Validación para más de 3 letras
              })}
              placeholder="Nombre"
            />
            {errors.nombre && (
              <p className="requerido">El nombre debe tener más de 3 letras</p>
            )}
          </label>
          <label>
            Código o Número:
            <input
              type="number"
              step="any"
              className="Oficinas input modalInput"
              {...register("codeOrNo", {
                required: true,
                pattern: {
                  value: /^-?\d*\.?\d+$/,
                  message: "Ingrese un número decimal válido",
                },
              })}
              placeholder="Código o Número"
            />
            {errors.codeOrNo && (
              <p className="requerido">
                {errors.codeOrNo.message || "Este campo es requerido"}
              </p>
            )}
          </label>
          {loadingOficina ? (
            <div className="botones">
              <ClipLoader
                color="#3d8463"
                loading={loadingOficina}
                size={"90px"}
              />
              <div style={{ fontSize: "30px" }}>Agregando Oficina...</div>
            </div>
          ) : (
            <>
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
            </>
          )}
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

      <Modal
        isOpen={modalImagesIsOpen}
        onRequestClose={() => setModalImagesIsOpen(false)}
        className="modalContent"
        overlayClassName="modalOverlay"
      >
        <h2>Imágenes</h2>
        {selectedImages.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`Imagen ${index + 1}`}
            style={{
              width: "50%",
              height: "150px",
              borderRadius: 0,
              padding: 10,
              margin: 0,
            }}
          />
        ))}
        <div className="botones2">
          <button
            className="cancelarBtn"
            onClick={() => setModalImagesIsOpen(false)}
          >
            Cerrar
          </button>
        </div>
      </Modal>
      <ToastContainer />
      <div className="tablaOficinas">
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
              pageNumber = Math.min(Math.max(pageNumber, 1), pageCount || 1);
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

export default Oficinas;
