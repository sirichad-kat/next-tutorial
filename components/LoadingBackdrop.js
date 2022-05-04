import React from "react";
import Backdrop from "@material-ui/core/Backdrop";

 const LoadingBackdrop = (props) => {   
    const txtLoading = props.text ? props.text : "Loading...";
    return (
      <Backdrop
        open={props.open}
        className="backdrop backdrop-loading"
      >
        {/* <CircularProgress color="inherit" /> */}
        <div className="Loading">
          <label>{txtLoading}</label>
          <div className="ball-pulse">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </Backdrop>
    );
  } 

export default LoadingBackdrop;
