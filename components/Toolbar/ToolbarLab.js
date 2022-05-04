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
   // console.log(props)
   const controller = useVisibilityControl(props.programId);
   const userInfo = useSelector((state) => state.user);
   const uiconfigStore = useSelector((state) => state.uiconfig);
   const dispatch = useDispatch();
   const isDetail = props.isDetail === undefined ? false : props.isDetail;
   const buttonDisabled = props.disabledButton ? props.disabledButton : [];
   const isDisabled = props.disabled ? props.disabled : false;
   const disabledSubmit = props.disabledSubmit ? props.disabledSubmit : false;
   const toolbarProgramId = props.toolbarProgramId ?? "";
   const labIdTo = isEmpty(props.labIdTo) ? "" : props.labIdTo; 
   const labIdFrom = isEmpty(props.labIdFrom) ? "" : props.labIdFrom;
   const isDocNew = isEmpty(props.isDocNew) ? false : props.isDocNew;
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
      hideCanceljob: true,      
      hideSubmit: true,      
      hideUrgent: true,      
      hideAccept: true,      
      hideDeny: true,      
      hideAdjust: true,      
      hideCreateResult: true,      
      hidePrint: true,      
      // hideRefresh: true   
   }
   const initialDisableBtns = {
      disableEdit: true,      
      disableSave: true,      
      disableDelete: true,      
      disableCanceljob: true,      
      disableSubmit: true,      
      disableUrgent: true,      
      disableAccept: true,      
      disableDeny: true,      
      disableAdjust: true,      
      disableCreateResult: true,      
      disablePrint: true,      
      // disableRefresh: true   
   }
   const [configHiddenBtns, setConfigHiddenBtns] = useState(initialHiddenBtns);
   const [configDisableBtns, setConfigDisableBtns] = useState(initialDisableBtns);
   const [adjustOptions, setAdjustOptions] = useState([]);
   const [printOptions, setPrintOptions] = useState([]);
   const [authens, setAuthens] = useState([]);
   const [formType, setFormType] = useState("");
   const [isNew, setIsNew] = useState(false);
   const [isEdit, setIsEdit] = useState(false);
   const [isDelete, setIsDelete] = useState(false);
   const [isReadOnly, setIsReadOnly] = useState(false);

   // const [state, setState] = useState(props.state);
   const [openPrint, setOpenPrint] = useState(false);
   const [openAdjust, setOpenAdjust] = useState(false);
   const anchorPrintRef = React.useRef(null);
   const anchorAdjustRef = React.useRef(null);
   // console.log("printdetail : " + props.isPrintDetail);

   useEffect(() => {
      const reqAdjust = {
         connection: userInfo.connection,
         orgCode: userInfo.orgCode,
       };
       axios
         .post(ServiceUrl.urlLabMgt + "GetAdjustMenuList", reqAdjust)
         .then((response) => {   
            setAdjustOptions(response.data);
         })
         .catch((error) => console.log(error));

      const reqPrint = {
         connection: userInfo.connection,
         lang: userInfo.language,
         gdtype: "GD059",
       };
       axios
         .post(ServiceUrl.urlBase + "GetGeneralDescList", reqPrint)
         .then((response) => {   
            setPrintOptions(response.data);
         })
         .catch((error) => console.log(error));
         // console.log(toolbarProgramId)
      if(toolbarProgramId === "SSLABM03500" || toolbarProgramId === "SSLABM15500" ){
         if(props.programId === "SSLABM01300" || props.programId === "SSLABM01400"){
            setFormType("RECEIVE")
            setIsEdit(true)
            setIsDelete(!isDocNew)
            setIsReadOnly(false)
         }else{
            const reqAuthen = {
               connection: userInfo.connection,
               lang: userInfo.language,
               userName: userInfo.username,
               orgCode: userInfo.orgCode,
            };
            axios
               .post(ServiceUrl.urlLabMgt + "FindAuthenLabroom", reqAuthen)
               .then((response) => {                
                  const dataAuthen = response.data;
                  const labToAuthen = dataAuthen.find(d => d.labroom === labIdTo)
                  const labFromAuthen = dataAuthen.find(d => d.labroom === labIdFrom)
                 console.log(labIdTo)
                 console.log(labIdFrom)
                 console.log(labToAuthen)
                 console.log(labFromAuthen)
                  if(isEmpty(labFromAuthen)){
                     setIsEdit(false)
                     setIsDelete(false)
                     setIsReadOnly(false)
                  }
                  else{           
                     setIsEdit(labFromAuthen.updateyn === "Y")
                     setIsDelete(labFromAuthen.deleteyn === "Y")
                     setIsReadOnly(labFromAuthen.readyn === "Y")
                  }
                  const labToNew = !isEmpty(labToAuthen) && labToAuthen.newyn === "Y"
                  const labFromNew = !isEmpty(labFromAuthen) && labFromAuthen.newyn === "Y"
                  console.log(labToNew)
                  console.log(labFromNew)
                  console.log(status)
                  if (labToNew && labFromNew) {
                     if (status === "SAMPS_S" || status === "SAMPS_A") {
                        setFormType("RECEIVE");
                     } else {
                        setFormType("SUBMIT");
                     }
                  } else {
                     if (labToNew) {
                        setFormType("RECEIVE");
                     }
                     if (labFromNew) {
                        setFormType("SUBMIT");
                     }
                  }               
               })
               .catch((error) => console.log(error));
         }
      }
      else{
         setFormType("SUBMIT")
         setIsEdit(true)
         setIsDelete(!isDocNew)
         setIsReadOnly(false)
      }
   }, [status, isDocNew]);

   useEffect(() => {
      console.log(formType)
      if(!isEmpty(formType)){
         if(status === "SAMPS_N"){
            const reqUrgent = {
               connection: userInfo.connection,
               keyName: "URGENT_YN",
               programCode: props.programId.toUpperCase(),
             };
             axios
               .post(ServiceUrl.urlBase + "GetInitValue", reqUrgent)
               .then((response) => {   
                  const urgentyn = isEmpty(response.data) ? "N" : response.data
                  const config = {...initialHiddenBtns}   
                  if(!isReadOnly){ 
                     switch (formType.toUpperCase()) {
                        case "RECEIVE":
                           config.hideEdit = false
                           config.hideSave = false
                           config.hideCanceljob = false
                           config.hideAccept = false
                           config.hideDeny = false
                           config.hideAdjust = false
                           config.hideCreateResult = false
                           config.hidePrint = false
                           config.hideRefresh = false
                           break;
                        case "SUBMIT":
                           config.hideEdit = false
                           config.hideSave = false
                           config.hideDelete = false
                           config.hideCanceljob = false
                           config.hideSubmit = false
                           config.hideUrgent = false
                           config.hidePrint = false
                           config.hideRefresh = false
                           config.hideUrgent = urgentyn === "N"
                           break;      
                        default:
                           break;
                     }      
                     if(props.programId !== "SSLABM01300" && props.programId !== "SSLABM01400"){
                        config.hideAdjust = true
                     }
                     setConfigHiddenBtns(config)
                  }
               })
               .catch((error) => console.log(error));
         }
         else{
            const config = { ...initialHiddenBtns };
            if (!isReadOnly) {
              switch (formType.toUpperCase()) {
                case "RECEIVE":
                  config.hideEdit = false;
                  config.hideSave = false;
                  config.hideCanceljob = false;
                  config.hideAccept = false;
                  config.hideDeny = false;
                  config.hideAdjust = false;
                  config.hideCreateResult = false;
                  config.hidePrint = false;
                  config.hideRefresh = false;
                  break;
                case "SUBMIT":
                  config.hideEdit = false;
                  config.hideSave = false;
                  config.hideDelete = false;
                  config.hideCanceljob = false;
                  config.hideSubmit = false;
                  config.hideUrgent = true;
                  config.hidePrint = false;
                  config.hideRefresh = false;
                  break;
                default:
                  break;
              }
              if(props.programId !== "SSLABM01300" && props.programId !== "SSLABM01400"){
                  config.hideAdjust = true
               }
              setConfigHiddenBtns(config);
            }
         }  
      }
          
   }, [formType, status]);

   useEffect(() => {
      console.log(isDelete)
      console.log(state)
      console.log(status)
      if(!isEmpty(formType)){
         let disable = {...initialDisableBtns}   
         let condInitial = []   
         switch (formType.toUpperCase()) {
            case "RECEIVE":
               condInitial = [
                  { state: 'STATE_I', status: 'SAMPS_S', config: {...initialDisableBtns, disableEdit: !isEdit, disableCanceljob: false, disableAccept: false, disableDeny: false, disablePrint: false} },
                  { state: 'STATE_I', status: 'SAMPS_D', config: {...initialDisableBtns, disableEdit: !isEdit} },
                  { state: 'STATE_I', status: 'SAMPS_R', config: {...initialDisableBtns} },
                  { state: 'STATE_I', status: 'SAMPS_A', config: {...initialDisableBtns, disableEdit: !isEdit, disableCanceljob: false, disableAdjust: false, disableCreateResult: false, disablePrint: false} },
                  { state: 'STATE_I', status: 'SAMPS_U', config: {...initialDisableBtns, disableEdit: !isEdit, disableCanceljob: false, disableAdjust: false, disableCreateResult: false, disablePrint: false} },
                  { state: 'STATE_I', status: 'SAMPS_C', config: {...initialDisableBtns, disableCreateResult: false, disablePrint: false} },
               ];
               switch (state.toUpperCase()) {
                  case "STATE_I":
                     const disableBtn = condInitial.find(con => con.state === state && con.status === status)
                     if(!isEmpty(disableBtn)){
                        disable = {...disable, ...disableBtn.config}
                     }
                     break;
                  case "STATE_C":
                     disable.disableSave = !isEdit
                     break;            
                  default:
                     break;
               }
               break;
            case "SUBMIT":
               condInitial = [
                  { state: 'STATE_I', status: 'SAMPS_N', config: {...initialDisableBtns, disableEdit: !isEdit, disableDelete: !isDelete, disableSubmit: false, disableUrgent: false} },
                  { state: 'STATE_I', status: 'SAMPS_S', config: {...initialDisableBtns, disableEdit: !isEdit, disableCanceljob: false, disablePrint: false} },
                  { state: 'STATE_I', status: 'SAMPS_D', config: {...initialDisableBtns, disableEdit: !isEdit, disableCanceljob: false} },
                  { state: 'STATE_I', status: 'SAMPS_R', config: {...initialDisableBtns} },
                  { state: 'STATE_I', status: 'SAMPS_A', config: {...initialDisableBtns, disableEdit: !isEdit, disableCanceljob: false, disablePrint: false} },
                  { state: 'STATE_I', status: 'SAMPS_U', config: {...initialDisableBtns, disableEdit: !isEdit, disableCanceljob: false, disablePrint: false} },
                  { state: 'STATE_I', status: 'SAMPS_C', config: {...initialDisableBtns, disablePrint: false} },
               ];
               switch (state.toUpperCase()) {
                  case "STATE_I":
                     const disableBtn = condInitial.find(con => con.state === state && con.status === status)
                     if(!isEmpty(disableBtn)){
                        disable = {...disable, ...disableBtn.config}
                     }
                     break;
                  case "STATE_C":
                     disable.disableSave = !isEdit
                     disable.disableSubmit = !isEdit
                     disable.disableUrgent = !isEdit
                     break;    
                  case "STATE_A":
                     disable.disableSave = !isEdit
                     disable.disableSubmit = !isEdit
                     disable.disableUrgent = !isEdit
                     break;            
                  default:
                     break;
               }           
               break;      
            default:
               break;
         }
         setConfigDisableBtns(disable)      
      }          
   }, [formType, status, state, isEdit, isDelete, isReadOnly]);

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
   const handleAccept = () => {
      // if (props.hasOwnProperty("onStateChange")) {
      //    props.onStateChange("STATE_I", "APPROVE");
      // }
      if (props.hasOwnProperty("accept")) {
         props.accept();
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

   const handleMenuPrintClick = (event, index, option) => {
      setOpenPrint(false);
      if (props.hasOwnProperty("printMenu")) {
         if (!isEmpty(props.printMenu)) {
            props.printMenu[option.gdcode](option);
         }
      }
   };
   const handleMenuAdjustClick = (event, index, option) => { 
      // if(toolbarProgramId === "SSLABM03500"){
      //    console.log("adjust state add")
      //    props.onStateChange("STATE_A", "ADJUST");
      // }    
      setOpenAdjust(false);
      if (props.hasOwnProperty("adjustMenu")) {
         if (!isEmpty(props.adjustMenu)) {
            props.adjustMenu[option.code](option);
         }
      }
   };

   const handleToggleBtnPrint = () => {
      setOpenPrint((prevOpen) => !prevOpen);
   };
   const handleToggleBtnAdjust = () => {
      setOpenAdjust((prevOpen) => !prevOpen);
   };

   const handleCloseBtnPrint = (event) => {
      if (anchorPrintRef.current && anchorPrintRef.current.contains(event.target)) {
         return;
      }
      setOpenPrint(false);
   };
   const handleCloseBtnAdjust = (event) => {
      if (anchorAdjustRef.current && anchorAdjustRef.current.contains(event.target)) {
         return;
      }
      setOpenAdjust(false);
   };

   return (
      <div className="row container-toolbar">
         <div className="col-md-12 col-lg-12 Toolbar" >
            {/* <button
               id="btnNew"
               key="New"
               className="mr-8px btn btn-with-icon btn-toolbar"
               onClick={handleNew}
               disabled={configBtns === null || configBtns.eNew === "N" || (buttonDisabled.find((b) => b === "ALL" || b === "NEW") && isDisabled)}
               hidden={configBtns === null || configHiddenBtns.hideNew === "N"}>
               <GIcons.IconNew />
               <span id="lblBtnNew" className="buttonName">
                  New
               </span>
            </button> */}
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
            <VisibilityControl controller={controller} id="vsb-delete-btn">
               <button
                  id="btnDelete"
                  key="Delete"
                  className="mr-8px btn btn-with-icon btn-toolbar btn-icon-gray"
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
            <VisibilityControl controller={controller} id="vsb-cancel-btn">
               <button
                  id="btnCancel"
                  key="Cancel"
                  className="mr-8px btn btn-with-icon btn-toolbar btn-icon-red"
                  onClick={handleCancel}
                  disabled={configDisableBtns.disableCanceljob}
                  hidden={configHiddenBtns.hideCanceljob}
               >
                  <GIcons.IconDenyOrder />
                  <span id="lblBtnCancel" className="buttonName">
                     Cancel Sample
                  </span>
               </button>    
            </VisibilityControl>
            <VisibilityControl controller={controller} id="vsb-submit-btn">
               <button
                  id="btnSubmit"
                  key="Submit"
                  className="mr-8px btn btn-with-icon btn-toolbar btn-icon-orange"
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
            <VisibilityControl controller={controller} id="vsb-urgent-btn">
               <button
                  id="btnUrgent"
                  key="Urgent"
                  className="mr-8px btn btn-with-icon btn-toolbar btn-icon-yellow"
                  onClick={props.urgent}
                  disabled={configDisableBtns.disableUrgent}
                  hidden={configHiddenBtns.hideUrgent}
               >
                  <GIcons.IconUrgent />
                  <span id="lblBtnUrgent" className="buttonName">
                     Urgent
                  </span>
               </button>
            </VisibilityControl>    
            <VisibilityControl controller={controller} id="vsb-accept-btn">
               <button
                  id="btnAccept"
                  key="Accept"
                  className="mr-8px btn btn-with-icon btn-toolbar"
                  onClick={handleAccept}
                  disabled={configDisableBtns.disableAccept}
                  hidden={configHiddenBtns.hideAccept}
               >
                  <GIcons.IconCheck />
                  <span id="lblBtnAccept" className="buttonName">
                     Accept
                  </span>
               </button>
            </VisibilityControl>    
            <VisibilityControl controller={controller} id="vsb-deny-btn">
               <button
                  id="btnDeny"
                  key="Deny"
                  className="mr-8px btn btn-with-icon btn-toolbar btn-icon-red"
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
            <VisibilityControl controller={controller} id="vsb-adjust-btn">
               <button
                  id="btnAdjust"
                  key="Adjust"
                  ref={anchorAdjustRef}
                  className="mr-8px btn btn-with-icon btn-toolbar btn-icon-blue"
                  aria-controls={openAdjust ? "split-adjust-menu" : undefined}
                  aria-expanded={openAdjust ? "true" : undefined}
                  aria-haspopup="menu"
                  onClick={handleToggleBtnAdjust}
                  disabled={configDisableBtns.disableAdjust}
                  hidden={configHiddenBtns.hideAdjust}
               >
                  <GIcons.IconAdjust />
                  <span id="lblBtnAdjust" className="buttonName">
                     Adjust
                  </span>
               </button>   
               <Popper open={openAdjust} placement="bottom-start" anchorEl={anchorAdjustRef.current} role={undefined} transition disablePortal>
                  {({ TransitionProps, placement }) => (
                     <Grow
                        {...TransitionProps}
                        style={{
                           transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                        }}>
                        <Paper>
                           <ClickAwayListener onClickAway={handleCloseBtnAdjust}>
                              <MenuList id="split-adjust-menu">
                                 {adjustOptions.map((option, index) => (
                                    <MenuItem key={option.code} onClick={(event) => handleMenuAdjustClick(event, index, option)}>
                                       {option.name}
                                    </MenuItem>
                                 ))}
                              </MenuList>
                           </ClickAwayListener>
                        </Paper>
                     </Grow>
                  )}
               </Popper>  
            </VisibilityControl>
            <VisibilityControl controller={controller} id="vsb-createresult-btn">
               <button
                  id="btnCreateResult"
                  key="CreateResult"
                  className="mr-8px btn btn-with-icon btn-toolbar btn-icon-blue"
                  onClick={props.createResult}
                  disabled={configDisableBtns.disableCreateResult}
                  hidden={configHiddenBtns.hideCreateResult}
               >
                  <GIcons.IconCreateResult />
                  <span id="lblBtnCreateResult" className="buttonName">
                     Create Result
                  </span>
               </button>     
            </VisibilityControl>   
            <VisibilityControl controller={controller} id="vsb-print-btn">
               {props.isPrintDetail !== undefined && props.isPrintDetail ? (
                  <ButtonGroup
                     className="mr-2"
                     ref={anchorPrintRef}
                     aria-label="split button"
                     disabled={configDisableBtns.disablePrint}
                     hidden={configHiddenBtns.hidePrint}
                  >
                     <button id="btnPrint" key="Print" className="btn btn-with-icon btn-toolbar" onClick={props.print}>
                        <GIcons.IconPrint />
                        <span id="lblBtnPrint" className="buttonName">
                           Print
                        </span>
                     </button>
                     <button
                        key="PrintMenu"
                        className="btn btn-toolbar btn-icon-only"
                        aria-controls={openPrint ? "split-print-menu" : undefined}
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
                     disabled={configDisableBtns.disablePrint}
                     hidden={configHiddenBtns.hidePrint}
                  >
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
                              <MenuList id="split-print-menu">
                                 {printOptions.map((option, index) => (
                                    <MenuItem key={option.gdcode} onClick={(event) => handleMenuPrintClick(event, index, option)}>
                                       {option.gdname}
                                    </MenuItem>
                                 ))}
                              </MenuList>
                           </ClickAwayListener>
                        </Paper>
                     </Grow>
                  )}
               </Popper>
            </VisibilityControl>   
            <VisibilityControl controller={controller} id="vsb-refresh-btn">
               <button
                  id="btnRefresh"
                  key="Refresh"
                  className="mr-8px btn btn-with-icon btn-toolbar"
                  onClick={handleRefresh}
                  // disabled={configDisableBtns.disableRefresh}
                  // hidden={configHiddenBtns.hideRefresh}
               >
                  <GIcons.IconRefresh />
                  <span id="lblBtnRefresh" className="buttonName">
                     Refresh
                  </span>
               </button>
            </VisibilityControl>     
            <button id="btnClose" key="Close" className="mr-8px btn btn-with-icon btn-toolbar" onClick={isDetail ? props.close : handleClose}>
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
