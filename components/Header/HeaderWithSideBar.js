import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Image from "next/image";
import Button from "@material-ui/core/Button";
import SidebarMenu from "../Menu/SidebarMenu";
import SettingsMenu from "./SettingsMenu";
import DropdownLanguage from "./DropdownLanguage";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import ServiceUrl from "../../configs/servicePath";
import * as LoginAction from "../../redux/actions/LoginAction";
import * as UiConfigAction from "../../redux/actions/UiConfigAction";
import * as UserAction from "../../redux/actions/UserAction";
import * as NavigateAction from "../../redux/actions/NavigateAction";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  appFrame: {
    zIndex: 1,
    overflow: "hidden",
  },
  appBar: {
    position: "fixed",
    width: "100%",
    backgroundColor: "#34c5b2",
  },
  menuButton: {
    marginLeft: theme.spacing(13),
    [theme.breakpoints.down("md")]: {
      marginLeft: theme.spacing(0),
    },
  },
  drawerPaper: {
    position: "fixed",
    width: drawerWidth,
    borderRadius: 0,
    borderTop: "none",
    borderBottom: "none",
    top: theme.spacing(8), // push content down to fix scrollbar position
    height: `calc(100% - ${theme.spacing(8)}px)`, // subtract appbar height
  },
  drawerContent: {
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
  },
  contentWrapper: {
    marginTop: "64px",
    flexGrow: 1,
    padding: "0px",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    maxWidth: `100vw`,
    minHeight: `100vh`,
    backgroundColor: "#F5F5F5",
    // [theme.breakpoints.up("md")]: {
    //    maxWidth: `99vw`
    // }
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    maxWidth: `100vw`,
    [theme.breakpoints.up("md")]: {
      maxWidth: `calc(100vw - ${drawerWidth}px)`,
    },
  },
  "content-left": {
    [theme.breakpoints.down("md")]: {
      marginLeft: 0,
    },
    marginLeft: drawerWidth,
  },
  title: {
    paddingLeft: theme.spacing(2),
    flexGrow: 1,
    color: "white",
  },
  usernameLabel: {
    color: "white",
    lineHeight: 1.2,
    fontWeight: "bold",
  },
  Toolbar: {
    [theme.breakpoints.down("md")]: {
      justifyContent: "space-between",
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0),
    },
  },
  logo: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  logoWithHamburger: {
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down("md")]: {
      flexDirection: "row-reverse",
    },
  },
}));

