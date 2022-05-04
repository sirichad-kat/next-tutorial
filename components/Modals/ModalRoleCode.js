import React, { useState, useEffect} from "react";
import axios from "axios";
import {useSelector, useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DataTable from "react-data-table-component";
import * as UserAction from "../../redux/actions/UserAction";
import ServiceUrl from "../../configs/servicePath";
import * as GIcons from "../../configs/googleicons";
import CircularProgress from "../circularprogress";
import Grid from '@material-ui/core/Grid';
import { selectedLkRowStyle } from "../../configs/function";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Lookup = (props) => {
  const userInfo = useSelector(state => state.user)
  const dispatch = useDispatch();

  const setDefaultOrg = (org) => {
    dispatch(UserAction.setOrgCode(org));
  };

  const [rolecodelist, setRoleCodeList] = useState([]);
  const [selectRoleCode, setSelectRoleCode] = useState(null);  
  const [textSearch, setTextSearch] = useState("");
  const [loadingLookup, setLoadingLookup] = useState(false);

  const columnsOrgCode = [
    {
      name: "Role Code",
      selector: row => row.roleCode,
      wrap: true,
    },  
    {
        name: "Role Name",
        selector: row => row.roleName,
        wrap: true,
      },   
  ];
 

  useEffect(() => {
    const req = {
        connection: userInfo.connection,
      };
    if(props.Open){
      setTextSearch("");
      setLoadingLookup(true);
    axios
      .post(ServiceUrl.urlBase + "GetRoleCodeList" ,req) 
      .then((response) => {
         const datalist = response.data;
        
        setLoadingLookup(false);
        setRoleCodeList(datalist);
      })
      .catch((error) => console.log(error)); 
    }
    
  }, [props.Open])

  const handleOrgRowClicked = (row) => {
    const data = rolecodelist.map((item) => {
      if (item.roleCode === row.roleCode) {
        setSelectRoleCode(item);
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

    setRoleCodeList(data);
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setTextSearch(value);
  };

  const handleSearchLkData = () => {
    const requestObj = {
      textSearch: textSearch,
      connection: userInfo.connection,
    };
    setLoadingLookup(true);
    axios
      .post(ServiceUrl.urlBase + "GetRoleCodeList" , requestObj)
      .then((response) => {
        const datalist = response.data;
        // let OrgCodeList = [];
        // response.data.forEach((org) => {
        //   let orgObj = {
        //     OrgCode: org.orgCode,
        //     OrgName: org.descr,
        //   };
        //   OrgCodeList.push(orgObj);
        // });
        // console.log(OrgCodeList);
        setLoadingLookup(false);
        setRoleCodeList(datalist);
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
      <DialogTitle id="scroll-dialog-title">Role Code</DialogTitle>
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
              {/* <FontAwesomeIcon icon={["fas", "search"]} /> */}
            </button>
          </div>
        </div>
      <DataTable
          columns={columnsOrgCode}
          data={rolecodelist}
          conditionalRowStyles={selectedLkRowStyle}
          onRowClicked={handleOrgRowClicked}
          progressPending={loadingLookup}
          progressComponent={<CircularProgress />}
          persistTableHead
          pagination
          noHeader
          striped
        />
      </DialogContent>
      <DialogActions>
        <button className="btn btn-primary-theme" onClick={() => props.OnOk(selectRoleCode)}>
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
