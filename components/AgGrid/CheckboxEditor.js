import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Checkbox from "@material-ui/core/Checkbox";

const CheckboxEditor = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value === "Y");
  const refInput = useRef(null);

  useEffect(() => {
    // focus on the input
    setTimeout(() => refInput.current.focus());
    setValue(!value);
  }, []);

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        // this simple editor doubles any value entered into the input
        return value ? "Y" : "N";
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
    <Checkbox
      inputRef={refInput}
      id="checkboxSquareYn"
      checked={value}
      onChange={(e) => setValue(e.target.checked)}
      name="checkboxSquareYn"
      color="primary"
      size="small"
      style={{ padding: "5px" }}
    />
  );
});

CheckboxEditor.displayName = "CheckboxEditor";

export default CheckboxEditor;
