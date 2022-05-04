import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Menu, Item, useContextMenu } from "react-contexify";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as UiConfigAction from "../../redux/actions/UiConfigAction";
import * as NavigateAction from "../../redux/actions/NavigateAction";

const useStylesList = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const useStylesListItem = makeStyles(() => ({
  root: {
    paddingTop: "2px",
    paddingBottom: "2px",
  },
  primary: {
    fontSize: "14px",
  },
}));

const SidebarMenu = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const classesList = useStylesList();
  const classesListItem = useStylesListItem();
  const [selectedProgram, setSelectedProgram] = useState(null);
  const MENU_ID = "MENUOPTION";
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  const displayMenu = (e) => {
    // pass the item id so the `onClick` on the `Item` has access to
    show(e, { props: { programId: e.currentTarget.id } });
  };

  const handleItemClick = () => {
    console.log("handleItemClick");
  };

  const handleClickMenuNavigate = (menu) => {
    const destination = menu.subfolder
      ? `/${menu.subfolder}/${menu.programId}`
      : `/${menu.programId}`;
    router.push(destination);
    dispatch(UiConfigAction.setProgramName(menu.descr));
    dispatch(UiConfigAction.setProgramId(menu.programId));    
    dispatch(NavigateAction.setDataNavigateObj(null));
    dispatch(NavigateAction.setCriteriaObj(null));
    props.onOpen();
  };

  const genChildMenuSideBar = (allmenus, onMenuClick, selectedProgram) => {
    const childmenudetail = allmenus.map((menu) => {
      let child = null;
      let hasChildren = false;
      if (menu.children != null && menu.children.length > 0) {
        hasChildren = true;
        child = genChildMenuSideBar(
          menu.children,
          onMenuClick,
          selectedProgram
        );
      }

      let menuComponent = null;
      if (menu.programIcon === null) {
        menu.programIcon = "fas fa-caret-square-right";
      }
      if (!hasChildren && menu.programId !== null && menu.programId !== "") {
        menuComponent = (
          <ListItem
            button
            className={classesListItem.root}
            key={menu.menuId}
            onClick={() => handleClickMenuNavigate(menu)}
            onContextMenu={displayMenu}
          >
            <ListItemIcon
              style={{ minWidth: "20px", width: "30px", paddingRight: "10px" }}
            >
              <FontAwesomeIcon
                icon={menu.programIcon.replace("fa-", "").split(" ")}
                size="xs"
              />
            </ListItemIcon>
            <ListItemText
              primary={menu.descr}
              primaryTypographyProps={{ className: classesListItem.primary }}
            />
          </ListItem>
          // <li
          //   key={menu.menuId}
          //   className="LastChild"
          //   id={menu.programId}
          //   onContextMenu={displayMenu}
          // >
          //   <Link to={"/" + menu.programId} onClick={() => onMenuClick(true)}>
          //     <i className={"metismenu-icon " + menu.programIcon} />
          //     {menu.descr}
          //   </Link>
          //   {child}
          // </li>
        );
      } else {
        menuComponent = (
          <div key={menu.menuId}>
            <ListItem
              button
              className={classesListItem.root}
              key={menu.menuId}
              onClick={() => props.onCollapse(menu)}
            >
              <ListItemIcon
                style={{
                  minWidth: "20px",
                  width: "30px",
                  paddingRight: "10px",
                }}
              >
                <FontAwesomeIcon
                  icon={menu.programIcon.replace("fa-", "").split(" ")}
                  size="xs"
                />
              </ListItemIcon>
              <ListItemText
                primary={menu.descr}
                primaryTypographyProps={{ className: classesListItem.primary }}
              />
              {menu.isClicked ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={menu.isClicked} timeout="auto" unmountOnExit>
              {child}
            </Collapse>
          </div>

          // <li key={menu.menuId} className="">
          //   <Link to={location.pathname}>
          //     <i className={"metismenu-icon " + menu.programIcon} />
          //     {menu.descr}
          //     {hasChildren}
          //   </Link>
          //   {child}
          // </li>
        );
      }

      return menuComponent;
    });

    let childmenu = <ul>{childmenudetail}</ul>;
    return childmenu;
  };

  const genMenuSideBar = (allmenus, onMenuClick, selectedProgram) => {
    const Menu = allmenus.map((menu) => {
      let child = null;
      let hasChildren = false;
      if (menu.children != null && menu.children.length > 0) {
        hasChildren = true;
        child = genChildMenuSideBar(
          menu.children,
          onMenuClick,
          selectedProgram
        );
      }

      let menuComponent = null;
      if (menu.programIcon === null) {
        menu.programIcon = "fas fa-caret-square-right";
      }
      if (!hasChildren && menu.programId !== null && menu.programId !== "") {
        menuComponent = (
          <ListItem
            button
            className={classesListItem.root}
            key={menu.menuId}
            id={menu.programId}
            onClick={() => handleClickMenuNavigate(menu)}
            onContextMenu={displayMenu}
          >
            <ListItemIcon
              style={{ minWidth: "20px", width: "30px", paddingRight: "10px" }}
            >
              <FontAwesomeIcon
                icon={menu.programIcon.replace("fa-", "").split(" ")}
                size="xs"
              />
            </ListItemIcon>
            <ListItemText
              primary={menu.descr}
              primaryTypographyProps={{ className: classesListItem.primary }}
            />
          </ListItem>
          // <li
          //   key={menu.menuId}
          //   className="LastChild"
          //   id={menu.programId}
          //   onContextMenu={displayMenu}
          // >
          //   <Link to={"/" + menu.programId} onClick={() => onMenuClick(true)}>
          //     <i className={"metismenu-icon " + menu.programIcon} />
          //     {menu.descr}
          //   </Link>
          //   {child}
          // </li>
        );
      } else {
        menuComponent = (
          <div key={menu.menuId}>
            <ListItem
              button
              className={classesListItem.root}
              key={menu.menuId}
              onClick={() => props.onCollapse(menu)}
            >
              <ListItemIcon
                style={{
                  minWidth: "20px",
                  width: "30px",
                  paddingRight: "10px",
                }}
              >
                <FontAwesomeIcon
                  icon={menu.programIcon.replace("fa-", "").split(" ")}
                  size="xs"
                />
              </ListItemIcon>
              <ListItemText
                primary={menu.descr}
                primaryTypographyProps={{ className: classesListItem.primary }}
              />
              {menu.isClicked ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={menu.isClicked} timeout="auto" unmountOnExit>
              {/* <List component="div" disablePadding>
                <ListItem button className={classesList.nested}>
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary="Starred" />
                </ListItem>
              </List> */}
              {child}
            </Collapse>
          </div>
          // <li key={menu.menuId} className="">
          //   <Link to={location.pathname}>
          //     <i className={"metismenu-icon " + menu.programIcon} />
          //     {menu.descr}
          //     {hasChildren}
          //   </Link>
          //   {child}
          // </li>
        );
      }

      return menuComponent;
    });
    return Menu;
  };

  const Menus = genMenuSideBar(props.menus, props.onMenuClick, selectedProgram);

  const handleSelectProgramFromSearch = (selected, history, onMenuClick) => {
    if (selected !== null) {
      setSelectedProgram(null);
      console.log(selected);
      const destination = selected.subfolder
        ? `/${selected.subfolder}/${selected.programId}`
        : `/${selected.programId}`;
      router.push(destination);
      // const program = { ...selected };
      // setSelectedProgram({ ...program });
      
      dispatch(NavigateAction.setDataNavigateObj(null));
      dispatch(NavigateAction.setCriteriaObj(null));
      props.onOpen();
    }
  };

  return (
    <>
      <Autocomplete
        value={selectedProgram}
        onChange={(event, newValue) => {
          handleSelectProgramFromSearch(newValue, history, props.onMenuClick);
        }}
        // id="combounit"
        size="small"
        placeholder="Search Menu..."
        options={props.programs}
        getOptionLabel={(option) => `${option.descr}`}
        renderInput={(params) => (
          <TextField {...params} size="small" variant="outlined" />
        )}
        style={{ padding: "10px 10px 5px 10px" }}
      />
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classesList.root}
      >
        {Menus}
      </List>
      <Menu id={MENU_ID}>
        <Item id="favorite" onClick={handleItemClick}>
          <FontAwesomeIcon
            icon={["fas", "star"]}
            style={{ color: "#f7b924" }}
          />{" "}
          Add Favorite
        </Item>
      </Menu>
    </>
  );
};

export default SidebarMenu;
