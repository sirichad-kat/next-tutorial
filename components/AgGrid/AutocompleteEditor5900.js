import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { isEmpty } from "../../configs/function";

const AutocompleteEditor = forwardRef((props, ref) => {
  const userInfo = useSelector((state) => state.user);
  const getFromService = props.getFromService ?? false
  const keyName = props.keyName ?? "code"
  const reqObj = props.reqObj ?? {}
  const [value, setValue] = useState(props.value ?? "");
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const refInput = useRef();

  useEffect(() => {
    if(getFromService){      
      const reqOption = {
        connection: userInfo.connection,
        lang: userInfo.language,
        orgCode: userInfo.orgCode,
        ...reqObj
      };
      axios
        .post(props.urlService, reqOption)
        .then((response) => {
          setOptions(response.data);
          const selected = response.data.find((i) => i[keyName] === value);
          setSelectedOption(selected);
          if(props.hasOwnProperty("getDataList")){          
            props.getDataList(response.data)
          }
        })
        .catch((error) => console.log(error));
    }
    else{
      setOptions(props.options);
      const selected = props.options.find((i) => i[keyName] === value);
      setSelectedOption(selected);
    }
    // focus on the input
    setTimeout(() => refInput.current.focus());
  }, []);

  // useEffect(() => {
  //   if (!isEmpty(value)) {
  //     const selected = options.find((i) => i[keyName] === value);
  //     setSelectedOption(selected);
  //   }
  // }, [value]);

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        // this simple editor doubles any value entered into the input
        return value;
      },

      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
      isCancelBeforeStart() {
        return false;
      },

      // Gets called once when editing is finished (eg if Enter is pressed).
      // If you return true, then the result of the edit will be ignored.
      isCancelAfterEnd() {
        // our editor will reject any value greater than 1000
        return false;
      },
    };
  });

  return (
    <div style={{ height: "100%", width: "100%", position: "absolute" }}>
      <Autocomplete
        ref={refInput}
        id="agEditorAutocomplete"
        className="autocomplete-cell"
        size="small"
        value={selectedOption}
        options={options}
        getOptionLabel={props.getOptionLabel}
        onChange={(event, newValue) => {
          setSelectedOption(newValue);
          setValue(newValue);
          // setValue(newValue[keyName]);
        }}
        noOptionsText={props.noOptionsText ?? "No options"}
        renderInput={(params) => (
          <TextField {...params} size="small" variant="outlined" />
        )}
        disableClearable
      />
    </div>
  );
});

AutocompleteEditor.displayName = "AutocompleteEditor";

export default AutocompleteEditor;
