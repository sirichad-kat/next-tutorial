import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
// import "antd/dist/antd.css";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DataTable from "react-data-table-component";
import ServiceUrl from "../../configs/servicePath";
import { useTranslation } from "react-i18next";
import { selectedLkRowStyle, textCellAlignTop } from "../../configs/function";

const Lookup = (props) => {
   // console.log(props);
  const { t, i18n } = useTranslation("ModalViewData");
   const userInfo = useSelector((state) => state.user);

   const title = props.title ?? "View Data";
   const size = props.size ?? "sm";

   const [datas, setDatas] = useState([]);
   const [selectView, setSelectView] = useState(null);

   
   useEffect(async () => {
      if (props.open) {
        setSelectView(null)
          if(props.dataView){              
              setDatas(props.dataView)
          }
          else{
              setDatas([])
          }
      }
   }, [props.open]);
 
   const handleRowClicked = (row) => {
    let checkKey = true;
    const keys = props.dataKey.split(",");
    const data = datas.map((item) => {
       checkKey = true;
       keys.forEach((k) => {
          checkKey = checkKey && item[k] === row[k];
       });
       if (checkKey) {
          setSelectView(item);
          return {
             ...item,
             toggleSelected: !item.toggleSelected,
          };
       }
       return {
          ...item,
          toggleSelected: false,
       };
    });
    setDatas(data);
 };
 const handleRowDoubleClicked = (row) => {
    let checkKey = true;
    const keys = props.dataKey.split(",");
    datas.forEach((item) => {
       checkKey = true;
       keys.forEach((k) => {
          checkKey = checkKey && item[k] === row[k];
       });
       if (checkKey) {
          // setSelectView(item);
          props.onOk(item)
       }
    });
 };
   return (
     <Dialog
       open={props.open}
       onClose={props.onCancel}
       scroll="paper"
       aria-labelledby="scroll-dialog-title"
       aria-describedby="scroll-dialog-description"
       maxWidth={size}
       fullWidth
     >
       <DialogTitle id="scroll-dialog-title">
         {title}
       </DialogTitle>
       <DialogContent>
         <DataTable
           conditionalRowStyles={selectedLkRowStyle}
           customStyles={textCellAlignTop}
           columns={props.columnList}
           data={datas}
           onRowClicked={handleRowClicked}
           onRowDoubleClicked={handleRowDoubleClicked}
           persistTableHead
           noHeader
           striped
         />
       </DialogContent>
       <DialogActions>
         <button
           id="btnCloseLookup"
           className="btn btn-cancel-theme"
           onClick={props.onCancel}
         >
           <span id="lblBtnCloseLookup">Close</span>
         </button>
       </DialogActions>
     </Dialog>
   );
};

export default Lookup;
