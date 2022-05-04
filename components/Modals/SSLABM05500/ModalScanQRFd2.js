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

const ModalScanQRFd2 = (props) => {
   // console.log(props);
  const { t, i18n } = useTranslation("ModalScanQRFd2");
   const userInfo = useSelector((state) => state.user);

   const dataHeader = props.dataHeader;
   const fd2Shifts = props.fd2Shifts;
   const fd2DieSizes = props.fd2DieSizes;

   const inputInitial = {
      productId: "",
      productIdName: "",
      lotNo: "",
      productionDateStr: "",
      formulaDateStr: "",
      shiftSelect: null,
      shiftNo: "",
      shiftNoName: "",
      dieSizeSelect: null,
      dieCode: "",
      dieCodeName: "",
      comments: "",
      inputSampleAC: "",
      sampleTidQr: "",
   }
   const [input, setInput] = useState(inputInitial);
   const [openModalScanQRFd2, setOpenModalScanQRFd2] = useState(false);
   
   // ----- Modal
   const handleOpenModalScanQRFd2 = () => {
      setOpenModalScanQRFd2(true);
   };
   const handleCloseModalScanQRFd2 = () => {
      setOpenModalScanQRFd2(false);
   };
   const handleOkModalScanQRFd2 = (data) => {
      if (data) {
         getDataFromQR(data)
      }
      setOpenModalScanQRFd2(false);
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

   const getDataFromQR = (result) => {      
         console.log(result)
         if (result) {
            let comments = []
            const results = isEmpty(result) ? [] : result.split("\t");
            console.log(results)
            const newInput = {};
            if (results.length > 0) {
               newInput.productId = results[0].split(" ")[0];               
               newInput.productIdName = results[1];
               // newInput.inputSampleAC = `${newInput.productId} - ${newInput.productIdName}`;
               newInput.lotNo = results[2];
               newInput.sampleTidQr = results[3];
               newInput.productionDateStr = results[4];
               newInput.formulaDateStr = results[5];
               newInput.comments = results[6];
               comments = isEmpty(results[6]) ? [] : results[6].split(";");
            }
            console.log(newInput)
            const reqMapping = {
               connection: userInfo.connection,
               lang: userInfo.language,
               sampleType: dataHeader.sampleTid,
               productId: newInput.productId,
            };
            axios
               .post(ServiceUrl.urlOrder + "IsFd2ProductMappingExist", reqMapping)
               .then((response) => {
                  if (response.data) {
                     const resProduct = response.data
                     newInput.productId = resProduct.code;               
                     newInput.productIdName = resProduct.descr;
                     newInput.inputSampleAC = resProduct.name;
                     if (comments.length > 0) {
                        const shiftNo = comments[1] ? comments[1] : "";
                        let shiftTime = "";
                        const dieCode = comments[4] ? comments[4].replace(".", "") : "";
                        // shift
                        if (shiftNo >= "0801" && shiftNo <= "1700") {
                           shiftTime = "1";
                        } else if (shiftNo >= "1701" && shiftNo <= "0000") {
                           shiftTime = "2";
                        } else {
                           shiftTime = "3";
                        }
                        const shift = fd2Shifts.find((d) => d.gdcode.substr(d.gdcode.length - 1) === shiftTime);
                        if (shift) {
                           newInput.shiftSelect = shift;
                           newInput.shiftNo = shift.code;
                           newInput.shiftNoName = shift.descr;
                        }
                        // dieCode
                        const dieSize = fd2DieSizes.find((d) => d.gdcode.substr(d.gdcode.indexOf("_") + 1) === dieCode);
                        if (dieSize) {
                           newInput.dieSizeSelect = dieSize;
                           newInput.dieCode = dieSize.code;
                           newInput.dieCodeName = dieSize.descr;
                        }
                     }
                     setInput({...inputInitial, ...newInput});
                     
                  } else {
                     Swal.fire({
                        icon: "warning",
                        title: "Cannot find setup for NIR product",
                        confirmButtonColor: "#16aaff",
                     });
                  }
               })
               .catch((error) => console.log(error));
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
         maxWidth="md"
         fullWidth
       >
         <DialogTitle id="scroll-dialog-title">
           {t("ModalScanQRFd2:lblTitle", "QR Code Info.")}
         </DialogTitle>
         <DialogContent dividers>
           <div className="row Label-Inline">
             <div className="col-md-12 col-lg-12">
               <div className="row">
                 <label
                   id="lblSampleCode"
                   className="col-sm-3 col-md-2 col-lg-2"
                 >
                   {t("ModalScanQRFd2:lblSampleCode", "Sample Code")} :
                 </label>
                 <div className="col-md-9 col-lg-4">
                   <input
                     id="txtSampleCode"
                     type="text"
                     name="productId"
                     className="form-control"
                     onKeyDown={handleSampleCodeEnter}
                     value={input.productId}
                     onChange={handleInputChange}
                   />
                 </div>
                 <label
                   id="lblSampleName"
                   className="col-sm-3 col-md-2 col-lg-2"
                 >
                   {t("ModalScanQRFd2:lblSampleName", "Sample Name")} :
                 </label>
                 <div className="col-md-9 col-lg-4">
                   <input
                     id="txtSampleName"
                     type="text"
                     name="productIdName"
                     className="form-control"
                     value={input.productIdName}
                     onChange={handleInputChange}
                   />
                 </div>
               </div>
               <div className="row">
                 <label
                   id="lblJobPacking"
                   className="col-sm-3 col-md-2 col-lg-2"
                 >
                   {t("ModalScanQRFd2:lblJobPacking", "Job Packing ID")} :
                 </label>
                 <div className="col-md-9 col-lg-4">
                   <input
                     id="txtJobPacking"
                     type="text"
                     name="lotNo"
                     className="form-control"
                     value={input.lotNo}
                     onChange={handleInputChange}
                   />
                 </div>
                 <label
                   id="lblSampleType"
                   className="col-sm-3 col-md-2 col-lg-2"
                 >
                   {t("ModalScanQRFd2:lblSampleType", "Sample Type")} :
                 </label>
                 <div className="col-md-9 col-lg-4">
                   <input
                     id="txtSampleType"
                     type="text"
                     name="sampleTidQr"
                     className="form-control"
                     value={input.sampleTidQr}
                     onChange={handleInputChange}
                   />
                 </div>
               </div>
               <div className="row">
                 <label
                   id="lblProductionDt"
                   className="col-sm-3 col-md-2 col-lg-2"
                 >
                   {t("ModalScanQRFd2:lblProductionDt", "Production Date")} :
                 </label>
                 <div className="col-md-9 col-lg-4">
                   <input
                     id="txtProductionDt"
                     type="text"
                     name="productionDateStr"
                     className="form-control"
                     value={input.productionDateStr}
                     onChange={handleInputChange}
                   />
                 </div>
                 <label
                   id="lblFormularDt"
                   className="col-sm-3 col-md-2 col-lg-2"
                 >
                   {t("ModalScanQRFd2:lblFormularDt", "Formular Date")} :
                 </label>
                 <div className="col-md-9 col-lg-4">
                   <input
                     id="txtFormularDt"
                     type="text"
                     name="formulaDateStr"
                     className="form-control"
                     value={input.formulaDateStr}
                     onChange={handleInputChange}
                   />
                 </div>
               </div>
               <div className="row">
                 <label id="lblComment" className="col-sm-3 col-md-2 col-lg-2">
                   {t("ModalScanQRFd2:lblComment", "Comment")} :
                 </label>
                 <div className="col-md-10 col-lg-10">
                   <input
                     id="txtComment"
                     type="text"
                     name="comments"
                     className="form-control"
                     value={input.comments}
                     onChange={handleInputChange}
                   />
                 </div>
               </div>
               <div className="row mt-12px">
                  <div className="col-md-12 col-lg-12">
                     <button id="btnOpenModalScanQR" className="mr-10px btn btn-with-icon btn-outline-primary-theme" onClick={handleOpenModalScanQRFd2} >
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
         title={t("ModalScanQRFd2:lblTitle", "QR Code Info.")}
         open={openModalScanQRFd2}
         onOk={handleOkModalScanQRFd2}
         onCancel={handleCloseModalScanQRFd2}
       />
     </React.Fragment>
   );
};

export default ModalScanQRFd2;
