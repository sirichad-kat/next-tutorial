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
import dynamic from "next/dynamic";
const BarcodeScannerComponent = dynamic(
  () => import("react-qr-barcode-scanner"),
  {
    ssr: false,
  }
);

const ModalScanner = (props) => {
  const userInfo = useSelector((state) => state.user);

  const { open, handleClose, handleOk } = props;
  const [data, setData] = useState("");

  useEffect(() => {
    if (data !== "") {
      handleOk(data);
    }
  }, [data]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="scroll-dialog-title">Scanner</DialogTitle>
      <DialogContent className="Label-Inline">
        <div className="row">
          <BarcodeScannerComponent
            width={400}
            height={400}
            onUpdate={(err, result) => {
              if (result) setData(result.text);
              else setData("");
            }}
          />
        </div>
        {/* <div className="row">{data === "" ? "WAITING" : data}</div> */}
      </DialogContent>
      <DialogActions>
        <button
          id="btnOkModalSubmit"
          className="btn btn-with-icon btn-primary-theme"
          onClick={() => handleOk(data)}
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

export default ModalScanner;
