import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import DialogTitle from "@material-ui/core/DialogTitle";
import Backdrop from "@material-ui/core/Backdrop";
import * as Func from "../../configs/function";
import * as GIcons from "../../configs/googleicons";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import ServiceUrl from "../../configs/servicePath";

const ModalAdjustTime = (props) => {
  const userInfo = useSelector((state) => state.user);

  const { open, handleClose, handleOk, isClear, setIsClear } = props;
  const [submitRemarks, setSubmitRemarks] = useState([]);
  const [input, setInput] = useState({
    adjustDay: "",
    remarks: null,
    otherRemark: "",
  });
  const [showOtherRemarks, setShowOtherRemarks] = useState(false);

  //on mount
  useEffect(() => {
    const reqGetSubmitRemark = {
      connection: userInfo.connection,
      username: userInfo.username,
      orgCode: userInfo.orgCode,
    };
    axios
      .post(`${ServiceUrl.urlLabMgt}GetSubmitRemark`, reqGetSubmitRemark)
      .then((res) => {
        setSubmitRemarks([...res.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
      if(isClear) {
        setInput({
          adjustDay: "",
          remarks: null,
          otherRemark: ""
        })
        setIsClear(false)
      }
  }, [isClear])

  useEffect(() => {
    if (input.remarks !== null && input.remarks.desc === "Others") {
        setShowOtherRemarks(true);
    } else {
        setShowOtherRemarks(false);
    }
  }, [input.remarks]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      {/* <DialogTitle id="scroll-dialog-title">Import Excel</DialogTitle> */}
      <DialogContent className="Label-Inline">
        <div className="row">
          <label id="lblresultDay" className="col-md-3 col-lg-3">
            Adjust Day(s) <span className="text-danger">*</span> :
          </label>
          <div className="col-md-4 col-lg-4">
            <input
              id="txtResultDay"
              type="text"
              name="resultday"
              className="form-control"
              maxLength="50"
              value={input ? input.adjustDay : ""}
              onChange={(e) =>
                setInput({ ...input, adjustDay: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row">
          <label id="lblremarkSubmit" className="col-md-3 col-lg-3">
            Remarks <span className="text-danger">*</span> :
          </label>
          <div className="col-md-9 col-lg-9">
            <Autocomplete
              id="cboRemarkSubmit"
              onChange={(event, newValue) => {
                setInput({ ...input, remarks: newValue });
              }}
              size="small"
              value={input.remarks}
              options={submitRemarks}
              getOptionLabel={(option) => `${option.desc}`}
              renderInput={(params) => (
                <TextField {...params} size="small" variant="outlined" />
              )}
            />
          </div>
        </div>
        {showOtherRemarks && (
          <div className="row">
            <label id="lblotherRemark" className="col-md-3 col-lg-3">
              Other Remarks <span className="text-danger">*</span> :
            </label>
            <div className="col-md-9 col-lg-9">
              <textarea
                id="txtOtherRemark"
                type="text"
                name="otherRemark"
                className="form-control"
                maxLength="50"
                value={input ? input.otherRemark : ""}
                onChange={(e) =>
                  setInput({ ...input, otherRemark: e.target.value })
                }
              />
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <button
          id="btnOkModalSubmit"
          className="btn btn-with-icon btn-primary-theme"
          onClick={() => handleOk(input)}
        >
          <GIcons.IconSubmit />
          <span id="lblBtnOkModalSubmit">Submit</span>
        </button>
        <button
          id="btnCloseModalSubmit"
          className="btn btn-cancel-theme"
          onClick={handleClose}
        >
          <span id="lblBtnCloseModalSubmit">Cancel</span>
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAdjustTime;
