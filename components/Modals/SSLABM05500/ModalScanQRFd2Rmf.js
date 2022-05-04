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
import DynamicTextArea from "../../../components/DynamicTextArea";

const ModalScanQRFd2Rmfaap = (props) => {
   // console.log(props);
  const { t, i18n } = useTranslation("ModalScanQRFd2Rmfaap");
   const userInfo = useSelector((state) => state.user);

   const fd2SamplPlaces = props.fd2SamplPlaces;
   const fd2DieSizes = props.fd2DieSizes;
   const fd2Pellets = props.fd2Pellets;
   const hideAdditiveTab = props.hideAdditiveTab;

   const inputInitial = {
     samplPlaceSelect: null,
     samplingPlace: "",
     samplingPlaceName: "",
     dieSizeSelect: null,
     dieCode: "",
     dieCodeName: "",
     pelletSelect: null,
     pelletIdName: "",
     pelletId: "",
     productId: "",
     productIdName: "",
     productionDateStr: "",
     dieCode: "",
     remarks: "",
     condition: "",
     inputSampleAC: "",
     additives: [],
   };
   const [input, setInput] = useState(inputInitial);
   const [openModalScanQRFd2Rmfaap, setOpenModalScanQRFd2Rmfaap] = useState(false);
   
   // ----- Modal
   const handleOpenModalScanQRFd2Rmfaap = () => {
      setOpenModalScanQRFd2Rmfaap(true);
   };
   const handleCloseModalScanQRFd2Rmfaap = () => {
      setOpenModalScanQRFd2Rmfaap(false);
   };
   const handleOkModalScanQRFd2Rmfaap = (data) => {
      if (data) {
         getDataFromQR(data)
      }
      setOpenModalScanQRFd2Rmfaap(false);
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
      const cols = ["samplingPlace", "productId", "productionDate", "pelletId", "dieCode", "remarks", "condition"];
      if (result) {
         const results = result.split("\t");
          console.log(results)
          const newInput = {};
         for (let i = 0; i < cols.length; i++) {
            if (cols[i] === "productionDate") {
               newInput["productionDateStr"] = results[i];
            } else if (cols[i] === "condition") {
               if (results[i] && !hideAdditiveTab) {
                  const newDetailList = [];
                  const newSelectAdditive = { ...selectAdditive };

                  newSelectAdditive.item = "ALL";
                  newSelectAdditive.addiSeq = 1;
                  newSelectAdditive.condition = results[i];
                  newSelectAdditive.brandNameSelect = null;
                  newSelectAdditive.brandNameName = "";
                  newSelectAdditive.itemSelect = null;
                  newSelectAdditive.itemInput = "";
                  newSelectAdditive.isMultiItem = true;

                  newDetailList.push(newSelectAdditive);

                  newInput.additives = newDetailList;

                  setDisableNewAdditive(true);
               }
            } else {
               newInput[cols[i]] = results[i];
            }
         }
         
         console.log(newInput)
         if (newInput.samplingPlace) {
            const fd2place = fd2SamplPlaces.find((d) => d.gdcode === newInput.samplingPlace);
            if (fd2place) {
               newInput.samplPlaceSelect = fd2place;
               newInput.samplingPlaceName = fd2place.gdname;
            }
         }
         if (newInput.dieCode) {
            const diesize = fd2DieSizes.find((d) => d.gdcode === newInput.dieCode);
            if (diesize) {
               newInput.dieSizeSelect = diesize;
               newInput.dieCodeName = diesize.gdname;
            }
         }
         if (newInput.pelletId) {
            const pellet = fd2Pellets.find((d) => d.gdcode === newInput.pelletId);
            if (pellet) {
               newInput.pelletSelect = pellet;
               newInput.pelletIdName = pellet.gdname;
            }
         }
         if (newInput.productId) {
            const reqSample = {
               connection: userInfo.connection,
               lang: userInfo.language,
               productId: newInput.productId,
            };
            axios
               .post(ServiceUrl.urlOrder + "FindFoodProductNameByCode", reqSample)
               .then((response) => {
                  if (response.data) {
                     newInput.inputSampleAC = response.data.name;
                     newInput.productIdName = response.data.descr;   
                     console.log({...inputInitial, ...newInput})
                    }
                    setInput({...inputInitial, ...newInput});
               })
               .catch((error) => console.log(error));
         } else {                     
           console.log({...inputInitial, ...newInput})
           setInput({...inputInitial, ...newInput});
        }
      }
   }
 
   const handleSamplingPlaceEnter = (e) => {
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
           {t("ModalScanQRFd2Rmfaap:lblTitle", "QR Code RMFAAP")}
         </DialogTitle>
         <DialogContent dividers>
           <div className="row Label-Inline">
             <div className="col-md-12 col-lg-12">
               <div className="row">
                 <label
                   id="lblSamplingPlace"
                   className="col-sm-3 col-md-2 col-lg-2"
                 >
                   {t("ModalScanQRFd2Rmfaap:lblSamplingPlace", "Sampling Place")} :
                 </label>
                 <div className="col-md-9 col-lg-4">
                   <input
                     id="txtSamplingPlace"
                     type="text"
                     name="samplingPlace"
                     className="form-control"
                     onKeyDown={handleSamplingPlaceEnter}
                     value={input.samplingPlace}
                     onChange={handleInputChange}
                   />
                 </div>
                 <label
                   id="lblProductCode"
                   className="col-sm-3 col-md-2 col-lg-2"
                 >
                   {t("ModalScanQRFd2Rmfaap:lblProductCode", "Product Code")} :
                 </label>
                 <div className="col-md-9 col-lg-4">
                   <input
                     id="txtProductCode"
                     type="text"
                     name="productId"
                     className="form-control"
                     value={input.productId}
                     onChange={handleInputChange}
                   />
                 </div>
               </div>
               <div className="row">
                 <label
                   id="lblProductionDt"
                   className="col-sm-3 col-md-2 col-lg-2"
                 >
                   {t("ModalScanQRFd2Rmfaap:lblProductionDt", "Production Date")} :
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
                   id="lblDieSize"
                   className="col-sm-3 col-md-2 col-lg-2"
                 >
                   {t("ModalScanQRFd2Rmfaap:lblDieSize", "Die Size")} :
                 </label>
                 <div className="col-md-9 col-lg-4">
                   <input
                     id="txtDieSize"
                     type="text"
                     name="dieCode"
                     className="form-control"
                     value={input.dieCode}
                     onChange={handleInputChange}
                   />
                 </div>
               </div>
               <div className="row">
                 <label
                   id="lblExtraDetail"
                   className="col-sm-3 col-md-2 col-lg-2"
                 >
                   {t("ModalScanQRFd2Rmfaap:lblExtraDetail", "Extra Detail")} :
                 </label>
                 <div className="col-md-10 col-lg-10">
                   <DynamicTextArea
                     id="txtExtraDetail"
                     type="text"
                     name="remarks"
                     className="form-control"
                     value={input.remarks}
                     onChange={handleInputChange}
                   />
                 </div>
               </div>     
               <div className="row">
                 <label
                   id="lblCondition"
                   className="col-sm-3 col-md-2 col-lg-2"
                 >
                   {t("ModalScanQRFd2Rmfaap:lblCondition", "Condition")} :
                 </label>
                 <div className="col-md-10 col-lg-10">
                   <DynamicTextArea
                     id="txtCondition"
                     type="text"
                     name="condition"
                     className="form-control"
                     value={input.condition}
                     onChange={handleInputChange}
                   />
                 </div>
               </div>               
               <div className="row mt-12px">
                  <div className="col-md-12 col-lg-12">
                     <button id="btnOpenModalScanQR" className="mr-10px btn btn-with-icon btn-outline-primary-theme" onClick={handleOpenModalScanQRFd2Rmfaap} >
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
         title={t("ModalScanQRFd2Rmfaap:lblTitle", "QR Code RMFAAP")}
         open={openModalScanQRFd2Rmfaap}
         onOk={handleOkModalScanQRFd2Rmfaap}
         onCancel={handleCloseModalScanQRFd2Rmfaap}
       />
     </React.Fragment>
   );
};

export default ModalScanQRFd2Rmfaap;
