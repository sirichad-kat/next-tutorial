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
  const { t, i18n } = useTranslation("ModalViewSample");
   const userInfo = useSelector((state) => state.user);

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
      const data = datas.map((item) => {
         if (item.sampId === row.sampId) {
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
    datas.forEach((item) => {
        if (item.sampId === row.sampId) {
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
       maxWidth="sm"
       fullWidth
     >
       <DialogTitle id="scroll-dialog-title">
         {t("SSLABM05900:lblViewData", "View Data")}
       </DialogTitle>
       <DialogContent>
         <DataTable
           conditionalRowStyles={selectedLkRowStyle}
           customStyles={textCellAlignTop}
           columns={[
             {
               name: t("SSLABM05900:colViewSeq", "Seq"),
               selector: (row) => row.seq,
               wrap: true,
               center: true,
               maxWidth: "5%",
               minWidth: "75px",
             },
             {
               name: t("SSLABM05900:colProduct", "Product"),
               selector: (row) => row.productid,
               wrap: true,
               maxWidth: "35%",
             },
             {
               name: t("SSLABM05900:colViewDescr", "Sample Description"),
               selector: (row) => row.sampleDescr,
               wrap: true,
               maxWidth: "60%",
             },
           ]}
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
