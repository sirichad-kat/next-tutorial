import React, { useState, useEffect} from "react";
import axios from "axios";
import {useSelector, useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DataTable from "react-data-table-component";
import ServiceUrl from "../../configs/servicePath";
import * as GIcons from "../../configs/googleicons";
import CircularProgress from "../circularprogress";
import { selectedLkRowStyle } from "../../configs/function";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Lookup = (props) => {
  const userInfo = useSelector(state => state.user)
  const [anigroup, setAniGroup] = useState([]);
  const [selectAnig, setSelectAnig] = useState(null);  
  const [textSearch, setTextSearch] = useState("");
  const [loadingLookup, setLoadingLookup] = useState(false);

  const columnsAniGroup = [
    {
      name: "Animal Group",
      selector: row => row.aniGid,
      wrap: true,
    },
    {
      name: "Description",
      selector: row => row.descrlist,
      wrap: true,
    }      
  ];
 

  useEffect(() => {
    const req = {
        connection: userInfo.connection,
        lang: userInfo.language,
        local: userInfo.language,
      };
    if(props.Open){
      setTextSearch("");
      setLoadingLookup(true);
    axios
      .post(ServiceUrl.urlBase + "GetAniTypeLookup" ,req)
      .then((response) => {
          console.log(response.data)
         const datalist = response.data;
        setLoadingLookup(false);
        setAniGroup(datalist);
      })
      .catch((error) => console.log(error));
    }
    
  }, [props.Open])

  const handleAnigRowClicked = (row) => {
    const data = anigroup.map((item) => {
      if (item.aniGid === row.aniGid) {
        setSelectAnig(item);
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

    setAniGroup(data);
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setTextSearch(value);
  };

  const handleSearchLkData = () => {
    const requestObj = {
      textSearch: textSearch,
      connection: userInfo.connection,
      lang: userInfo.language,
      local: userInfo.language,
    };
    setLoadingLookup(true);
    axios
      .post(ServiceUrl.urlBase + "GetAniTypeLookup" , requestObj)
      .then((response) => {
        const datalist = response.data;
        setLoadingLookup(false);
        setAniGroup(datalist);
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
        fullWidth>
        <DialogTitle id="scroll-dialog-title">Org Code</DialogTitle>
        <DialogContent dividers>
           <div className="row">
              <div className="col-sm-12 col-md-4"></div>
              <div className="col-sm-12 col-md-8 form-row Label-Inline" style={{ margin: "0px 0px 20px 0px" }}>
                 <label htmlFor="search" className="col-md-3" style={{ marginBottom: "0px" }}>
                    Search
                 </label>
                 <input
                    type="text"
                    name="search"
                    className="col-md-7 form-control form-control-sm"
                    value={textSearch}
                    onChange={handleSearchChange}
                 />
                 <button className="ml-2 btn btn-icon-only btn-primary-theme btn-form" style={{ border: "none" }} onClick={handleSearchLkData}>
                    {/* <FontAwesomeIcon icon={["fas", "search"]}></FontAwesomeIcon> */}
                    <GIcons.IconSearch />
                 </button>
              </div>
           </div>
           <DataTable
              columns={columnsAniGroup}
              data={anigroup}
              conditionalRowStyles={selectedLkRowStyle}
              onRowClicked={handleAnigRowClicked}
              progressPending={loadingLookup}
              progressComponent={<CircularProgress />}
              persistTableHead
              pagination
              noHeader
              striped
           />
        </DialogContent>
        <DialogActions>
           <button className="btn btn-primary-theme" onClick={() => props.OnOk(selectAnig)}>
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
