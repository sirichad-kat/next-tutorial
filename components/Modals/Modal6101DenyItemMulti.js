import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
// import "antd/dist/antd.css";
import Swal from "sweetalert2";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckboxTable from "../../components/CheckBoxTheme";
import DataTable from "react-data-table-component";
import * as UserAction from "../../redux/actions/UserAction";
import ServiceUrl from "../../configs/servicePath";
import * as GIcons from "../../configs/googleicons";
import CircularProgress from "../circularprogress";
import { useTranslation } from "react-i18next";
import { convertFormatMoment, isEmpty, selectedLkRowStyle, sortByAlphabet } from "../../configs/function";
import VisibilityControl from "../../components/VisibilityControl";
import useVisibilityControl from "../../hooks/useVisibilityControl";

const Lookup = (props) => {  
  const programId = props.programId ?? ""
  const { t, i18n } = useTranslation(programId);
  const controller = useVisibilityControl(programId);
  const userInfo = useSelector((state) => state.user);
  const selectCheckBoxProps = { indeterminate: isIndeterminate => isIndeterminate };
  const isUncer = props.isUncer ?? false
  const [data, setData] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [isApplyAll, setIsApplyAll] = useState(false);
  const [isCali, setIsCali] = useState(false);
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
      // setSelectData(props.itemSelectList)
      setIsApplyAll(false);
      setIsCali(false);
      setData(props.data)
    }

  }, [props.open]);
  
  const handleSelectedDataRow = ({ allSelected, selectedCount, selectedRows }) => {
    setSelectData(selectedRows)
  }

  const handleApplyAllCheckBox = (e) => {
    const checked = e.target.checked;
    setIsApplyAll(checked)
  }
  const handleCaliCheckBox = (e) => {
    const checked = e.target.checked;
    setIsCali(checked)
  }
  const checkRequire = () => {
    let isValid = true
    let errtxt = ""
    if (isEmpty(selectData)) {
        errtxt += "Please Select Item!";
        isValid = false;
    }  
    if (!isValid) {
        errtxt = "<p>" + errtxt + "</p>";
        Swal.fire({
          icon: "warning",
          title: "Invalid",
          html: errtxt,
          confirmButtonText: "OK",
        });
    }
    return isValid
 }
  const handleOkClicked = () => {   
    if(checkRequire()){
      console.log(selectData)
      props.onOk(selectData, isApplyAll, isCali)
    } 
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
      <DialogTitle id="scroll-dialog-title">{props.title}</DialogTitle>
      <DialogContent >    
        <div className="row">
          <div className="col-md-12 col-lg-12">
            <DataTable
              columns={columnList}
              data={data}
              conditionalRowStyles={selectedLkRowStyle}
              progressPending={loadingLookup}
              progressComponent={<CircularProgress />}
              selectableRows
              selectableRowsHighlight
              selectableRowsComponent={CheckboxTable}     
              selectableRowsComponentProps={selectCheckBoxProps}
              onSelectedRowsChange={handleSelectedDataRow}           
              persistTableHead
              noHeader
              striped
            />
          </div>
        </div> 
        <div className="row">
          <VisibilityControl controller={controller} id="vsb-applyAll">     
            <div className="col-md-6 col-lg-6">
              <FormControlLabel
                control={
                  <Checkbox
                    id="chkApplyAll"
                    checked={isApplyAll}
                    onChange={handleApplyAllCheckBox}
                    color="primary"
                    size="small"
                  />
                }
                label="Apply All Sequence"
                style={{marginLeft: "5px"}}
              />
            </div>
          </VisibilityControl>
          <VisibilityControl controller={controller} id="vsb-calibrationInvalid">     
            {
              isUncer ? 
                <div className="col-md-6 col-lg-6">
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="chkCali"
                        checked={isCali}
                        onChange={handleCaliCheckBox}
                        color="primary"
                        size="small"
                      />
                    }
                    label="Calibration Curve Invalid"
                    style={{marginLeft: "5px"}}
                  />
                </div> : null            
            }
          </VisibilityControl>          
        </div>        
      </DialogContent>
      <DialogActions>
        <button className="btn btn-danger-theme" onClick={handleOkClicked} >
          Deny
        </button>
        <button className="btn btn-cancel-theme" onClick={props.onCancel}>
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default Lookup;
