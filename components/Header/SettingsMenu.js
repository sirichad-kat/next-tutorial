import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Menu from "@material-ui/core/Menu";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ModalOrg from "../Modals/ModalOrgCode";
import * as UserAction from "../../redux/actions/UserAction";
import * as LoginAction from "../../redux/actions/LoginAction";

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

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: "#34c5b2",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
    width: "230px",
  },
}))(MenuItem);

const classes = makeStyles((theme) => ({
  icon: {
    minWidth: "30px",
  },
}));

const SettingsMenu = (props) => {
  const { anchorEl, onCloseFn } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user);
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));

  const [showModal, setShowModal] = useState(false);

  const handleShowModalOrg = (e) => {
    setShowModal(true);
  };

  const handleCloseModalOrg = () => {
    setShowModal(false);
  };

  const onClickOkModalOrg = (org) => {
    setShowModal(false);
    if (org !== null) {
      dispatch(UserAction.setOrgCode(org.OrgCode));
    }
  };

  return (
    <>
      <StyledMenu
        id="menu-appbar"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={onCloseFn}
      >
        {mdDown && (
          <MenuItem disabled>
            <ListItemText primary={`User: ${userInfo.username}`} />
          </MenuItem>
        )}
        {mdDown && (
          <MenuItem disabled>
            <ListItemText primary={`OrgCode: ${userInfo.orgCode}`} />
          </MenuItem>
        )}
        <MenuItem disabled>
          <ListItemText primary="Settings" />
        </MenuItem>
        <StyledMenuItem>
          <ListItemIcon className={classes.icon}>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleShowModalOrg}>
          <ListItemIcon className={classes.icon}>
            <LocationOnIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Org Code" />
        </StyledMenuItem>
        <StyledMenuItem>
          <ListItemIcon className={classes.icon}>
            <ColorLensIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Theme" />
        </StyledMenuItem>
        <StyledMenuItem
          onClick={() => {
            dispatch(LoginAction.logout());
            router.push("/Login");
          }}
        >
          <ListItemIcon className={classes.icon} style={{ color: "red" }}>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Log out" style={{ color: "red" }} />
        </StyledMenuItem>
      </StyledMenu>
      <ModalOrg
        Open={showModal}
        OnOk={onClickOkModalOrg}
        OnCancel={handleCloseModalOrg}
      />
    </>
  );
};

export default SettingsMenu;
