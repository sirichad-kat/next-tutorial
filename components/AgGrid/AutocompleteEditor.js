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

const AutocompleteEditor = forwardRef((props, ref) => {

  const {
    value: initValue = null,
    options = [],
    selectKeyBy = "code",
    returnValue = true,
    getOptionLabel = (option) => `${option.code} - ${option.name}`,
    noOptionsText = "No options",
    disabled = false,
  } = props;

  const [value, setValue] = useState(initValue ?? "");
  const [selectedOption, setSelectedOption] = useState(null);
  const refInput = useRef(null);
  console.log(props)
  useEffect(() => {
    // focus on the input
    setTimeout(() => refInput.current.focus());
  }, []);

  useEffect(() => {
    if (!isEmpty(value)) {
      const selected = options.find((i) => {
        if (!isEmpty(selectKeyBy)) {
          return i[selectKeyBy] === value;
        } else {
          return i.code === value;
        }
      });
      setSelectedOption(selected);
    }
  }, [value]);

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        // this simple editor doubles any value entered into the input
        // console.log("GET VALUE", returnValue);
        if (returnValue === false) {
          // console.log("RET S", selectedOption)
          return selectedOption;
        } else {
          // console.log("VALUE")
          return value;
        }
        // return isEmpty(returnValue) ? value : returnValue ? value : selectedOption;
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
        options={options}
        getOptionSelected={(option, selectedValue) => {
          if (!isEmpty(selectKeyBy)) {
            return option[selectKeyBy] === selectedValue[selectKeyBy];
          } else {
            return option.code === selectedValue.code;
          }
        }}
        getOptionLabel={getOptionLabel}
        onChange={(event, newValue) => {
          setSelectedOption(newValue);
          // console.log("set selected option", newValue);
          if (!isEmpty(selectKeyBy)) {
            setValue(newValue[selectKeyBy]);
          } else {
            setValue(newValue.code);
          }
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
        disabled={disabled}
      />
    </div>
  );
});

AutocompleteEditor.displayName = "AutocompleteEditor";

export default AutocompleteEditor;
