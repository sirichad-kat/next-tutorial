import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { isEmpty, getInitValue, isNumeric } from "configs/function";
import Checkbox from "@material-ui/core/Checkbox";
import uniq from "lodash/uniq";

const ModalSubReportGroupBy = (props) => {
  const userInfo = useSelector((state) => state.user);

  const baseRequest = {
    connection: userInfo.connection,
    username: userInfo.username,
    orgCode: userInfo.orgCode,
    lang: userInfo.language,
  };

  const title = props.title ?? "Group By";

  const programId = props.programId ?? "";
  const { t, i18n } = useTranslation(programId);

  const [groupByData, setGroupByData] = useState([]);

  function hasDuplicates(a) {
    return uniq(a).length !== a.length;
  }

  
  useEffect(() => {
    const loadGroupByInit = async () => {
      let groupByDescr = await getInitValue(
        userInfo.connection,
        "SUMMARYGROUPBY_DESCR",
        "N/A"
      ).then((res) => {
        console.log("RES DESCR", res);
        console.log(res.split(":"));
        return res.split(":");
      });
      let groupBy = await getInitValue(
        userInfo.connection,
        "SUMMARYGROUPBY",
        "N/A"
      ).then((res) => {
        console.log("RES GB", res);
        console.log(res.split(":"));
        return res.split(":");
      });
      console.log("GROUP BY INIT", groupBy, groupByDescr);
      console.log(groupBy);
      console.log(groupByDescr);
      const noneData = {
        groupBy: "NONE",
        groupByDescr: "None",
        checked: true,
        seq: "",
      };
      const groupByData = [
        noneData,
        ...groupBy.map((data, index) => {
          return {
            groupBy: data,
            groupByDescr: groupByDescr[index],
            checked: false,
            seq: "",
          };
        }),
      ];
      setGroupByData(groupByData);
    };

    loadGroupByInit();
  }, []);

  useEffect(() => {
    console.log("GROUP BY");
    console.log(groupByData);
  }, [groupByData]);

  const handleOkBtn = () => {
    console.log("HANDLE OK")
    console.log(groupByData)
    const currentSeq = groupByData
      .filter((i) => i.checked)
      .map((i) => i.seq);
    console.log(currentSeq);
    if (hasDuplicates(currentSeq)) {
      return Swal.fire({
        title: "Warning",
        text: t(
          programId + ":duplicateGroupbySeq",
          "Duplicated group by seq is not allowed."
        ),
        icon: "warning",
      });
    }
    const returnGroupBy = groupByData.filter((i) => i.checked);
    props.onOk(returnGroupBy);
  };

  function findMissingNumbers(arr) {
    // Create sparse array with a 1 at each index equal to a value in the input.
    var sparse = arr.reduce((sparse, i) => ((sparse[i] = 1), sparse), []);
    // Create array 0..highest number, and retain only those values for which
    // the sparse array has nothing at that index (and eliminate the 0 value).
    return [...sparse.keys()].filter((i) => i && !sparse[i]);
  }

  const handleCheckboxChange = (e, index) => {
    let newGroupByData = [...groupByData];
    newGroupByData[index].checked = e.target.checked;
    if (index !== 0) {
      newGroupByData[0].checked = false; //uncheck none
    }
    if (index === 0) {
      newGroupByData = newGroupByData.map((data, i) => ({
        ...data,
        checked: i === 0,
        seq: "",
      }));
    }
    if (e.target.checked && index !== 0) {
      const currentSeq = newGroupByData.map((i) => i.seq);
      const availableSeq = findMissingNumbers(currentSeq);
      let newSeq = 1;
      if (currentSeq.length > 0) {
        newSeq = Math.max(...currentSeq) + 1;
      }
      if (availableSeq.length > 0) {
        newSeq = availableSeq[0];
      }
      newSeq = newSeq.toString();
      newGroupByData[index].seq = newSeq;
    } else {
      newGroupByData[index].seq = "";
    }
    setGroupByData(newGroupByData);
  };

  const handleSeqChange = (e, index) => {
    let newGroupByData = [...groupByData];
    // const currentSeq = newGroupByData.map((i) => i.seq);
    // console.log(currentSeq)
    if (e.target.value !== "" && isNumeric(e.target.value)) {
      newGroupByData[index].seq = e.target.value;
      setGroupByData(newGroupByData);
    }
  };

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
      <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {groupByData.map((data, index) => {
          return (
            <div className="row" key={index}>
              <div className="col-3 col-md-2">
                <Checkbox
                  id={`${data.groupBy}Chxbox`}
                  checked={data.checked}
                  onChange={(e) => handleCheckboxChange(e, index)}
                  name={`${data.groupBy}Chxbox`}
                  color="primary"
                  size="small"
                  style={{ padding: "5px" }}
                />
              </div>
              <div className="col-3">
                <span className="font-weight-bold">{data.groupByDescr}</span>
              </div>
              {data.groupBy !== "NONE" && (
                <div className="col-4">
                  <input
                    id={`${data.groupBy}Seq`}
                    type="text"
                    name={`${data.groupBy}Seq`}
                    className="form-control input-cell text-right"
                    onChange={(e) => handleSeqChange(e, index)}
                    value={data.seq}
                    disabled={!data.checked}
                  />
                </div>
              )}
            </div>
          );
        })}
      </DialogContent>
      <DialogActions>
        <button
          id="btnOkRemark"
          className="btn btn-primary-theme"
          onClick={handleOkBtn}
        >
          <span id="lblBtnOkRemark">OK</span>
        </button>
        <button
          id="btnCloseRemark"
          className="btn btn-cancel-theme"
          onClick={props.onCancel}
        >
          <span id="lblBtnCloseRemark">Cancel</span>
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalSubReportGroupBy;
