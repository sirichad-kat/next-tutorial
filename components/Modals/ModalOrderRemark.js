import React, { useState, useEffect} from "react";
import {useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { isEmpty } from "../../configs/function";

const Lookup = (props) => {  
const title = props.title ?? ""
const isRequired = props.hasOwnProperty("remarkRequired") ? props.remarkRequired : true
const [remark, setRemark] = useState("");
  
  useEffect(() => {
    if (props.open) {
      setRemark("")
    }
  }, [props.open]);

  const handleInputChange = (e) => {
    const { target } = e;
    const { name } = target;
    const value = target.value;
    setRemark(value)
  };

  const handleOkBtn = () => {
    if(isRequired && isEmpty(remark)){
      Swal.fire({
        icon: "warning",
        title: "Invalid",
        html: "Remark <br>Cannot Be Empty!",
        confirmButtonColor: "#16aaff",
        confirmButtonText: "OK",
      });
    }else{
      props.onOk(remark)      
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
      <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <label>Remark{isRequired ? <span className="text-red"> *</span> : null} :</label>
        <div className="row">
          <div className="col-md-12">
            <textarea
              id="txtRemark"
              type="text"
              className="form-control"
              value={remark}
              onChange={handleInputChange}             
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <button id="btnOkRemark" className="btn btn-primary-theme" onClick={handleOkBtn}>
          <span id="lblBtnOkRemark">OK</span>
        </button>
        <button id="btnCloseRemark" className="btn btn-cancel-theme" onClick={props.onCancel}>
          <span id="lblBtnCloseRemark">Cancel</span>
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default Lookup;
