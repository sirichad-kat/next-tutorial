import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
// import "antd/dist/antd.css";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import DataTable from "react-data-table-component";
import * as UserAction from "../../redux/actions/UserAction";
import ServiceUrl from "../../configs/servicePath";
import * as GIcons from "../../configs/googleicons";
import CircularProgress from "../circularprogress";
import { useTranslation } from "react-i18next";
import { convertFormatMoment, isEmpty, selectedLkRowStyle, sortByAlphabet } from "../../configs/function";

const Lookup = (props) => {  
  const { t, i18n } = useTranslation(props.programId ?? "");
  const userInfo = useSelector((state) => state.user);

  const [lookupOris, setLookupOris] = useState([]);
  const [lookups, setLookups] = useState([]);
  const [selectLookUp, setSelectLookUp] = useState([]);
  const [unselectLookUp, setUnselectLookUp] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [totalSelect, setTotalSelect] = useState(0);
  const [resetPageTable, setResetPageTable] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isApplyAll, setIsApplyAll] = useState(false);
  const [selectAllClicked, setSelectAllClicked] = useState(false);
  const [selectItemStr, setSelectItemStr] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const columnList = [
    {
      name: "",
      wrap: true,
      center: true,
      minWidth: "50px",
      maxWidth: "5%",
      cell: (row) => (
        <Checkbox
          checked={row.toggleSelected}
          onChange={() => handleLookupRowClicked(row)}
          className="p-0"
          name="chkSelect"
          color="primary"
          size="small"
        />
      ),
    },
    ...props.columnList,
  ];


  const searchLookUpService = (selectItems = selectLookUp) => {
    let url = props.urlGetData;
    if (props.urlGetData == null || props.urlGetData === "" || props.urlGetData === undefined) {
      url = ServiceUrl.urlBase;
    }
    const requestObj = {
      lang: userInfo.language,
      textSearch: textSearch,
      searchType: "CONTAIN",
      connection: userInfo.connection,      
      ...props.reqObj,
    };
    setLoadingLookup(true);
    axios
      .post(url + props.serviceName, requestObj)
      .then((response) => {
        const data =
          response.data ?? [];
        let itemSelect = "";
        let newData = []
        if(props.isNew){
          setIsSelectAll(true);
          newData = data.map((d) => {
            itemSelect = itemSelect ? itemSelect + "; " + d.key : d.key;
            return { ...d, toggleSelected: true };
          });
          setSelectItemStr(itemSelect);
          setSelectLookUp(newData);
        }
        else{
          setIsSelectAll(selectItems.length === data.length);
          const items = []
          newData = data.map((d) => {
            const itemExist = selectItems.find(tm => d.key === tm.diseaseId)
            if(itemExist){
              itemSelect = itemSelect ? itemSelect + "; " + d.key : d.key;
              items.push(d)
              return { ...d, toggleSelected: true };
            }
            return { ...d, toggleSelected: false };
          });
          console.log(selectItems)
          console.log(newData)
          setSelectItemStr(itemSelect);
          setSelectLookUp(items);
        }
        setLookupOris(JSON.parse(JSON.stringify(response.data)));
        setLookups(newData);
        setLoadingLookup(false);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (props.Open) {
      // setSelectLookUp(props.itemSelectList)
      setUnselectLookUp([])
      setIsSelectAll(false);
      setIsApplyAll(false);
      setTextSearch("");
      setSelectItemStr("");
      searchLookUpService(props.itemSelectList);
      if (lookups !== null && lookups !== undefined) {
        lookups.forEach((lk) => {
          lk.toggleSelected = false;
        });
      }
    }

  }, [props.Open]);

  const handleLookupRowClicked = (row) => {
    let newSelectedList = [...selectLookUp];
    const data = lookups.map(item => {      
      if (row.key === item.key) {
        const selected = newSelectedList.find((s) => s.key === item.key);
        if (selected !== undefined) {
          item.toggleSelected = false;
          var indexSelect = newSelectedList.findIndex((d) => d.key === item.key);
          if (indexSelect !== -1) {
            newSelectedList.splice(indexSelect, 1);
          }
        } else {
          item.toggleSelected = true;
          newSelectedList.push(item)          
        }
        return { ...item };
      }
      return {
        ...item
      };
    });
    newSelectedList = sortByAlphabet(newSelectedList)
    let itemSelect = ""
    newSelectedList.forEach(d => {
      itemSelect = itemSelect ? itemSelect + "; " + d.key : d.key
    })
    setSelectItemStr(itemSelect)
    setSelectLookUp(newSelectedList);
    setTotalSelect(newSelectedList.length)
    setIsSelectAll(newSelectedList.length === lookups.length)
    setLookups(data);
  };

  const handleSelectAllCheckBox = (e) => {
    console.log(lookups)
    const checked = e.target.checked;
    setIsSelectAll(checked);
    setSelectLookUp(lookupOris);
    let itemSelect = ""
    const newData = lookups.map(d => {
      // itemSelect = itemSelect ? itemSelect + "; " + d.key : d.key
      return { ...d, toggleSelected: checked }
    })
    lookupOris.forEach(d => {
      itemSelect = itemSelect ? itemSelect + "; " + d.key : d.key
    })
    if (!checked) {
      setSelectLookUp([])
      itemSelect = ""
    }
    setSelectItemStr(itemSelect)
    setLookups(newData)
  }

  const handleApplyAllCheckBox = (e) => {
    const checked = e.target.checked;
    setIsApplyAll(checked)
  }

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setTextSearch(value);
  };

  const handleTextSearchKeyDown = (e) => {
    if (e.key === "Enter") {
       handleSearchLkData();
    }
 };
  const handleSearchLkData = () => {
    if(textSearch){
      const newLookups = lookupOris.filter(d => d.key.toUpperCase().includes(textSearch.toUpperCase()) || d.name.toUpperCase().includes(textSearch.toUpperCase()))
      let newData = []
      newData = newLookups.map((d) => {
        const itemExist = selectLookUp.find(tm => d.key === tm.key)
        if(itemExist){
          return { ...d, toggleSelected: true };
        }
        return { ...d, toggleSelected: false };
      });
      setLookups(newData);
      setIsSearch(true)
    }
    else{
      let newData = []
      newData = lookupOris.map((d) => {
        const itemExist = selectLookUp.find(tm => d.key === tm.key)
        if(itemExist){
          return { ...d, toggleSelected: true };
        }
        return { ...d, toggleSelected: false };
      });
      setLookups(newData);
      setIsSearch(false)
    }
  };

  const handleOkClicked = () => {    
    console.log(selectLookUp)
    props.OnOk(selectLookUp, isApplyAll)
  }

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
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="scroll-dialog-title">{props.title}</DialogTitle>
      <DialogContent dividers>
        <div className="row Label-Inline">
          <div className="col-md-12 col-lg-12">
            <div className="row">
              <label id="lblItemSelected" className="col-md-2 col-lg-2">
                Item Selected :
              </label>
              <label
                id="lblItemSelectedVal"
                className="col-sm-12 col-md-10 col-lg-10"
              >
                {selectItemStr ?? ""}
              </label>
            </div>
          </div>
        </div>
        <div className="row Label-Inline">
          <div className="col-md-5 col-lg-5 mb-0"></div>
          <div className="col-md-7 col-lg-7 mb-0">
            <div className="row">
              <label
                htmlFor="search"
                className="col-md-3 col-lg-3"
                style={{ marginBottom: "0px" }}
              >
                Search
              </label>
              <input
                type="text"
                name="search"
                className="col-md-7 col-md-7 form-control"
                value={textSearch}
                onChange={handleSearchChange}
                onKeyDown={handleTextSearchKeyDown}
              />
              <button
                className="ml-2 btn btn-icon-only btn-primary-theme btn-form"
                style={{ border: "none" }}
                onClick={handleSearchLkData}
              >
                <GIcons.IconSearch />
              </button>
            </div>
          </div>
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={isSelectAll}
              onChange={handleSelectAllCheckBox}
              name="chkSelectAll"
              color="primary"
              size="small"
            />
          }
          label="Select All"
          style={{ marginBottom: "0px" }}
        />
        <DataTable
          columns={columnList}
          data={lookups}
          conditionalRowStyles={selectedLkRowStyle}
          onRowClicked={handleLookupRowClicked}
          progressPending={loadingLookup}
          progressComponent={<CircularProgress />}
          persistTableHead
          noHeader
          striped
        />
      </DialogContent>
      <DialogActions>
        <FormControlLabel
          control={
            <Checkbox
              id="chkApplyAll"
              checked={isApplyAll}
              onChange={handleApplyAllCheckBox}
              color="primary"
              size="small"
            />
          }
          label="Apply to All Sample"
          style={{marginLeft: "5px"}}
        />
        <div style={{ flex: "1 0 0" }} />
        <button className="btn btn-primary-theme" onClick={handleOkClicked}>
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
