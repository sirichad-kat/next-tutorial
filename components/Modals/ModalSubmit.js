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

const ModalSubmit = (props) => {
  const userInfo = useSelector((state) => state.user);

  const { open, handleClose, defaultSentMail, disabled, sampleTid, handleSubmit } = props;
  const [submitRemarks, setSubmitRemarks] = useState([]);
  const [input, setInput] = useState({
    resultDay: "",
    sentMailCheckbox: true,
    remarks: null,
    otherRemark: "",
  });
  const [showOtherRemarks, setShowOtherRemarks] = useState(false);

  useEffect(() => {
    setInput(prev => ({
      ...prev,
      sentMailCheckbox: defaultSentMail,
    }));
  }, [defaultSentMail]);

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
    if (input.remarks !== null && input.remarks.desc === "Others") {
        setShowOtherRemarks(true);
    } else {
        setShowOtherRemarks(false);
    }
  }, [input.remarks]);

  useEffect(() => {
    const reqGetResultDays = {
      connection: userInfo.connection,
      username: userInfo.username,
      orgCode: userInfo.orgCode,
      sampleTid: sampleTid,
    };
    axios
      .post(`${ServiceUrl.urlLabMgt}GetResultDays`, reqGetResultDays)
      .then((res) => {
        setInput({
          ...input,
          resultDay: res.data.resultdays,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [sampleTid]);

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
            Result Day(s) :
          </label>
          <div className="col-md-4 col-lg-4">
            <input
              id="txtResultDay"
              type="text"
              name="resultday"
              className="form-control"
              maxLength="50"
              value={input ? input.resultDay : ""}
              onChange={(e) =>
                setInput({ ...input, resultDay: e.target.value })
              }
              disabled={disabled}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 col-lg-3"></div>
          <div className="col-md-8 col-lg-8 mb-0" style={{ marginLeft: "4px" }}>
            <FormControlLabel
              className="mr-0"
              control={
                <Checkbox
                  id="chkSendMailCust"
                  checked={input.sentMailCheckbox}
                  onChange={(e) =>
                    setInput({ ...input, sentMailCheckbox: e.target.checked })
                  }
                  name="isSendMail"
                  color="primary"
                  size="small"
                  style={{ padding: "5px" }}
                />
              }
              label={<span>Sent Mail to Customer</span>}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="row">
          <label id="lblremarkSubmit" className="col-md-3 col-lg-3">
            Remarks :
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
              disabled={disabled}
            />
          </div>
        </div>
        {showOtherRemarks && (
          <div className="row">
            <label id="lblotherRemark" className="col-md-3 col-lg-3">
              Other Remarks :
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
                disabled={disabled}
              />
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <button
          id="btnOkModalSubmit"
          className="btn btn-with-icon btn-primary-theme"
          onClick={() => handleSubmit(input)}
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

export default ModalSubmit;
