import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
// import "antd/dist/antd.css";
import Swal from "sweetalert2";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DataTable from "react-data-table-component";
import ServiceUrl from "../../configs/servicePath";
import { useTranslation } from "react-i18next";
import { selectedLkRowStyle, textCellAlignTop, isEmpty } from "../../configs/function";
import CheckboxTable from "../../components/CheckBoxTheme";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import VisibilityControl from "../../components/VisibilityControl";
import useVisibilityControl from "../../hooks/useVisibilityControl";
import DynamicTextArea from "../../components/DynamicTextArea";
import CircularProgress from "../../components/circularprogress";

const Lookup = (props) => {
  const programId = props.programId ?? ""
  const { t, i18n } = useTranslation("ModalUnlockLabApproval");
  const controller = useVisibilityControl(programId);
  const selectCheckBoxProps = { indeterminate: isIndeterminate => isIndeterminate };
  const userInfo = useSelector((state) => state.user);
  const dataHeader = props.dataHeader ?? null

  const [datas, setDatas] = useState([]);
  const [selectUnlockList, setSelectUnlockList] = useState([]);
  const [unlockRemarks, setUnlockRemarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputInitial = {
    unlockRemarkCode: "",
    remarks: "",
    unlockRemarkSelect: null
  }
  const [input, setInput] = useState(inputInitial);
   
   useEffect(async () => {
      const reqSampleFst = {
        connection: userInfo.connection,
        lang: userInfo.language,
        gdtype: "GD072",
      };
      axios
        .post(ServiceUrl.urlBase + "GetGeneralDescList", reqSampleFst)
        .then((response) => {
          setUnlockRemarks(response.data);
        })
        .catch((error) => console.log(error));
   }, []);
   
   useEffect(async () => {
     if (props.open) {
      setInput(inputInitial)
      setSelectUnlockList([]);
       if (dataHeader) {
         setLoading(true)
         const reqUnlock = {
           connection: userInfo.connection,
           programId: programId,
           lang: userInfo.language,
           userName: userInfo.username,
           orgCode: dataHeader.orgCode,
           labNo: dataHeader.labNo,
           sampleTid: dataHeader.sampleTid
         };
         axios
           .post(ServiceUrl.urlResult + "GetItemForUnlock", reqUnlock)
           .then((response) => {
             setDatas(response.data)
            setLoading(false)
           })
           .catch((error) => {console.log(error);  setLoading(false)});
       } else {
         setDatas([]);
       }
     }
   }, [props.open]);

   const handleSelectRemark = (selected) => {
    if (selected !== null) {
      setInput({...input, unlockRemarkCode: selected.gdcode, unlockRemarkSelect: selected })
    } else {
      setInput({ ...input, unlockRemarkCode: "", unlockRemarkSelect: null });
    }
  };

   const handleSelectedDataRow = ({ allSelected, selectedCount, selectedRows }) => {
    setSelectUnlockList(selectedRows)
  }

   const checkRequire = () => {
      let isValid = true
      let errtxt = ""
     if (isEmpty(selectUnlockList)) {
        errtxt += "Please Select Item! <br>";
        isValid = false;
     }
     if (isEmpty(input.unlockRemarkCode)) {
        errtxt += "Remark <br>";
        isValid = false;
     }
     if (!isValid) {
        errtxt = "<p>" + errtxt + " Cannot Be Empty! </p>";
        Swal.fire({
           icon: "warning",
           title: "Invalid",
           html: errtxt,
           confirmButtonText: "OK",
        });
     }
      return isValid
   }

   const handleOk = () => {
    if(checkRequire()){
      setDatas([]);
      props.onOk(selectUnlockList, input);
    }    
   }

   const handleClose = () => {
      setDatas([]);
      props.onCancel();
   }

   return (
     <Dialog
       open={props.open}
       onClose={handleClose}
       scroll="paper"
       aria-labelledby="scroll-dialog-title"
       aria-describedby="scroll-dialog-description"
       maxWidth="sm"
       fullWidth
     >
       <DialogTitle id="scroll-dialog-title">
         {/* {t("SSLABM06100:lblViewData", "View Data")} */}
       </DialogTitle>
       <DialogContent>
         <div className="row">
           <div className="col-md-12 col-lg-12">
             <DataTable
               conditionalRowStyles={selectedLkRowStyle}
               columns={[
                 {
                   name: t("SSLABM06100:colUnlockSeq", "Seq"),
                   selector: (row) => row.seq,
                   wrap: true,
                   center: true,
                   maxWidth: "5%",
                   minWidth: "75px",
                 },
                 {
                   name: t("SSLABM06100:colUnlockItem", "Item"),
                   selector: (row) => row.diseaseId,
                   wrap: true,
                   maxWidth: "35%",
                 },
                 {
                   name: t("SSLABM06100:colUnlockResult1", "Result 1"),
                   selector: (row) => row.result1,
                   wrap: true,
                   maxWidth: "20%",
                 },
                 {
                   name: t("SSLABM06100:colUnlockResult2", "Result 2"),
                   selector: (row) => row.result2,
                   wrap: true,
                   maxWidth: "20%",
                 },
                 {
                   name: t("SSLABM06100:colUnlockAverage", "Average"),
                   selector: (row) => row.averageResult,
                   wrap: true,
                   maxWidth: "20%",
                 },
               ]}
               data={datas}
               progressPending={loading}
               progressComponent={<CircularProgress />}
               persistTableHead
               fixedHeader
               fixedHeaderScrollHeight="250px"
               selectableRows
               selectableRowsComponent={CheckboxTable}
               selectableRowsComponentProps={selectCheckBoxProps}
               onSelectedRowsChange={handleSelectedDataRow}
               noHeader
               striped
             />
           </div>
         </div>
         <div className="row Label-Inline">
          <VisibilityControl controller={controller} id="vsb-unlockRemarkSelect">           
            <label id="lblUnlockRemark" className="col-md-4 col-lg-2">
              {t(programId + ":lblUnlockRemark", "Remark")} :
            </label>
            <div className="col-sm-12 col-md-8 col-lg-7">
              <Autocomplete
                id="cboUnlockRemark"
                size="small"
                onChange={(event, newValue) => {
                  handleSelectRemark(newValue);
                }}
                value={input.unlockRemarkSelect}
                options={unlockRemarks}
                getOptionLabel={(option) => `${option.gdname}`}
                renderInput={(params) => (
                  <TextField {...params} size="small" variant="outlined" />
                )}
              />
            </div>
          </VisibilityControl>
         </div>
         <div className="row">
         <VisibilityControl controller={controller} id="vsb-unlockRemarkText">
           <div className="col-sm-12 col-md-12 col-lg-12">
             <DynamicTextArea
               id="txtRemark"
               name="remark"
               className="form-control"
               value={input.remarks}
               onChange={(e) => {
                 setInput({ ...input, remarks: e.target.value });
               }}
             />
           </div>
         </VisibilityControl>
         </div>
       </DialogContent>
       <DialogActions>
         <button
           id="btnOkLookup"
           className="btn btn-primary-theme"
           onClick={handleOk}
         >
           <span id="lblBtnOkLookup">OK</span>
         </button>
         <button
           id="btnCloseLookup"
           className="btn btn-cancel-theme"
           onClick={handleClose}
         >
           <span id="lblBtnCloseLookup">Close</span>
         </button>
       </DialogActions>
     </Dialog>
   );
};

export default Lookup;
