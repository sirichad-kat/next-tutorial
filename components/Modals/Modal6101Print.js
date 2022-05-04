import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import DataTable from "react-data-table-component";
import CheckboxTable from "../../components/CheckBoxTheme";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { isEmpty } from "../../configs/function";
import { useTranslation } from "react-i18next";
import VisibilityControl from "../../components/VisibilityControl";
import useVisibilityControl from "../../hooks/useVisibilityControl";
import ServiceUrl from "../../configs/servicePath";
import DynamicTextArea from "../../components/DynamicTextArea";

const Lookup = (props) => {
  const programId = props.programId ?? ""
  const { t, i18n } = useTranslation(programId);
  const controller = useVisibilityControl(programId);
  const selectCheckBoxProps = { indeterminate: isIndeterminate => isIndeterminate };
  const userInfo = useSelector((state) => state.user);
  const title = props.title ?? ""
  const isApprove = props.isApprove ?? false
  const isGenerate = props.isGenerate ?? false
  const isUncer = props.isUncer ?? false
  const [dataUncer, setDataUncer] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const [reportTypes, setReportTypes] = useState([]);
  const inputInitial = {
    reportType: "RPT_NORMAL",
    sendMail: false,
    remark: ""
  }
  const [input, setInput] = useState(inputInitial);
  const columnList = [
    {
      name: "Item",
      selector: (row) => row.diseaseId,
      wrap: true,
      maxWidth: "100%",
    }
  ];

  useEffect(() => {
    if (props.open) {
      const reqReportType = {
        connection: userInfo.connection,
        lang: userInfo.language,
        orgCode: userInfo.orgCode
      };
      axios
        .post(ServiceUrl.urlResult + "GetLabApprovalReportType", reqReportType)
        .then((response) => {
          setReportTypes(response.data);
        })
        .catch((error) => console.log(error));
      // setInput(inputInitial)
      if (isApprove) {
        setDataUncer(props.dataUncer ? props.dataUncer.map(d => {
          return { ...d, isSelected: true }
        }) : [])
        setSelectData(props.dataUncer)
        const reqDefaultSendMail = {
          connection: userInfo.connection,
          keyName: "DEFAULT_SENDMAIL",
          programCode: programId,
        };
        axios
          .post(ServiceUrl.urlBase + "GetInitValue", reqDefaultSendMail)
          .then((response) => {
            console.log(response.data)
            setInput({ ...inputInitial, sendMail: response.data === "Y" })
          })
          .catch((error) => console.log(error));
      }
      else {
        setInput(inputInitial)
      }
    }
  }, [props.open]);

  const handleReportTypeRadio = (e) => {
    const value = e.target.value;
    const newInput = {
      ...input,
      reportType: value,
    };
    setInput(newInput);
  };
  const handleSendMailCheckBox = (e) => {
    const checked = e.target.checked;
    setInput({ ...input, sendMail: checked })
  }
  const handleSelectedDataRow = ({ allSelected, selectedCount, selectedRows }) => {
    setSelectData(selectedRows)
    // const newData = dataUncer.map(d=> {
    //   const isSelected = selectedRows.find(sel=> sel.diseaseId === d.diseaseId)
    //   return 
    // })
    dataUncer.forEach(d => {
      const isSelected = selectedRows.find(sel => sel.diseaseId === d.diseaseId)
      d.isSelected = isSelected ? true : false
    })
    setDataUncer(dataUncer)
  }

  const handleOkBtn = () => {
    props.onOk(input, selectData)
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.onCancel}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <div className="row Label-Inline">
          <VisibilityControl controller={controller} id="vsb-reportType">
            <label id="lblReportType" className="col-md-3 col-lg-3">
              {t(programId + ":lblReportType", "Report Type")} :
            </label>
            <div className="col-md-9 col-lg-9">
              <RadioGroup
                id="rdoReportType"
                value={input ? input.reportType : ""}
                onChange={handleReportTypeRadio}
                style={{ marginLeft: "5px" }}
              >
                {reportTypes.map((d) => (
                  <FormControlLabel
                    key={d.code}
                    value={d.code}
                    className="col-md-12 col-lg-5-5"
                    control={
                      <Radio
                        id={`rdoReportType_${d.code}`}
                        color="primary"
                        size="small"
                        style={{ padding: "5px" }}
                      />
                    }
                    label={<span id={`lblReportType_${d.code}`}>{d.name}</span>}
                  />
                ))}
              </RadioGroup>
            </div>
          </VisibilityControl>
        </div>
        {isApprove ? (
          <React.Fragment>
            <div className="row">
              <VisibilityControl controller={controller} id="vsb-sendMail">
                <div className="col-md-3 col-lg-3"></div>
                <div
                  className="col-md-8 col-lg-8"
                  style={{ marginLeft: "5px" }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="chkApplyAll"
                        checked={input.sendMail}
                        onChange={handleSendMailCheckBox}
                        color="primary"
                        size="small"
                        style={{ padding: "5px" }}
                      />
                    }
                    label="Send mail to customer"
                  />
                </div>
              </VisibilityControl>
            </div>
            {isUncer ? <div className="row">
              <div className="col-md-12 col-lg-12">
                <DataTable
                  columns={columnList}
                  data={dataUncer}
                  // conditionalRowStyles={selectedLkRowStyle}
                  // progressPending={loadingLookup}
                  // progressComponent={<CircularProgress />}
                  selectableRows
                  selectableRowsHighlight
                  selectableRowsComponent={CheckboxTable}
                  selectableRowsComponentProps={selectCheckBoxProps}
                  onSelectedRowsChange={handleSelectedDataRow}
                  selectableRowSelected={(row) => row.isSelected}
                  persistTableHead
                  noHeader
                  striped
                />
              </div>
            </div> : null}
          </React.Fragment>
        ) : null}
        {isGenerate ? (
          <React.Fragment>
            <VisibilityControl controller={controller} id="vsb-remark">
              <div className="row">
                <label id="lblRemark" className="col-md-12 col-lg-12">
                  {t(programId + ":lblRemark", "Remark")} :
                </label>
              </div>
              <div className="col-md-12 col-lg-12 px-0">
                <DynamicTextArea
                  id="txtRemark"
                  name="remark"
                  className="form-control"
                  value={input ? input.remark : ""}
                  onChange={(e) => {
                    setInput({ ...input, remark: e.target.value });
                  }}
                />
              </div>
            </VisibilityControl>
          </React.Fragment>
        ) : null}
      </DialogContent>
      <DialogActions>
        <button
          id="btnOk"
          className="btn btn-primary-theme"
          onClick={handleOkBtn}
        >
          <span id="lblBtnOk">OK</span>
        </button>
        <button
          id="btnClose"
          className="btn btn-cancel-theme"
          onClick={props.onCancel}
        >
          <span id="lblBtnClose">Cancel</span>
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default Lookup;
