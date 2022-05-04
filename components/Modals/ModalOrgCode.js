import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DataTable from "react-data-table-component";
import ServiceUrl from "../../configs/servicePath";
import * as GIcons from "../../configs/googleicons";
import CircularProgress from "../circularprogress";
import { selectedLkRowStyle } from "../../configs/function";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Lookup = (props) => {
  const userInfo = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [orgs, setOrgs] = useState([]);
  const [selectOrg, setSelectOrg] = useState(null);
  const [textSearch, setTextSearch] = useState("");
  const [loadingLookup, setLoadingLookup] = useState(false);

  const columnsOrgCode = [
    {
      name: "Org Code",
      selector: (row) => row.OrgCode,
      wrap: true,
    },
    {
      name: "Org Name",
      selector: (row) => row.OrgName,
      wrap: true,
    },
  ];

  // useEffect(() => {
  //   setLoadingLookup(true);
  //   axios
  //     .post(ServiceUrl.urlGetUserOrgList, null, {
  //       headers: headers,
  //       params: { username: userInfo.username },
  //     })
  //     .then((response) => {
  //       let OrgCodeList = [];
  //       response.data.forEach((org) => {
  //         let orgObj = {
  //           OrgCode: org.orgCode,
  //           OrgName: org.descr,
  //         };
  //         OrgCodeList.push(orgObj);
  //       });
  //       console.log(OrgCodeList);
  //       setLoadingLookup(false);
  //       setOrgs(OrgCodeList);
  //     })
  //     .catch((error) => console.log(error));

  //     return () => console.log("unmount")
  // },[]);

  useEffect(() => {
    if (props.Open) {
      setTextSearch("");
      setLoadingLookup(true);
      axios
        .post(ServiceUrl.urlBase + "GetUserOrgList", {
          username: userInfo.username,
          textSearch: textSearch,
          connection: userInfo.connection,
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
          setLoadingLookup(false);
          setOrgs(OrgCodeList);
        })
        .catch((error) => console.log(error));
      orgs.forEach((org) => {
        org.toggleSelected = false;
      });
    }
  }, [props.Open]);

  const handleOrgRowClicked = (row) => {
    const data = orgs.map((item) => {
      if (item.OrgCode === row.OrgCode) {
        setSelectOrg(item);
        return {
          ...item,
          toggleSelected: !item.toggleSelected,
        };
      }
      return {
        ...item,
        toggleSelected: false,
      };
    });

    setOrgs(data);
  };
  const handleOrgRowDoubleClicked = (row) => {
    orgs.forEach((item) => {
      if (item.OrgCode === row.OrgCode) {
        props.OnOk(item)
      }
    });
 };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setTextSearch(value);
  };

  const handleSearchLkData = () => {
    const requestObj = {
      textSearch: textSearch,
    };
    setLoadingLookup(true);
    axios
      .post(ServiceUrl.urlBase + "GetUserOrgList", {
        username: userInfo.username,
        textSearch: textSearch,
        connection: userInfo.connection,
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
        setLoadingLookup(false);
        setOrgs(OrgCodeList);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Dialog
      open={props.Open}
      onClose={props.OnCancel}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="scroll-dialog-title">Org Code</DialogTitle>
      <DialogContent dividers>
        <div className="row">
          <div className="col-sm-12 col-md-4"></div>
          <div
            className="col-sm-12 col-md-8 form-row Label-Inline"
            style={{ margin: "0px 0px 20px 0px" }}
          >
            <label
              htmlFor="search"
              className="col-md-3"
              style={{ marginBottom: "0px" }}
            >
              Search
            </label>
            <input
              type="text"
              name="search"
              className="col-md-7 form-control form-control-sm"
              value={textSearch}
              onChange={handleSearchChange}
            />
            <button
              className="ml-2 btn btn-icon-only btn-primary-theme btn-form"
              style={{ border: "none" }}
              onClick={handleSearchLkData}
            >
              <GIcons.IconSearch />
              {/* <FontAwesomeIcon
                icon={["fas", "search"]}
                style={{ width: "15px"}}
              /> */}
            </button>
          </div>
        </div>
        <DataTable
          columns={columnsOrgCode}
          data={orgs}
          conditionalRowStyles={selectedLkRowStyle}
          onRowClicked={handleOrgRowClicked}
          onRowDoubleClicked={handleOrgRowDoubleClicked}
          progressPending={loadingLookup}
          progressComponent={<CircularProgress />}
          persistTableHead
          pagination
          noHeader
          striped
        />
      </DialogContent>
      <DialogActions>
        <button
          className="btn btn-primary-theme"
          onClick={() => props.OnOk(selectOrg)}
        >
          OK
        </button>
        <button className="btn btn-cancel-theme" onClick={props.OnCancel}>
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default Lookup;
