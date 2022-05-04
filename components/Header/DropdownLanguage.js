import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import * as UserAction from "../../redux/actions/UserAction";
import { useTranslation } from "react-i18next";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import LanguageIcon from "@material-ui/icons/Language";
import IconButton from "@material-ui/core/IconButton";
import ListItemText from "@material-ui/core/ListItemText";
import THFlag from "../../public/Images/Icon/th.svg";
import GBFlag from "../../public/Images/Icon/gb.svg";
import ListItemIcon from "@material-ui/core/ListItemIcon";

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

const DropdownLanguage = () => {
  const { t, i18n } = useTranslation();
  const lang = useSelector((state) => state.user.language);
  const dispatch = useDispatch();
  const setDefaultLang = (Lang) => {
    dispatch(UserAction.setLanguage(Lang));
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickLangHandler = (lang) => {
    setDefaultLang(lang);
    i18n.reloadResources();
    i18n.changeLanguage(lang.toLowerCase(), (err, t) => {
      if (err)
        return console.log("something went wrong loading translation: ", err);
    });
  };

  return (
    <>
      <IconButton style={{ color: "white" }} onClick={handleClick}>
        <LanguageIcon />
      </IconButton>
      <StyledMenu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem disabled>
          <ListItemText primary={`Language Setting`} />
        </MenuItem>
        <MenuItem onClick={() => onClickLangHandler("THA")} selected={lang === "THA"}>
          <ListItemIcon>
            <Image
              src={THFlag}
              alt="Thai"
              width="25"
              height="20"
            />
          </ListItemIcon>
          <ListItemText primary="Thai" />
        </MenuItem>
        <MenuItem onClick={() => onClickLangHandler("ENG")} selected={lang === "ENG"}>
          <ListItemIcon>
            <Image
              src={GBFlag}
              alt="English"
              width="25"
              height="20"
            />
          </ListItemIcon>
          <ListItemText primary="English" />
        </MenuItem>
      </StyledMenu>
    </>
  );
};

export default DropdownLanguage;