const StyledButton = withStyles((theme) => ({
  label: {
    color: "white",
    fontSize: "10px",
  },
  root: {
    [theme.breakpoints.up("md")]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
}))(Button);

export default function HeaderWithSideBar(props) {
  const { children } = props;
  const classes = useStyles();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const userInfo = useSelector((state) => state.user);
  const uiconfigStore = useSelector((state) => state.uiconfig);
  const historyPath = useSelector((state) => state.navigate.historyPath);
  const dispatch = useDispatch();

  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [menudata, setMenuData] = useState({
    ungroupMenus: [],
    menus: [],
    programs: [],
  });

  useEffect(() => {
    console.log("Setting page name");
    console.log("Ungroup menu");
    console.log(menudata.ungroupMenus);
    const currentPage = menudata.ungroupMenus.filter(
      (item) =>
        item.programId ===
        router.pathname
          .split("/")
          .filter((e) => e)
          .reverse()[0]
    );
    console.log("currentPage", currentPage);
    // if (currentPage.length > 0) {
    //   dispatch(UiConfigAction.setProgramName(currentPage[0].descr));
    //   dispatch(UiConfigAction.setProgramId(currentPage[0].programId));
    // } else {
    //   dispatch(UiConfigAction.setProgramName(""));
    //   dispatch(UiConfigAction.setProgramId(""));
    // }
  }, [menudata.ungroupMenus]);

  useEffect(() => {
    console.log(router)
    if (router.pathname === "/") {
      dispatch(UiConfigAction.setProgramName(""));
      dispatch(UiConfigAction.setProgramId(""));
      dispatch(NavigateAction.setDataNavigateObj(null));
      dispatch(NavigateAction.setDataNavigateReportObj(null));
      dispatch(NavigateAction.setTempObj(null));
      dispatch(NavigateAction.setCriteriaObj(null));
      dispatch(NavigateAction.setShowDetailPage(false))
      dispatch(NavigateAction.setStateProgram("STATE_I"))
      dispatch(NavigateAction.setIsNew(false))
      setOpen(true);
    } else {
      if (historyPath !== router.pathname) {
        dispatch(NavigateAction.setShowDetailPage(false))
        dispatch(NavigateAction.setStateProgram("STATE_I"))
        dispatch(NavigateAction.setIsNew(false))
      }
      let programName = "";
      let programId = "";

      const pathName = router.pathname.substr(router.pathname.lastIndexOf('/') + 1, router.pathname.length - 1);
      const requestObj = {
        connection: userInfo.connection,
        lang: userInfo.language,
        path: pathName,
      };

      axios
        .post(ServiceUrl.urlBase + "FindMenuByPath", requestObj)
        .then((response) => {
          console.log(response.data)
          programName = response.data.descr;
          programId = response.data.programId;
          dispatch(UiConfigAction.setProgramName(programName));
          dispatch(UiConfigAction.setProgramId(programId));
        })
        .catch((error) => {
          console.log(error);
          dispatch(UiConfigAction.setShowLoadingBackdrop(false));
        });
      setOpen(false);
    }
    dispatch(NavigateAction.setHistoryPath(router.pathname));
  }, [router.pathname]);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const buildGroupMenu = (MenusList) => {
    let ChildMenus = [];
    MenusList.forEach((menu) => {
      let children = [];
      MenusList.forEach((m) => {
        if (menu.menuId === m.parentId) {
          children.push(m);
          ChildMenus.push(m.menuId);
        }
      });
      menu.children = children;
    });

    ChildMenus.forEach((menuid) => {
      let index = MenusList.findIndex((m) => m.menuId === menuid);
      if (index > -1) {
        MenusList.splice(index, 1);
      }
    });

    return MenusList;
  };

  const handleClickMenuCollapse = (menu) => {
    const menuList = [];
    menudata.ungroupMenus.forEach((menu) => {
      menuList.push(menu);
    });

    menuList.forEach((m) => {
      if (m.menuId === menu.menuId) {
        m.isClicked = !m.isClicked;
      }
    });
    const groupMenus = buildGroupMenu(menuList);
    setMenuData({
      ...menudata,
      menus: groupMenus,
    });
  };

  useEffect(() => {
    let MenusList = [];
    let programList = [];

    MenusList.push({ menuId: 1, parentId: 0, programIcon: "fas fa-caret-square-right", isClicked: false, programId: "SSLABM12100", programName: "SSLABM12100", descr: "Parameter Information", subfolder: "tutorial", filePath: "SSLABM12100", reactYn: "Y", orderIdx: 1 });

    MenusList.push({ menuId: 2, parentId: 0, programIcon: "fas fa-caret-square-right", isClicked: false, programId: "SSLABM00700", programName: "SSLABM00700", descr: "Item", subfolder: "tutorial", filePath: "SSLABM00700", reactYn: "Y", orderIdx: 2 });

    programList.push(...MenusList);



    const groupMenus = buildGroupMenu(MenusList);
    setMenuData({
      ungroupMenus: MenusList,
      menus: groupMenus,
      programs: programList,
    });


    // if (userInfo.orgCode && userInfo.orgCode !== "") {
    //   const reqMenu = {
    //     ...userInfo,
    //     lang: userInfo.language,
    //     InternetYn: ServiceUrl.InternetYn
    //   };
    //   axios
    //     .post(ServiceUrl.urlBase + "GetMenuList", reqMenu)
    //     .then((response) => {
    //       let data = [...response.data];
    //       let MenusList = [];
    //       let programList = [];
    //       data.forEach((menu) => {
    //         // let m = { ...menu };
    //         menu.programIcon =
    //           menu.programIcon !== "" && menu.programIcon !== null
    //             ? menu.programIcon
    //             : "fas fa-caret-square-right";
    //         menu.isClicked = false;
    //         MenusList.push(menu);
    //         if (menu.programId !== null && menu.programId !== "") {
    //           programList.push({ ...menu });
    //         }
    //       });

    //       const groupMenus = buildGroupMenu(MenusList);
    //       setMenuData({
    //         ungroupMenus: data,
    //         menus: groupMenus,
    //         programs: programList,
    //       });
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       if (error.response && error.response.status === 401) {
    //         dispatch(LoginAction.logout());
    //         router.push("/Login");
    //       }
    //     });
    // }
  }, [userInfo.orgCode]);

  //onMount
  useEffect(() => {
    dispatch(UiConfigAction.setShowLoadingBackdrop(false));
    axios
      .post(ServiceUrl.urlBase + "GetUserDefaultOrg", {
        username: userInfo.username,
        connection: userInfo.connection,
      })
      .then((response) => {
        dispatch(UserAction.setOrgCode(response.data.orgCode));
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className={classes.appFrame}>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        elevation={0}
        PaperProps={{
          variant: "outlined",
        }}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerContent}>
          <SidebarMenu
            menus={menudata.menus}
            programs={menudata.programs}
            onCollapse={handleClickMenuCollapse}
            open={open}
            onOpen={handleDrawerOpen}
          ></SidebarMenu>
        </div>
      </Drawer>
      <AppBar className={classes.appBar} elevation={0}>
        <Toolbar className={classes.Toolbar}>
          <div className={classes.logoWithHamburger}>
            <div className={classes.logo}>
              <Image
                src="/Images/Content/labicon.png"
                alt="smartlab-logo"
                width="76"
                height="38"
              />
            </div>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
          </div>
          {mdUp && (
            <Typography variant="h5" className={classes.title}>
              {uiconfigStore.programName && (
                <>
                  <IconButton
                    className="btn-transparent text-white"
                    onClick={() => {
                      router.push("/");
                    }}
                  >
                    <ChevronLeftIcon style={{ fontSize: 40 }} />
                  </IconButton>
                </>
              )}
              {uiconfigStore.programName || ""}
            </Typography>
          )}
          <div>
            <DropdownLanguage />
            <StyledButton
              aria-label="Settings"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              startIcon={<AccountCircle style={{ fontSize: 40 }} />}
              endIcon={<ExpandMoreIcon />}
            >
              {mdUp && (
                <Typography
                  variant="subtitle1"
                  classes={{
                    subtitle1: classes.usernameLabel,
                  }}
                >
                  {userInfo.orgCode} | {userInfo.username}
                </Typography>
              )}
            </StyledButton>
          </div>
          <SettingsMenu anchorEl={anchorEl} onCloseFn={handleClose} />
        </Toolbar>
      </AppBar>
      <div
        className={clsx(classes.contentWrapper, {
          [classes.contentShift]: open,
          [classes[`content-left`]]: open,
        })}
      >
        {children}
      </div>
    </div>
  );
}
