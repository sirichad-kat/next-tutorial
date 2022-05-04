import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DataTable from "react-data-table-component";
import * as UserAction from "../../redux/actions/UserAction";
import ServiceUrl from "../../configs/servicePath";
import * as GIcons from "../../configs/googleicons";
import CircularProgress from "../circularprogress";
import { selectedLkRowStyle } from "../../configs/function";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Program = (props) => {
   const userInfo = useSelector((state) => state.user);
   const dispatch = useDispatch();

   const [programs, setProgram] = useState([]);
   const [selectProgram, setSelectProgram] = useState(null);
   const [textSearch, setTextSearch] = useState("");
   const [loadingLookup, setLoadingLookup] = useState(false);
   const [totalPage, setTotalPage] = useState(0);
   const [resetPageTable, setResetPageTable] = useState(false);

   const columnsProgram = [
      {
         name: "Program Id",
         selector: row => row.programId,
         wrap: true,
         maxWidth: "30%",
      },
      {
         name: "Program Name",
         selector: row => row.descr,
         wrap: true,
         maxWidth: "70%",
      },
   ];
  
   useEffect(() => {
      if (props.Open) {
         setTextSearch("");
         setLoadingLookup(true);

         const requestProgram = {
            connection: userInfo.connection,
            page: 1,
            pageSize: ServiceUrl.pageSizeLookup,
         };
         axios
            .post(ServiceUrl.urlBase + "GetProgramList", requestProgram)
            .then((response) => {
               setResetPageTable(!resetPageTable);
               setLoadingLookup(false);
               setProgram(response.data.dataList !== null ? response.data.dataList : []);
               setTotalPage(response.data.totalRow);
            })
            .catch((error) => console.log(error));
      }

      return () => console.log("unmount");
   }, [props.Open]);

   const handleProgramRowClicked = (row) => {
      const data = programs.map((item) => {
         if (item.programId === row.programId) {
            setSelectProgram(item);
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

      setProgram(data);
   };

   const handleSearchChange = (e) => {
      const value = e.target.value;
      setTextSearch(value);
   };

   const handleSearchLkData = () => {
      const requestProgram = {
         connection: userInfo.connection,
         textSearch: textSearch,
         page: 1,
         pageSize: ServiceUrl.pageSizeLookup,
      };
      setLoadingLookup(true);
      axios
         .post(ServiceUrl.urlBase + "GetProgramList", requestProgram)
         .then((response) => {
            setResetPageTable(!resetPageTable);
            setLoadingLookup(false);
            setProgram(response.data.dataList !== null ? response.data.dataList : []);
            setTotalPage(response.data.totalRow);
         })
         .catch((error) => console.log(error));
   };

   const handlePageChange = (page, totalRows) => {
      const requestProgram = {
         connection: userInfo.connection,
         textSearch: textSearch,
         page: page,
         pageSize: ServiceUrl.pageSizeLookup,
      };
      setLoadingLookup(true);
      axios
         .post(ServiceUrl.urlBase + "GetProgramList", requestProgram)
         .then((response) => {
            setLoadingLookup(false);
            setProgram(response.data.dataList !== null ? response.data.dataList : []);
         })
         .catch((error) => console.log(error));
   };

   return (
      <Dialog
         open={props.Open}
         onClose={props.OnCancel}
         scroll="paper"
         aria-labelledby="scroll-dialog-title"
         aria-describedby="scroll-dialog-description"
         maxWidth="sm"
         fullWidth>
         <DialogTitle id="scroll-dialog-title">Program</DialogTitle>
         <DialogContent dividers>
            <div className="row">
               <div className="col-sm-12 col-md-4"></div>
               <div className="col-sm-12 col-md-8 form-row Label-Inline" style={{ margin: "0px 0px 20px 0px" }}>
                  <label htmlFor="search" className="col-md-3" style={{ marginBottom: "0px" }}>
                     Search
                  </label>
                  <input
                     type="text"
                     name="search"
                     className="col-md-7 form-control form-control-sm"
                     value={textSearch}
                     onChange={handleSearchChange}
                  />
                  <button className="ml-2 btn btn-icon-only btn-primary-theme btn-form" style={{ border: "none" }} onClick={handleSearchLkData}>
                  <GIcons.IconSearch />
                     {/* <FontAwesomeIcon icon={["fas", "search"]} /> */}
                  </button>
               </div>
            </div>
            <DataTable
               columns={columnsProgram}
               data={programs}
               conditionalRowStyles={selectedLkRowStyle}  
               onRowClicked={handleProgramRowClicked}
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
            <button className="btn btn-primary-theme" onClick={() => props.OnOk(selectProgram)}>
               OK
            </button>
            <button className="btn btn-cancel-theme" onClick={props.OnCancel}>
               Cancel
            </button>
         </DialogActions>
      </Dialog>
   );
};

export default Program;
