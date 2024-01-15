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
  const [buildingIds, setBuildingIds] = useState([]); // Nuevo estado para almacenar los IDs de los edificios

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
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    formState: { errors: errorsAdd },
    setValue: setValueAdd,
    reset: resetAdd,
    getValues: getValuesAdd,
    watch: watchAdd,
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    setValue: setValueEdit,
    reset: resetEdit,
    getValues: getValuesEdit,
    watch: watchEdit,
  } = useForm();

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
      setBuildingIds(response.data.map((building) => building.id)); // Almacena los IDs
      setLoading(false);
    } catch (error) {
      await fetchBuildings(token);

      console.error("Error fetching buildings:", error);
      setLoading(false);
      setPageSize(defaultPageSize);
      setPageNumber(0);
    }
  };

  const onSubmit = async (data) => {
    const token = Cookies.get("token");

    try {
      const confirmResult = await Swal.fire({
        title: "Confirmar ingreso",
        text: "¿Estas seguro de agregar este nuevo Edificio?",
        icon: "question",
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
          resetAdd();
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
      await fetchBuildings(token);

      Swal.fire({
        title: "Error al agregar el edificio",
        text: error.response?.data?.message || "Hubo un error inesperado",
        icon: "error",
      });
      setPageSize(defaultPageSize);
      setPageNumber(0);
    }
  };

  const editarEdificio = (index) => {
    const token = Cookies.get("token");
    Swal.fire({
      title: "Verificando Edificio",
      text: "Por favor, espera...",
      icon: "info",
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    // Realiza una solicitud tipo GET para obtener los detalles del edificio
    axios
      .get(`${process.env.REACT_APP_API_URL}/buildings/${index}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const edificio = response.data;
        setEdificioEditado(edificio);

        setValueEdit("numero", edificio.no);
        setValueEdit("nombre", edificio.name);
        setValueEdit("descripcion", edificio.description);
        setValueEdit("direccion", edificio.address);
        setValueEdit("longitud", edificio.longitude);
        setValueEdit("latitud", edificio.latitude);
        Swal.close();

        setModalEditarIsOpen(true);
      })
      .catch((error) => {
        fetchBuildings(token);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al verificar Edificio, prueba de nuevo",
        });
        setPageSize(defaultPageSize);
        setPageNumber(0);
      });
  };

  const onSubmitEditar = async (data) => {
    const token = Cookies.get("token");

    try {
      const confirmResult = await Swal.fire({
        title: "¿Estás seguro de editar este edificio?",
        showDenyButton: true,
        confirmButtonText: `Continuar`,
        denyButtonText: `Cancelar`,
      });

      if (confirmResult.isConfirmed) {
        setLoadingAddEdificio(true);
        // Realiza la petición tipo PATCH con el token
        await axios.patch(
          `${process.env.REACT_APP_API_URL}/buildings/${edificioEditado.id}`,
          {
            no: data.numero,
            name: data.nombre,
            description: data.descripcion,
            address: data.direccion,
            longitude: data.longitud,
            latitude: data.latitud,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEdificios(
          edificios.map((edif) => (edif === edificioEditado ? data : edif))
        );

        setModalEditarIsOpen(false);
        setLoadingAddEdificio(false);

        await fetchBuildings(token);

        toast.success("Edificio editado exitosamente!");
        // Actualiza el estado local para forzar la recarga de datos
        setPageSize(defaultPageSize);
        setPageNumber(0);
      }
      resetEdit();
    } catch (error) {
      await fetchBuildings(token);

      setLoadingAddEdificio(false);
      console.error("Error al editar el edificio:", error);
      Swal.fire({
        title: "Error al editar el edificio",
        text: error.response?.data?.message || "Hubo un error inesperado",
        icon: "error",
      });
      setPageSize(defaultPageSize);
      setPageNumber(0);
    }
  };

  const eliminarEdificio = async (id) => {
    const token = Cookies.get("token");

    try {
      // Mostrar SweetAlert de carga
      Swal.fire({
        title: "Verificando Edificio",
        text: "Por favor, espera...",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      // Obtén el edificio por su id
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/buildings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const edificio = response.data;

      // Verifica si existen registros asociados
      if (
        edificio.faculties.length > 0 ||
        edificio.laboratories.length > 0 ||
        edificio.offices.length > 0
      ) {
        // Oculta el SweetAlert de carga
        Swal.close();

        // Muestra SweetAlert de error
        Swal.fire({
          title: "No se puede eliminar",
          text: "Este edificio tiene registros asociados en Facultades, Oficinas o Laboratorios. Por favor, elimina estos registros antes de eliminar el edificio.",
          icon: "error",
        });
        return;
      }

      // Oculta el SweetAlert de carga antes de mostrar la confirmación
      Swal.close();

      // Mostrar SweetAlert de confirmación
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

        // Realiza la eliminación
        await axios.delete(`${process.env.REACT_APP_API_URL}/buildings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await fetchBuildings(token);

        toast.success("Edificio eliminado correctamente!");

        // Actualiza el estado local para forzar la recarga de datos
        setPageSize(defaultPageSize);
        setPageNumber(0);
      }
    } catch (error) {
      await fetchBuildings(token);

      // Oculta el SweetAlert de carga en caso de error
      Swal.close();

      // Muestra SweetAlert de error
      Swal.fire({
        title: "Error",
        text:
          error.response.data.message ||
          "Hubo un error al eliminar el edificio",
        icon: "error",
      });

      setPageSize(defaultPageSize);
      setPageNumber(0);
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
        <br />
        <p>
          La Ubicación del Edificio "{selectedBuildingInfo.name}" se muestra en
          el siguiente mapa
        </p>
        <br />

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
                scaledSize: new window.google.maps.Size(70, 100),
              }}
              onClick={() => setInfoWindowOpen(true)}
            />

            <InfoWindow
              position={{
                lat: selectedBuildingCoordinates.lat + 0.00015, // Ajusta este valor según sea necesario
                lng: selectedBuildingCoordinates.lng,
              }}
            >
              <div className="infoContent">
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

        <form onSubmit={handleSubmitAdd(onSubmit)}>
          <br />
          <h3>Considera un Número y un Nombre único</h3>
          <br />
          <label>
            Número:
            <input
              type="number"
              min="0"
              className="edificios input modalInput"
              {...registerAdd("numero", {
                required: true,
                valueAsNumber: true,
                validate: (value) =>
                  (Number.isInteger(value) && value >= 0) ||
                  "Ingrese un número entero positivo",
              })}
              placeholder="Número"
            />
            {errorsAdd.numero && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>

          <label>
            Nombre:
            <input
              className="edificios input modalInput"
              {...registerAdd("nombre", { required: true, minLength: 3 })}
              placeholder="Nombre"
            />
            {errorsAdd.nombre?.type === "required" && (
              <p className="requerido">Este campo es requerido</p>
            )}
            {errorsAdd.nombre?.type === "minLength" && (
              <p className="requerido">Debe tener al menos 3 caracteres</p>
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
              {...registerAdd("longitud", {
                required: true,
                pattern: {
                  value: /^-?\d*\.?\d+$/,
                  message: "Ingrese un número decimal válido",
                },
              })}
              placeholder="Longitud"
            />
            {errorsAdd.longitud && (
              <p className="requerido">
                {errorsAdd.longitud.message || "Este campo es requerido"}
              </p>
            )}
          </label>
          <label>
            Latitud:
            <input
              type="number"
              step="any"
              className="edificios input modalInput"
              {...registerAdd("latitud", {
                required: true,
                pattern: {
                  value: /^-?\d*\.?\d+$/,
                  message: "Ingrese un número decimal válido",
                },
              })}
              placeholder="Latitud"
            />
            {errorsAdd.latitud && (
              <p className="requerido">
                {errorsAdd.latitud.message || "Este campo es requerido"}
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
              onClick={(e) => {
                setValueAdd("longitud", e.latLng.lng());
                setValueAdd("latitud", e.latLng.lat());
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
                  scaledSize: new window.google.maps.Size(70, 100),
                  labelOrigin: new window.google.maps.Point(35, 110),
                }}
                label={{
                  text: "Aquí estará tu edificio",
                  color: "black",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              />
            </GoogleMap>
          </div>
          {loadingAddEdificio ? (
            <div className="botones">
              <ClipLoader
                color="#3d8463"
                loading={loadingAddEdificio}
                size={"90px"}
              />
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
        <form onSubmit={handleSubmitEdit(onSubmitEditar)}>
          <br />
          <h3>Considera un Número y un Nombre único</h3>
          <br />
          <label>
            Número:
            <input
              type="number"
              min="0"
              className="edificios input modalInput"
              {...registerEdit("numero", {
                required: true,
                valueAsNumber: true,
                validate: (value) =>
                  (Number.isInteger(value) && value >= 0) ||
                  "Ingrese un número entero positivo",
              })}
              placeholder="Número"
            />
            {errorsEdit.numero && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>

          <label>
            Nombre:
            <input
              className="edificios input modalInput"
              {...registerEdit("nombre", { required: true })}
              placeholder="Nombre"
            />
            {errorsEdit.nombre && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Descripción:
            <input
              className="edificios input modalInput"
              {...registerEdit("descripcion", { required: true })}
              placeholder="Descripción"
            />
            {errorsEdit.descripcion && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Dirección:
            <input
              className="edificios input modalInput"
              {...registerEdit("direccion", { required: true })}
              placeholder="Dirección"
            />
            {errorsEdit.direccion && (
              <p className="requerido">Este campo es requerido, mayor a 3</p>
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
              {...registerEdit("longitud", {
                required: true,
                pattern: {
                  value: /^-?\d*\.?\d+$/,
                  message: "Ingrese un número decimal válido",
                },
              })}
              placeholder="Longitud"
            />
            {errorsEdit.longitud && (
              <p className="requerido">
                {errorsEdit.longitud.message || "Este campo es requerido"}
              </p>
            )}
          </label>
          <label>
            Latitud:
            <input
              type="number"
              step="any"
              className="edificios input modalInput"
              {...registerEdit("latitud", {
                required: true,
                pattern: {
                  value: /^-?\d*\.?\d+$/,
                  message: "Ingrese un número decimal válido",
                },
              })}
              placeholder="Latitud"
            />
            {errorsEdit.latitud && (
              <p className="requerido">
                {errorsEdit.latitud.message || "Este campo es requerido"}
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
              onClick={(e) => {
                setValueEdit("longitud", e.latLng.lng());
                setValueEdit("latitud", e.latLng.lat());
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
                  scaledSize: new window.google.maps.Size(70, 100),
                  labelOrigin: new window.google.maps.Point(35, 110),
                }}
                label={{
                  text: "Ubicación del Edificio",
                  color: "black",
                  background: "black",
                  fontSize: "20px",
                  fontWeight: "bold",
                  textShadow: "1px 3px 0px black",
                }}
              />
            </GoogleMap>
          </div>
          {loadingAddEdificio ? (
            <div className="botones">
              <ClipLoader
                color="#3d8463"
                loading={loadingAddEdificio}
                size={"90px"}
              />
              <div style={{ fontSize: "30px" }}>Actualizando Edificio...</div>
            </div>
          ) : (
            <>
              <div className="btnContainer">
                <button type="submit" className="agregarBtn">
                  Actualizar
                </button>
                <button
                  className="cancelarBtn"
                  onClick={() => setModalEditarIsOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </>
          )}
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
