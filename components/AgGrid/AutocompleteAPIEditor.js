import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { isEmpty } from "../../configs/function";
import axios from "axios";

const AutocompleteEditor = forwardRef((props, ref) => {
  const {
    value: initValue = null,
    apiUrl,
    apiEndpoint,
    apiRequest,
    selectKeyBy = "code",
    returnValue = true,
    getOptionLabel = (option) => `${option.code} - ${option.name}`,
    noOptionsText = "No options",
  } = props;

  const [value, setValue] = useState(initValue ?? "");
  const [selectedOption, setSelectedOption] = useState(null);
  const [allOptions, setAllOptions] = useState([]);
  const refInput = useRef(null);

  useEffect(() => {
    axios
      .post(apiUrl + apiEndpoint, apiRequest)
      .then((response) => {
        const cleanedOptions = response.data.filter(
          (i) => !isEmpty(i[selectKeyBy])
        );
        setAllOptions(cleanedOptions);
      })
      .catch((error) => console.log(error));
    // focus on the input
    setTimeout(() => refInput.current.focus());
  }, []);

  // useEffect(() => {
  //   // console.log("ALL OPTIONS ", allOptions);
  // }, [allOptions])

  useEffect(() => {
    if (!isEmpty(value) && !isEmpty(allOptions)) {
      const selected = allOptions.find((i) => i[selectKeyBy] === value);
      // console.log(allOptions);
      // console.log(value)
      // console.log("SELECTED ", selected);
      setSelectedOption(selected);
    }
  }, [value, allOptions]);

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        // this simple editor doubles any value entered into the input
        if (returnValue === false) {
          // console.log("RET S", selectedOption)
          return selectedOption;
        } else {
          // console.log("VALUE")
          return value;
        }
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
        id="agEditorAutocomplete"
        className="autocomplete-cell"
        size="small"
        value={selectedOption}
        options={allOptions}
        getOptionLabel={getOptionLabel}
        onChange={(event, newValue) => {
          setSelectedOption(newValue);
          setValue(newValue[selectKeyBy]);
        }}
        noOptionsText={noOptionsText}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={refInput}
            size="small"
            variant="outlined"
          />
        )}
        disableClearable
      />
    </div>
  );
});

AutocompleteEditor.displayName = "AutocompleteEditor";

export default AutocompleteEditor;
