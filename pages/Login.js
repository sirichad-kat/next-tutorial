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
import { isEmpty } from "../configs/function";
import Swal from "sweetalert2";

const LoginPage = () => {
  const router = useRouter();

  const uiconfigStore = useSelector((state) => state.uiconfig);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();
  const onSubmitClick = (loginObj) => {
    dispatch(UserAction.setLoginObj(loginObj));
    dispatch(LoginAction.login());
  };

  const [loading, setLoading] = useState(false);
  const [connectionList, setConnectionList] = useState([]);
  const [disable, setDisable] = useState(false);
  const [isErr, setIsErr] = useState(false);
  const [input, setInput] = useState({
    username: "",
    password: "",
    language: "ENG",
    connection: "",
  });

  const [uiconfig, setUIConfig] = useState({
    classfocusUser: false,
    classfocusPass: false,
    classfocusLang: false,
  });

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    console.log("login onload");
    console.log(localStorage);
    if (!isEmpty(localStorage.getItem("IsSso")) && localStorage.IsSso === "Y") {
      console.log("sso on login");
      ValidateSso();
    } else {
      dispatch(UiConfigAction.setShowLoadingBackdrop(false));
      axios
        .post(ServiceUrl.urlAuthen + "GetConnectionList", {})
        .then((response) => {
          // console.log(response.data);
          const data = response.data;
          setConnectionList(data);
          if (data.length > 0) {
            setInput({ ...input, connection: data[0] });
            if (data.length === 1) {
              setDisable(true);
            } else {
              setDisable(false);
            }
          }
        })
        .catch((error) => console.log(error));

      return () => {
        dispatch(UiConfigAction.setShowLoadingBackdrop(false));
      };
    }
  }, []);

  const ValidateSso = () => {
    if (
      !isEmpty(localStorage.Token) &&
      !isEmpty(localStorage.Connection) &&
      !isEmpty(localStorage.UserName) &&
      !isEmpty(localStorage.DefaultProgram)
    ) {
      let jData = {};
      jData.UserName = localStorage.UserName;
      jData.Token = localStorage.Token;
      jData.Connection = localStorage.Connection;
      jData.DefaultProgram = localStorage.DefaultProgram;
      axios
        .post(ServiceUrl.urlBase + "ValidateSso", jData)
        .then((response) => {
          console.log("validate sso completed");
          // console.log(response.data);
          if (response.data.isValid) {
            const inputobj = {
              username: response.data.userName,
              language: "eng",
              orgCode: response.data.orgCode,
              connection: response.data.connection,
              userRole: response.data.userRole,
              token: response.data.token,
            };

            onSubmitClick(inputobj);
            if (!isEmpty(response.data.programPath)) {
              router.push(
                `/${response.data.programPath}/${localStorage.DefaultProgram}`
              );
            } else {
              router.push("/");
            }
          } else {
            Swal.fire({ title: response.data.message, icon: error });
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleChange = (e) => {
    const { target } = e;
    const { name } = target;
    const value = target.value;
    // console.log(value);
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleFocus = (e) => {
    const { target } = e;
    const { name } = target;
    let focus = "";

    switch (name) {
      case "username":
        focus = "classfocusUser";
        break;
      case "password":
        focus = "classfocusPass";
        break;
      case "language":
        focus = "classfocusLang";
        break;
      case "connection":
        focus = "classfocusLang";
        break;
      default:
        focus = "";
        break;
    }
    setUIConfig({
      ...uiconfig,
      [focus]: true,
    });
  };

  const handleBlur = (e) => {
    const { target } = e;
    const { name } = target;
    const value = target.value;
    let isFocused = value !== null && value !== "" ? true : false;
    let focus = "";

    switch (name) {
      case "username":
        focus = "classfocusUser";
        break;
      case "password":
        focus = "classfocusPass";
        break;
      case "language":
        focus = "classfocusLang";
        break;
      default:
        focus = "";
        break;
    }
    setUIConfig({
      ...uiconfig,
      [focus]: isFocused,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(input.username);
    // console.log(input.password);
    // console.log(input.language);
    dispatch(UiConfigAction.setProgramName(""));
    dispatch(UiConfigAction.setShowMenuSidebar(true));
    const loginObj = {
      connection: input.connection,
      username: input.username,
      password: input.password,
      lang: input.language,
    };
    // setLoading(true);
    dispatch(UiConfigAction.setShowLoadingBackdrop(true));
    axios
      .post(ServiceUrl.urlAuthen + "Authenticate", loginObj)
      .then((response) => {
        // console.log("pass");
        // console.log(response.data);

        if (response.data.isValid) {
          // setInput({
          //   ...input,
          //   userRole: response.data.userRole,
          //   token: response.data.token,
          // });
          const inputobj = {
            username: response.data.userName,
            language: input.language,
            orgCode: input.orgCode,
            connection: input.connection,
            userRole: response.data.userRole,
            token: response.data.token,
          };

          onSubmitClick(inputobj);

          router.push("/");
        } else {
          // setLoading(false);
          dispatch(UiConfigAction.setShowLoadingBackdrop(false));
          console.log("incorrect");
          setIsErr(true);
        }
      })
      .catch((error) => console.log(error));
  };

  let inputUserClass = ["InputItem"];
  if (uiconfig.classfocusUser) {
    inputUserClass.push("Focus");
  }

  let inputPassClass = ["InputItem"];
  if (uiconfig.classfocusPass) {
    inputPassClass.push("Focus");
  }

  let inputLangClass = ["InputItem", "Focus"];
  return (
    <div>
      <div className="Wave">
        <Image
          alt="LoginBackground"
          src={Images.login_wave}
          height="100%"
          layout="fill"
        ></Image>
      </div>
      <div className="LoginPage">
        <div className="LoginCover">
          <Image alt="LoginPicture" src={Images.login_cover}></Image>
        </div>
        <div
          className="LoginForm"
          style={uiconfigStore.isShowloadingBackdrop ? { zIndex: "-1" } : {}}
        >
          <form>
            <Image
              alt="ProfilePicture"
              src={Images.login_avatar}
              className="ProfilePic"
              width={100}
              height={100}
            ></Image>
            <h2>Welcome</h2>
            <div className={inputUserClass.join(" ")}>
              <div className="icon">
                <FontAwesomeIcon icon={["fas", "user"]} />
              </div>
              <div className="textinput">
                <label className="Label">Username</label>
                <input
                  name="username"
                  type="text"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={handleChange}
                ></input>
              </div>
            </div>
            <div className={inputPassClass.join(" ")}>
              <div className="icon">
                <FontAwesomeIcon icon={["fas", "lock"]} />
              </div>
              <div className="textinput">
                <label className="Label">Password</label>
                <input
                  name="password"
                  type="password"
                  autoComplete="off"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={handleChange}
                ></input>
              </div>
            </div>
            <div className={inputLangClass.join(" ")}>
              <div className="icon">
                <FontAwesomeIcon icon={["fas", "globe-asia"]} />
              </div>
              <div className="textinput">
                <label className="Label">Language</label>
                <select
                  name="language"
                  defaultValue={input.language}
                  onChange={handleChange}
                >
                  <option key="ENG" value="ENG">
                    English
                  </option>
                  <option key="THA" value="THA">
                    Thai
                  </option>
                </select>
              </div>
            </div>
            <div className={inputLangClass.join(" ")}>
              <div className="icon">
                <FontAwesomeIcon icon={["fas", "home"]} />
              </div>
              <div className="textinput">
                <label className="Label">Connection</label>
                <select
                  name="connection"
                  defaultValue={input.connection}
                  onChange={handleChange}
                  disabled={disable}
                >
                  {connectionList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  {/* <option value="DEV">DEV</option>
                  <option value="UAT">UAT</option> */}
                </select>
              </div>
            </div>
            {isErr ? (
              <label
                style={{
                  color: "#dc3545",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Username or password is incorrect !!!
              </label>
            ) : null}
            <button onClick={handleSubmit}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
