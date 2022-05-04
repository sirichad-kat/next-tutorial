import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import axios from "axios";
import ServiceUrl from "../../configs/servicePath";
import { isEmpty } from "../../configs/function";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import moment from "moment";
import DataTable from "react-data-table-component";
import ReportDataTable from "../ReportDataTable";
import CircularProgress from "../circularprogress";
import * as NavigateAction from "../../redux/actions/NavigateAction";


const ModalPending = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user);

  const [initPeriod, setInitPeriod] = useState({
    overdue: 0,
    comingClose: 0,
  });

  const [periodRadio, setPeriodRadio] = useState("TODAY");
  const [pendingData, setPendingData] = useState([]);

  const [selectedLabDoc, setSelectedLabDoc] = useState("");
  const [selectedReport, setSelectedReport] = useState("");

  const [isDataTableLoading, setIsDataTableLoading] = useState(false);


  const getSampleReceiveData = () => {
    setIsDataTableLoading(true);
    const reqPending = {
      connection: userInfo.connection,
      username: userInfo.username,
      orgCode: userInfo.orgCode,
      lang: userInfo.language,
      pendingCriteria: periodRadio,
    };
    axios
      .post(ServiceUrl.urlLabMgt + "SearchPendingSampleReceive", reqPending)
      .then((response) => {
        setPendingData([...response.data]);
        setIsDataTableLoading(false);
      })
      .catch((error) => {
        console.log(error)
        setIsDataTableLoading(false);
      });
  };

  useEffect(() => {
    if (props.open) {
      console.log("MOUNTED");
      getSampleReceiveData();
    }
  }, [props.open]);

  useEffect(() => {
    console.log("PENDING DATA UPDATED");
    console.log(pendingData);
  }, [pendingData]);

  useEffect(() => {
    getSampleReceiveData();
  }, [periodRadio]);

  const customRowStyles = [
    {
      when: (row) => row,
      style: (row) => ({
        color: row.priorityyn === "Y" ? "red" : "inherit",
        fontWeight: row.labIdFrom === "LAB_CENTER" ? "bold" : "inherit",
        backgroundColor: row.toggleSelected ? "#34c5b24d" : "inherit",
      }),
    },
  ];

  const columns = [
    {
      name: "Lab No.",
      selector: (row) => row.labNo,
      maxWidth: "15%",
      wrap: true,
    },
    {
      name: "Description",
      selector: (row) => row.sampleDescr,
      maxWidth: "20%",
      wrap: true,
    },
    {
      name: "Lab From",
      selector: (row) => row.labRoomFrom ?? row.labIdFrom,
      maxWidth: "12%",
      wrap: true,
    },
    {
      name: "Lab To",
      selector: (row) => row.labRoomTo ?? row.labIdTo,
      maxWidth: "12%",
      wrap: true,
    },
    {
      name: "Expected Date",
      selector: (row) => row.expectedFinDt,
      format: (row) =>
        isEmpty(row.expectedFinDt)
          ? ""
          : moment(row.expectedFinDt).format(props.formatDate.toUpperCase()),
      wrap: true,
      maxWidth: "15%",
    },
    {
      name: "Disease",
      selector: (row) => row.disease,
      wrap: true,

    },
  ];

  const handleRowClicked = (row) => {
    const newPendingData = [...pendingData].map((item) => {
      if (item.labNo === row.labNo && item.sampleSeq === row.sampleSeq) {
        if (item.toggleSelected) {
          setSelectedLabDoc("");
        } else {
          setSelectedLabDoc(item);
        }
        return {
          ...item,
          toggleSelected: !item.toggleSelected,
        };
      } else {
        return {
          ...item,
          toggleSelected: false,
        };
      }
    });
    setSelectedReport("");
    setPendingData(newPendingData);
  };

  const handleReportClicked = (row) => {
    setSelectedReport(row);
    setSelectedLabDoc("");

    const newPendingData = [...pendingData].map((item) => {
      return {
        ...item,
        toggleSelected: false,
      };
    });
    setPendingData(newPendingData);
  };

  const expandableRowsComponentProps = {
    reportStatus: "",
    includeCancelRequest: false,
    includeSentMail: false,
    handleReportClicked: handleReportClicked,
    currentSelected: selectedReport,
    currentLabSelected: selectedLabDoc,
    reportNoWidth: 20
  };

  const handleRowDoubleClicked = (row, event) => {
    // console.log(row);
    if (row.sampleAdjyn === "Y") {
      const reqProgramCode = {
        connection: userInfo.connection,
        username: userInfo.username,
        orgCode: userInfo.orgCode,
        labIdTo: row.labIdTo,
      };
      axios
        .post(ServiceUrl.urlLabMgt + "GetLabRoomProgramCode", reqProgramCode)
        .then((res) => {
          const programCodeMap = res.data;
          const programCode =
            programCodeMap.length > 0
              ? programCodeMap[0].programcode.split(",")
              : [];
          if (programCode.length === 1) {
            router.push(
              {
                pathname: `/Laboratory/${programCode[0]}`,
              },
              `/Laboratory/${programCode[0]}`
            );
            dispatch(
              NavigateAction.setDataNavigateObj({
                orgCode: userInfo.orgCode,
                labNo: row.labNo,
                sampleSeq: row.sampleSeq,
                aniId: row.aniId,
                labIdFrom: row.labIdFrom,
                labIdTo: row.labIdTo,
                sampleFst: row.sampleFst,
                program: "SSLABM03500",
                isNew: false,
              })
            );
          } else if (programCode.length > 1) {
            if (programCodeMap[0].labIdFrom === "LAB_PATHO") {
              router.push(
                {
                  pathname: `/Laboratory/${programCode[1]}`,
                },
                `/Laboratory/${programCode[1]}`
              );
              dispatch(
                NavigateAction.setDataNavigateObj({
                  orgCode: userInfo.orgCode,
                  labNo: row.labNo,
                  sampleSeq: row.sampleSeq,
                  aniId: row.aniId,
                  labIdFrom: row.labIdFrom,
                  labIdTo: row.labIdTo,
                  sampleFst: row.sampleFst,
                  program: "SSLABM03500",
                  isNew: false,
                })
              );
            } else {
              router.push(
                {
                  pathname: `/Laboratory/${programCode[0]}`,
                },
                `/Laboratory/${programCode[0]}`
              );
              dispatch(
                NavigateAction.setDataNavigateObj({
                  orgCode: userInfo.orgCode,
                  labNo: row.labNo,
                  sampleSeq: row.sampleSeq,
                  aniId: row.aniId,
                  labIdFrom: row.labIdFrom,
                  labIdTo: row.labIdTo,
                  sampleFst: row.sampleFst,
                  program: "SSLABM03500",
                  isNew: false,
                })
              );
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (row.sampleAdjyn === "N") {
      if (row.normalForm === "Y") {
        console.log({
          orgCode: userInfo.orgCode,
          labNo: row.labNo,
          sampleSeq: row.sampleSeq,
          aniId: row.aniId,
          labIdFrom: row.labIdFrom,
          labIdTo: row.labIdTo,
          sampleFst: row.sampleFst,
          program: "SSLABM03500",
          isNew: false,
        });
        router.push(
          {
            pathname: "/Laboratory/SSLABM01300",
          },
          "/Laboratory/SSLABM01300"
        );
        dispatch(
          NavigateAction.setDataNavigateObj({
            orgCode: userInfo.orgCode,
            labNo: row.labNo,
            sampleSeq: row.sampleSeq,
            aniId: row.aniId,
            labIdFrom: row.labIdFrom,
            labIdTo: row.labIdTo,
            sampleFst: row.sampleFst,
            program: "SSLABM03500",
            isNew: false,
          })
        );
      } else if (row.normalForm === "N") {
        router.push(
          {
            pathname: "/Laboratory/SSLABM01400",
          },
          "/Laboratory/SSLABM01400"
        );
        dispatch(
          NavigateAction.setDataNavigateObj({
            orgCode: userInfo.orgCode,
            labNo: row.labNo,
            sampleSeq: row.sampleSeq,
            aniId: row.aniId,
            labIdFrom: row.labIdFrom,
            labIdTo: row.labIdTo,
            sampleFst: !isEmpty(
              allLabStatus.find((i) => i.desc === row.sampleFst)
            )
              ? allLabStatus.find((i) => i.desc === row.sampleFst).gdcode
              : row.sampleFst,
            program: "SSLABM03500",
            isNew: false,
          })
        );
      }
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onCancel}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="scroll-dialog-title">{props.title}</DialogTitle>
      <DialogContent dividers>
        <div className="row">
          <div className="col-12">
            <RadioGroup
              aria-label="Pending period"
              name="pendingPeriod"
              value={periodRadio}
              onChange={(e) => setPeriodRadio(e.target.value)}
            >
              <FormControlLabel
                value="TODAY"
                control={<Radio />}
                label="Today"
                className="mr-3"
              />
              <FormControlLabel
                value="COMING_CLOSE"
                control={<Radio />}
                label="Coming Close"
                className="mx-3"
              />
              <FormControlLabel
                value="OVERDUE"
                control={<Radio />}
                label="Overdue"
                className="mx-3"
              />
            </RadioGroup>
          </div>
          <div className="col-12">
            <DataTable
              columns={columns}
              data={pendingData}
              conditionalRowStyles={customRowStyles}
              onRowClicked={handleRowClicked}
              persistTableHead
              // pagination
              // paginationServer
              // paginationTotalRows={allDataRows}
              // onChangeRowsPerPage={handlePerRowsChange}
              // onChangePage={handlePageChange}
              striped
              expandableRows
              progressPending={isDataTableLoading}
              progressComponent={<CircularProgress />}
              expandableRowsComponent={ReportDataTable}
              expandableRowsComponentProps={expandableRowsComponentProps}
              onRowDoubleClicked={handleRowDoubleClicked}
            />
            {/* TODO: Change grid to react-data-table-component since ag-grid is not allow collapse row */}
            {/* <div
              className="ag-theme-cpf"
              style={{
                width: "100%",
                minHeight: "30vh",
                height: "100%",
              }}
            >
              <AgGridReact domLayout="normal" rowData={pendingData}>
                <AgGridColumn
                  field="labNo"
                  minWidth={150}
                ></AgGridColumn>
                <AgGridColumn
                  field="sampleDescr"
                  minWidth={350}
                  wrapText={true}
                  headerName="Description"
                ></AgGridColumn>
                <AgGridColumn
                  field="labRoomFrom"
                  width={110}
                  headerName="Lab From"
                ></AgGridColumn>
                <AgGridColumn
                  field="labRoomTo"
                  width={110}
                  headerName="Lab To"
                ></AgGridColumn>
                <AgGridColumn
                  field="expectedFinDt"
                  minWidth={150}
                  headerName="Expected Date"
                  valueFormatter={dateFormatter}
                ></AgGridColumn>
                <AgGridColumn
                  field="disease"
                  minWidth={200}
                  wrapText={true}
                ></AgGridColumn>
              </AgGridReact>
            </div> */}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <div style={{ flex: "1 0 0" }} />
        <button className="btn btn-primary-theme" onClick={props.onCancel}>
          OK
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalPending;
