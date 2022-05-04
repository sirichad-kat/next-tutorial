import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import dynamic from "next/dynamic";
const QrReader = dynamic(() => import('react-qr-reader'),{ ssr: false })
import * as GIcons from "../../configs/googleicons";

const UploadImage = (props) => {
  const qrRef = React.useRef(null)  
  const qrCameraRef = React.useRef(null)  
  const [scanQrResult, setScanQrResult] = useState("");   
  const [isScan, setIsScan] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {console.log("unmount"); qrCameraRef.current = null}
  }, []);
  useEffect(() => {
    if (props.open) {
      setScanQrResult("")
      setIsScan(true)
      setLoading(false)
    }
  }, [props.open]);

  const handleScanQRByCamera = (result) => {
    if (result) {    
      console.log(result)
      console.log(loading)
      props.onOk(result)
      // setIsScan(false)      
      // setScanQrResult(result)
    }
    else{
      // setIsScan(true)
    }   
    
  }
  const handleScanQRByFile = (result) => {   
    if (result) {    
      console.log(result)
      console.log(loading)
      props.onOk(result)
      // setIsScan(false)      
      // setScanQrResult(result)
    }
    else{
      console.log(result)
      console.log(loading)
      if(loading){
        props.onCancel()
      }
    }
    // else{
    //   console.log(result)
    //   // setIsScan(true)
    // }
  }
  const handleOpenQRFile = () => {
    qrRef.current.openImageDialog();
  }

  return (
    <React.Fragment>
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
        <DialogContent dividers>
          <div
            className="row"
            style={{ justifyContent: "center", marginBottom: "10px" }}
          >
            <QrReader
              ref={qrCameraRef}
              style={{ width: "350px" }}
              onError={(err) => console.error(err)}
              onScan={handleScanQRByCamera}
            />
            <QrReader
              ref={qrRef}
              // style={{width: "350px"}}
              onError={(err) => console.error(err)}
              onScan={handleScanQRByFile}
              onImageLoad={() => setLoading(true)}
              legacyMode
            />
          </div>
          {/* {isScan ? (
            <div
              className="row"
              style={{ justifyContent: "center", marginBottom: "10px" }}
            >
              <QrReader
                style={{ width: "350px" }}
                onError={(err) => console.error(err)}
                onScan={handleScanQRByCamera}
              />
              <QrReader
                ref={qrRef}
                // style={{width: "350px"}}
                onError={(err) => console.error(err)}
                onScan={handleScanQRByFile}
                onImageLoad={() => setLoading(true)}
                legacyMode
              />
            </div>
          ) : (
            <React.Fragment>              
              <div className="row">
                <div className="col-md-12">
                  <h6 style={{ textDecoration: "underline" }}>Result</h6>
                </div>
                <div className="col-md-12">
                  <label>{scanQrResult}</label>
                </div>
              </div>    
              <div className="row">
                <button className="mb-2 btn btn-link" onClick={() => setIsScan(true)}>
                  <i name="item" className="fas fa-arrow-left mr-2" />            
                  <span>Back to Scan QR</span>    
                </button> 
              </div>   
            </React.Fragment>
          )} */}
        </DialogContent>
        <DialogActions>
          <button
            id="btnOpenQRFile"
            className="btn btn-with-icon btn-primary-theme"
            onClick={handleOpenQRFile}
            hidden={!isScan}
          >
            {/* <i name="item" className="fas fa-image mr-2" /> */}
            <GIcons.IconImage />
            <span id="lblBtnOpenQRFile">Open Image</span>              
          </button>
          <div style={{ flex: "1 0 0" }} />
          {/* <button className="mr-2 btn btn-info" onClick={() => props.onOk(scanQrResult)}>
            OK
          </button> */}
          <button id="btnCloseScanQR" className="btn btn-cancel-theme" onClick={props.onCancel}>
            <span id="lblBtnCloseScanQR">Cancel</span>               
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default UploadImage;
