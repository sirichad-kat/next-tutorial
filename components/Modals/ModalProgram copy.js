import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import ServiceUrl from "../../configs/servicePath";
import * as MenuAction from "../../redux/actions/MenuAction";

const Program = (props) => {
  const dispatch = useDispatch();
 
  const [programs, setProgram] = useState([]);

  useEffect(() => { 
    axios
      .post(ServiceUrl.urlBase + "GetProgramList", null)
      .then((response) => {
        let ProgramList = [];
        response.data.forEach((program) => {
          let orgObj = {
            ProgramId: program.programId,
            ProgramName: program.descr,
          };
          ProgramList.push(orgObj);
        });
        setProgram(ProgramList);
      })
      .catch((error) => console.log(error));

    return () => console.log("unmount");
  }, []);

  const onClickRowHandler = (event, programinfo) => {  
    dispatch(MenuAction.setSelectedProgram(programinfo.ProgramId));
    dispatch(MenuAction.setSelectedProgramName(programinfo.ProgramName));
  };

  let header = programs.length > 0 ? Object.keys(programs[0]) : [];

  const headerList = header.map((key, index) => {
    let keyname = key;
    keyname = keyname.replace(/([a-z])([A-Z])/g, "$1 $2");
    keyname = keyname.replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
    return <th key={index}>{keyname.toUpperCase()}</th>;
  });

  const bodyList = programs.map((program, index) => {
    const programinfo = { ...program };
    let tr = (
      <tr
        key={programinfo.ProgramId}
        onClick={(event) => {
          onClickRowHandler(event, programinfo);
        }}
        data-dismiss="modal"
      >
        <td>{programinfo.ProgramId}</td>
        <td>{programinfo.ProgramName}</td>
      </tr>
    );
    return tr;
  });

  return (
    <div
      className="modal fade my-modal-header-primary"
      id="ModalProgram"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="ModalProgramLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="ModalProgramLabel">
              Select Org Code
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <table className="mb-0 table table-hover">
              <thead>
                <tr>{headerList}</tr>
              </thead>
              <tbody>{bodyList}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Program;
