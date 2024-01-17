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
      codeOrNo: Number(data.codeOrNo), // Agrega el campo "code_or_no"
    };

    try {
      setLoadingOficina(true);
      const token = Cookies.get("token");

      const existingFaculty = Oficinas.find(
        (faculty) => faculty.name === data.nombre
      );
      if (existingFaculty) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ya existe una Oficina con ese nombre",
        });
        return;
      }

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

        setOficinas([...Oficinas, response.data]);
        setModalIsOpen(false);
        setLoading(true);

        await fetchoffices(token);
        setPageSize(defaultPageSize);
        setPageNumber(0);
        toast.success("Oficina agregada exitosamente!");
        resetAdd();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al agregar la Oficina",
      });
    } finally {
      setLoadingOficina(false);
    }
  };

  const editarOficina = (index) => {
    const token = Cookies.get("token");
    Swal.fire({
      title: "Verificando Oficina",
      text: "Por favor, espera...",
      icon: "info",
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    axios
      .get(`${process.env.REACT_APP_API_URL}/offices/${index}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const edificio = response.data;
        setOficinaEditado(edificio);

        setValueEdit("edificio", edificio.building.id);
        setValueEdit("nombre", edificio.name);
        setValueEdit("profesor", edificio.teacherName);
        setValueEdit("codeOrNo", edificio.codeOrNo);
        Swal.close();

        setModalEditarIsOpen(true);
      })
      .catch((error) => {
        fetchoffices(token);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al verificar Oficina, prueba de nuevo",
        });
        setPageSize(defaultPageSize);
        setPageNumber(0);
      });
  };

  const onSubmitEditar = async (data) => {
    const token = Cookies.get("token");

    try {
      const confirmResult = await Swal.fire({
        title: "¿Estás seguro de editar esta Oficina?",
        showDenyButton: true,
        confirmButtonText: `Continuar`,
        denyButtonText: `Cancelar`,
      });

      if (confirmResult.isConfirmed) {
        setLoadingOficina(true);
        // Realiza la petición tipo PATCH con el token
        await axios.patch(
          `${process.env.REACT_APP_API_URL}/offices/${OficinaEditado.id}`,
          {
            buildingId: data.edificio,
            name: data.nombre,
            teacherName: data.profesor,
            codeOrNo: data.codeOrNo,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOficinas(
          Oficinas.map((edif) => (edif === OficinaEditado ? data : edif))
        );

        await fetchoffices(token);

        toast.success("Oficina editada exitosamente!");
        setPageSize(defaultPageSize);
        setPageNumber(0);

        setModalEditarIsOpen(false);
        setLoadingOficina(false);
      }
      resetEdit();
    } catch (error) {
      await fetchoffices(token);

      setLoadingOficina(false);
      Swal.fire({
        title: "Error al editar la Oficina",
        text: error.response?.data?.message || "Hubo un error inesperado",
        icon: "error",
      });
      setPageSize(defaultPageSize);
      setPageNumber(0);
    }
  };

  const eliminarOficina = async (oficinaId) => {
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
          error.response.data.message || "Hubo un error al eliminar la Oficina",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(true);
  const [loadingOficina, setLoadingOficina] = useState(false); // Modificado: Inicializado en "false"

  const [pageNumber, setPageNumber] = useState(0);
  const [defaultPageSize, setDefaultPageSize] = useState(5);

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

  const [isEditMode, setIsEditMode] = useState(false);
  const [tempImages, setTempImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [modalImagesIsOpen, setModalImagesIsOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
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
        `${process.env.REACT_APP_API_URL}/files/offices/${OficinaIMGEditado}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsEditMode(false);

      await fetchoffices(token);
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
        administrar y visualizar una lista de Oficinas en tu aplicación. Puedes
        agregar nuevas Oficinas, editar sus detalles existentes y eliminarlas
        individualmente. Esta herramienta ofrece una interfaz amigable para
        mantener y actualizar la información de las Oficinas, proporcionando
        opciones claras para gestionar eficientemente los registros en tu
        sistema.
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
        <form onSubmit={handleSubmitAdd(onSubmit)}>
          <label>
            Edificio:
            <select
              className="Oficinas input modalInput"
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
              className="Oficinas input modalInput"
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
        <form onSubmit={handleSubmitEdit(onSubmitEditar)}>
          <label>
            Edificio:
            <select
              className="Oficinas input modalInput"
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
              className="Oficinas input modalInput"
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
            Nombre:
            <input
              className="Oficinas input modalInput"
              {...registerEdit("profesor", {
                required: false,
              })}
              placeholder="Profesor"
            />
          </label>
          <label>
            Código o Número:
            <input
              className="Oficinas input modalInput"
              {...registerEdit("codeOrNo", {
                required: false,
              })}
              placeholder="Código o Número"
            />
            {errorsEdit.codeOrNo && (
              <p className="requerido">"Este campo es requerido"</p>
            )}
          </label>
          {loadingOficina ? (
            <div className="botones">
              <ClipLoader
                color="#3d8463"
                loading={loadingOficina}
                size={"90px"}
              />
              <div style={{ fontSize: "30px" }}>Actualizando Oficina...</div>
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
