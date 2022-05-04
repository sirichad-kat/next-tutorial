import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import axios from "axios";
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import ModalLookUp from "../Modals/ModalLookUpItemOrderMulti";
import ServiceUrl from "../../configs/servicePath";

const AutocompleteItem = (props) => {
  const itemValue = props.value ? props.value : []
  const userInfo = useSelector((state) => state.user);
  const fixedOptions = [];
  const sampleType = props.sampleType ? props.sampleType : ""
  const labroom = props.labroom ? props.labroom : ""
  const fromProgramCode = props.fromProgramCode ? props.fromProgramCode : ""
  const [items, setItems] = useState([]);
  const [inputItem, setInputItem] = useState("");
  const [selectItem, setSelectItem] = useState(itemValue);
  const [openItem, setOpenItem] = useState(false);
  const [loadingItem, setLoadingItem] = useState(false);
  const [itemSeries, setItemSeries] = useState(null);
  const [openItemModal, setOpenItemModal] = useState(false);

  const handleCloseModalItem = () => {
    setOpenItemModal(false);
  };

  const handleOkModalItem = (items) => {
    items.forEach(i => {
      i.diseaseId = i.key;
      i.groupName = itemSeries.key;
      i.isSelected = true;
    });
    const newData = selectItem.filter((d) => {
      if (itemSeries.key === d.groupName && itemSeries.orgCode === d.orgCode) {
        const selected = items.find(s => d.key === s.key && d.orgCode === s.orgCode)
        if (selected !== undefined) {
          return true;
        } else {
          return false;
        }
      }
      else {
        return true;
      }
    });
    // setSelectItem(newData)

    const newItemSelect = items.filter(d => {
      if (newData.length > 0) {
        const selected = newData.find(s => d.key === s.key && d.orgCode === s.orgCode)
        console.log(selected)
        if (selected === undefined) {
          return true
        }
        else {
          return false
        }
      }
      return true
    })
    const newSelect = [...newData, ...newItemSelect]
    if (props.hasOwnProperty("onChange")) {
      props.onChange(newSelect)
    }
    setSelectItem(newSelect)
    setItemSeries(null)
    setOpenItemModal(false);
  }

  const handleSelectItem = (newValues) => {
    let newSelectItem = []
    const selected = newValues.find(v => !v.hasOwnProperty("isSelected"))
    if (selected !== undefined) {
      switch (selected.type) {
        case "N":
          selected.diseaseId = selected.key;
          selected.groupName = null;
          selected.isSelected = true;
          const selectN = newValues.map(v => {
            if (v.key === selected.key && v.orgCode === selected.orgCode) {
              return { ...selected }
            }
            return { ...v }
          })
          newSelectItem = selectN
          if (props.hasOwnProperty("onChange")) {
            props.onChange(newSelectItem)
          }
          setSelectItem(newSelectItem);
          break;
        case "I":
          selected.diseaseId = selected.key;
          selected.groupName = selected.key;
          selected.isSelected = true;
          const selectI = newValues.map(v => {
            if (v.key === selected.key && v.orgCode === selected.orgCode) {
              return { ...selected }
            }
            return { ...v }
          })
          newSelectItem = selectI
          if (props.hasOwnProperty("onChange")) {
            props.onChange(newSelectItem)
          }
          setSelectItem(newSelectItem);
          break;
        case "G":
          if (selected.showGroup === "Y") {
            selected.diseaseId = selected.key;
            selected.groupName = selected.key;
            selected.isSelected = true;
            const selectG = newValues.map(v => {
              if (v.key === selected.key && v.orgCode === selected.orgCode) {
                return { ...selected }
              }
              return { ...v }
            })
            newSelectItem = selectG
            if (props.hasOwnProperty("onChange")) {
              props.onChange(newSelectItem)
            }
            setSelectItem(newSelectItem);
          } else {
            const reqItem = {
              connection: userInfo.connection,
              lang: userInfo.language,
              userName: userInfo.username,
              orgCode: userInfo.orgCode,
              data: selected,
              sampleType: sampleType,
              labroom: labroom,
              fromProgram: fromProgramCode,
            };
            setLoadingItem(true)
            axios
              .post(ServiceUrl.urlLabMgt + "FindItemLabByConsistof", reqItem)
              .then((response) => {
                const data = response.data.dataList.map(d => {
                  d.diseaseId = d.key;
                  d.groupName = selected.key;
                  d.isSelected = true;
                  return { ...d }
                })
                console.log(data)
                newSelectItem = [...newValues.filter((option) => option.key !== selected.key || option.orgCode !== selected.orgCode), ...data]
                // newSelectItem = [...selectItem, ...newValues.filter((option) => option.key !== selected.key || option.orgCode !== selected.orgCode), ...data]
                console.log(newSelectItem);
                if (props.hasOwnProperty("onChange")) {
                  props.onChange(newSelectItem)
                }
                setSelectItem(newSelectItem);
                setLoadingItem(false)
              })
              .catch((error) => console.log(error));
          }
          break;
        case "S":
          setItemSeries(selected)
          console.log(selected)
          console.log(newValues)
          console.log(newValues.filter((option) => option.key !== selected.key || option.orgCode !== selected.orgCode))
          newSelectItem = [...newValues.filter((option) => option.key !== selected.key || option.orgCode !== selected.orgCode)]
          if (props.hasOwnProperty("onChange")) {
            props.onChange(newSelectItem)
          }
          setSelectItem(newSelectItem);
          setOpenItemModal(true);
          break;
        default:
          break;
      }
    }
    else {
      console.log(newValues)
      newSelectItem = newValues
      if (props.hasOwnProperty("onChange")) {
        props.onChange(newSelectItem)
      }
      setSelectItem(newSelectItem);
    }
    // if(props.hasOwnProperty("onChange")){
    //   props.onChange(newSelectItem)
    // }
    // setSelectItem(newSelectItem);
    setInputItem("")
    setOpenItem(false);
  };

  const handleInputItem = (value, reason) => {
    console.log(value);
    console.log(reason);
    if (reason === "input") {
      // setSelectItem({ ...selectProjectApprove, custInput: value });
      setInputItem(value)
      if (value !== "") {
        const reqItem = {
          connection: userInfo.connection,
          lang: userInfo.language,
          userName: userInfo.username,
          orgCode: userInfo.orgCode,
          textSearch: value,
          sampleType: sampleType,
          labroom: labroom,
          fromProgram: fromProgramCode,
        };
        setLoadingItem(true)
        axios
          .post(ServiceUrl.urlLabMgt + "GetItemLabCriteria", reqItem)
          .then((response) => {
            console.log(response.data)
            console.log(selectItem)
            console.log(itemValue)
            const newData = response.data.map(d => {
              const exist = itemValue.find(s => s.orgCode === d.orgCode && (s.key === d.key || s.groupName === d.key) && d.type !== "S")
              // console.log(exist)
              if (exist !== undefined) {
                return { ...d, isDisabled: true }
              }
              return { ...d, isDisabled: false }
            })
            // console.log(newData)
            setItems(newData);
            setLoadingItem(false)
          })
          .catch((error) => console.log(error));
        setOpenItem(true);
      } else {
        setItems([]);
        setOpenItem(false);
      }
    } else {
      setOpenItem(false);
    }
  };

  const handleCloseItem = (value, reason) => {
    setInputItem("")
  }

  return (
    <div>
      <Autocomplete
        id="cboItems"
        className="autocomplete-multi"
        // style={{backgroundColor: "#f1fafe"}}
        multiple
        size="small"
        value={itemValue}
        onChange={(event, newValue) => handleSelectItem(newValue)}
        inputValue={inputItem}
        onInputChange={(event, newInputValue, reason) =>
          handleInputItem(newInputValue, reason)
        }
        onClose={(event, newInputValue, reason) =>
          handleCloseItem(newInputValue, reason)
        }
        options={items}
        getOptionLabel={(option) => option.name}
        getOptionSelected={(option, value) =>
          value !== null &&
          option.key === value.key &&
          option.orgCode === value.orgCode
        }
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              size="small"
              label={option.name}
              key={option.name}
              {...getTagProps({ index })}
            />
          ))
        }
        // style={{ width: 500 }}
        renderInput={(params) => (
          <TextField {...params} size="small" variant="outlined" InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loadingItem ? <CircularProgress style={{ marginRight: "40px", color: "#34c5b2" }} color="primary" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }} />
        )}
        // filterSelectedOptions
        getOptionDisabled={(option) => option.isDisabled}
        loading={loadingItem}
        open={openItem}
        disabled={props.disabled}
      />
      <ModalLookUp
        Open={openItemModal}
        OnOk={handleOkModalItem}
        OnCancel={handleCloseModalItem}
        title="Item"
        urlGetData={ServiceUrl.urlLabMgt}
        serviceName="FindItemLabByConsistof"
        lookupKey="key,orgCode"
        reqObj={{
          connection: userInfo.connection,
          lang: userInfo.language,
          userName: userInfo.username,
          orgCode: userInfo.orgCode,
          data: itemSeries
        }}
        columnList={[
          {
            name: "Item Name",
            selector: row => row.name,
            wrap: true,
          },
        ]}
        itemSelectList={itemSeries === null ? [] : selectItem.filter(s => s.groupName === itemSeries.key && s.orgCode === itemSeries.orgCode)}
      />
    </div>
  );
}

export default AutocompleteItem;