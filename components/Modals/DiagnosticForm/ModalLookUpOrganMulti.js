import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
// import "antd/dist/antd.css";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DataTable from "react-data-table-component";
import * as UserAction from "redux/actions/UserAction";
import ServiceUrl from "configs/servicePath";
import * as GIcons from "configs/googleicons";
import CircularProgress from "components/circularprogress";
import CheckboxTable from "components/CheckBoxTheme";
import { useTranslation } from "react-i18next";
import { convertFormatMoment, isEmpty, selectedLkRowStyle, sortByPropertyName , checkSortedAscByPropertyName } from "configs/function";

const Lookup = (props) => {  
  const { t, i18n } = useTranslation(props.programId ?? "");
  const userInfo = useSelector((state) => state.user);
  const selectCheckBoxProps = { indeterminate: isIndeterminate => isIndeterminate };
  const columnList  = props.columnList ?? []
  const organList  = props.organList ?? []
  const [lookups, setLookups] = useState([]);
  const [selectLookUp, setSelectLookUp] = useState([]);
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [notClickAll, setNotClickAll] = useState(false);

  const searchLookUpService = (selectItems = selectLookUp) => {
    let url = props.urlGetData;
    if (props.urlGetData == null || props.urlGetData === "" || props.urlGetData === undefined) {
      url = ServiceUrl.urlBase;
    }
    const requestObj = {
      lang: userInfo.language,
      searchType: "CONTAIN",
      userName: userInfo.username,
      orgCode: userInfo.orgCode,
      connection: userInfo.connection,      
      ...props.reqObj,
    };
    setLoadingLookup(true);
    axios
      .post(url + props.serviceName, requestObj)
      .then((response) => {
        const data = response.data ?? [];
        // console.log(props.getDatasource)
        if(props.getDatasource){
          props.getDatasource(data)
        }
        // console.log(data)
        let newData = []
        data.forEach((d) => {
          const itemExist = selectItems.find(tm => d.code === tm.organCd)
          if(isEmpty(itemExist)){
            newData.push(d)
          }
        });
        setLookups(newData);
        setLoadingLookup(false);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    searchLookUpService();
  }, [props.reqObj.aniId]);

  useEffect(() => {
    if (props.open) {
      searchLookUpService(organList);
      setSelectLookUp([])
    }

  }, [props.open]);

  const handleSelectedDataRow = ({ allSelected, selectedCount, selectedRows }) => {
    // console.log(lookups)
    let isNotClickAll = notClickAll
    if(selectedCount === 0){
      isNotClickAll = false
    }
    if(selectedCount === 1){
      isNotClickAll = true
    }
    setNotClickAll(isNotClickAll)
    // console.log(isNotClickAll)
    let order = 0
    if(selectedCount > 0){
      if(allSelected && !isNotClickAll){
        let order = 0
        selectedRows.forEach(d => {
          order = order + 1
          d.orderSelect = order
          d.isSelected = true
        })
      }
      else{
        if(isEmpty(selectedRows[0].orderSelect)){
          let maxOrder = Math.max(...lookups.map((m) => m.orderSelect));
          if(isNaN(maxOrder) || !isFinite(maxOrder)){
            maxOrder = 0;
          }
          selectedRows[0].orderSelect = maxOrder + 1
        }
        const sortSelected = sortByPropertyName(selectedRows, "orderSelect")
        let order = 0
        sortSelected.forEach(d => {
          order = order + 1
          d.orderSelect = order
          d.isSelected = true
        })
      }
      lookups.forEach(d => {
        const selectExist = selectedRows.find(sel => sel.code === d.code)
        if(isEmpty(selectExist)){
          d.isSelected = false
          d.orderSelect = ""
        }
      })      
      // console.log(lookups)
    }
    else{
      lookups.forEach(d => {
        d.isSelected = false
        d.orderSelect = ""
      })      
    }
    setSelectLookUp(selectedRows)
  }

  const handleOkClicked = () => {    
    console.log(selectLookUp)
    props.onOk(selectLookUp)
  }

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
      <DialogTitle id="scroll-dialog-title">{props.title}</DialogTitle>
      <DialogContent dividers>   
        <DataTable
          columns={columnList}
          data={lookups}
          conditionalRowStyles={selectedLkRowStyle}
          progressPending={loadingLookup}
          progressComponent={<CircularProgress />}
          selectableRows
          selectableRowsNoSelectAll
          selectableRowsHighlight
          selectableRowsComponent={CheckboxTable}     
          selectableRowsComponentProps={selectCheckBoxProps}
          onSelectedRowsChange={handleSelectedDataRow}           
          persistTableHead
          noHeader
          striped
        />
      </DialogContent>
      <DialogActions>
        <button className="btn btn-primary-theme" onClick={handleOkClicked}>
          OK
        </button>
        <button className="btn btn-cancel-theme" onClick={props.onCancel}>
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default Lookup;
