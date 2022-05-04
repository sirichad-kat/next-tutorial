import SvgIcon from '@material-ui/core/SvgIcon';
import IconNew from "@material-ui/icons/InsertDriveFileOutlined";
import IconSave from "@material-ui/icons/SaveOutlined";
import IconEdit from "@material-ui/icons/EditOutlined";
import IconRefresh from '@material-ui/icons/RefreshOutlined';
import IconTrash from "@material-ui/icons/DeleteOutlined";
import IconPrint from "@material-ui/icons/PrintOutlined";
import IconCheck from "@material-ui/icons/CheckOutlined";
import IconClose from '@material-ui/icons/CloseOutlined';
import IconReject from '@material-ui/icons/HighlightOff';
import IconError from '@material-ui/icons/ErrorOutlined';
import IconClone from '@material-ui/icons/FileCopyOutlined';
import IconAdd from '@material-ui/icons/AddOutlined';
import IconImage from '@material-ui/icons/CropOriginalOutlined';
import IconCamera from '@material-ui/icons/CameraAltOutlined';
import IconSearch from '@material-ui/icons/SearchOutlined';
import IconArrowLeft from '@material-ui/icons/ArrowBackIosOutlined';
import IconArrowRight from '@material-ui/icons/ArrowForwardIosOutlined';
import IconInfo from '@material-ui/icons/Info';
import IconExpandLess from '@material-ui/icons/ExpandLessOutlined';
import IconExpandMore from '@material-ui/icons/ExpandMoreOutlined';
import IconEditRound from '@material-ui/icons/CreateRounded';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DescriptionIcon from '@material-ui/icons/Description';
import IconDenyOrder from '@material-ui/icons/HighlightOff';
import IconSeqUp from '@material-ui/icons/ArrowUpwardRounded';
import IconSeqDown from '@material-ui/icons/ArrowDownwardRounded';
import IconSubmit from '@material-ui/icons/AccessTimeRounded';
import IconUrgent from '@material-ui/icons/FlashOnRounded';
import IconDenyLab from '@material-ui/icons/RemoveCircleOutline';
import IconAdjust from '@material-ui/icons/OpenInNewRounded';
import IconCreateResult from '@material-ui/icons/DescriptionRounded';
import IconMinus from '@material-ui/icons/RemoveRounded';
import UpdateIcon from '@material-ui/icons/Update';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import SpeedRoundedIcon from '@material-ui/icons/SpeedRounded';
import IconQR from '@ant-design/icons/QrcodeOutlined';
import BarcodeOutlined from '@ant-design/icons/BarcodeOutlined';
import IconDoNotDisturbSvg from "../public/Images/Icon/do_not_disturb_black_24dp.svg";
import IconView from '@material-ui/icons/VisibilityOutlined';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import IconUnlock from '@material-ui/icons/LockOpen';
import IconMail from '@material-ui/icons/MailOutlineRounded';
import PublishIcon from '@material-ui/icons/Publish';

