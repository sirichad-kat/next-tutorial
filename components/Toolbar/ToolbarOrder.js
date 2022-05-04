import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
// import IconNew from "@material-ui/icons/InsertDriveFileOutlined";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
// import Icons from "../../configs/icons";
// import {IconNew} from "../../configs/googleicons";
import * as GIcons from "../../configs/googleicons";
import * as UiConfigAction from "../../redux/actions/UiConfigAction";
import ServiceUrl from "../../configs/servicePath";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Toolbar = (props) => {
   const userInfo = useSelector((state) => state.user);
   const uiconfigStore = useSelector((state) => state.uiconfig);
   const dispatch = useDispatch();
   const isDetail = props.isDetail === undefined ? false : props.isDetail;
   const orderDetail = props.orderDetail ? props.orderDetail : {orgCode: "", orderDoc: "", aniId: "", custId: "" };
   const buttonDisabled = props.disabledButton ? props.disabledButton : [];
   const isDisabled = props.disabled ? props.disabled : false;
   const printOptions = ["Print Header & Detail", "Print Header", "Print Detail", "Customized Sticker"];
   const disabledSubmit = props.disabledSubmit ? props.disabledSubmit : false;
   const programId = props.programId ? props.programId : uiconfigStore.programId
   const fromProgramPath = props.fromProgramPath ?? ""
   
   const [configBtns, setConfigBtns] = useState(null);
   // const [state, setState] = useState(props.state);
   const [openPrint, setOpenPrint] = useState(false);
   const anchorPrintRef = React.useRef(null);
   // console.log("printdetail : " + props.isPrintDetail);
   const handleNew = () => {
      // setState("STATE_A");
      if (props.hasOwnProperty("onStateChange")) {
         props.onStateChange("STATE_A", "NEW");
      }
      if (props.hasOwnProperty("new")) {
         props.new();
      }
   };
   const handleEdit = () => {
      // setState("STATE_C");
      if (props.hasOwnProperty("onStateChange")) {
         props.onStateChange("STATE_C", "EDIT");
      }
      if (props.hasOwnProperty("edit")) {
         props.edit();
      }
   };
   const handleRefresh = () => {
      if (props.hasOwnProperty("onStateChange")) {
         let state = "STATE_I"
         if(props.state === "STATE_A"){
            state = "STATE_A"
         }
         props.onStateChange(state, "REFRESH");       
      }
      if (props.hasOwnProperty("refresh")) {
         props.refresh();
      }
   };
   const handleSave = () => {
      // if(props.hasOwnProperty("onStateChange")){
      //   props.onStateChange("STATE_I", "SAVE")
      // }
      if (props.hasOwnProperty("save")) {
         props.save();
      }
   };
   const handleSubmit = () => {
      // if (props.hasOwnProperty("onStateChange")) {
      //    props.onStateChange("STATE_I", "SUBMIT");
      // }
      if (props.hasOwnProperty("submit")) {
         props.submit();
      }
   };
   const handleApprove = () => {
      // if (props.hasOwnProperty("onStateChange")) {
      //    props.onStateChange("STATE_I", "APPROVE");
      // }
      if (props.hasOwnProperty("approve")) {
         props.approve();
      }
   };
   const handleConfirm = () => {
      // if (props.hasOwnProperty("onStateChange")) {
      //    props.onStateChange("STATE_I", "CONFIRM");
      // }
      if (props.hasOwnProperty("confirm")) {
         props.confirm();
      }
   };
   const handleDeny = () => {
      // if (props.hasOwnProperty("onStateChange")) {
      //    props.onStateChange("STATE_I", "DENY");
      // }
      if (props.hasOwnProperty("deny")) {
         props.deny();
      }
   };
   const handleCancel = () => {
      // if (props.hasOwnProperty("onStateChange")) {
      //    props.onStateChange("STATE_I", "CANCEL");
      // }
      if (props.hasOwnProperty("cancel")) {
         props.cancel();
      }
   };
   const handleClose = () => {
      if (props.hasOwnProperty("close")) {
         // dispatch(UiConfigAction.setShowMenuSidebar(true));
         props.close();
      }
   };

   useEffect(() => {
      if(fromProgramPath.includes("SSLABM05000")){
         const requestObj = {
            connection: userInfo.connection,
            programid: programId,
            trnStatus: props.trnStatus,
            state: props.state,
            orderDetail: orderDetail,
         };
   
         axios
            .post(ServiceUrl.urlOrder + "FindConfigBtn", requestObj)
            .then((response) => {
               setConfigBtns(response.data === "" ? null : response.data);
            })
            .catch((error) => console.log(error));
      }
      else{
         const newConfigBtn = {
            eAccept: "N",
            eApprove: "N",
            eBtnaddeff: "N",
            eBtnchange: "Y",
            eBtndeleff: "N",
            eBtndelete: "N",
            eBtnsave: "Y",
            eCancel: "Y",
            eCanceljob: "N",
            eComplete: "N",
            eDeny: "N",
            eMail: "N",
            eNew: "N",
            ePrint: "Y",
            eRegist: "N",
            eReject: "N",
            eSubmit: "N",
            vAccept: "N",
            vApprove: "N",
            vBtnaddeff: "N",
            vBtnchange: "N",
            vBtndeleff: "N",
            vBtndelete: "N",
            vBtnsave: "N",
            vCancel: "N",
            vCanceljob: "N",
            vComplete: "N",
            vDeny: "N",
            vMail: "N",
            vNew: "N",
            vPrint: "Y",
            vRegist: "N",
            vReject: "N",
            vSubmit: "N",
         }
         setConfigBtns(newConfigBtn)
      }
      
   }, [uiconfigStore.programId, props.trnStatus, props.state, orderDetail.orderDoc, orderDetail.aniId, orderDetail.custId, fromProgramPath]);

   const handleMenuItemClick = (event, index, option) => {
      setOpenPrint(false);
      if (props.hasOwnProperty("printMenu")) {
         if (props.printMenu.length > 0) {
            props.printMenu[index](option);
         }
      }
   };

   const handleToggleBtnPrint = () => {
      setOpenPrint((prevOpen) => !prevOpen);
   };

   const handleCloseBtnPrint = (event) => {
      if (anchorPrintRef.current && anchorPrintRef.current.contains(event.target)) {
         return;
      }

      setOpenPrint(false);
   };
   // console.log(configBtns === null || configBtns.eNew === "N" || (buttonDisabled.find((b) => b === "ALL" || b === "NEW") && isDisabled));
   return (
      <div className="row container-toolbar">
         <div className="col-md-12 col-lg-12 Toolbar">
            <button
               id="btnNew"
               key="New"
               className="mr-8px btn btn-with-icon btn-toolbar"
               onClick={handleNew}
               disabled={configBtns === null || configBtns.eNew === "N" || (buttonDisabled.find((b) => b === "ALL" || b === "NEW") && isDisabled)}
               hidden={configBtns === null || configBtns.vNew === "N"}>
               {/* <img alt="" src={Icons.new}></img> */}
               <GIcons.IconNew />
               <span id="lblBtnNew" className="buttonName">
                  New
               </span>
            </button>
            <button
               id="btnEdit"
               key="Edit"
               className="mr-8px btn btn-with-icon btn-toolbar"
               onClick={handleEdit}
               disabled={
                  configBtns === null || configBtns.eBtnchange === "N" || (buttonDisabled.find((b) => b === "ALL" || b === "EDIT") && isDisabled)
               }
               hidden={configBtns === null || configBtns.vBtnchange === "N"}>
               {/* <img alt="" src={Icons.edit}></img> */}
               <GIcons.IconEdit />
               <span id="lblBtnEdit" className="buttonName">
                  Edit
               </span>
            </button>
            <button
               id="btnDelete"
               key="Delete"
               className="mr-8px btn btn-with-icon btn-toolbar"
               onClick={props.delete}
               disabled={
                  configBtns === null ||
                  configBtns.eBtndelete === "N" ||
                  (buttonDisabled.find((b) => b === "ALL" || b === "DELETE") && isDisabled)
               }
               hidden={configBtns === null || configBtns.vBtndelete === "N"}>
               {/* <img alt="" src={Icons.delete}></img> */}
               <GIcons.IconTrash />
               <span id="lblBtnDelete" className="buttonName">
                  Delete
               </span>
            </button>
            <button
               id="btnSave"
               key="Save"
               className="mr-8px btn btn-with-icon btn-toolbar"
               onClick={handleSave}
               disabled={
                  configBtns === null || configBtns.eBtnsave === "N" || (buttonDisabled.find((b) => b === "ALL" || b === "SAVE") && isDisabled)
               }
               hidden={configBtns === null || configBtns.vBtnsave === "N"}>
               {/* <img alt="" src={Icons.save}></img> */}
               <GIcons.IconSave />
               <span id="lblBtnSave" className="buttonName">
                  Save
               </span>
            </button>
            <button
               id="btnSubmit"
               key="Submit"
               className="mr-8px btn btn-with-icon btn-toolbar"
               onClick={handleSubmit}
               disabled={
                  configBtns === null || configBtns.eSubmit === "N" || (buttonDisabled.find((b) => b === "ALL" || b === "SUBMIT") && isDisabled) || disabledSubmit
               }
               hidden={configBtns === null || configBtns.vSubmit === "N"}>
               {/* <img alt="" src={Icons.submit}></img> */}
               <GIcons.IconCheck />
               <span id="lblBtnSubmit" className="buttonName">
                  Submit
               </span>
            </button>
            <button
               id="btnApprove"
               key="Approve"
               className="mr-8px btn btn-with-icon btn-toolbar"
               onClick={handleApprove}
               disabled={
                  configBtns === null || configBtns.eApprove === "N" || (buttonDisabled.find((b) => b === "ALL" || b === "APPROVE") && isDisabled)
               }
               hidden={configBtns === null || configBtns.vApprove === "N"}>
               {/* <img alt="" src={Icons.approve}></img> */}
               <GIcons.IconCheck />
               <span id="lblBtnApprove" className="buttonName">
                  Approve
               </span>
            </button>
            <button
               id="btnDeny"
               key="Deny"
               className="mr-8px btn btn-with-icon btn-toolbar"
               onClick={handleDeny}
               disabled={
                  configBtns === null || configBtns.eDeny === "N" || (buttonDisabled.find((b) => b === "ALL" || b === "DENY") && isDisabled)
               }
               hidden={configBtns === null || configBtns.vDeny === "N"}>
               {/* <img alt="" src={Icons.deny}></img> */}
               <GIcons.IconDenyOrder />
               <span id="lblBtnDeny" className="buttonName">
                  Deny
               </span>
            </button>
            <button
               id="btnConfirm"
               key="Confirm"
               className="mr-8px btn btn-with-icon btn-toolbar"
               onClick={handleConfirm}
               disabled={
                  configBtns === null ||
                  configBtns.eComplete === "N" ||
                  (buttonDisabled.find((b) => b === "ALL" || b === "CONFIRM") && isDisabled)
               }
               hidden={configBtns === null || configBtns.vComplete === "N" || (configBtns.vSubmit !== "N")}>
               {/* <img alt="" src={Icons.confirm}></img> */}
               <GIcons.IconCheck />
               <span id="lblBtnConfirm" className="buttonName">
                  Confirm
               </span>
            </button>
            <button
               id="btnCancel"
               key="Cancel"
               className="mr-8px btn btn-with-icon btn-toolbar"
               onClick={handleCancel}
               disabled={
                  configBtns === null ||
                  configBtns.eCanceljob === "N" ||
                  (buttonDisabled.find((b) => b === "ALL" || b === "CANCEL") && isDisabled)
               }
               hidden={configBtns === null || configBtns.vCanceljob === "N"}>
               {/* <img alt="" src={Icons.cancel}></img> */}
               <GIcons.IconError />
               <span id="lblBtnCancel" className="buttonName">
                  Cancel Order
               </span>
            </button>
            {props.isPrintDetail !== undefined && props.isPrintDetail ? (
               <ButtonGroup
                  className="mr-2"
                  ref={anchorPrintRef}
                  aria-label="split button"
                  disabled={
                     configBtns === null || configBtns.ePrint === "N" || (buttonDisabled.find((b) => b === "ALL" || b === "PRINT") && isDisabled)
                  }
                  hidden={configBtns === null || configBtns.vPrint === "N"}>
                  <button id="btnPrint" key="Print" className="btn btn-with-icon btn-toolbar" onClick={props.print}>
                     {/* <img alt="" src={Icons.print}></img> */}
                     <GIcons.IconPrint />
                     <span id="lblBtnPrint" className="buttonName">
                        Print
                     </span>
                  </button>
                  <button
                     key="PrintMenu"
                     className="btn btn-toolbar btn-icon-only"
                     aria-controls={openPrint ? "split-button-menu" : undefined}
                     aria-expanded={openPrint ? "true" : undefined}
                     aria-label="select merge strategy"
                     aria-haspopup="menu"
                     onClick={handleToggleBtnPrint}
                     style={{ alignContent: "center" }}>
                     <ArrowDropDownIcon></ArrowDropDownIcon>
                  </button>
               </ButtonGroup>
            ) : (
               <button
                  key="Print"
                  className="mr-8px btn btn-with-icon btn-toolbar"
                  onClick={props.print}
                  disabled={configBtns === null || configBtns.ePrint === "N"}
                  hidden={configBtns === null || configBtns.vPrint === "N"}>
                  <GIcons.IconPrint />
                  <span id="lblBtnPrint" className="buttonName">
                     Print
                  </span>
               </button>
            )}
            <Popper open={openPrint} placement="bottom-start" anchorEl={anchorPrintRef.current} role={undefined} transition disablePortal>
               {({ TransitionProps, placement }) => (
                  <Grow
                     {...TransitionProps}
                     style={{
                        transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                     }}>
                     <Paper>
                        <ClickAwayListener onClickAway={handleCloseBtnPrint}>
                           <MenuList id="split-button-menu">
                              {printOptions.map((option, index) => (
                                 <MenuItem key={option} onClick={(event) => handleMenuItemClick(event, index, option)}>
                                    {option}
                                 </MenuItem>
                              ))}
                           </MenuList>
                        </ClickAwayListener>
                     </Paper>
                  </Grow>
               )}
            </Popper>
            <button
               id="btnRefresh"
               key="Refresh"
               className="mr-8px btn btn-with-icon btn-toolbar"
               onClick={handleRefresh}
               disabled={
                  configBtns === null || configBtns.eCancel === "N" || (buttonDisabled.find((b) => b === "ALL" || b === "REFRESH") && isDisabled)
               }
               hidden={configBtns === null || configBtns.vCancel === "N"}>
               {/* <img alt="" src={Icons.refresh}></img> */}
               <GIcons.IconRefresh />
               <span id="lblBtnRefresh" className="buttonName">
                  Refresh
               </span>
            </button>
            <button id="btnClose" key="Close" className="mr-8px btn btn-with-icon btn-toolbar" onClick={isDetail ? props.close : handleClose}>
               {/* <img alt="" src={Icons.close}></img> */}
               <GIcons.IconClose />
               <span id="lblBtnClose" className="buttonName">
                  Close
               </span>
            </button>
         </div>
      </div>
   );
};

export default Toolbar;
