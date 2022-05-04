import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as GIcons from "../../configs/googleicons";
import { useSelector } from "react-redux";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import ServiceUrl from "../../configs/servicePath";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    transformOrigin={{ vertical: "top", horizontal: "center" }}
    {...props}
  />
));

const AdjustBtn = (props) => {
  const userInfo = useSelector((state) => state.user);
  const { onClickEvent, buttonDisabled, isDisabled } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [allMenu, setAllMenu] = useState([]);

  useEffect(() => {
    axios
      .post(ServiceUrl.urlLabMgt + "GetAdjustMenu", {
        connection: userInfo.connection,
        username: userInfo.username,
        orgCode: userInfo.orgCode,
        lang: userInfo.language,
      })
      .then((res) => {
        setAllMenu([...res.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <button
        id="btnAdjust"
        key="Adjust"
        className="mr-8px btn btn-with-icon btn-toolbar"
        onClick={handleClick}
        disabled={
          buttonDisabled.some((b) => b === "ALL" || b === "ADJUST") &&
          isDisabled
        }
      >
        <GIcons.IconAdjust />
        <span id="lblBtnAdjust" className="buttonName">
          Adjust
        </span>
        <GIcons.IconExpandMore
          style={{ marginRight: "0px", marginLeft: "10px" }}
        />
      </button>
      <StyledMenu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {allMenu &&
          allMenu.map((menu, index) => (
            <MenuItem key={index} onClick={() => onClickEvent(menu)}>
              <ListItemText primary={menu.descr} />
            </MenuItem>
          ))}
      </StyledMenu>
    </>
  );
};

export default AdjustBtn;
