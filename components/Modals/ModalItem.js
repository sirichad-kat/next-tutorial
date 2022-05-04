import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DataTable from "react-data-table-component";
import * as UserAction from "../../redux/actions/UserAction";
import ServiceUrl from "../../configs/servicePath";
import CircularProgress from "../circularprogress";
import { selectedLkRowStyle } from "../../configs/function";
import * as GIcons from "../../configs/googleicons";

const Lookup = (props) => {
  const userInfo = useSelector((state) => state.user);

  const [items, setItem] = useState([]);
  const [selectItem, setSelectItem] = useState(null);
  const [textSearch, setTextSearch] = useState("");
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [resetPageTable, setResetPageTable] = useState(false);

  const columnsItemCode = [
    {
      name: "Item Code",
      selector: row => row.diseaseId,
      wrap: true,
    },
    {
      name: "Item Name",
      selector: row => row.itemName,
      wrap: true,
    },
  ];
 

  useEffect(() => {
    if (props.Open) {
      setTextSearch("");
      setLoadingLookup(true);
      const requestItem = {
        connection: userInfo.connection,
        orgCode: props.OrgCode,
        lang: userInfo.language,
        page: 1,
        pageSize: ServiceUrl.pageSizeLookup
      };
      let url = props.urlGetData;
      if(props.urlGetData == null || props.urlGetData == "" || props.urlGetData == undefined){
        url = ServiceUrl.urlBase;
      }
      axios
        .post(url + "GetItemDisease", requestItem)
        .then((response) => {       
          setResetPageTable(!resetPageTable);
          setItem(response.data.dataList !== null ? response.data.dataList : []);
          setTotalPage(response.data.totalRow);
          setLoadingLookup(false);
        })
        .catch((error) => console.log(error));
      items.forEach((item) => {
        item.toggleSelected = false;
      });
    }
  }, [props.Open]);

  const handleItemRowClicked = (row) => {
    const data = items.map((item) => {
      if (item.diseaseId === row.diseaseId) {
        setSelectItem(item);
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

    setItem(data);
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setTextSearch(value);
  };

  const handleSearchLkData = () => {
    setLoadingLookup(true);
    const requestItem = {
      connection: userInfo.connection,
      orgCode: props.OrgCode,
      lang: userInfo.language,
      textSearch: textSearch,
      page:1,
      pageSize: ServiceUrl.pageSizeLookup
    };

    axios
      .post(ServiceUrl.urlBase + "GetItemDisease", requestItem)
      .then((response) => {      
        setResetPageTable(!resetPageTable);
        setItem(response.data.dataList !== null ? response.data.dataList : []);
        setTotalPage(response.data.totalRow);
        setLoadingLookup(false);
      })
      .catch((error) => console.log(error));
  };
  const handlePageChange = (page, totalRows) => {
    const requestItem = {
      connection: userInfo.connection,
      orgCode: props.OrgCode,
      lang: userInfo.language,
      textSearch: textSearch,
      page: page,
      pageSize: ServiceUrl.pageSizeLookup
    };
    setLoadingLookup(true);
    axios
      .post(ServiceUrl.urlBase + "GetItemDisease", requestItem)
      .then((response) => {
        setItem(response.data.dataList !== null ? response.data.dataList : []);
        setLoadingLookup(false);
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
      fullWidth
    >
      <DialogTitle id="scroll-dialog-title">Item</DialogTitle>
      <DialogContent dividers>
        <div className="row">
          <div className="col-sm-12 col-md-4"></div>
          <div
            className="col-sm-12 col-md-8 form-row Label-Inline"
            style={{ margin: "0px 0px 20px 0px" }}
          >
            <label
              htmlFor="search"
              className="col-md-3"
              style={{ marginBottom: "0px" }}
            >
              Search
            </label>
            <input
              type="text"
              name="search"
              className="col-md-7 form-control form-control-sm"
              value={textSearch}
              onChange={handleSearchChange}
            />
            <button
              id="btnSearch"
              className="ml-2 btn btn-icon-only btn-primary-theme btn-form"
              style={{ border: "none" }}
              onClick={handleSearchLkData}
            >
              <GIcons.IconSearch />
              {/* <i className="fas fa-search"></i> */}
            </button>
          </div>
        </div>
        <DataTable
          columns={columnsItemCode}
          data={items}
          conditionalRowStyles={selectedLkRowStyle}
          // customStyles={customStyles}
          onRowClicked={handleItemRowClicked}
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
        <button
          className="btn btn-primary-theme"
          onClick={() => props.OnOk(selectItem)}
        >
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
