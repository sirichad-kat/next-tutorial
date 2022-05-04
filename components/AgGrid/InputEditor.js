import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { isNumber, checkDecimalPlaceExceed } from "../../configs/function";

const NumberInputEditor = forwardRef((props, ref) => {
  const type = props.type ?? "TEXT";
  const checkDecimal = props.checkDecimal ?? false;
  const decimalPlace = props.decimalPlace ?? 3;
  const allowNegative = props.allowNegative ?? false;
  const [value, setValue] = useState(props.value ?? "");
  const refInput = useRef();

  useEffect(() => {
    // focus on the input
    setTimeout(() => refInput.current.focus());
  }, []);

  const handleInputChange = (e) => {
    const { target } = e;
    const { name } = target;
    const newValue = target.value;
    if (type === "NUMBER") {
      let newVal = newValue;
      if (allowNegative && newVal.length === 1) {
        if (newVal.indexOf("-") === 0) {
          newVal = newValue;
        }
      } else {
        newVal = isNumber(newValue) ? newValue : value;
        if(!allowNegative) {
          newVal = newValue >= 0 ? newValue : value;
        }
        if (checkDecimal) {
          newVal = !checkDecimalPlaceExceed(newVal, decimalPlace)
            ? newVal
            : value;
        }
      }
      setValue(newVal);
    } else {
      setValue(newValue);
    }
  };

  useEffect(() => {
    // focus on the input
    setTimeout(() => refInput.current.focus());
  }, []);

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        // this simple editor doubles any value entered into the input
        if(allowNegative && value === "-") return "0"
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
      <input
        ref={refInput}
        id={props.idname}
        type="text"
        name="value"
        className={
          "form-control input-cell" + (type === "NUMBER" ? " text-right" : "")
        }
        onChange={handleInputChange}
        value={value ?? ""}
      />
    </div>
  );
});

NumberInputEditor.displayName = "NumberInputEditor";

export default NumberInputEditor;
