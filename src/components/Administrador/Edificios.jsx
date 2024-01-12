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
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import MarkerMi from "../../assets/Marker.png";

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
  const [loading, setLoading] = useState(true);
  const [modalImagesIsOpen, setModalImagesIsOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loadingAddEdificio, setLoadingAddEdificio] = useState(false);
  const [mapModalIsOpen, setMapModalIsOpen] = useState(false);
  const [selectedBuildingCoordinates, setSelectedBuildingCoordinates] =
    useState({
      lat: 0,
      lng: 0,
    });

  const openImagesModal = (images) => {
    setSelectedImages(images);
    setModalImagesIsOpen(true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
    watch,
  } = useForm();

  const latitud = watch("latitud", -0.21055556);
  const longitud = watch("longitud", -78.48888889);

  const [markerPosition, setMarkerPosition] = useState({
    lat: -0.21055556,
    lng: -78.48888889,
  });
  const handleOpenMapModal = (latitude, longitude) => {
    setMapModalIsOpen(true);
    setSelectedBuildingCoordinates({ lat: latitude, lng: longitude });
  };

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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      setLoading(false);
    }
  };
  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("token");

      // Mostrar confirmación con SweetAlert antes de enviar la solicitud
      const confirmResult = await Swal.fire({
        title: "¿Estás seguro de agregar este edificio?",
        showDenyButton: true,
        confirmButtonText: `Continuar`,
        denyButtonText: `Cancelar`,
      });

      if (confirmResult.isConfirmed) {
        setLoadingAddEdificio(true); // Establecer el estado de carga a true

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/buildings`,
          {
            no: data.numero,
            name: data.nombre,
            latitude: data.latitud,
            longitude: data.longitud,
            // Agrega otros campos necesarios según tu modelo de datos
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLoadingAddEdificio(false); // Establecer el estado de carga a false después de la solicitud

        if (response.status === 201) {
          // Edificio agregado exitosamente
          Swal.fire({
            title: "Edificio agregado exitosamente",
            icon: "info",
          });
          setEdificios([...edificios, response.data]); // Agrega el nuevo edificio a la lista local
          setModalIsOpen(false);
          toast.success("Edificio agregado exitosamente!");
          reset();
        } else {
          // Error al agregar el edificio
          Swal.fire({
            title: "Error al agregar el edificio",
            text: response.data.message || "Hubo un error inesperado",
            icon: "error",
          });
        }
      }
    } catch (error) {
      setLoadingAddEdificio(false); // Establecer el estado de carga a false en caso de error
      console.error("Error al agregar el edificio:", error);
      // Maneja errores durante la solicitud y muestra un mensaje de error con Swal
      Swal.fire({
        title: "Error al agregar el edificio",
        text: error.response?.data?.message || "Hubo un error inesperado",
        icon: "error",
      });
    }
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
            {value.length > 0 ? (
              <button onClick={() => openImagesModal(value)}>
                Ver Imágenes
              </button>
            ) : (
              <p className="requerido">Sin imágenes aún</p>
            )}
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
      },

      {
        Header: "Nombre",
        accessor: "name",
      },
      {
        Header: "Dirección",
        accessor: "address",
        Cell: ({ value }) => (
          <div>
            {value ? value : <p className="requerido">Sin Dirección aún</p>}
          </div>
        ),
      },
      {
        Header: "Descripcion",
        accessor: "description",
        Cell: ({ value }) => (
          <div>
            {value ? value : <p className="requerido">Sin Descripción aún</p>}
          </div>
        ),
      },
      {
        Header: "Ubicación",
        accessor: "location",
        Cell: ({ row }) => {
          const { longitude, latitude } = row.original;
          return (
            <button onClick={() => handleOpenMapModal(latitude, longitude)}>
              Ver en Google Maps
            </button>
          );
        },
        disableFilters: true,
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
        isOpen={mapModalIsOpen}
        onRequestClose={() => setMapModalIsOpen(false)}
        className="modalContent"
        overlayClassName="modalOverlay"
      >
        <h2>Ubicación en Google Maps</h2>

        <div
          className="mapContainer"
          style={{ height: "400px", width: "100%", position: "relative" }}
        >
          <GoogleMap
            mapContainerStyle={{
              height: "100%",
              width: "100%",
              position: "absolute",
            }}
            mapTypeId={"satellite"} 
            center={{
              lat: selectedBuildingCoordinates.lat,
              lng: selectedBuildingCoordinates.lng,
            }}
            zoom={19}
          >
            <Marker
              position={selectedBuildingCoordinates}
              icon={{
                url: MarkerMi,
                scaledSize: new window.google.maps.Size(160, 80),
              }}
            />
          </GoogleMap>
        </div>

        <button
          className="cancelarBtn"
          onClick={() => setMapModalIsOpen(false)}
        >
          Cerrar
        </button>
      </Modal>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modalContent"
        overlayClassName="modalOverlay"
      >
        <h2>Agregar nuevo edificio</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <br />
          <h3>Considera un Número y un Nombre único</h3>
          <br />
          <label>
            Número:
            <input
              type="number"
              min="0"
              className="edificios input modalInput"
              {...register("numero", {
                required: true,
                valueAsNumber: true, // Ensure the entered value is converted to a number
                validate: (value) =>
                  (Number.isInteger(value) && value >= 0) ||
                  "Ingrese un número entero positivo", // Validate if it's a positive integer
              })}
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
          <br />
          <h3>Haz click en el mapa para extraer las Coordenadas de un lugar</h3>
          <br />
          <label>
            Longitud:
            <input
              type="number"
              step="any"
              className="edificios input modalInput"
              {...register("longitud", {
                required: true,
                pattern: {
                  value: /^-?\d*\.?\d+$/,
                  message: "Ingrese un número decimal válido",
                },
              })}
              placeholder="Longitud"
            />
            {errors.longitud && (
              <p className="requerido">
                {errors.longitud.message || "Este campo es requerido"}
              </p>
            )}
          </label>
          <label>
            Latitud:
            <input
              type="number"
              step="any"
              className="edificios input modalInput"
              {...register("latitud", {
                required: true,
                pattern: {
                  value: /^-?\d*\.?\d+$/,
                  message: "Ingrese un número decimal válido",
                },
              })}
              placeholder="Latitud"
            />
            {errors.latitud && (
              <p className="requerido">
                {errors.latitud.message || "Este campo es requerido"}
              </p>
            )}
          </label>

          <div
            className="mapContainer"
            style={{ height: "400px", width: "100%", position: "relative" }}
          >
            <GoogleMap
              mapContainerStyle={{
                height: "100%",
                width: "100%",
                position: "absolute",
              }}
              center={{ lat: markerPosition.lat, lng: markerPosition.lng }}
              zoom={17}
              mapTypeId={"satellite"} 
              onClick={(e) => {
                setValue("longitud", e.latLng.lng());
                setValue("latitud", e.latLng.lat());
                setMarkerPosition({
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                });
              }}
            >
              <Marker
                position={markerPosition}
                icon={{
                  url: MarkerMi,
                  scaledSize: new window.google.maps.Size(160, 80),
                }}
              />
            </GoogleMap>
          </div>
          {loadingAddEdificio ? (
            <div className="botones">
              <ClipLoader color="#3d8463" loading={loading} size={"90px"} />
              <div style={{ fontSize: "30px" }}>Agregando Edificio...</div>
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
            style={{ width: "100%", height: "auto" }}
          />
        ))}
        <button
          className="cancelarBtn"
          onClick={() => setModalImagesIsOpen(false)}
        >
          Cerrar
        </button>
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
                    );
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
