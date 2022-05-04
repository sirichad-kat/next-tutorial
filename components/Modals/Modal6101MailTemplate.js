import React, { useState, useEffect} from "react";
import {useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { isEmpty, getBase64 } from "../../configs/function";
import { useTranslation } from "react-i18next";
import VisibilityControl from "../../components/VisibilityControl";
import useVisibilityControl from "../../hooks/useVisibilityControl";
import ServiceUrl from "../../configs/servicePath";
import DynamicTextArea from "../../components/DynamicTextArea";
import * as GIcons from "../../configs/googleicons";

const Lookup = (props) => {  
  const programId = props.programId ?? ""
  const { t, i18n } = useTranslation(programId);
  const controller = useVisibilityControl(programId);  
  const userInfo = useSelector((state) => state.user);
  const title = props.title ?? ""
  const hideAttach = props.hideAttach ?? ""

  const [data, setData] = useState(null);  
 
  const [attachFileName, setAttachFileName] = useState("");
  const [attachFiles, setAttachFiles] = useState([]); 
  useEffect(() => {
    if (props.open) {
      console.log(props.data)
      setData(props.data)     
      setAttachFileName("")
      setAttachFiles([])
    }
    else{
      setData(null)     
    }
  }, [props.open]);

  const handlePreviewReport = () => {
    const dataMail = data
    if(!isEmpty(dataMail) && !isEmpty(dataMail.fileData)){
      const byteCharacters = atob(dataMail.fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      let data = new Blob([byteArray], { type: "application/pdf" });
      var fileURL = URL.createObjectURL(data);
      window.open(fileURL);
    }
    else{
      Swal.fire({
        icon: "error",
        html: "Cannot View Report",
        confirmButtonColor: "#16aaff",
        confirmButtonText: "OK",
     });
    }
  }
  const handleUploadAttach = async (e) => {
    const files = e.target.files;
    if(attachFiles.length + files.length <= 6){
      let curAttach = [...attachFiles]
      console.log(files)
      let fileList = []
      if (files.length > 0) {      
        for(const f in files) {
          console.log(!isNaN(f))   
          if(!isNaN(f)){
            fileList.push(files[f]);
          }         
        } 
        console.log(fileList)
         for(const file of fileList) {  
            console.log(file)
            const base64Obj = await getBase64(file)
            const indexDataType = base64Obj.split(",")
            const newBase64 = indexDataType[1]
            const newfile = {
                base64: newBase64,
                name: file.name,
                type: file.type,
            };
            curAttach = [...curAttach, newfile]
            setAttachFiles(curAttach);          
         }    
      }
    }
    else{
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "You can only upload 6 file",
        confirmButtonColor: "#16aaff",
        confirmButtonText: "OK",
     });
    }
 };

  const handleDeleteFile = (filename) => {
    setAttachFiles(attachFiles.filter(d => d.name !== filename))
  }
  const handleOkBtn = () => {
    props.onOk(data, attachFiles)      
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.onCancel}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
      <DialogContent>
          <VisibilityControl controller={controller} id="vsb-remark">
            <div className="row">
                <label id="lblRemark" className="col-md-12 col-lg-12">
                  {t(programId + ":lblRemark", "Remark")} :
                </label>
            </div>
            <div className="row">
                <div className="col-md-12 col-lg-12">
                  <DynamicTextArea
                    id="txtRemark"
                    name="remark"
                    className="form-control"                
                    value={data ? data.mailDetail : ""}
                    onChange={(e) => {
                      setData({ ...data, mailDetail: e.target.value });
                    }}
                    disabled={hideAttach}
                  />
                </div>
            </div>
          </VisibilityControl>
        {
          !hideAttach ? <React.Fragment>
          <div className="row Label-Inline">
            <VisibilityControl controller={controller} id="vsb-reportFile">
              <label id="lblReportFile" className="col-md-2 col-lg-2" style={{marginBottom: "8px"}}>
                {t(programId + ":lblReportFile", "Report")} :
              </label>
              <label id="lblReportFileVal" className="col-md-9 col-lg-9 pl-0">
                {data ? data.fileName : ""}
              </label>
              <button
                id="btnPreview"
                className="btn btn-icon-only btn-primary-theme btn-form"
                style={{ border: "none" }}
                onClick={handlePreviewReport}
              >
                <GIcons.IconView />
              </button>
            </VisibilityControl>
          </div>
          <div className="row Label-Inline">
            <VisibilityControl controller={controller} id="vsb-attachFile">
              <label id="lblAttachFile" className="col-md-2 col-lg-2">
                {t(programId + ":lblAttachFile", "Attach")} :
              </label>
              {/* actual upload which is hidden */}
              <input
                id="attachFiles"
                name="file"
                type="file"
                onChange={handleUploadAttach}
                multiple
                hidden
              ></input>
              {/* name of file chosen */}
              {/* <span className="file-chosen col-md-8 col-lg-8">
                {attachFileName}
              </span> */}
              <div className="col-md-9 col-lg-9 px-0">
                {attachFiles.map(d => <React.Fragment  key={d.name}>
                  <div className="row" style={{marginBottom: "5px"}}>
                    <label className="col-md-10 col-lg-10 ">{d.name}</label>
                    <button
                      id="btnSearch"
                      className="ml-2 btn btn-icon-only btn-danger-theme btn-form"
                      style={{ border: "none" }}
                      onClick={() => handleDeleteFile(d.name)}
                    >
                      <GIcons.IconTrash />
                    </button>
                  </div>
                </React.Fragment>)}
              </div>
              {/* our custom upload button */}            
              <label
                id="lblAttachFiles"
                htmlFor="attachFiles"
                className="btn btn-icon-only btn-primary-theme btn-form col-md-1 col-lg-1"
                style={{maxWidth: "30px", padding: "5px"}}
              >
                <GIcons.IconDownload />
              </label>
            </VisibilityControl>
          </div>
          </React.Fragment> : null
        }
      </DialogContent>
      <DialogActions>
        <button
          id="btnOk"
          className="btn btn-primary-theme"
          onClick={handleOkBtn}
        >
          <span id="lblBtnOk">Send Mail</span>
        </button>
        <button
          id="btnClose"
          className="btn btn-cancel-theme"
          onClick={props.onCancel}
        >
          <span id="lblBtnClose">Cancel</span>
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default Lookup;
