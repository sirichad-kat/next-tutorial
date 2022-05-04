import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
// import "antd/dist/antd.css";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ServiceUrl from "../../../configs/servicePath";
import { useTranslation } from "react-i18next";
import { isEmpty } from "../../../configs/function";
import * as GIcons from "../../../configs/googleicons";
import ModalScanQR from "../ModalScanQRSample";

const ModalScanQRFd2SamplingPoint = (props) => {
   // console.log(props);
  const { t, i18n } = useTranslation("ModalScanQRFd2SamplingPoint");
   const userInfo = useSelector((state) => state.user);

   const fd2SamplPoints = props.fd2SamplPoints;

   const inputInitial = {
      lotNo: "",
      samplingPoint: "",
      samplingPointName: "",
      samplPointSelect: "",
   }
   const [input, setInput] = useState(inputInitial);
   const [openModalScanQRSampPoint, setOpenModalScanQRSampPoint] = useState(false);
   
   // ----- Modal
   const handleOpenModalScanQRSampPoint = () => {
      setOpenModalScanQRSampPoint(true);
  };
  const handleCloseModalScanQRSampPoint = () => {
      setOpenModalScanQRSampPoint(false);
  };
   const handleOkModalScanQRSampPoint = (data) => {
      if (data) {
         getDataFromQR(data)
      }
      setOpenModalScanQRFd2SamplingPoint(false);
   };
   // -----
   useEffect(async () => {
      if (props.open) {
         setInput(inputInitial)
      }
   }, [props.open]);

   const handleInputChange = (e) => {
      const { target } = e;
      const { name } = target;
      const value = target.value;

      setInput({
         ...input,
         [name]: value,
      });
   };

   const getDataFromQR = async(result) => {      
    const cols = ["samplingPoint", "lotNo"];
    if (result) {
       const results = result.split("\t");
       const newInput = { ...input };
       for (let i = 0; i < cols.length; i++) {
          newInput[cols[i]] = results[i];
       }
       if (newInput.samplingPoint) {
          const fd2point = fd2SamplPoints.find((d) => d.gdcode === newInput.samplingPoint);
          if (fd2point) {
             newInput.samplPointSelect = fd2point;
             newInput.samplingPointName = fd2point.gdname;
          }
       }
       setInput(newInput);
    }    
   }
 
   const handleSampleCodeEnter = (e) => {
      if (e.key === "Enter") {
         getDataFromQR(e.target.value)
      }
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
         <DialogTitle id="scroll-dialog-title">
           {t("ModalScanQRFd2SamplingPoint:lblTitle", "QR Code Info.")}
         </DialogTitle>
         <DialogContent dividers>
           <div className="row Label-Inline">
             <div className="col-md-12 col-lg-12">
               <div className="row">
                 <label
                   id="lblSamplingPoint"
                   className="col-md-3 col-lg-3"
                 >
                   {t(
                     "ModalScanQRFd2SamplingPoint:lblSamplingPoint",
                     "Sampling Point"
                   )}{" "}
                   :
                 </label>
                 <div className="col-md-9 col-lg-9">
                   <input
                     id="txtSamplingPoint"
                     type="text"
                     name="samplingPoint"
                     className="form-control"
                     onKeyDown={handleSampleCodeEnter}
                     value={input.samplingPoint}
                     onChange={handleInputChange}
                   />
                 </div>
               </div>
               <div className="row">
                 <label
                   id="lblLotNo"
                   className="col-md-3 col-lg-3"
                 >
                   {t(
                     "ModalScanQRFd2SamplingPoint:lblLotNo",
                     "Lot No"
                   )}{" "}
                   :
                 </label>
                 <div className="col-md-9 col-lg-9">
                   <input
                     id="txtLotNo"
                     type="text"
                     name="lotNo"
                     className="form-control"
                     value={input.lotNo}
                     onChange={handleInputChange}
                   />
                 </div>
               </div>
               <div className="row mt-12px">
                  <div className="col-md-12 col-lg-12">
                     <button id="btnOpenModalScanQR" className="mr-10px btn btn-with-icon btn-outline-primary-theme" onClick={handleOpenModalScanQRSampPoint} >
                        <GIcons.IconCamera style={{ fontSize: "13px", verticalAlign: "middle" }} />
                        <span>Scan QR With Camera</span>
                     </button>
                  </div>
               </div>
             </div>
           </div>
         </DialogContent>
         <DialogActions>
           <button
             id="btnOk"
             className="btn btn-primary-theme"
             onClick={() => props.onOk(input)}
           >
             <span id="lblBtnOk">OK</span>
           </button>
           <button
             id="btnCancel"
             className="btn btn-danger-theme"
             onClick={props.onCancel}
           >
             <span id="lblBtnCancel">Cancel</span>
           </button>
         </DialogActions>
       </Dialog>
       <ModalScanQR
          title={t("ModalScanQRFd2SamplingPoint:lblTitle", "QR Code Info.")}
          open={openModalScanQRSampPoint}
          onOk={handleOkModalScanQRSampPoint}
          onCancel={handleCloseModalScanQRSampPoint}
       />
     </React.Fragment>
   );
};

export default ModalScanQRFd2SamplingPoint;