const IconExcel = (props) => {
    const newProps = { ...props, className: "svgicon " + props.className }
    //TODO: THIS CAUSE ERROR, RE-WORK ON THIS LATER
    // return <IconExcelSvg {...newProps} />;
    return <IconNew />;
}
const IconDoNotDisturb = (props) => {
    const className = props && props.className ? props.className : ""
    const newProps = { ...props, className: "svgicon " + className }
    return <IconDoNotDisturbSvg {...newProps} />;
}
const IconForwardAll = (props) => {
    const className = props && props.className ? props.className : ""
    const newProps = {...props, className: "svgicon " + className}
    return (
      <svg {...newProps} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" fill="currentColor"><g><rect fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/></g><g><g><path d="M5.7,6.71L5.7,6.71c-0.39,0.39-0.39,1.02,0,1.41L9.58,12L5.7,15.88c-0.39,0.39-0.39,1.02,0,1.41l0,0 c0.39,0.39,1.02,0.39,1.41,0l4.59-4.59c0.39-0.39,0.39-1.02,0-1.41L7.12,6.71C6.73,6.32,6.09,6.32,5.7,6.71z"/><path d="M12.29,6.71L12.29,6.71c-0.39,0.39-0.39,1.02,0,1.41L16.17,12l-3.88,3.88c-0.39,0.39-0.39,1.02,0,1.41l0,0 c0.39,0.39,1.02,0.39,1.41,0l4.59-4.59c0.39-0.39,0.39-1.02,0-1.41l-4.59-4.59C13.32,6.32,12.68,6.32,12.29,6.71z"/></g></g></svg>
    );
}
const IconBackwardAll = (props) => {
    const className = props && props.className ? props.className : ""
    const newProps = {...props, className: "svgicon " + className}
    return (
      <svg {...newProps} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" fill="currentColor"><g><rect fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/></g><g><g><path d="M18.29,17.29L18.29,17.29c0.39-0.39,0.39-1.02,0-1.41L14.42,12l3.88-3.88c0.39-0.39,0.39-1.02,0-1.41l0,0 c-0.39-0.39-1.02-0.39-1.41,0l-4.59,4.59c-0.39,0.39-0.39,1.02,0,1.41l4.59,4.59C17.27,17.68,17.9,17.68,18.29,17.29z"/><path d="M11.7,17.29L11.7,17.29c0.39-0.39,0.39-1.02,0-1.41L7.83,12l3.88-3.88c0.39-0.39,0.39-1.02,0-1.41l0,0 c-0.39-0.39-1.02-0.39-1.41,0l-4.59,4.59c-0.39,0.39-0.39,1.02,0,1.41l4.59,4.59C10.68,17.68,11.31,17.68,11.7,17.29z"/></g></g></svg>
    );
}
const IconForward = (props) => {
    const className = props && props.className ? props.className : ""
    const newProps = {...props, className: "svgicon " + className}
    return (
        <svg {...newProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.29 15.88L13.17 12 9.29 8.12c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.3c-.39.39-1.02.39-1.41 0-.38-.39-.39-1.03 0-1.42z"/></svg>
    );
}
const IconBackward = (props) => {
    const className = props && props.className ? props.className : ""
    const newProps = {...props, className: "svgicon " + className}
    return (
        <svg {...newProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14.71 15.88L10.83 12l3.88-3.88c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .38-.39.39-1.03 0-1.42z"/></svg>
    );
}
const IconDownload = (props) => {
    const className = props && props.className ? props.className : ""
    const newProps = {...props, className: "svgicon " + className}
    return (
        <svg {...newProps} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" fill="currentColor"><g><rect fill="none" height="24" width="24"/></g><g><path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z"/></g></svg>
    );
}
const IconUpload = (props) => {
    const className = props && props.className ? props.className : ""
    const newProps = {...props, className: "svgicon " + className}
    return (
        <svg {...newProps} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" fill="currentColor"><g><rect fill="none" height="24" width="24"/></g><g><path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M7,9l1.41,1.41L11,7.83V16h2V7.83l2.59,2.58L17,9l-5-5L7,9z"/></g></svg>
    );
}
export {
    IconNew,
    IconSave,
    IconEdit,
    IconRefresh,
    IconTrash,
    IconPrint,
    IconCheck,
    IconClose,
    IconError,
    IconClone,
    IconAdd,
    IconImage,
    IconCamera,
    IconSearch,
    IconArrowLeft,
    IconArrowRight,
    IconExpandLess,
    IconExpandMore,
    IconEditRound,
    IconInfo,
    IconQR,
    IconExcel,
    CloudUploadIcon,
    IconDenyOrder,
    IconSeqUp,
    IconSeqDown,
    IconSubmit,
    IconUrgent,
    IconDenyLab,
    IconAdjust,
    IconCreateResult,
    DescriptionIcon,
    IconMinus,
    IconDoNotDisturb,
    UpdateIcon,
    BarcodeOutlined,
    KeyboardArrowDownIcon,
    IconReject,
    SpeedRoundedIcon,
    IconForward,
    IconForwardAll,
    IconBackward,
    IconBackwardAll,
    IconView,
    FlagOutlinedIcon,
    HourglassEmptyIcon,
    IconUnlock,
    IconMail,
    IconUpload,
    PublishIcon,
    IconDownload
}