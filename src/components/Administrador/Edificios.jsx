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
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
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
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  const [selectedBuildingCoordinates, setSelectedBuildingCoordinates] =
    useState({
      lat: 0,
      lng: 0,
    });

  const openImagesModal = (images) => {
    setSelectedImages(images);
    setModalImagesIsOpen(true);
  };
  const [selectedBuildingInfo, setSelectedBuildingInfo] = useState({
    name: "",
    coordinates: {
      lat: 0,
      lng: 0,
    },
  });

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

  const handleOpenMapModal = (latitude, longitude, name) => {
    setSelectedBuildingCoordinates({ lat: latitude, lng: longitude });
    setSelectedBuildingInfo({
      name: name,
      coordinates: { lat: latitude, lng: longitude },
    });

    if (infoWindowOpen) {
      setInfoWindowOpen(false);
    }

    setMapModalIsOpen(true);
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

      const confirmResult = await Swal.fire({
        title: "¿Estás seguro de agregar este edificio?",
        showDenyButton: true,
        confirmButtonText: `Continuar`,
        denyButtonText: `Cancelar`,
      });

      if (confirmResult.isConfirmed) {
        setLoadingAddEdificio(true);

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/buildings`,
          {
            no: data.numero,
            name: data.nombre,
            latitude: data.latitud,
            longitude: data.longitud,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLoadingAddEdificio(false);

        if (response.status === 201) {
          Swal.fire({
            title: "Edificio agregado exitosamente",
            icon: "info",
          });
          setEdificios([...edificios, response.data]);
          setModalIsOpen(false);
          toast.success("Edificio agregado exitosamente!");
          reset();
        } else {
          Swal.fire({
            title: "Error al agregar el edificio",
            text: response.data.message || "Hubo un error inesperado",
            icon: "error",
          });
        }
      }
    } catch (error) {
      setLoadingAddEdificio(false);
      console.error("Error al agregar el edificio:", error);
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

  const eliminarEdificio = async (id) => {
    try {
      const token = Cookies.get("token");
      const confirmResult = await Swal.fire({
        title: "Confirmar eliminación",
        text: "¿Estás seguro de eliminar este Edificio?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        dangerMode: true,
      });

      if (confirmResult.isConfirmed) {
        setLoading(true);

        await axios.delete(`${process.env.REACT_APP_API_URL}/buildings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Edificio eliminado correctamente!");

        // Actualiza la lista de edificios después de la eliminación
        const updatedBuildings = edificios.filter(
          (edificio) => edificio.id !== id
        );
        setEdificios(updatedBuildings);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text:
          error.response.data.message ||
          "Hubo un error al eliminar el edificio",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
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
          const { longitude, latitude, name } = row.original;
          return (
            <button
              onClick={() => handleOpenMapModal(latitude, longitude, name)}
            >
              Ver en Google Maps
            </button>
          );
        },
        disableFilters: true,
      },
      {
        Header: "Facultades",
        accessor: "faculties",
        Cell: ({ value }) => (
          <div>
            {value && value.length > 0 ? (
              <ul>
                {value.map((faculty) => (
                  <li key={faculty.id}>{faculty.name}</li>
                ))}
              </ul>
            ) : (
              <p className="requerido">No existen Facultades aún</p>
            )}
          </div>
        ),
        disableFilters: true,
      },
      {
        Header: "Laboratorios",
        accessor: "laboratories",
        Cell: ({ value }) => (
          <div>
            {value && value.length > 0 ? (
              <ul>
                {value.map((lab) => (
                  <li key={lab.id}>{lab.name}</li>
                ))}
              </ul>
            ) : (
              <p className="requerido">No existen Laboratorios aún</p>
            )}
          </div>
        ),
        disableFilters: true,
      },
      {
        Header: "Oficinas",
        accessor: "offices",
        Cell: ({ value }) => (
          <div>
            {value && value.length > 0 ? (
              <ul>
                {value.map((office) => (
                  <li key={office.id}>{office.name}</li>
                ))}
              </ul>
            ) : (
              <p className="requerido">No existen Oficinas aún</p>
            )}
          </div>
        ),
        disableFilters: true,
      },
      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <div>
            <button
              className="botonEyD"
              title="Editar"
              onClick={() => editarEdificio(row.original.id)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              className="botonEyD"
              title="Eliminar"
              onClick={() => eliminarEdificio(row.original.id)}
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
              onClick={() => setInfoWindowOpen(true)}
            />

            <InfoWindow
              position={{
                lat: selectedBuildingCoordinates.lat + 0.00015, // Ajusta este valor según sea necesario
                lng: selectedBuildingCoordinates.lng,
              }}
            >
              <div>
                <h3>{selectedBuildingInfo.name}</h3>
              </div>
            </InfoWindow>
          </GoogleMap>
        </div>
        <div className="botones2">
          <button
            className="cancelarBtn"
            onClick={() => setMapModalIsOpen(false)}
          >
            Cerrar
          </button>
        </div>
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
                valueAsNumber: true,
                validate: (value) =>
                  (Number.isInteger(value) && value >= 0) ||
                  "Ingrese un número entero positivo",
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

export default Edificios;
