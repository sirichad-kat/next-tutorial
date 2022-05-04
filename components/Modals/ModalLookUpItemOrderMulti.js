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
import { isEmpty, selectedLkRowStyle } from "../../configs/function";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Lookup = (props) => {
  const userInfo = useSelector((state) => state.user);

  const [lookups, setLookups] = useState([]);
  const [selectLookUp, setSelectLookUp] = useState([]);
  const [unselectLookUp, setUnselectLookUp] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [totalSelect, setTotalSelect] = useState(0);
  const [resetPageTable, setResetPageTable] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [selectAllClicked, setSelectAllClicked] = useState(false);
  const columnList = [
    {
      name: "",
      wrap: true,
      center: true,
      // minWidth: "7%",
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


  const searchLookUpService = (page, selectItem = selectLookUp) => {
    let url = props.urlGetData;
    if (props.urlGetData == null || props.urlGetData === "" || props.urlGetData === undefined) {
      url = ServiceUrl.urlBase;
    }
    const requestObj = {
      lang: userInfo.language,
      textSearch: textSearch,
      searchType: "CONTAIN",
      connection: userInfo.connection,
      page: page,
      pageSize: ServiceUrl.pageSizeLookup,
      ...props.reqObj,
    };
    setLoadingLookup(true);
    axios
      .post(url + props.serviceName, requestObj)
      .then((response) => {
        const data =
          response.data.dataList !== null ? response.data.dataList.map(d => {
            return { ...d, toggleSelected: false }
          }) : [];
        console.log("find data")
        if (page === 1) {
          setResetPageTable(!resetPageTable);
          setTotalData(response.data.totalRow);
        }

        if (totalSelect === response.data.totalRow) {
          const newData = data.map(d => {
            return { ...d, toggleSelected: true }
          })
          console.log(newData)
          setLookups(newData)
          setIsSelectAll(true)
        }
        else {
          if (totalSelect > 0) {
            if(selectAllClicked){
              const newData = data.map((d) => {
                console.log({...d})
                console.log(unselectLookUp)
                const unselected = unselectLookUp.find(un => un === d.key);
                if (isEmpty(unselected)) {
                  return { ...d, toggleSelected: true };
                } else {
                  return { ...d, toggleSelected: false };
                }
              });
              console.log(newData)
              setLookups(newData);
            }
            else{
              const keys = props.lookupKey.split(",");
              let checkKey = true;
              const newData = data.map((d) => {
                const selected = selectItem.find((s) => {
                  checkKey = true;
                  keys.forEach((k) => {
                    checkKey = checkKey && s[k] === d[k];
                  });
                  return checkKey;
                });
                if (selected !== undefined) {
                  return { ...d, toggleSelected: true };
                } else {
                  return { ...d, toggleSelected: false };
                }
              });
              setLookups(newData);
            }            
          }
          else {
            console.log(data)
            setLookups(data);
            console.log("set look up")
          }
          setIsSelectAll(false)

        }
        setLoadingLookup(false);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (props.Open) {
      setSelectLookUp(props.itemSelectList)
      setUnselectLookUp([])
      setTextSearch("");
      searchLookUpService(1, props.itemSelectList);
      // setSelectAllClicked(false)
      // setTotalSelect(0)
      console.log(lookups)
      if (lookups !== null && lookups !== undefined) {
        lookups.forEach((lk) => {
          lk.toggleSelected = false;
        });
      }
    }

  }, [props.Open]);

  const handleLookupRowClicked = (row) => {
    let dataRow = {...row}
    let checkKey = true;
    let checkKeySelect = true;
    const keys = props.lookupKey.split(",");
    console.log([...lookups])
    // item is already in autocomplete ?
    const data = lookups.map(item => {
      checkKey = true;
      keys.forEach((k) => {
        checkKey = checkKey && item[k] === row[k];
      });
      if (checkKey) {
        const selectedList = lookups.filter(s => s.toggleSelected);
        if (selectedList.length > 0) {
          checkKeySelect = true;
          const selected = selectedList.find((s) => {
            checkKeySelect = true;
            keys.forEach((k) => {
              checkKeySelect = checkKeySelect && item[k] === s[k];
            });
            return checkKeySelect;
          });
          if (selected !== undefined) {
            item.toggleSelected = false;
          } else {
            item.toggleSelected = true;
          }
        }
        else {
          item.toggleSelected = !item.toggleSelected;
        }
        return { ...item }
      }
      return {
        ...item
      };
    });

    let checkKeyItem = true;
    let checkKeySelectLookup = true;
    const newDataSelect = data.filter(d => {
      if (selectLookUp.length > 0) {
        const selected = selectLookUp.find(s => {
          checkKeyItem = true
          keys.forEach((k) => {
            checkKeyItem = checkKeyItem && s[k] === d[k];
          });

          return checkKeyItem
        });
        if (selected === undefined) {
          return d.toggleSelected
        }
        else {
          return false
        }
      }
      return d.toggleSelected
    })
    const newSelectLookUp = selectLookUp.filter(d => {
      const selected = data.find(s => {
        checkKeySelectLookup = true
        keys.forEach((k) => {
          checkKeySelectLookup = checkKeySelectLookup && s[k] === d[k];
        });
        return checkKeySelectLookup
      })
      if (selected !== undefined) {
        return selected.toggleSelected
      }
      else {
        return d.toggleSelected
      }
    })
    const newlookups = [...newSelectLookUp, ...newDataSelect]
    setSelectLookUp(newlookups);
    setTotalSelect(newlookups.length)
    setIsSelectAll(newlookups.length === totalSelect)
    setLookups(data);

    console.log(dataRow.toggleSelected)
    const exist = unselectLookUp.find(un => un === dataRow.key)
    if(dataRow.toggleSelected){ 
      //unselect   
      if(isEmpty(exist)){
        console.log([...unselectLookUp, dataRow.key])
        setUnselectLookUp([...unselectLookUp, dataRow.key])
      }
    }
    else{
      //select   
      if(!isEmpty(exist)){
        const newUnselectLookUp = unselectLookUp.filter(un => un !== dataRow.key)
        console.log(newUnselectLookUp)
        setUnselectLookUp(newUnselectLookUp)
      }
    }
  };

  const handleSelectAllClicked = (e) => {
    console.log(lookups)
    const checked = e.target.checked;
    setIsSelectAll(checked);
    setSelectAllClicked(checked)
    const newData = lookups.map(d => {
      return { ...d, toggleSelected: checked }
    })
    setTotalSelect(checked ? totalData : 0)
    if (!checked) {
      setSelectLookUp([])
    }
    setLookups(newData)
  }


  const handleSelectLookupRow = (state) => {
    let checkKey = true;
    const keys = props.lookupKey.split(",");
    if (state.allSelected) {

    }
    else {
      const data = lookups.map(item => {
        checkKey = true;
        const selected = state.selectedRows.find(s => {
          checkKey = true;
          keys.forEach((k) => {
            checkKey = checkKey && item[k] === s[k];
          });
          return checkKey
        })

        if (selected !== undefined) {
          item.toggleSelected = true
        }
        else {
          item.toggleSelected = false
        }
        return { ...item }
      });
      let checkKeyItem = true;
      let checkKeySelect = true;
      const newDataSelect = data.filter(d => {
        if (selectLookUp.length > 0) {
          const selected = selectLookUp.find(s => {
            checkKeyItem = true
            keys.forEach((k) => {
              checkKeyItem = checkKeyItem && s[k] === d[k];
            });

            return checkKeyItem
          })
          if (selected === undefined) {
            return d.toggleSelected
          }
          else {
            return false
          }
        }
        return d.toggleSelected
      })
      const newSelectLookUp = selectLookUp.filter(d => {
        const selected = data.find(s => {
          checkKeySelect = true
          keys.forEach((k) => {
            checkKeySelect = checkKeySelect && s[k] === d[k];
          });
          return checkKeySelect
        })
        if (selected !== undefined) {
          return selected.toggleSelected
        }
        else {
          return d.toggleSelected
        }
      });
      setSelectLookUp([...selectLookUp, ...newDataSelect]);
      setLookups(data);
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setTextSearch(value);
  };

  const handleSearchLkData = () => {
    searchLookUpService(1);
  };

  const handleOkClicked = () => {
    let url = props.urlGetData;
    if (props.urlGetData == null || props.urlGetData === "" || props.urlGetData === undefined) {
      url = ServiceUrl.urlBase;
    }
    if (isSelectAll) {
      const requestObj = {
        lang: userInfo.language,
        textSearch: textSearch,
        searchType: "CONTAIN",
        connection: userInfo.connection,
        page: 0,
        pageSize: ServiceUrl.pageSizeLookup,
        ...props.reqObj,
      };
      // setLoadingLookup(true);
      axios
        .post(url + props.serviceName, requestObj)
        .then((response) => {
          const data =
            response.data.dataList !== null ? response.data.dataList : [];
          props.OnOk(data)
        })
        .catch((error) => console.log(error));
    }
    else {
      props.OnOk(selectLookUp)
    }
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
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="scroll-dialog-title">{props.title}</DialogTitle>
      <DialogContent dividers>
        <div className="row">
          <div className="col-sm-12 col-md-4"></div>
          <div
            className="col-sm-12 col-md-8 form-row Label-Inline"
            style={{ margin: "0px 0px 5px 0px" }}
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
              className="ml-2 btn btn-icon-only btn-primary-theme btn-form"
              style={{ border: "none" }}
              onClick={handleSearchLkData}
            >
              <GIcons.IconSearch />
            </button>
          </div>
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={isSelectAll}
              onChange={handleSelectAllClicked}
              name="chkSelectAll"
              color="primary"
              size="small"
            />
          }
          label="Select All"
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
          pagination
          paginationServer
          paginationPerPage={ServiceUrl.pageSizeLookup}
          paginationTotalRows={totalData}
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
          onClick={handleOkClicked}
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
