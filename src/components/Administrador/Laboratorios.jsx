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
const MAX_DESCRIPTION_LENGTH = 400;
const Laboratorios = () => {
  const [remainingChars, setRemainingChars] = useState(MAX_DESCRIPTION_LENGTH);

  const handleDescriptionChange = (e) => {
    const inputText = e.target.value;
    const remaining = MAX_DESCRIPTION_LENGTH - inputText.length;
    setRemainingChars(Math.max(0, remaining));
  };

  const [Laboratorios, setLaboratorios] = useState([]);
  const [edificios, setEdificios] = useState([]); // Nuevo estado para almacenar la lista de edificios

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalEditarIsOpen, setModalEditarIsOpen] = useState(false);
  const [LaboratorioEditado, setLaboratorioEditado] = useState(null);

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

  const onSubmit = async (data) => {
    const buildingId = data.edificio;
    const payload = {
      buildingId,
      name: data.nombre,
      description: data.descripcion,
    };

    try {
      setLoadingLaboratorio(true);
      const token = Cookies.get("token");

      const existingFaculty = Laboratorios.find(
        (faculty) => faculty.name === data.nombre
      );
      if (existingFaculty) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ya existe una Laboratorio con ese nombre",
        });
        return;
      }

      const result = await Swal.fire({
        title: "¿Estás seguro de agregar esta Laboratorio?",
        showDenyButton: true,
        confirmButtonText: `Continuar`,
        denyButtonText: `Cancelar`,
      });

      if (result.isConfirmed) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/laboratories`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLaboratorios([...Laboratorios, response.data]);
        setModalIsOpen(false);
        setLoading(true);

        await fetchlaboratories(token);
        setPageSize(defaultPageSize);
        setPageNumber(0);
        toast.success("Laboratorio agregada exitosamente!");
        resetAdd();
        // Actualiza el estado local para forzar la recarga de datos
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al agregar la Laboratorio",
      });
    } finally {
      setLoadingLaboratorio(false);
    }
  };

  const editarLaboratorio = (index) => {
    const token = Cookies.get("token");
    Swal.fire({
      title: "Verificando Laboratorio",
      text: "Por favor, espera...",
      icon: "info",
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    axios
      .get(`${process.env.REACT_APP_API_URL}/laboratories/${index}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const edificio = response.data;
        setLaboratorioEditado(edificio);

        setValueEdit("edificio", edificio.building.id);
        setValueEdit("nombre", edificio.name);
        setValueEdit("descripcion", edificio.description);
        Swal.close();

        setModalEditarIsOpen(true);
      })
      .catch((error) => {
        fetchlaboratories(token);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al verificar Laboratorio, prueba de nuevo",
        });
        setPageSize(defaultPageSize);
        setPageNumber(0);
      });
  };

  const onSubmitEditar = async (data) => {
    const token = Cookies.get("token");

    try {
      const confirmResult = await Swal.fire({
        title: "¿Estás seguro de editar este Laboratorios?",
        showDenyButton: true,
        confirmButtonText: `Continuar`,
        denyButtonText: `Cancelar`,
      });

      if (confirmResult.isConfirmed) {
        setLoadingLaboratorio(true);
        // Realiza la petición tipo PATCH con el token
        await axios.patch(
          `${process.env.REACT_APP_API_URL}/laboratories/${LaboratorioEditado.id}`,
          {
            buildingId: data.edificio,
            name: data.nombre,
            description: data.descripcion,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLaboratorios(
          Laboratorios.map((edif) =>
            edif === LaboratorioEditado ? data : edif
          )
        );

        await fetchlaboratories(token);

        toast.success("Facultad editada exitosamente!");
        setPageSize(defaultPageSize);
        setPageNumber(0);

        setModalEditarIsOpen(false);
        setLoadingLaboratorio(false);
      }
    } catch (error) {
      await fetchlaboratories(token);

      setLoadingLaboratorio(false);
      Swal.fire({
        title: "Error al editar el Laboratorio",
        text: error.response?.data?.message || "Hubo un error inesperado",
        icon: "error",
      });
      setPageSize(defaultPageSize);
      setPageNumber(0);
    }
  };

  const eliminarLaboratorio = async (laboratorioId) => {
    try {
      const result = await Swal.fire({
        title: "Confirmar eliminación",
        text: "¿Estás seguro de eliminar este Laboratorio?",
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
          `${process.env.REACT_APP_API_URL}/laboratories/${laboratorioId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await fetchlaboratories(token);

        Swal.fire("Laboratorio eliminado correctamente!", "", "info");
        // Actualiza el estado local para forzar la recarga de datos
        setPageSize(defaultPageSize);
        setPageNumber(0);
      }
    } catch (error) {
      console.error("Error al eliminar Laboratorio:", error);
      Swal.fire({
        title: "Error",
        text:
          error.response.data.message ||
          "Hubo un error al eliminar el Laboratorio",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(true);
  const [loadingLaboratorio, setLoadingLaboratorio] = useState(false); // Modificado: Inicializado en "false"

  const [selectedImages, setSelectedImages] = useState([]);
  const [modalImagesIsOpen, setModalImagesIsOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [defaultPageSize] = useState(5);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetchlaboratories(token);
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

  const fetchBuildingInfo = async (LaboratorioId) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/laboratories/${LaboratorioId}`,
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
  const fetchlaboratories = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/laboratories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const LaboratoriosWithBuildingInfo = await Promise.all(
        response.data.map(async (Laboratorio) => {
          const buildingInfo = await fetchBuildingInfo(Laboratorio.id);
          return {
            ...Laboratorio,
            edificioId: buildingInfo ? buildingInfo.id : null,
            edificioNombre: buildingInfo ? buildingInfo.name : null,
          };
        })
      );

      setLaboratorios(LaboratoriosWithBuildingInfo);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      setLoading(false);
    }
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [tempImages, setTempImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [OficinaIMGEditado, setOficinaIMGEditado] = useState("");
  const [loadingImages, setLoadingImages] = useState(false);

  const openImagesModal = (images, index) => {
    setOficinaIMGEditado(index);
    setSelectedImages(images);
    setTempImages([...images]); // Guardar una copia de las imágenes en tempImages
    setModalImagesIsOpen(true);
    setIsEditMode(false);
  };
  const confirmImageDelete = (index) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la imagen. ¿Estás seguro de continuar? (Los cambios no se harán hasta que confirmes la actualización)",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleImageDelete(index);
      }
    });
  };

  const handleImageDelete = (index) => {
    setDeletedImages([...deletedImages, index]);
    setTempImages(tempImages.filter((_, i) => i !== index));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setTempImages([...tempImages, reader.result]);
      };

      reader.readAsDataURL(file);
    }
  };

  const saveChanges = async () => {
    try {
      setLoadingImages(true); // Activar el cliploader y deshabilitar elementos

      const token = Cookies.get("token");
      const formData = new FormData();

      const fetchPromises = tempImages.map((image, index) => {
        if (image.startsWith("data:image")) {
          const blob = dataURLtoBlob(image);
          const file = new File([blob], `image${index}.png`, {
            type: "image/png",
          });

          formData.append("files", file);
        } else {
          return fetch(`${process.env.REACT_APP_SECURE_URL}${image}`)
            .then((res) => res.blob())
            .then((blob) => {
              const file = new File([blob], `newImage${index}.png`, {
                type: "image/png",
              });

              formData.append("files", file);
            });
        }
      });

      await Promise.all(fetchPromises);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/files/laboratories/${OficinaIMGEditado}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsEditMode(false);

      await fetchlaboratories(token);
      setPageSize(defaultPageSize);
      setPageNumber(0);
      Swal.fire({
        title: "Imágenes actualizadas exitosamente",
        icon: "info",
      });
    } catch (error) {
      console.error("Error al guardar imágenes:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al guardar las imágenes, ya no se puede dejar esté campo vacío",
      });
    } finally {
      setLoadingImages(false); // Desactivar el cliploader y habilitar elementos
    }
  };

  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([uint8Array], { type: "image/png" });
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const data = useMemo(() => Laboratorios, [Laboratorios]);

  const columns = useMemo(
    () => [
      {
        Header: "Edificio",
        accessor: "edificioNombre",
        Cell: ({ value }) => <div>{value}</div>,
      },
      {
        Header: "Nombre",
        accessor: "name",
      },
      {
        Header: "Imágenes",
        accessor: "imageUrls",
        Cell: ({ value, row }) => (
          <div>
            <button onClick={() => openImagesModal(value, row.original.id)}>
              Ver Imágenes
            </button>
          </div>
        ),
      },
      {
        Header: "Descripcion",
        accessor: "description",
        Cell: ({ value }) => (
          <div style={{ width: 500, whiteSpace: "pre-line" }}>
            {value ? value : <p className="requerido">Sin Descripción aún</p>}
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
              onClick={() => editarLaboratorio(original.id)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              className="botonEyD"
              title="Eliminar"
              onClick={() => eliminarLaboratorio(original.id)}
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
    <div className="Laboratorios">
      <h2>Laboratorios</h2>
      <p>
        ¡Bienvenido a la sección de administración de Laboratorios! Aquí podrás
        administrar y visualizar una lista de Laboratorios en tu aplicación.
        Puedes agregar nuevas Laboratorios, editar sus detalles existentes y
        eliminarlas individualmente. Esta herramienta ofrece una interfaz
        amigable para mantener y actualizar la información de las Laboratorios,
        proporcionando opciones claras para gestionar eficientemente los
        registros en tu sistema.
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
        <form onSubmit={handleSubmitAdd(onSubmit)}>
          <label>
            Edificio:
            <select
              className="Laboratorios input modalInput"
              {...registerAdd("edificio", { required: true })}
            >
              {edificios.map((edificio) => (
                <option key={edificio.id} value={edificio.id}>
                  {edificio.name}
                </option>
              ))}
            </select>
            {errorsAdd.edificio && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Nombre:
            <input
              className="Laboratorios input modalInput"
              {...registerAdd("nombre", {
                required: true,
                validate: (value) => value.trim().length > 3, // Validación para más de 3 letras
              })}
              placeholder="Nombre"
            />
            {errorsAdd.nombre && (
              <p className="requerido">El nombre debe tener más de 3 letras</p>
            )}
          </label>
          <label>
            Descripcion:
            <textarea
              className="Laboratorios input modalInput"
              {...registerAdd("descripcion", {
                required: true,
                validate: (value) => value.trim().length > 3,
              })}
              placeholder="Descripción"
              onChange={handleDescriptionChange}
              maxLength={MAX_DESCRIPTION_LENGTH}
              rows={4} // Cambia la cantidad de filas según tus preferencias
            />
            {errorsAdd.descripcion && (
              <p className="requerido">
                La descripción debe tener más de 3 caracteres
              </p>
            )}
            <p>
              Caracteres restantes: {remainingChars}/{MAX_DESCRIPTION_LENGTH}
            </p>
          </label>
          {loadingLaboratorio ? (
            <div className="botones">
              <ClipLoader
                color="#3d8463"
                loading={loadingLaboratorio}
                size={"90px"}
              />
              <div style={{ fontSize: "30px" }}>Agregando Laboratorio...</div>
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
        <h2>Editar Laboratorio</h2>
        <form onSubmit={handleSubmitEdit(onSubmitEditar)}>
          <label>
            Edificio:
            <select
              className="Laboratorios input modalInput"
              {...registerEdit("edificio", { required: true })}
            >
              {edificios.map((edificio) => (
                <option key={edificio.id} value={edificio.id}>
                  {edificio.name}
                </option>
              ))}
            </select>
            {errorsEdit.edificio && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Nombre:
            <input
              className="Laboratorios input modalInput"
              {...registerEdit("nombre", {
                required: true,
                validate: (value) => value.trim().length > 3, // Validación para más de 3 letras
              })}
              placeholder="Nombre"
            />
            {errorsEdit.nombre && (
              <p className="requerido">El nombre debe tener más de 3 letras</p>
            )}
          </label>
          <label>
            Descripcion:
            <textarea
              className="Laboratorios input modalInput"
              {...registerEdit("descripcion", {
                required: true,
                validate: (value) => value.trim().length > 3, // Validación para más de 3 letras
              })}
              placeholder="Descripción"
              onChange={handleDescriptionChange}
              maxLength={MAX_DESCRIPTION_LENGTH}
              rows={4} // Cambia la cantidad de filas según tus preferencias
            />
            {errorsEdit.descripcion && (
              <p className="requerido">
                La descripción debe tener más de 3 caracteres
              </p>
            )}
            <p>
              Caracteres restantes: {remainingChars}/{MAX_DESCRIPTION_LENGTH}
            </p>
          </label>
          {loadingLaboratorio ? (
            <div className="botones">
              <ClipLoader
                color="#3d8463"
                loading={loadingLaboratorio}
                size={"90px"}
              />
              <div style={{ fontSize: "30px" }}>
                Actualizando Laboratorio...
              </div>
            </div>
          ) : (
            <>
              <div className="btnContainer">
                <button type="submit" className="agregarBtn">
                  Agregar
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

        {tempImages.length > 0 ? (
          tempImages.map((imageUrl, index) => (
            <div
              key={index}
              style={{ position: "relative", textAlign: "center" }}
            >
              {isEditMode && (
                <button
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    zIndex: 1,
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                  }}
                  onClick={() => confirmImageDelete(index)}
                >
                  X
                </button>
              )}
              <img
                src={
                  imageUrl.startsWith("data:image")
                    ? imageUrl
                    : `${process.env.REACT_APP_SECURE_URL}${imageUrl}`
                }
                alt={`Imagen ${index + 1}`}
                style={{
                  width: "auto",
                  height: "150px",
                  borderRadius: 0,
                  padding: 10,
                  margin: "0 auto", // Centra la imagen
                  display: "block", // Hace que la imagen ocupe el ancho completo del contenedor
                  opacity: isEditMode ? 0.5 : 1,
                  objectFit: "cover",
                }}
              />
            </div>
          ))
        ) : (
          <h3>Sin imágenes aún. ¡Empieza a agregar imágenes!</h3>
        )}
        <div className="botones2">
          {loadingImages ? (
            <div className="botones">
              <ClipLoader
                color="#3d8463"
                loading={loadingImages}
                size={"90px"}
              />
              <div style={{ fontSize: "30px" }}>Actualizando Imágenes...</div>
            </div>
          ) : (
            <>
              {isEditMode && (
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handleImageUpload}
                />
              )}
              <button onClick={toggleEditMode} className="agregarBtn">
                {isEditMode ? "Cancelar Editar Imágenes" : "Editar Imágenes"}
              </button>
              <button
                className="cancelarBtn"
                onClick={() => setModalImagesIsOpen(false)}
              >
                Cerrar
              </button>
              {isEditMode && (
                <button className="agregarBtn" onClick={saveChanges}>
                  Guardar Cambios
                </button>
              )}
            </>
          )}
        </div>
      </Modal>

      <ToastContainer
        theme="colored"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="tablaLaboratorios">
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

export default Laboratorios;
