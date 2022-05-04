import React, { useState, useEffect} from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import * as UserAction from "../../redux/actions/UserAction";
import TableHover from "../Table/TableHover";
import ServiceUrl from "../../configs/servicePath";

const OrgCode = (props) => {
  const dispatch = useDispatch();
  const setDefaultOrg = (org) => {
    dispatch(UserAction.setOrgCode(org));
  };

  const [orgs, setOrgsState] = useState([]);

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + props.data.token,
    };
    axios
      .post(ServiceUrl.urlBase + "GetUserOrgList", null, {
        headers: headers,
        params: { username: props.data.username },
      })
      .then((response) => {
        let OrgCodeList = [];
        response.data.forEach((org) => {
          let orgObj = {
            OrgCode: org.orgCode,
            OrgName: org.descr,
          };
          OrgCodeList.push(orgObj);
        });
        console.log(OrgCodeList);
        setOrgsState(OrgCodeList);
      })
      .catch((error) => console.log(error));

      return () => console.log("unmount")
  },[]);

  const onClickRowHandler = (event, value) => {
    console.log("Click Row");
    console.log(event);
    setDefaultOrg(value)
  };

  let Table = null;
  if (orgs.length > 0) {
    Table = <TableHover data={orgs} clickedRow={onClickRowHandler} closedComponentType="modal"></TableHover>;
  }

  return (
    <div
      className="modal fade my-modal-header-primary"
      id="ModalOrgCode"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="ModalOrgCodeLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="ModalOrgCodeLabel">
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
            {Table}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgCode;
