import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
// import "antd/dist/antd.css";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DataTable from "react-data-table-component";
import * as UserAction from "../../redux/actions/UserAction";
import ServiceUrl from "../../configs/servicePath";
import * as GIcons from "../../configs/googleicons";
import CircularProgress from "../circularprogress";
import { selectedLkRowStyle, textCellAlignTop } from "../../configs/function";

const Lookup = (props) => {
   // console.log(props);
   const userInfo = useSelector((state) => state.user);

   const [lookups, setLookups] = useState([]);
   const [selectLookUp, setSelectLookUp] = useState(null);
   const [textSearch, setTextSearch] = useState("");
   const [loadingLookup, setLoadingLookup] = useState(false);
   const [totalPage, setTotalPage] = useState(0);
   const [resetPageTable, setResetPageTable] = useState(false);

   const searchLookUpService = (page, search = textSearch) => {

      let urlser = props.urlGetData;
      if (props.urlGetData == null || props.urlGetData == "" || props.urlGetData == undefined) {
         urlser = ServiceUrl.urlBase;
      }
     
      const requestObj = {
         lang: userInfo.language,
         textSearch: search,
         searchType: "CONTAIN",
         connection: userInfo.connection,
         page: page,
         pageSize: ServiceUrl.pageSizeLookup,
         userName: userInfo.username,
         ...props.reqObj,
         orgCode : userInfo.orgCode,
      };
      setLoadingLookup(true);
      axios
         .post(urlser + props.serviceName, requestObj)
         .then((response) => {
            // console.log(response.data.dataList);
            const data = response.data.dataList !== null ? response.data.dataList : [];
            if (page === 1) {
               setResetPageTable(!resetPageTable);
               setTotalPage(response.data.totalRow);
            }
            setLookups(data);
            setLoadingLookup(false);
         })
         .catch((error) => console.log(error));
   };

   useEffect(() => {
      if (props.Open) {
         setTextSearch("");
         setLoadingLookup(true);
         searchLookUpService(1, "");
         if (lookups !== null && lookups !== undefined) {
            lookups.forEach((lk) => {
               lk.toggleSelected = false;
            });
         }
      }
      // console.log(lookups);
   }, [props.Open]);

   const handleLookupRowClicked = (row) => {
      let checkKey = true;
      const keys = props.lookupKey.split(",");
      const data = lookups.map((item) => {
         checkKey = true;
         keys.forEach((k) => {
            checkKey = checkKey && item[k] === row[k];
         });
         if (checkKey) {
            setSelectLookUp(item);
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
      setLookups(data);
   };
   const handleLookupRowDoubleClicked = (row) => {
      let checkKey = true;
      const keys = props.lookupKey.split(",");
      lookups.forEach((item) => {
         checkKey = true;
         keys.forEach((k) => {
            checkKey = checkKey && item[k] === row[k];
         });
         if (checkKey) {
            // setSelectLookUp(item);
            props.OnOk(item)
         }
      });
   };
   const handleSearchChange = (e) => {
      const value = e.target.value;
      setTextSearch(value);
   };

   const handleSearchLkData = () => {
      searchLookUpService(1);
   };
   const handleTextSearchKeyDown = (e) => {
      if (e.key === "Enter") {
         handleSearchLkData();
      }
   };
   const handleClearValue = () => {
      const clearObj = {}
      if(lookups.length > 0){
         for (const key in lookups[0]) {
            clearObj[key] = ""
         }
      }
      else{
         const keys = props.lookupKey.split(",");
         keys.forEach((k) => {
            clearObj[k] = ""
         });         
      }
      props.OnOk(clearObj)
   };
   const handlePageChange = (page, totalRows) => {
      searchLookUpService(page);
   };

   return (
      <Dialog
         open={props.Open}
         onClose={props.OnCancel}
         scroll="paper"
         aria-labelledby="scroll-dialog-title"
         aria-describedby="scroll-dialog-description"
         maxWidth={props.size ? props.size : "sm" }
         fullWidth>
         <DialogTitle id="scroll-dialog-title">{props.title}</DialogTitle>
         <DialogContent dividers>
            <div className="row">
               <div className="col-sm-12 col-md-4"></div>
               <div className="col-sm-12 col-md-8 form-row Label-Inline" style={{ margin: "0px 0px 20px 0px" }}>
                  <label htmlFor="search" className="col-md-3" style={{ marginBottom: "0px" }}>
                     Search
                  </label>
                  <input
                     id="txtSearch"
                     type="text"
                     name="search"
                     className="col-md-7 form-control form-control-sm"
                     value={textSearch}
                     onChange={handleSearchChange}
                     onKeyDown={handleTextSearchKeyDown}
                  />
                  <button
                     id="btnSearch"
                     className="ml-2 btn btn-icon-only btn-primary-theme btn-form"
                     style={{ border: "none" }}
                     onClick={handleSearchLkData}>
                     <GIcons.IconSearch />
                     {/* <i className="fas fa-search"></i> */}
                  </button>
               </div>
            </div>
            <DataTable
               columns={props.columnList}
               data={lookups}
               conditionalRowStyles={selectedLkRowStyle}
               customStyles={textCellAlignTop}
               onRowClicked={handleLookupRowClicked}
               onRowDoubleClicked={handleLookupRowDoubleClicked}
               progressPending={loadingLookup}
               progressComponent={<CircularProgress />}
               persistTableHead
               noHeader
               striped
               pagination
               paginationServer
               paginationPerPage={ServiceUrl.pageSizeLookup}
               paginationTotalRows={totalPage}
               onChangePage={handlePageChange}
               paginationResetDefaultPage={resetPageTable}
               paginationComponentOptions={{
                  rowsPerPageText: "",
                  rangeSeparatorText: "of",
                  noRowsPerPage: true,
                  selectAllRowsItem: false,
                  selectAllRowsItemText: "All",
               }}
            />
         </DialogContent>
         <DialogActions>
            <button id="btnClearLookup" className="btn btn-danger-theme" onClick={handleClearValue}>
               <span id="lblBtnClearLookup">Clear</span>
            </button>
            <div style={{ flex: "1 0 0" }} />
            <button id="btnOkLookup" className="btn btn-primary-theme" onClick={() => props.OnOk(selectLookUp)}>
               <span id="lblBtnOkLookup">OK</span>
            </button>
            <button id="btnCloseLookup" className="btn btn-cancel-theme" onClick={props.OnCancel}>
               <span id="lblBtnCloseLookup">Cancel</span>
            </button>
         </DialogActions>
      </Dialog>
   );
};

export default Lookup;
