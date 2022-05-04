import React, {useEffect, useState} from 'react';
import { useSelector } from "react-redux";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import ServiceUrl from "../../configs/servicePath";

const AutocompleteItem = (props) => {
  // console.log(props.value)
  const userInfo = useSelector((state) => state.user);
  const [emails, setEmails] = useState([]);
  const [inputEmail, setInputEmail] = useState("");  
  const [selectEmail, setSelectEmail] = useState(props.value ? props.value : []);
  const [itemSeries, setItemSeries] = useState(null);
  const [openEmailAutoComplete, setOpenEmailAutoComplete] = useState(false);

  useEffect(()=>{
    // console.log(selectEmail)
    if(props.hasOwnProperty("onChange")){
      props.onChange(selectEmail)
    }
  }, [selectEmail])

  const handleCloseEmail = (value, reason) => {
    setInputEmail("")
  }

  const handleSelectEmail = (newValues) => {
    const selected = newValues.find((v) => !v.hasOwnProperty("isSelected"));
    if (selected !== undefined) {
      selected.isDefault = false;
      selected.isSelected = true;
      const selectN = newValues.map((v) => {
        if (v.code === selected.code) {
          return { ...selected };
        }
        return { ...v };
      });
      console.log(selectN);
      setSelectEmail(selectN);
    } else {
      setSelectEmail(newValues);
    }
    setInputEmail("");
    setOpenEmailAutoComplete(false);
  };

  const handleInputEmail = (value, reason) => {
     
    let urlService = props.urlGetData;
      if(props.urlGetData == null || props.urlGetData == "" || props.urlGetData == undefined){
        urlService = ServiceUrl.urlBase;
      }
      // console.log(`urlService ${urlService}`)
    if (reason === "input") {
      setInputEmail(value);
      if (value !== "") {
        const mailReq = {
          connection: userInfo.connection,
          lang: userInfo.language,
          textSearch: value,
        };
        axios
          .post(urlService + props.serviceName, mailReq)
          .then((response) => { 
            console.log(response.data)
            setEmails(response.data);
          })
          .catch((error) => console.log(error));
        setOpenEmailAutoComplete(true);
      } else {
        setEmails([]);
        setOpenEmailAutoComplete(false);
      }
    } else {
      setOpenEmailAutoComplete(false);
    }
  };

  return (
    <div>
      <Autocomplete
        id="cboEmails"
        className="autocomplete-multi"
        // style={{backgroundColor: "#f1fafe"}}
        multiple
        value={props.value ? props.value : []}
        onChange={(event, newValue) => {
          handleSelectEmail(newValue);
        }}
        inputValue={inputEmail}
        onInputChange={(event, newInputValue, reason) =>
          handleInputEmail(newInputValue, reason)
        }       
        onClose={(event, newInputValue, reason) =>
          handleCloseEmail(newInputValue, reason)
        } 
        options={emails}
        getOptionSelected={(option, value) =>
          value !== null && option.code === value.code
        }
        getOptionLabel={(option) => option.name}
        renderOption={(option, { selected }) => {return (
          // <React.Fragment>
          //   <ListItem className="py-0" dense>
          //     <ListItemText
          //       primary={option.name}
          //       secondary={option.email}
          //     />
          //   </ListItem>
          // </React.Fragment>
          <React.Fragment>
            <Avatar
              style={{
                fontSize: "16px",
                backgroundColor:
                  "#" + Math.floor(Math.random() * 16777215).toString(16),
                marginRight: "10px",
              }}
            >
              {option.descr1 !== null && option.descr2 !== null ? option.descr1.charAt(0) + option.descr2.charAt(0) : option.descr1.charAt(0)}
            </Avatar>
            <div style={{ padding: "0px 15px" }}>
              <div className="row" style={{ fontSize: "18px" }}>
                {option.name}
              </div>
              <div
                className="row"
                style={{
                  fontSize: "16px",
                  color: "rgba(0, 0, 0, 0.54)",
                }}
              >
                {option.email}
              </div>
            </div>
          </React.Fragment>
        )}}
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
        renderInput={(params) => (
          <TextField {...params} size="small" variant="outlined" />
        )}
        open={openEmailAutoComplete}
        disabled={props.disabled}
      />
    </div>
  );
}

export default AutocompleteItem;