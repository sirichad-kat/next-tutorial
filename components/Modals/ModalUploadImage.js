import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import "antd/dist/antd.css";
import { Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Alert } from "antd";
import Image from "next/image";
import Swal from "sweetalert2";
import Webcam from "react-webcam";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Backdrop from "@material-ui/core/Backdrop";
import DataTable from "react-data-table-component";
import * as UserAction from "../../redux/actions/UserAction";
import ServiceUrl from "../../configs/servicePath";
import CircularProgress from "../circularprogress";
import * as Func from "../../configs/function";
import * as GIcons from "../../configs/googleicons";

const UploadImage = (props) => {
  const userInfo = useSelector((state) => state.user);
  const limitFile = props.limitFile ? props.limitFile : 6;
  const stateInit = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: props.value ? props.value : [],
  };
  const videoConstraints = {
    facingMode: "environment"
  };
  const photoType = "image/jpeg";
  const webcamRef = React.useRef(null);  
  const [upload, setUpload] = useState(stateInit);
  const [showWarning, setShowWarning] = useState(false);
  const [openModalTakePhoto, setOpenModalTakePhoto] = useState(false);
  const [photoSample, setPhotoSample] = useState(null);
  const [takePhoto, setTakePhoto] = useState(true);

  useEffect(() => {
    if (props.open) {
      console.log(props.value ? props.value : []);
      const newValList = props.value ? props.value : []
      newValList.forEach(d => {
        d.isSelected = true
      })
      setUpload({ ...upload, fileList: newValList });
      setShowWarning(false);
    }
  }, [props.open]);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc);
    setTakePhoto(!imageSrc);
    setPhotoSample(imageSrc);
  }, [webcamRef, setPhotoSample]);
  const handleReTakePhoto = () => {
    setTakePhoto(true);
  };
  const handleOpenModalTakePhoto = () => {
    setOpenModalTakePhoto(true);
  };
  const handleCloseModalTakePhoto = () => {
    setPhotoSample(null)
    setTakePhoto(true)
    setOpenModalTakePhoto(false);
  };
  const handleOkModalTakePhoto = () => {
    const date = new Date().toISOString().split('.')[0].replace(/[^\d]/gi,'')
    const photo = {
      base64: photoSample,
      name:"IMG" + date + ".jpg",
      thumbUrl: photoSample,
      type: photoType,
      isSelected: true
    }   
    const newFileList = [...upload.fileList, photo]
    setUpload({...upload, fileList: newFileList})
    handleCloseModalTakePhoto()
  };

  const beforeUpload = async (file) => {
    // console.log("beforeUpload")
    // console.log(file)
    const isImage = file.type.includes("image/");
    // setShowWarning(!isImage)
    if (isImage) {
      const base64 = await Func.getBase64(file);
      console.log(base64);
      file.base64 = base64;
    }
    return false;
  };

  const handleCancel = () => setUpload({ ...upload, previewVisible: false });

  const handlePreview = async (file) => {
    if (!file.base64 && !file.preview) {
      file.preview = await Func.getBase64(file.originFileObj);
    }
    console.log(file.preview);
    console.log(file);
    setUpload({
      ...upload,
      previewImage: file.base64 || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  const handleClosePreview = () => {
    setUpload({ ...upload, previewVisible: false });
  };

  const handleChange = ({ fileList }) => {
    const imageList = fileList.filter((f) => f.type.includes("image/"));
    const isExceed = imageList.length > limitFile;
    console.log(fileList)
    console.log(imageList)

    if (isExceed) {
      const newImageList = imageList.filter((f) =>
        f.hasOwnProperty("isSelected")
      );
      setUpload({ ...upload, fileList: newImageList });
    } else {
      imageList.forEach((f) => (f.isSelected = true));
      setUpload({ ...upload, fileList: imageList });
    }
    setShowWarning(isExceed);
  };

  const uploadButton = (
    <div>
      {/* <PlusOutlined /> */}
      {/* <i
        className="fas fa-plus btn-icon-wrapper"
        style={{ fontSize: "18px" }}
      /> */}
      <GIcons.IconAdd />
      <div style={{ marginTop: 8, fontSize: "18px"  }}>Upload Picture</div>
    </div>
  );

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
        <DialogTitle id="scroll-dialog-title">Upload Picture</DialogTitle>
        <DialogContent dividers>
          <React.Fragment>
            <Upload
              id="btnUploadImg"
              // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              fileList={upload.fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              // accept="image/*"
              beforeUpload={beforeUpload}
              multiple
              showUploadList = {{
                showRemoveIcon: !props.disabled,
              }}
            >
              {upload.fileList.length >= limitFile || props.disabled
                ? null
                : uploadButton}
            </Upload>
            {/* <Modal
          visible={upload.previewVisible}
          title={upload.previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={upload.previewImage} />
        </Modal> */}
            <Backdrop
              className="backdrop"
              open={upload.previewVisible}
              onClick={handleClosePreview}
            >
              {upload.previewVisible ? (
                <div style={{ height: "80%" }}>
                  <Image
                    alt="preview"
                    // style={{ height: "80%" }}
                    layout="fill"
                    objectFit="contain"
                    src={upload.previewImage}
                  />
                </div>
              ) : null}
            </Backdrop>
            {showWarning ? (
              <Alert
                className="mt-3"
                message={`You can only upload ${limitFile} images!`}
                type="warning"
                showIcon
              />
            ) : null}
          </React.Fragment>
        </DialogContent>
        <DialogActions>
          {upload.fileList.length >= limitFile || props.disabled ? null : (
            <React.Fragment>
              <button
                id="btnOpenModalTakePhoto"
                className="btn btn-with-icon btn-primary-theme"
                onClick={handleOpenModalTakePhoto}
                disabled={props.disabled}
              >
                <GIcons.IconCamera />
                {/* <i name="item" className="fas fa-camera" /> */}
                <span id="lblBtnOpenModalTakePhoto">Take Photo</span>
              </button>
              <div style={{ flex: "1 0 0" }} />
            </React.Fragment>
          )}
          {/* <button
            id="btnOkUploadImage"
            className="btn btn-primary-theme"
            onClick={() => props.onOk(upload.fileList)}
            disabled={props.disabled}
          >
            <span id="lblBtnOkUploadImage">Add Picture</span>
          </button> */}
          <button
            id="btnCloseUploadImage"
            className="btn btn-cancel-theme"
            onClick={() => props.onOk(upload.fileList)}
            // onClick={props.onCancel}
          >
            <span id="lblBtnCloseUploadImage">Close</span>
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openModalTakePhoto}
        onClose={handleCloseModalTakePhoto}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="scroll-dialog-title">Photo</DialogTitle>
        <DialogContent dividers>
          {takePhoto ? (
            <React.Fragment>
              <div className="row">
                <div className="col-md-12">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat={photoType}
                    // width={480}
                    // height={400}
                    videoConstraints={videoConstraints}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <button
                    id="btnCapturePhoto"
                    className="btn btn-outline-primary-theme"
                    onClick={capture}
                    style={{ width: "100%", marginTop: "5px" }}
                  >
                    <span id="lblBtnCapturePhoto">Capture Photo</span>
                  </button>
                </div>
              </div>
            </React.Fragment>
          ) : (
            photoSample && (
              <React.Fragment>
                <div className="row">
                  <div className="col-md-12">
                    <Image
                      src={photoSample}
                      style={{ width: "100%" }}
                      alt="Sample photo"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <button
                      id="btnRetakePhoto"
                      className="btn btn-outline-primary-theme"
                      onClick={handleReTakePhoto}
                      style={{ width: "100%", marginTop: "5px" }}
                    >
                      <span id="lblBtnRetakePhoto">Retake Photo</span>
                    </button>
                  </div>
                </div>
              </React.Fragment>
            )
          )}
        </DialogContent>
        <DialogActions>
          <button
            id="lblBtnOkTakePhoto"
            className="btn btn-primary-theme"
            onClick={handleOkModalTakePhoto}
          >
            <span id="lblBtnOkTakePhoto">OK</span>
          </button>
          <button
            id="lblBtnCloseTakePhoto"
            className="btn btn-cancel-theme"
            onClick={handleCloseModalTakePhoto}
          >
            <span id="lblBtnCloseTakePhoto">Cancel</span>
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default UploadImage;
