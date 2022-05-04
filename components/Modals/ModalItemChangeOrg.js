import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
// import "antd/dist/antd.css";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import * as UserAction from "../../redux/actions/UserAction";
import ServiceUrl from "../../configs/servicePath";
import Icons from "../../configs/icons";
import CircularProgress from "../circularprogress";
import ModalLookUp from "../../components/Modals/ModalLookUp";
import * as GIcons from "../../configs/googleicons";

const Lookup = (props) => {
  const userInfo = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [items, setItems] = useState([]);
  const [curRow, setCurRow] = useState(null);
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [openModalOrg, setOpenModalOrg] = useState(false);

  const columnsChangeOrg = [
    {
      name: "Item",
      selector: row => row.item,
      wrap: true,
      maxWidth: "20%"
    },
    {
      name: "Current Org",
      selector: row => row.orgCode,
      wrap: true,
      maxWidth: "40%",
      cell: (row) => <div data-tag="allowRowEvents" >{row.orgDescr ? row.orgCode + " - " + row.orgDescr : row.orgCode}</div>
    },
    {
      name: "New Org",
      selector: row => row.newOrgCode,
      wrap: true,
      maxWidth: "40%",
      cell: (row) => (
        <div className="input-group input-group-sm">
          <input
            id={`txtNewOrgCode_${row.item}_${row.orgCode}`}
            type="text"
            name="newOrgCode"
            className="form-control form-control-sm"
            value={row.newOrgName ? row.newOrgCode + " - " + row.newOrgName : row.newOrgCode}
            disabled
          />
          <div className="input-group-append">
            <button
              id={`btnNewOrgCode_${row.item}_${row.orgCode}`}
              className="btn btn-icon-only btn-icon-lookup btn-form"
              onClick={() => handleOpenModalOrg(row)}
            >
              <GIcons.IconSearch />
              {/* <i className="fas fa-search" /> */}
            </button>
          </div>
        </div>
      ),
    },
  ];

  // Modal
  const handleOpenModalOrg = (row) => {
    console.log(row);
    setCurRow(row);
    setOpenModalOrg(true);
  };

  const handleOkModalOrg = (item) => {
    setOpenModalOrg(false);
    console.log(items);
    console.log(curRow);
    const newdetail = items.map((d) => {
      if (d.item === curRow.item && d.orgCode === curRow.orgCode) {
        d.newOrgCode = item.code; 
        d.newOrgName = item.name; 
        return {...d};
      }
      return { ...d };
    });
    console.log(newdetail)
    setItems(newdetail);
  };

  const handleCloseModalOrg = () => {
    setOpenModalOrg(false);
  };
  //--------

  useEffect(() => {
    if (props.open) {
      setItems(props.data);
    }
  }, [props.open]);

  const handleSameOrgCode = () => {
    console.log(items[0].newOrgCode)
    console.log(items)
    console.log(ServiceUrl.urlOrder)
    if(items[0].newOrgCode === ""){
      Swal.fire({
        icon: "warning",
        title: "Invalid",
        text: "Please select new org code in the first row.",
        confirmButtonColor: "#16aaff",
        confirmButtonText: "OK",
      });      
    }
    else{
      const reqSame = {
        connection: userInfo.connection,
        userName: userInfo.username,
        orgCode: userInfo.orgCode,
        changedOrgCode: items[0].newOrgCode,
        items: items
      };
      axios
        .post(ServiceUrl.urlOrder + "FindOrgCodeByItem", reqSame)
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => console.log(error));
    }    
  };

  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        onClose={props.onCancel}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="scroll-dialog-title">Change Org</DialogTitle>
        <DialogContent dividers>
          <div className="row">
            <div className="col-sm-12 col-md-12 mb-2">
              <button
                className="btn btn-with-icon btn-outline-primary-theme"
                onClick={handleSameOrgCode}
              >
                {/* <img
                  alt=""
                  src={Icons.same}
                  style={{ height: "16px", width: "16px" }}
                ></img> */}
                <GIcons.IconClone />
                <span className="ml-1">Same Org</span>
              </button>
            </div>
          </div>
          <DataTable
            columns={columnsChangeOrg}
            data={items} 
            progressPending={loadingLookup}
            progressComponent={<CircularProgress />}
            persistTableHead
            // pagination
            noHeader
            striped
          />
        </DialogContent>
        <DialogActions>
          <button
            id="btnOkChangeOrg"
            className="btn btn-primary-theme"
            onClick={() => props.onOk(items)}
          >
            <span id="lblBtnOkChangeOrg">OK</span>
          </button>
          <button id="btnCloseChangeOrg" className="btn btn-cancel-theme" onClick={props.onCancel}>
            <span id="lblBtnCloseChangeOrg">Cancel</span>
          </button>
        </DialogActions>
      </Dialog>
      <ModalLookUp
        Open={openModalOrg}
        OnOk={handleOkModalOrg}
        OnCancel={handleCloseModalOrg}
        title="Org Code"
        urlGetData = {ServiceUrl.urlOrder}
        serviceName="GetOrgCodeByItem"
        lookupKey="code"
        reqObj={{orgCode: userInfo.orgCode, diseaseId: curRow ? curRow.item : ""}}
        columnList={[
          {
            name: "Org Code",
            selector: row => row.code,
            wrap: true,
          },
          {
            name: "Org Name",
            selector: row => row.name,
            wrap: true,
          },
        ]}
      />
    </React.Fragment>
  );
};

export default Lookup;
