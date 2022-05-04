import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import Icons from "../../configs/icons";
import * as UiConfigAction from "../../redux/actions/UiConfigAction";
import * as GIcons from "../../configs/googleicons";
import { isEmpty } from "../../configs/function";
import VisibilityControl from "../../components/VisibilityControl";
import useVisibilityControl from "../../hooks/useVisibilityControl";
import AdjustBtn from "./AdjustBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Toolbar = (props) => {
  const controller = useVisibilityControl(props.programId);
  const dispatch = useDispatch();
  const isDetail = props.isDetail === undefined ? false : props.isDetail;
  const buttonList = props.buttons === undefined ? [] : props.buttons;
  const buttonDisabled = props.disabledButton ? props.disabledButton : [];
  const isDisabled = props.disabled ? props.disabled : false;
  const state = isEmpty(props.state) ? "STATE_I" : props.state;
  const buttonCollapseCriteria =
    props.hasOwnProperty("buttonCollapseCriteria") &&
    props.buttonCollapseCriteria;
  const hasFilterMobile =
    props.hasFilterMobile === undefined ? false : props.hasFilterMobile;
  const handleClose = () => {
    dispatch(UiConfigAction.setShowMenuSidebar(true));
    // dispatch(UiConfigAction.setProgramName(""));
    props.close();
  };
  const buttonUseState = props.buttonUseState ?? false;
  const [isCollapseCriteria, setIsCollapseCriteria] = useState(false);
  const initialDisableBtns = {
    new: false,
    edit: false,
    save: false,
    savenew: false,
    delete: false,
    submit: false,
  };
  const [disableBtns, setDisableBtns] = useState(initialDisableBtns);

  useEffect(() => {
    console.log(buttonUseState);
    console.log(state);
    if (buttonUseState) {
      const condInitial = [
        {
          state: "STATE_I",
          config: {
            ...initialDisableBtns,
            save: true,
            savenew: true,
            submit: false,
          },
        },
        {
          state: "STATE_A",
          config: {
            ...initialDisableBtns,
            new: true,
            edit: true,
            delete: true,
            submit: true,
          },
        },
        {
          state: "STATE_C",
          config: {
            ...initialDisableBtns,
            new: true,
            edit: true,
            delete: true,
            submit: true,
          },
        },
      ];
      const disable = condInitial.find((con) => con.state === state);
      if (!isEmpty(disable)) {
        setDisableBtns({ ...disableBtns, ...disable.config });
      }
    } else {
      setDisableBtns(initialDisableBtns);
    }
  }, [state, buttonUseState]);

  let buttons = null;
  buttons = buttonList.map((btn) => {
    switch (btn) {
      case "NEW":
        const existNew =
          props.menuButtons !== undefined && props.menuButtons.length > 0
            ? props.menuButtons.find((cb) => cb === btn)
            : undefined;
        return existNew !== undefined ? (
          <VisibilityControl controller={controller} id="vsb-new-btn">
            <div key="NewDiv">
              <button
                id="btnNew"
                key="New"
                className="mr-8px btn btn-with-icon btn-toolbar"
                disabled={
                  (buttonDisabled.find((b) => b === "ALL" || b === "NEW") &&
                    isDisabled) ||
                  disableBtns.new
                }
                {...props.buttonNew.buttonProp}
              >
                {/* <img alt="" src={Icons.new}></img> */}
                <GIcons.IconNew />
                <span id="lblBtnNew" className="buttonName">
                  New
                </span>
              </button>
              {props.buttonNew.buttonMenu}
            </div>
          </VisibilityControl>
        ) : (
          <VisibilityControl controller={controller} id="vsb-new-btn">
            <button
              id="btnNew"
              key="New"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.new}
              disabled={
                (buttonDisabled.find((b) => b === "ALL" || b === "NEW") &&
                  isDisabled) ||
                disableBtns.new
              }
            >
              {/* <img alt="" src={Icons.new}></img> */}
              <GIcons.IconNew />
              <span id="lblBtnNew" className="buttonName">
                New
              </span>
            </button>
          </VisibilityControl>
        );
      case "REFRESH":
        return (
          <VisibilityControl controller={controller} id="vsb-refresh-btn">
            <button
              id="btnRefresh"
              key="Refresh"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.refresh}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "REFRESH") &&
                isDisabled
              }
            >
              {/* <img alt="" src={Icons.refresh}></img> */}
              <GIcons.IconRefresh />
              <span id="lblBtnRefresh" className="buttonName">
                Refresh
              </span>
            </button>
          </VisibilityControl>
        );
      case "SAVE":
        return (
          <VisibilityControl controller={controller} id="vsb-save-btn">
            <button
              id="btnSave"
              key="Save"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.save}
              disabled={
                (buttonDisabled.find((b) => b === "ALL" || b === "SAVE") &&
                  isDisabled) ||
                disableBtns.save
              }
            >
              {/* <img alt="" src={Icons.save}></img> */}
              <GIcons.IconSave />
              <span id="lblBtnSave" className="buttonName">
                Save
              </span>
            </button>
          </VisibilityControl>
        );
      case "ACCEPT":
        return (
          <button
            id="btnAccept"
            key="accept"
            className="mr-8px btn btn-with-icon btn-toolbar"
            onClick={props.accept}
            disabled={
              buttonDisabled.find((b) => b === "ALL" || b === "ACCEPT") &&
              isDisabled
            }
          >
            {/* <img alt="" src={Icons.save}></img> */}
            <GIcons.IconCheck />
            <span id="lblBtnAccept" className="buttonName">
              Accept
            </span>
          </button>
        );
      case "REJECT":
        return (
          <button
            id="btnReject"
            key="reject"
            className="mr-8px btn btn-with-icon btn-toolbar btn-icon-red"
            onClick={props.reject}
            disabled={
              buttonDisabled.find((b) => b === "ALL" || b === "REJECT") &&
              isDisabled
            }
          >
            {/* <img alt="" src={Icons.save}></img> */}
            <GIcons.IconReject />
            <span id="lblBtnReject" className="buttonName">
              Reject
            </span>
          </button>
        );
      case "SAVE&NEW":
        return (
          <VisibilityControl controller={controller} id="vsb-saveandnew-btn">
            <button
              id="btnSavenew"
              key="Savenew"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.savenew}
              disabled={
                (buttonDisabled.find((b) => b === "ALL" || b === "SAVE&NEW") &&
                  isDisabled) ||
                disableBtns.savenew
              }
            >
              {/* <img alt="" src={Icons.savenew}></img> */}
              <GIcons.IconClone />
              <span id="lblBtnSavenew" className="buttonName">
                Save & New
              </span>
            </button>
          </VisibilityControl>
        );
      case "DELETE":
        return (
          <VisibilityControl controller={controller} id="vsb-delete-btn">
            <button
              id="btnDelete"
              key="Delete"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.delete}
              disabled={
                (buttonDisabled.find((b) => b === "ALL" || b === "DELETE") &&
                  isDisabled) ||
                disableBtns.delete
              }
            >
              {/* <img alt="" src={Icons.delete}></img> */}
              <GIcons.IconTrash />
              <span id="lblBtnDelete" className="buttonName">
                Delete
              </span>
            </button>
          </VisibilityControl>
        );
      case "CLOSE":
        return (
          <VisibilityControl controller={controller} id="vsb-close-btn">
            <button
              id="btnClose"
              key="Close"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={isDetail ? props.close : handleClose}
            // disabled={buttonDisabled.find((b) => b === "ALL" || b === "CLOSE")}
            >
              {/* <img alt="" src={Icons.close}></img> */}
              <GIcons.IconClose />
              <span id="lblBtnClose" className="buttonName">
                Close
              </span>
            </button>
          </VisibilityControl>
        );
      case "GENERATE":
        return (
          <VisibilityControl controller={controller} id="vsb-generate-btn">
            <button
              id="btnGenerate"
              key="Generate"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.generate}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "GENERATE") &&
                isDisabled
              }
            >
              {/* <img alt="" src={Icons.report}></img> */}
              <GIcons.IconNew />
              <span id="lblBtnGenerate" className="buttonName">
                Generate
              </span>
            </button>
          </VisibilityControl>
        );
      case "SEARCH":
        return (
          <VisibilityControl controller={controller} id="vsb-search-btn">
            <button
              id="btnSearch"
              key="Search"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.search}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "SEARCH") &&
                isDisabled
              }
            >
              {/* <img alt="" src={Icons.search}></img> */}
              <GIcons.IconSearch />
              <span id="lblBtnSearch" className="buttonName">
                Search
              </span>
            </button>
          </VisibilityControl>
        );
      case "PREVIEW":
        return (
          <VisibilityControl controller={controller} id="vsb-search-btn">
            <button
              id="btnSearch"
              key="Search"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.preview}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "PREVIEW") &&
                isDisabled
              }
            >
              {/* <img alt="" src={Icons.search}></img> */}
              <GIcons.IconSearch />
              <span id="lblBtnSearch" className="buttonName">
                Preview
              </span>
            </button>
          </VisibilityControl>
        );
      case "VIEWREPORT":
        return (
          <VisibilityControl controller={controller} id="vsb-search-btn">
            <button
              id="btnSearch"
              key="Search"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.viewReport}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "VIEWREPORT") &&
                isDisabled
              }
            >
              <GIcons.IconPrint />
              <span id="lblBtnSearch" className="buttonName">
                View Sample Form
              </span>
            </button>
          </VisibilityControl>
        );
      case "SUBMIT":
        return (
          <VisibilityControl controller={controller} id="vsb-submit-btn">
            <button
              id="btnSubmit"
              key="Submit"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.submit}
              disabled={
                (buttonDisabled.find((b) => b === "ALL" || b === "SUBMIT") &&
                  isDisabled) ||
                disableBtns.submit
              }
            >
              {/* <img alt="" src={Icons.report}></img> */}
              <GIcons.IconCheck />
              <span id="lblBtnSubmit" className="buttonName">
                Submit
              </span>
            </button>
          </VisibilityControl>
        );
      case "APPROVE":
        return (
          <VisibilityControl controller={controller} id="vsb-approve-btn">
            <button
              id="btnApprove"
              key="Approve"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.approve}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "APPROVE") &&
                isDisabled
              }
            >
              {/* <img alt="" src={Icons.report}></img> */}
              <GIcons.IconCheck />
              <span id="lblBtnApprove" className="buttonName">
                Approve
              </span>
            </button>
          </VisibilityControl>
        );
      case "DENY":
        return (
          <button
            id="btnDeny"
            key="Deny"
            className="mr-8px btn btn-with-icon btn-toolbar btn-icon-red"
            onClick={props.deny}
            disabled={
              buttonDisabled.find((b) => b === "ALL" || b === "DENY") &&
              isDisabled
            }
          >
            {/* <img alt="" src={Icons.report}></img> */}
            <GIcons.IconDenyLab />
            <span id="lblBtnDeny" className="buttonName">
              Deny
            </span>
          </button>
        );
      case "BIN":
        return (
          <button
            id="btnBin"
            key="Bin"
            className="mr-8px btn btn-with-icon btn-toolbar"
            onClick={props.bin}
            disabled={
              buttonDisabled.find((b) => b === "ALL" || b === "BIN") &&
              isDisabled
            }
          >
            <GIcons.IconTrash />
            <span id="lblBtnBin" className="buttonName">
              Bin
            </span>
          </button>
        );
      case "CLONE":
        const existClone =
          props.menuButtons !== undefined && props.menuButtons.length > 0
            ? props.menuButtons.find((cb) => cb === btn)
            : undefined;
        return existClone !== undefined ? (
          <VisibilityControl controller={controller} id="vsb-clone-btn">
            <div key="CloneDiv">
              <button
                id="btnClone"
                key="Clone"
                className="mr-8px btn btn-with-icon btn-toolbar"
                disabled={
                  buttonDisabled.find((b) => b === "ALL" || b === "CLONE") &&
                  isDisabled
                }
                {...props.buttonClone.buttonProp}
              >
                {/* <img alt="" src={Icons.clone}></img> */}
                <GIcons.IconClone />
                <span id="lblBtnClone" className="buttonName">
                  Clone
                </span>
              </button>
              {props.buttonClone.buttonMenu}
            </div>
          </VisibilityControl>
        ) : (
          <VisibilityControl controller={controller} id="vsb-clone-btn">
            <button
              key="Clone"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.clone}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "CLONE") &&
                isDisabled
              }
            >
              {/* <img alt="" src={Icons.clone}></img> */}
              <GIcons.IconClone />
              <span className="buttonName">Clone</span>
            </button>
          </VisibilityControl>
        );
      case "EDIT":
        return (
          <VisibilityControl controller={controller} id="vsb-edit-btn">
            <button
              id="btnEdit"
              key="Edit"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.edit}
              disabled={
                (buttonDisabled.find((b) => b === "ALL" || b === "EDIT") &&
                  isDisabled) ||
                disableBtns.edit
              }
            >
              {/* <img alt="" src={Icons.edit}></img> */}
              <GIcons.IconEdit />
              <span id="lblBtnEdit" className="buttonName">
                Edit
              </span>
            </button>
          </VisibilityControl>
        );
      case "EXCEL":
        return (
          <VisibilityControl controller={controller} id="vsb-excel-btn">
            <button
              id="btnExcel"
              key="Excel"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.excel}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "EXCEL") &&
                isDisabled
              }
            >
              {/* <img alt="" src={Icons.excel}></img> */}
              <GIcons.IconExcel />
              <span id="lblBtnExcel" className="buttonName">
                Excel
              </span>
            </button>
          </VisibilityControl>
        );
      case "TEMPLATE":
        return (
          <VisibilityControl controller={controller} id="vsb-template-btn">
            <button
              id="btnTemplate"
              key="Template"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.template}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "TEMPLATE") &&
                isDisabled
              }
            >
              {/* <img alt="" src={Icons.excel}></img> */}
              <GIcons.IconExcel />
              <span id="lblBtnExcel" className="buttonName">
                Template
              </span>
            </button>
          </VisibilityControl>
        );
      case "IMPORT":
        return (
          <VisibilityControl controller={controller} id="vsb-import-btn">
            <button
              id="btnImport"
              key="Import"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.import}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "IMPORT") &&
                isDisabled
              }
            >
              {/* <img alt="" src={Icons.excel}></img> */}
              <GIcons.CloudUploadIcon />
              <span id="lblBtnExcel" className="buttonName">
                Import
              </span>
            </button>
          </VisibilityControl>
        );
      case "ADJUST":
        return (
          <VisibilityControl controller={controller} id="vsb-adjust-btn">
            <AdjustBtn
              buttonDisabled={buttonDisabled}
              isDisabled={isDisabled}
              onClickEvent={props.adjust}
            />
          </VisibilityControl>
        );
      case "ADJUSTLIST":
        return (
          <VisibilityControl controller={controller} id="vsb-adjustList-btn">
            <button
              id="btnadjustList"
              key="adjustList"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.adjustList}
              disabled={
                buttonDisabled.some(
                  (b) => b === "ALL" || b === "ADJUST_LIST"
                ) && isDisabled
              }
            >
              {/* <img alt="" src={Icons.excel}></img> */}
              <GIcons.DescriptionIcon />
              <span id="lblAdjustList" className="buttonName">
                Adjust List
              </span>
            </button>

          </VisibilityControl>
        );
      case "CREATE_RESULT":
        return (
          <VisibilityControl controller={controller} id="vsb-create-result-btn">
            <button
              id="btnCreateResult"
              key="CreateResult"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.createResult}
              disabled={
                buttonDisabled.some(
                  (b) => b === "ALL" || b === "CREATE_RESULT"
                ) && isDisabled
              }
            >
              {/* <img alt="" src={Icons.excel}></img> */}
              <GIcons.DescriptionIcon />
              <span id="lblCreateResult" className="buttonName">
                Create Result
              </span>
            </button>
          </VisibilityControl>
        );
      case "ADJUST_TIME":
        return (
          <VisibilityControl controller={controller} id="vsb-adjust-time-btn">
            <button
              id="btnAdjustTime"
              key="AdjustTime"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.adjustTime}
              disabled={
                buttonDisabled.find(
                  (b) => b === "ALL" || b === "ADJUST_TIME"
                ) && isDisabled
              }
            >
              {/* <img alt="" src={Icons.excel}></img> */}
              <GIcons.UpdateIcon />
              <span id="lblBtnAdjustTime" className="buttonName">
                Adjust
              </span>
            </button>
          </VisibilityControl>
        );
      case "DOWNLOAD":
        return (
          <VisibilityControl controller={controller} id="vsb-download-btn">
            <button
              id="btnDownload"
              key="Download"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.download}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "DOWNLOAD") &&
                isDisabled
              }
            >
              <GIcons.IconExcel />
              <span id="lblBtnDownload" className="buttonName">
                Download
              </span>
            </button>
          </VisibilityControl>
        );
      case "PRINT":
        return (
          <VisibilityControl controller={controller} id="vsb-print-btn">
            <button
              id="btnPrint"
              key="Print"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.print}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "PRINT") &&
                isDisabled
              }
            >
              <GIcons.IconPrint />
              <span id="lblBtnPrint" className="buttonName">
                Print
              </span>
            </button>
          </VisibilityControl>
        );
      case "COMPLETE":
        return (
          <VisibilityControl controller={controller} id="vsb-complete-btn">
            <button
              id="btnComplete"
              key="Complete"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.complete}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "COMPLETE") &&
                isDisabled
              }
            >
              <GIcons.FlagOutlinedIcon />
              <span id="lblBtnComplete" className="buttonName">
                Complete
              </span>
            </button>
          </VisibilityControl>
        );
      case "PENDING":
        return (
          <VisibilityControl controller={controller} id="vsb-pending-btn">
            <button
              id="btnPending"
              key="Pending"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.pending}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "PENDING") &&
                isDisabled
              }
            >
              <GIcons.HourglassEmptyIcon />
              <span id="lblBtnPending" className="buttonName">
                Pending
              </span>
            </button>
          </VisibilityControl>
        );
      case "DIVISION":
        return (
          <VisibilityControl controller={controller} id="vsb-division-btn">
            <button
              id="btnDivision"
              key="Division"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.division}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "DIVISION") &&
                isDisabled
              }
            >
              <GIcons.IconNew />
              <span id="lblBtnDivision" className="buttonName">
                Division
              </span>
            </button>
          </VisibilityControl>
        );
      case "UNLOCK":
        return (
          <VisibilityControl controller={controller} id="vsb-unlock-btn">
            <button
              id="btnUnlock"
              key="Unlock"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.unlock}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "UNLOCK") &&
                isDisabled
              }
            >
              <GIcons.IconUnlock />
              <span id="lblBtnUnlock" className="buttonName">
                Unlock
              </span>
            </button>
          </VisibilityControl>
        );
      case "RESENDMAIL":
        return (
          <VisibilityControl controller={controller} id="vsb-resendMail-btn">
            <button
              id="btnResendMail"
              key="ResendMail"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.resendMail}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "RESENDMAIL") &&
                isDisabled
              }
            >
              <GIcons.IconMail />
              <span id="lblBtnResendMail" className="buttonName">
                Re-send Mail
              </span>
            </button>
          </VisibilityControl>
        );
      case "SENDMAILCUST":
        return (
          <VisibilityControl controller={controller} id="vsb-sendMailCust-btn">
            <button
              id="btnSendMailCust"
              key="SendMailCust"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.sendMailCust}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "SENDMAILCUST") &&
                isDisabled
              }
            >
              <GIcons.IconMail />
              <span id="lblBtnResendMail" className="buttonName">
                Send Mail To Customer
              </span>
            </button>
          </VisibilityControl>
        );
      case "UPLOAD":
        return (
          <VisibilityControl controller={controller} id="vsb-upload-btn">
            <button
              id="btnUpload"
              key="Upload"
              className="mr-8px btn btn-with-icon btn-toolbar"
              onClick={props.upload}
              disabled={
                buttonDisabled.find((b) => b === "ALL" || b === "UPLOAD") &&
                isDisabled
              }
            >
              <GIcons.IconUpload />
              <span id="lblBtnUpload" className="buttonName">
                Upload
              </span>
            </button>
          </VisibilityControl>
        );
      default:
      // return (
      //   <button
      //     className="mr-8px btn-icon btn btn-toolbar"
      //     onClick={props[btn.toLowerCase()]}
      //   >
      //     {Icons[btn.toLowerCase()] && (
      //       <img
      //         alt=""
      //         class="img-fluid"
      //         src={Icons[btn.toLowerCase()]}
      //       ></img>
      //     )}
      //     <label className="buttonName">
      //       {btn.charAt(0).toUpperCase() + btn.slice(1).toLowerCase()}
      //     </label>
      //   </button>
      // );
    }
  });

  const handleClickCollapseCriteria = () => {
    setIsCollapseCriteria(!isCollapseCriteria);
    if (!isCollapseCriteria) {
      const criteria = document.getElementsByClassName("criteria-section");
      if (!isEmpty(criteria)) {
        criteria[0].style.display = "none";
      }
    } else {
      const criteria = document.getElementsByClassName("criteria-section");
      if (!isEmpty(criteria)) {
        criteria[0].style.display = "block";
      }
    }
  };

  return (
    <div className="row container-toolbar">
      <div className="col-md-12 col-lg-12 Toolbar">
        {buttons.map((btn) => btn)}
        {hasFilterMobile ? (
          <button
            key="FilterMobile"
            className="mr-8px btn btn-with-icon btn-toolbar"
            onClick={props.filterMobile}
            style={{ marginLeft: "auto" }}
          >
            <Image alt="" src={Icons.filter}></Image>
            <span className="buttonName">Filter</span>
          </button>
        ) : null}

        {buttonCollapseCriteria ? (
          <div style={{ marginLeft: "auto" }}>
            <IconButton onClick={handleClickCollapseCriteria}>
              {isCollapseCriteria ? (
                <GIcons.IconExpandMore />
              ) : (
                <GIcons.IconExpandLess />
              )}
            </IconButton>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Toolbar;
