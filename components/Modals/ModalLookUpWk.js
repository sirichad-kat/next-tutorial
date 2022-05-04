import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const Lookup = (props) => {
  return (
    
    <Dialog
      open={props.Visible}
      onClose={props.OnCancel}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="scroll-dialog-title">{props.Title}</DialogTitle>
      <DialogContent dividers>
      {props.children}
      </DialogContent>
      <DialogActions>
        <button id="btnOkLookup" className="btn btn-primary-theme" onClick={props.OnOk}>
          <span id="lblBtnOkLookup">OK</span>
        </button>
        <button id="btnCloseLookup" className="btn btn-cancel-theme" onClick={props.OnCancel}>
          <span id="lblBtnCloseLookup">Cancel</span>
        </button>   
      </DialogActions>
    </Dialog>
  );
};

export default Lookup;
