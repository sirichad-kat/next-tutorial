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
import { selectedLkRowStyle } from "../../configs/function";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Lookup = (props) => {
  const userInfo = useSelector((state) => state.user);
 
  const [orgs, setOrgs] = useState([]);
  const [selectOrg, setSelectOrg] = useState(null);
  const [textSearch, setTextSearch] = useState("");
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [resetPageTable, setResetPageTable] = useState(false);

  const columnsOrgCode = [
    {
      name: "Org Code",
      selector: row => row.orgCode,
      wrap: true,
    },
    {
      name: "Org Name",
      selector: row => row.descr,
      wrap: true,
    },
  ];
  

  useEffect(() => {
    if (props.Open) {
      setTextSearch("");
      setLoadingLookup(true);

      const request = {
        connection: userInfo.connection,
        textSearch: textSearch,
        page: 1,
        pageSize: ServiceUrl.pageSizeLookup,
      };

      axios
        .post(ServiceUrl.urlBase + "GetTemplateOrgList", request)
        .then((response) => {
          const orgCodeList = response.data.dataList !== null ? response.data.dataList : [];
          setResetPageTable(!resetPageTable);
          setLoadingLookup(false);
          setOrgs(orgCodeList);
          setTotalPage(response.data.totalRow);
        })
        .catch((error) => console.log(error));
      orgs.forEach((org) => {
        org.toggleSelected = false;
      });
    }
  }, [props.Open]);

  const handleOrgRowClicked = (row) => {
    const data = orgs.map((item) => {
      if (item.orgCode === row.orgCode) {
        setSelectOrg(item);
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

    setOrgs(data);
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setTextSearch(value);
  };

  const handleSearchLkData = () => {
    setLoadingLookup(true);
    const request = {
      connection: userInfo.connection,
      textSearch: textSearch,
      page: 1,
      pageSize: ServiceUrl.pageSizeLookup
    };

    axios
      .post(ServiceUrl.urlBase + "GetTemplateOrgList", request)
      .then((response) => {
        const orgCodeList = response.data.dataList !== null ? response.data.dataList : [];
        setResetPageTable(!resetPageTable);
        setLoadingLookup(false);
        setOrgs(orgCodeList);
        setTotalPage(response.data.totalRow);
      })
      .catch((error) => console.log(error));
  };

  const handlePageChange = (page, totalRows) => {
    const requestProgram = {
      connection: userInfo.connection,
      textSearch: textSearch,
      page: page,
      pageSize: ServiceUrl.pageSizeLookup
    };
    setLoadingLookup(true);
    axios
      .post(ServiceUrl.urlBase + "GetTemplateOrgList", requestProgram)
      .then((response) => {
        const orgCodeList = response.data.dataList !== null ? response.data.dataList : [];
        setLoadingLookup(false);
        setOrgs(orgCodeList);
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
        <DialogTitle id="scroll-dialog-title">Org Code</DialogTitle>
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
              columns={columnsOrgCode}
              data={orgs}
              conditionalRowStyles={selectedLkRowStyle}
              // customStyles={customStyles}
              onRowClicked={handleOrgRowClicked}
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
           <button className="btn btn-primary-theme" onClick={() => props.OnOk(selectOrg)}>
              OK
           </button>
           <button className="btn btn-cancel-theme" onClick={props.OnCancel}>
              Cancel
           </button>
        </DialogActions>
     </Dialog>
  );
};

export default Lookup;
