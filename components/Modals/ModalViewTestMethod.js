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
  const { t, i18n } = useTranslation("ModalViewTestMethod");
   const userInfo = useSelector((state) => state.user);

   const [datas, setDatas] = useState([]);
   const [selectView, setSelectView] = useState(null);

   
   useEffect(async () => {
      if (props.open) {
        setSelectView(null)
         if(props.dataView){
            const newViewList = await Promise.all(props.dataView.refMethods.map(async (d) => {
               const reqTestMed = {
                 connection: userInfo.connection,
                 lang: userInfo.language,
                 textSearch: d.refMethod,
               };
               const testMethodName = await axios.post(ServiceUrl.urlLabMgt + "FindTestMethodNameById", reqTestMed) 
               const newView = {}
               newView.refMethodSeq = d.refMethodSeq
               newView.testMethod = d.refMethod
               newView.testMethodName = testMethodName.data
               return newView
             }))
             setDatas(newViewList)
         }
         else{
            setDatas([])
         }
      }
   }, [props.open]);

   const handleRowClicked = (row) => {     
      const data = datas.map((item) => {
         if (item.refMethodSeq === row.refMethodSeq) {
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
        if (item.refMethodSeq === row.refMethodSeq) {
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
         {t("SSLABM05100:lblViewData", "View Data")}
       </DialogTitle>
       <DialogContent>
         <DataTable
           conditionalRowStyles={selectedLkRowStyle}
           customStyles={textCellAlignTop}
           columns={[
             {
               name: t("SSLABM05100:colViewSeq", "Seq"),
               selector: (row) => row.refMethodSeq,
               wrap: true,
               center: true,
               maxWidth: "5%",
               minWidth: "75px",
             },
             {
               name: t("SSLABM05100:colViewTestMethod", "Test Method"),
               selector: (row) => row.testMethod,
               wrap: true,
               maxWidth: "35%",
             },
             {
               name: t("SSLABM05100:colViewDescr", "Description"),
               selector: (row) => row.testMethodName,
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
