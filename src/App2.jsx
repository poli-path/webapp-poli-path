import { useState } from 'react'
import DataTable from "react-data-table-component";

export const customStylesTable = {
  rows: {
    style: {
      border: "1px solid #9b9b9b",
      minHeight: "20px", // override the row height
    },
  },
  headCells: {
    style: {
      border: "1px solid white",
      paddingLeft: "8px", // override the cell padding for head cells
      paddingRight: "8px",
      backgroundColor: "#004e74 !important",
      color: "white",
      fontSize: "0.9em",
      fontWeight: "bold",
      center: true,
      textAlign: "center !important",
      justifyContent: "center"
    },
  },
  cells: {
    style: {
      paddingLeft: "8px", // override the cell padding for data cells
      paddingRight: "8px",
      paddingBottom: "5px",
      paddingTop: "5px",
      fontSize: "0.9em",
      center: false,
      textAlign: "left"
    },
  },
};

export const columnsTable = [
  {
    name: "No.",
    selector: "ID",
    sortable: true,
    center: true,
    width: "6%",
  },
  {
    name: "Identificacion",
    selector: "identificacion",
    sortable: true,
    center: true,
    width: "17%",
  },
  {
    name: "Nombre",
    selector: "nombre",
    //center: true,
    sortable: true,
    width: "50%",
  },
  {
    name: 'Estados',
    selector: "estado",
    center: true,
    width: "15%",
  },
  {
    name: "",
    selector: "buttons",
    center: true,
    width: "12%",
  },
];

const DATOS = [
  {
    ID: 1,
    identificacion: "1721313213",
    nombre: "Nombre de persona 1",
    estado: true
  }
]

function App() {

  const [totalRow, setTotalRow] = useState(0);
  const [actualPage, setActual] = useState(0);
  const [elementsPage, setElementsPage] = useState(10);
  const [actualPagination, setActualPagination] = useState(1);
  const [loadRec, setLoadRec] = useState(false); // Muetra un spinners
  const [data, setData] = useState(DATOS);


  const handleConsultarRecolecciones = (a) => {
    setActualPagination(a);
    setTotalRow(0);
  };

  const changeElements = (e, i) => {
    console.log("Rows per page", e);
    console.log("Actual page", actualPage);
    setElementsPage(e);
    handleConsultarRecolecciones(actualPage);
  };

  const mapperTable = () => { // Renderiza las celdas

    if (data.length > 0) {
      var resul = [];
      data.map((item, key) => {
        resul.push({
          ID: item.ID,
          identificacion: item.identificacion,
          nombre: item.nombre,
          estado: item.estado ? (
            <span> Activo</span>
          ) : (
            <span> Inactivo </span>
          ),

          buttons: (
            <div>
              <center>
                <button
                  disabled={!item.estado}
                  style={{
                    marginTop: "5px",
                    fontSize: "10px",
                    width: "60%",
                  }}
                >
                  <span> Editar </span>
                </button>
              </center>

              <center>
                <button
                  style={{
                    marginTop: "5px",
                    fontSize: "10px",
                    width: "60%",
                  }}

                >
                  <span> Eliminar </span>
                </button>
              </center>
            </div>

          ),
        });
      });
      return resul;
    } else {
      return [];
    }
  };

  return (
    <DataTable
      style={{ backgroundColor: "#f0f3f5", width: "200px" }}
      columns={columnsTable}
      data={mapperTable()}
      highlightOnHover
      noDataComponent={"Sin registros en la tabla"}
      persistTableHead={true}
      noHeader={true}
      progressPending={loadRec}
      progressComponent={
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
          Cargando...
        </div>
      }
      customStyles={customStylesTable}
      pagination
      paginationServer
      paginationTotalRows={totalRow}
      onChangeRowsPerPage={changeElements}
      onChangePage={handleConsultarRecolecciones}
    />
  )
}

export default App
