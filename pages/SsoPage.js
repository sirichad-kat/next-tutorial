import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import axios from "axios";
import Images from "../configs/images";
import * as UserAction from "../redux/actions/UserAction";
import * as LoginAction from "../redux/actions/LoginAction";
import * as UiConfigAction from "../redux/actions/UiConfigAction";
import ServiceUrl from "../configs/servicePath";

const SsoPage = () => {
  const userInfo = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(localStorage);
    console.log("load ssopage");

    //  let qs = localStorage.getItem("qs");
    //  let Token = new URLSearchParams(qs).get("Token");
    //  let ProgramCode = new URLSearchParams(qs).get("ProgramCode");
    //  let UserName = new URLSearchParams(qs).get("UserName");
    //  let Lang = new URLSearchParams(qs).get("Lang");
    //  let OrgCode = new URLSearchParams(qs).get("OrgCode");
    //  let Connection = new URLSearchParams(qs).get("Connection");
    //  console.log("sso validate");
    //  console.log(Token);
    // localStorage.setItem("DefaultProgram", ProgramCode);

    //  let jData = {};
    //  jData.UserName = UserName;
    //  jData.Token = Token;
    //  jData.Connection = Connection;
    //  axios
    //    .post(ServiceUrl.urlBase + "ValidateSso", jData)
    //    .then((response) => {
    //      console.log("validate sso");
    //      console.log(response);
    //      if (response.data.isValid) {
    //        const loginObj = {
    //          connection: Connection,
    //          username: UserName,
    //          language: Lang,
    //          userRole: response.data.userRole,
    //          token: response.data.token,
    //        };

    //        console.log("login Object : ");
    //        console.log(loginObj);
    //        dispatch(UserAction.setOrgCode(OrgCode));
    //        dispatch(UserAction.setLoginObj(loginObj));
    //        dispatch(LoginAction.login());

    //       //  history.replace("/");
    //       //  // window.location.reload = true;
    //       //  history.push({
    //       //    pathname: "/" + ProgramCode.toUpperCase(),
    //       //  });
    //        dispatch(UiConfigAction.setShowMenuSidebar(false));
    //      } else {
    //        localStorage.removeItem("qs");
    //        window.location.replace("/Login");
    //        window.location.reload = true;
    //      }
    //    })
    //    .catch((error) => console.log(error));
  }, []);
  return (
    <div>
      <div>
        <img
          alt="Loading"
          src={Images.loading}
          style={{
            textAlign: "center",
            display: "block",
            justifyContent: "center",
            margin: "auto",
          }}
        ></img>
      </div>
      <div style={{ display: "flex", justifyContent: "center", color: "gray" }}>
        {" "}
        Authenticating...
      </div>
    </div>
  );
};

export default SsoPage;
