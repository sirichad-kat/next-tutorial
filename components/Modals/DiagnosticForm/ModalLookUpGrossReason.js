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
import { convertFormatMoment, isEmpty, selectedLkRowStyle, sortByPropertyName, checkSortedAscByPropertyName } from "configs/function";

const Lookup = (props) => {  
  const { t, i18n } = useTranslation(props.programId ?? "");
  const userInfo = useSelector((state) => state.user);
  const selectCheckBoxProps = { indeterminate: isIndeterminate => isIndeterminate };
  const selectedReasonList  = props.selectedReasonList ?? []
  const [lookups, setLookups] = useState([]);
  const [selectLookUp, setSelectLookUp] = useState([]);
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [notClickAll, setNotClickAll] = useState(false);

  const columnList = [
    {
      name: "Reason",
      selector: (row) => row.name,
      wrap: true,
      maxWidth: "75%",
    },
    {
      name: "Score",
      selector: (row) => row.temp,
      wrap: true,
      maxWidth: "15%",
      cell: (row) => row.isSelected ? (
        <input
          id={`score-${row.code}`}
          type="text"
          name="score"
          className="form-control"
          value={row.temp}
          onChange={(e) => handleInputScoreChange(e, row)}
        /> 
      ) : null,
    },
    {
      name: "Seq",
      selector: (row) => row.number,
      wrap: true,
      center: true,
      maxWidth: "10%",
    },
  ]

  const searchLookUpService = (selectItems = selectLookUp) => {
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
      .post(ServiceUrl.urlResult + "GetOrganReasonList", requestObj)
      .then((response) => {
        const data = response.data ?? [];    
        if(!isEmpty(selectItems)){
          const selectedList = []
          data.forEach((d) => {
            const reasonExist = selectItems.find(tm => d.code === tm.code)
            d.isSelected = false
            if(reasonExist){
              // console.log(reasonExist)
              d.isSelected = true
              d.temp = reasonExist.temp
              d.number = reasonExist.number
              // console.log(d)
              selectedList.push(d)
            }
            console.log(d)
          });
        }
        // console.log(data)
        setLookups(data);
        setLoadingLookup(false);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (props.open) {
      // console.log(selectedReasonList)
      searchLookUpService(selectedReasonList);
      setSelectLookUp([])
    }

  }, [props.open]);

  const handleInputScoreChange = (e, row) => {
    const { target } = e;
    const { name } = target;
    const value = target.value;
    const newLookups = [...lookups];
    newLookups.forEach((p) => {
       if (p.code === row.code) {
          p.temp = value;
       }
    });
    setLookups(newLookups);
    setTimeout(() => document.getElementById(`score-${row.code}`).focus());
 };

  const handleSelectedDataRow = ({ allSelected, selectedCount, selectedRows }) => {  
    // console.log(selectedRows)
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
          d.number = order
          d.isSelected = true
        })
      }
      else{
        if(isEmpty(selectedRows[0].number)){
          let maxOrder = Math.max(...lookups.map((m) => m.number));
          if(isNaN(maxOrder) || !isFinite(maxOrder)){
            maxOrder = 0;
          }
          selectedRows[0].number = maxOrder + 1
        }
        const sortSelected = sortByPropertyName(selectedRows, "number")
        let order = 0
        sortSelected.forEach(d => {
          order = order + 1
          d.number = order
          d.isSelected = true
        })
      }
      lookups.forEach(d => {
        const selectExist = selectedRows.find(sel => sel.code === d.code)
        if(isEmpty(selectExist)){
          d.isSelected = false
          d.orderTmp = ""
          d.number = ""
        }
      })      
      // console.log(lookups)
    }
    else{
      lookups.forEach(d => {
        d.isSelected = false
        d.orderTmp = ""
        d.number = ""
      })      
    }
    setSelectLookUp(selectedRows)
  }

  const handleOkClicked = () => {    
    // console.log(selectLookUp)
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
          selectableRowSelected={(row) => row.isSelected}
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
