import React, { useMemo, useState, useEffect } from "react";
import { useTable, usePagination, useFilters } from "react-table";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Defaultimg from "../../assets/Default.jpg";

import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "../../styles/Administrador/Administradores.css";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

const Administradores = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [administradores, setAdministradores] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(true);
  const [loadingNew, setLoadingNew] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [defaultPageSize, setDefaultPageSize] = useState(5);
  const adminId = Cookies.get("id");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const fetchAdministradores = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const filteredAdmins = response.data.filter((user) =>
        user.roles.includes("admin")
      );
      setAdministradores(filteredAdmins);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAdministradores();
  }, [token]);

  const onSubmit = async (data) => {
    try {
      const { name, lastname, email, password } = data;
      const registerDate = new Date().toISOString();

      const confirmResult = await Swal.fire({
        title: "Confirmar ingreso",
        text: "¿Estas seguro de agregar este nuevo administrador?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      if (confirmResult.isConfirmed) {
        // Validar contraseña y confirmar contraseña
        if (password !== confirmPassword) {
          Swal.fire({
            title: "Error",
            text: "Las contraseñas no coinciden",
            icon: "error",
          });
          return;
        }

        setLoadingNew(true);

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/admin-register`,
          {
            email,
            password,
            name,
            lastname,
            registerDate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("¡Administrador agregado correctamente!");

        setModalIsOpen(false);

        fetchAdministradores();
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text:
          error.response.data.message ||
          "Hubo un error al agregar el administrador",
        icon: "error",
      });
    } finally {
      setLoadingNew(false);
    }
  };

  const eliminarAdministrador = async (id) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Confirmar eliminación",
        text: "¿Estás seguro de eliminar este administrador?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        dangerMode: true,
      });
  
      if (confirmResult.isConfirmed) {
        setLoading(true);
  
        await axios.delete(`${process.env.REACT_APP_API_URL}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Espera a que se resuelva la promesa antes de continuar
        await fetchAdministradores();
  
        toast.success("¡Administrador eliminado correctamente!");
  
        // Actualiza el estado local para forzar la recarga de datos
        setPageSize(defaultPageSize);
        setPageNumber(0);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text:
          error.response.data.message ||
          "Hubo un error al eliminar el administrador",
        icon: "error",
      });
      await fetchAdministradores();
      setPageSize(defaultPageSize);
      setPageNumber(0);
    } finally {
      setLoading(false);
    }
  };
  

  const data = useMemo(() => administradores, [administradores]);

  const columns = useMemo(
    () => [
      {
        Header: "Foto",
        accessor: "imageUrl", // Key para la imagen
        Cell: ({ value }) => (
          <img
            src={value || Defaultimg}
            alt="Avatar"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ),
        disableFilters: true, // Deshabilita los filtros para esta columna
      },
      {
        Header: "Nombre",
        accessor: "name",
      },
      {
        Header: "Apellido",
        accessor: "lastname",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Fecha de Registro",
        accessor: "registerDate",
      },
      {
        Header: "Estado",
        accessor: "isVerified",
        Cell: ({ value }) => (value ? "Verificado" : "No Verificado"),
      },
      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <div>
            {adminId === row.original.id ? (
              <p className="requerido">Usuario Actual</p>
            ) : (
              <button
                className="botonEyD"
                title="Eliminar"
                onClick={() => eliminarAdministrador(row.original.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>
        ),
      },
    ],
    [adminId]  // Asegúrate de incluir adminId como dependencia
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
    <div className="administradores">
      <h2>Administradores</h2>
      <br />
      <p>
        ¡Bienvenido a la sección de administración de Administradores! Aquí
        podrás ver y gestionar una lista de administradores en la aplicación.
        Puedes agregar nuevos administradores introduciendo sus detalles en un
        formulario, eliminar registros existentes y buscar información
        específica utilizando la función de búsqueda. Es una herramienta simple
        pero poderosa para controlar y mantener a los administradores de la
        aplicación de manera eficiente.
      </p>
      <br />
      <button onClick={() => setModalIsOpen(true)}>
        Agregar Administrador
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modalContent"
        overlayClassName="modalOverlay"
      >
        <h2>Agregar nuevo administrador</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Nombre:
            <input
              className="administradores input modalInput"
              {...register("name", {
                required: true,
                minLength: 3,
                maxLength: 20,
                pattern: /^[^\s]+$/,
              })}
              placeholder="Nombre"
            />
            {errors.name?.type === "required" && (
              <p className="requerido">Este campo es requerido</p>
            )}
            {errors.name?.type === "minLength" && (
              <p className="requerido">
                El nombre debe tener al menos 3 caracteres
              </p>
            )}
            {errors.name?.type === "maxLength" && (
              <p className="requerido">
                El nombre no debe exceder los 20 caracteres
              </p>
            )}
            {errors.name?.type === "pattern" && (
              <p className="requerido">El nombre no debe contener espacios</p>
            )}
          </label>
          <label>
            Apellido:
            <input
              className="administradores input modalInput"
              {...register("lastname", {
                required: true,
                minLength: 3,
                maxLength: 20,
                pattern: /^[^\s]+$/,
              })}
              placeholder="Apellido"
            />
            {errors.lastname?.type === "required" && (
              <p className="requerido">Este campo es requerido</p>
            )}
            {errors.lastname?.type === "minLength" && (
              <p className="requerido">
                El apellido debe tener al menos 3 caracteres
              </p>
            )}
            {errors.lastname?.type === "maxLength" && (
              <p className="requerido">
                El apellido no debe exceder los 20 caracteres
              </p>
            )}
            {errors.lastname?.type === "pattern" && (
              <p className="requerido">El apellido no debe contener espacios</p>
            )}
          </label>
          <label>
            Email:
            <input
              className="administradores input modalInput"
              {...register("email", { required: true })}
              placeholder="Email"
            />
            {errors.email && (
              <p className="requerido">Este campo es requerido</p>
            )}
          </label>
          <label>
            Contraseña:
            <br />
            <div className="passwordContainer">
              <input
                className="administradores input modalInput"
                {...register("password", {
                  required: true,
                  pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                })}
                placeholder="Contraseña"
                type={showPassword ? "text" : "password"}
              />

              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                onClick={() => setShowPassword(!showPassword)}
                className="passwordIcon"
              />
            </div>
            {errors.password?.type === "required" && (
              <p className="requerido">Este campo es requerido</p>
            )}
            {errors.password?.type === "pattern" && (
              <p className="requerido">
                La contraseña debe tener al menos una mayúscula, una minúscula y
                un número (8 caracteres mínimo)
              </p>
            )}
          </label>
          <label>
            Confirmar Contraseña:
            <br />
            <div className="passwordContainer">
              <input
                className="administradores input modalInput"
                {...register("confirmPassword", {
                  required: true,
                  pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                })}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar Contraseña"
                type={showConfirmPassword ? "text" : "password"}
              />

              <FontAwesomeIcon
                icon={showConfirmPassword ? faEye : faEyeSlash}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="passwordIcon"
              />
            </div>
            {errors.confirmPassword?.type === "required" && (
              <p className="requerido">Este campo es requerido</p>
            )}
            {errors.confirmPassword?.type === "pattern" && (
              <p className="requerido">
                La contraseña debe tener al menos una mayúscula, una minúscula y
                un número.
              </p>
            )}
          </label>

          <div className="btnContainer">
            {loadingNew ? (
              <div className="botones">
                <ClipLoader
                  color="#3d8463"
                  loading={loadingNew}
                  size={"50px"}
                />
                <div style={{ fontSize: "20px" }}>Ingresando Usuario...</div>
              </div>
            ) : (
              <>
                <button type="submit" className="agregarBtn">
                  Agregar
                </button>
                <button
                  className="cancelarBtn"
                  onClick={() => setModalIsOpen(false)}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </form>
      </Modal>
      <ToastContainer />
      <div className="tablaAdministradores">
        {loading ? (
          <div className="botones">
            <ClipLoader color="#3d8463" loading={loading} size={"90px"} />
            <div style={{ fontSize: "30px" }}>
              Actualizando Datos de la Tabla...
            </div>
          </div>
        ) : (
          <>
            <table
              {...getTableProps()}
              style={{ borderRadius: "50px 50px 25px 25px" }}
            >
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
              pageNumber = Math.min(Math.max(pageNumber, 1), pageCount || 1); // Limita el valor entre 1 y pageCount o 1 si pageCount no está disponible
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
      </div>{" "}
    </div>
  );
};

export default Administradores;
