import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import * as GIcons from "../../configs/googleicons";
import * as UiConfigAction from "../../redux/actions/UiConfigAction";
import ServiceUrl from "../../configs/servicePath";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {isEmpty} from "../../configs/function";
import VisibilityControl from "../../components/VisibilityControl";
import useVisibilityControl from "../../hooks/useVisibilityControl";

const Toolbar = (props) => {
   // console.log(props);
   const controller = useVisibilityControl(props.programId);
   const userInfo = useSelector((state) => state.user);
   const uiconfigStore = useSelector((state) => state.uiconfig);
   const dispatch = useDispatch();
   const isDetail = props.isDetail === undefined ? false : props.isDetail;
   const buttonDisabled = props.disabledButton ? props.disabledButton : [];
   const isDisabled = props.disabled ? props.disabled : false;
   const hasSubReport = props.hasSubReport ? props.hasSubReport : false;
   const disabledSubmit = props.disabledSubmit ? props.disabledSubmit : false;
   const fromProgramId = props.fromProgramId ?? "";
   const status = isEmpty(props.status) ? "" : props.status;
   const state = isEmpty(props.state) ? "STATE_I" : props.state;
   const hideToolbar = isEmpty(props.hidden) ? false : props.hidden;
   // const isEdit = props.isEdit ?? false;
   // const isDelete = props.isDelete ?? false;
   // const isReadOnly = props.isReadOnly ?? false;

   const initialHiddenBtns = {
      hideEdit: true,      
      hideSave: true,      
      hideDelete: true,      
      hideRefresh: true,      
      hideSubmit: true,      
      hideApprove: true,      
      hideDeny: true,      
      hideCancelReport: true,      
      hideCreateSubReport: true,      
      hideSentMail: true,      
      hidePrint: true,     
   }
   const initialDisableBtns = {
      disableEdit: true,      
      disableSave: true,      
      disableDelete: true,      
      disableRefresh: true,      
      disableSubmit: true,      
      disableApprove: true,      
      disableDeny: true,      
      disableCancelReport: true,      
      disableCreateSubReport: true,      
      disableSentMail: true,      
      disablePrint: true,
   }
   const [configHiddenBtns, setConfigHiddenBtns] = useState(initialHiddenBtns);
   const [configDisableBtns, setConfigDisableBtns] = useState(initialDisableBtns);
   const [adjustOptions, setAdjustOptions] = useState([]);
   const [printOptions, setPrintOptions] = useState([]);
   const [formType, setFormType] = useState("");
   const [isNew, setIsNew] = useState(false);
   const [isEdit, setIsEdit] = useState(false);
   const [isDelete, setIsDelete] = useState(false);
   const [isReadOnly, setIsReadOnly] = useState(false);

   useEffect(() => {
      console.log(state)
      console.log(status)
      // console.log(labStatus)
      if(!isEmpty(fromProgramId)){
         let disable = {...initialDisableBtns} 
         let disableBtn = null  
         let condDisableInitial = []   
         let hidden = {...initialHiddenBtns} 
         let hiddenBtn = null  
         let condHiddenInitial = []   
         switch (fromProgramId.toUpperCase()) {
            case "SSLABM03500": case "SSLABM01300": case "SSLABM01400":  case "SSLABM01500": case "SSLABM01700": case "SSLABM02800":
               condDisableInitial = [
                  { state: 'STATE_A', status: 'RPTS_N', config: {...initialDisableBtns, disableSave: false, disableRefresh: false, disableSubmit: false } },
                  { state: 'STATE_I', status: 'RPTS_N', config: {...initialDisableBtns, disableEdit: false, disableDelete: false, disableSubmit: false, disablePrint: false } },
                  { state: 'STATE_C', status: 'RPTS_N', config: {...initialDisableBtns, disableSave: false, disableRefresh: false, disableSubmit: false } },
                  { state: 'STATE_I', status: 'RPTS_S', config: {...initialDisableBtns, disableEdit: false, disableCreateSubReport: !hasSubReport, disablePrint: false} },
                  { state: 'STATE_C', status: 'RPTS_S', config: {...initialDisableBtns, disableRefresh: false, disableSubmit: false } },
               ];
               disableBtn = condDisableInitial.find((con) => con.state === state && con.status === status);
               if (!isEmpty(disableBtn)) {
                 disable = { ...disable, ...disableBtn.config };
               }
               condHiddenInitial = [
                  { state: 'STATE_A', status: 'RPTS_N', config: {...initialHiddenBtns, hideEdit: false, hideDelete: false, hideSave: false, hideRefresh: false, hideSubmit: false, hidePrint: false } },
                  { state: 'STATE_I', status: 'RPTS_N', config: {...initialHiddenBtns, hideEdit: false, hideDelete: false, hideSave: false, hideRefresh: false, hideSubmit: false, hidePrint: false } },
                  { state: 'STATE_C', status: 'RPTS_N', config: {...initialHiddenBtns, hideEdit: false, hideDelete: false, hideSave: false, hideRefresh: false, hideSubmit: false, hidePrint: false } },
                  { state: 'STATE_I', status: 'RPTS_S', config: {...initialHiddenBtns, hideEdit: false, hideRefresh: false, hideSubmit: false, hideCreateSubReport: false, hidePrint: false } },
                  { state: 'STATE_C', status: 'RPTS_S', config: {...initialHiddenBtns, hideEdit: false, hideRefresh: false, hideSubmit: false, hideCreateSubReport: false, hidePrint: false } },
               ];
               hiddenBtn = condHiddenInitial.find((con) => con.state === state && con.status === status);
               if (!isEmpty(hiddenBtn)) {
                 hidden = { ...hidden, ...hiddenBtn.config };
               }
               break;
            case "SSLABM03800":
               condDisableInitial = [
                  { state: 'STATE_I', status: 'RPTS_S', config: {...initialDisableBtns, disableApprove: false, disableDeny: false, disableCancelReport: false, disablePrint: false } },
                  { state: 'STATE_I', status: 'RPTS_A', config: {...initialDisableBtns, disablePrint: false } },
                  { state: 'STATE_I', status: 'RPTS_M', config: {...initialDisableBtns, disablePrint: false } },
               ];
               disableBtn = condDisableInitial.find((con) => con.state === state && con.status === status);
               if (!isEmpty(disableBtn)) {
                 disable = { ...disable, ...disableBtn.config };
               }               
               condHiddenInitial = [
                  { state: 'STATE_I', status: 'RPTS_S', config: {...initialHiddenBtns, hideApprove: false, hideDeny: false, hideCancelReport: false, hidePrint: false } },
                  { state: 'STATE_I', status: 'RPTS_A', config: {...initialHiddenBtns, hidePrint: false } },
                  { state: 'STATE_I', status: 'RPTS_M', config: {...initialHiddenBtns, hidePrint: false } },
               ];
               hiddenBtn = condHiddenInitial.find((con) => con.state === state && con.status === status);
               if (!isEmpty(hiddenBtn)) {
                 hidden = { ...hidden, ...hiddenBtn.config };
               }
               break;      
            case "SSLABM01800":
               condDisableInitial = [
                  { state: 'STATE_I', status: 'RPTS_A', config: {...initialDisableBtns, disableApprove: false, disableDeny: false, disableCancelReport: false, disableSentMail: false, disablePrint: false } },
                  { state: 'STATE_I', status: 'RPTS_M', config: {...initialDisableBtns, disableApprove: false, disableDeny: false, disableCancelReport: false, disableSentMail: false, disablePrint: false } },
               ];
               disableBtn = condDisableInitial.find((con) => con.state === state && con.status === status);
               if (!isEmpty(disableBtn)) {
                 disable = { ...disable, ...disableBtn.config };
               }        
               condHiddenInitial = [
                  { state: 'STATE_I', status: 'RPTS_A', config: {...initialHiddenBtns, hideApprove: false, hideDeny: false, hideCancelReport: false, hideSentMail: false, hidePrint: false } },
                  { state: 'STATE_I', status: 'RPTS_M', config: {...initialHiddenBtns, hideApprove: false, hideDeny: false, hideCancelReport: false, hideSentMail: false, hidePrint: false } },
               ];
               hiddenBtn = condHiddenInitial.find((con) => con.state === state && con.status === status);
               if (!isEmpty(hiddenBtn)) {
                 hidden = { ...hidden, ...hiddenBtn.config };
               }
               break;      
            default:
               break;
         }
         setConfigDisableBtns(disable)      
         setConfigHiddenBtns(hidden)      
      }          
   }, [fromProgramId, status, state]);

   const handleEdit = () => {
      console.log("edit click")
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
   const handleDeny = () => {
      // if (props.hasOwnProperty("onStateChange")) {
      //    props.onStateChange("STATE_I", "DENY");
      // }
      if (props.hasOwnProperty("deny")) {
         props.deny();
      }
   };
   const handleCancelReport = () => {
      // if (props.hasOwnProperty("onStateChange")) {
      //    props.onStateChange("STATE_I", "CANCEL");
      // }
      if (props.hasOwnProperty("cancelReport")) {
         props.cancelReport();
      }
   };
   const handleCreateSubReports  = () => {
      // if (props.hasOwnProperty("onStateChange")) {
      //    props.onStateChange("STATE_I", "CANCEL");
      // }
      if (props.hasOwnProperty("createSubReport")) {
         props.createSubReport();
      }
   };

   return (
      <div className="row container-toolbar">
         <div className="col-md-12 col-lg-12 Toolbar" >
            <VisibilityControl controller={controller} id="vsb-edit-btn">
               <button
                  id="btnEdit"
                  key="Edit"
                  className="mr-8px btn btn-with-icon btn-toolbar"
                  onClick={handleEdit}
                  disabled={configDisableBtns.disableEdit}
                  hidden={configHiddenBtns.hideEdit}
               >
                  <GIcons.IconEdit />
                  <span id="lblBtnEdit" className="buttonName">
                     Edit
                  </span>
               </button>   
            </VisibilityControl>
            <VisibilityControl controller={controller} id="vsb-save-btn">
               <button
                  id="btnSave"
                  key="Save"
                  className="mr-8px btn btn-with-icon btn-toolbar"
                  onClick={handleSave}
                  disabled={configDisableBtns.disableSave}
                  hidden={configHiddenBtns.hideSave}
               >
                  <GIcons.IconSave />
                  <span id="lblBtnSave" className="buttonName">
                     Save
                  </span>
               </button>
            </VisibilityControl>      
            <VisibilityControl controller={controller} id="vsb-submit-btn">
               <button
                  id="btnSubmit"
                  key="Submit"
                  className="mr-8px btn btn-with-icon btn-toolbar"
                  onClick={handleSubmit}
                  disabled={configDisableBtns.disableSubmit}
                  hidden={configHiddenBtns.hideSubmit}
               >
                  <GIcons.IconSubmit />
                  <span id="lblBtnSubmit" className="buttonName">
                     Submit
                  </span>
               </button>
            </VisibilityControl>
            <VisibilityControl controller={controller} id="vsb-delete-btn">
               <button
                  id="btnDelete"
                  key="Delete"
                  className="mr-8px btn btn-with-icon btn-toolbar"
                  onClick={props.delete}
                  disabled={configDisableBtns.disableDelete}
                  hidden={configHiddenBtns.hideDelete}
               >
                  <GIcons.IconTrash />
                  <span id="lblBtnDelete" className="buttonName">
                     Delete
                  </span>
               </button>
            </VisibilityControl>
            <VisibilityControl controller={controller} id="vsb-approve-btn">
               <button
                  id="btnApprove"
                  key="Approve"
                  className="mr-8px btn btn-with-icon btn-toolbar"
                  onClick={handleApprove}
                  disabled={configDisableBtns.disableApprove}
                  hidden={configHiddenBtns.hideApprove}
               >
                  <GIcons.IconCheck />
                  <span id="lblBtnApprove" className="buttonName">
                     Approve
                  </span>
               </button>
            </VisibilityControl>    
            <VisibilityControl controller={controller} id="vsb-deny-btn">
               <button
                  id="btnDeny"
                  key="Deny"
                  className="mr-8px btn btn-with-icon btn-toolbar"
                  onClick={handleDeny}
                  disabled={configDisableBtns.disableDeny}
                  hidden={configHiddenBtns.hideDeny}
               >
                  <GIcons.IconDenyLab />
                  <span id="lblBtnDeny" className="buttonName">
                     Deny
                  </span>
               </button>
            </VisibilityControl>     
            <VisibilityControl controller={controller} id="vsb-cancelReport-btn">
               <button
                  id="btnCancelReport"
                  key="CancelReport"
                  className="mr-8px btn btn-with-icon btn-toolbar"
                  onClick={handleCancelReport}
                  disabled={configDisableBtns.disableCancelReport}
                  hidden={configHiddenBtns.hideCancelReport}
               >
                  <GIcons.IconDenyOrder />
                  <span id="lblBtnCancelReport" className="buttonName">
                     Cancel Report
                  </span>
               </button>    
            </VisibilityControl>      
            <VisibilityControl controller={controller} id="vsb-createSubReport-btn">
               <button
                  id="btnCreateSubReport"
                  key="CreateSubReport"
                  className="mr-8px btn btn-with-icon btn-toolbar"
                  onClick={handleCreateSubReports}
                  disabled={configDisableBtns.disableCreateSubReport}
                  hidden={configHiddenBtns.hideCreateSubReport}
               >
                  <GIcons.IconCreateResult />
                  <span id="lblBtnCreateSubReport" className="buttonName">
                     Create Sub Report
                  </span>
               </button>     
            </VisibilityControl>   
            <VisibilityControl controller={controller} id="vsb-sendMail-btn">
               <button
                  id="btnSentMail"
                  key="SentMail"
                  className="mr-8px btn btn-with-icon btn-toolbar"
                  onClick={props.sendMail}
                  disabled={configDisableBtns.disableSentMail}
                  hidden={configHiddenBtns.hideSentMail}
               >
                  <GIcons.IconMail />
                  <span id="lblBtnSentMail" className="buttonName">
                     Send Mail
                  </span>
               </button>     
            </VisibilityControl>   
            <VisibilityControl controller={controller} id="vsb-print-btn">
               <button
                  id="btnPrint"
                  key="Print"
                  className="mr-8px btn btn-with-icon btn-toolbar"
                  onClick={props.print}
                  disabled={configDisableBtns.disablePrint}
                  hidden={configHiddenBtns.hidePrint}
               >
                  <GIcons.IconPrint />
                  <span id="lblBtnPrint" className="buttonName">
                     Print
                  </span>
               </button>     
            </VisibilityControl>         
            <VisibilityControl controller={controller} id="vsb-refresh-btn">
               <button
                  id="btnRefresh"
                  key="Refresh"
                  className="mr-8px btn btn-with-icon btn-toolbar"
                  onClick={handleRefresh}
                  disabled={configDisableBtns.disableRefresh}
                  hidden={configHiddenBtns.hideRefresh}
               >
                  <GIcons.IconRefresh />
                  <span id="lblBtnRefresh" className="buttonName">
                     Refresh
                  </span>
               </button>
            </VisibilityControl>     
            <button id="btnClose" key="Close" className="mr-8px btn btn-with-icon btn-toolbar" onClick={props.close}>
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
