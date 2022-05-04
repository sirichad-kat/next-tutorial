import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import { Alert } from 'antd';
import { Typography } from "@material-ui/core";
import ServiceUrl from "../../configs/servicePath";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "10px",
  },
  paper: {
    width: 350,
    height: 230,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

const notStd = (a, b) => {
  // console.log(a);
  // console.log(b);
  return a.filter(
    (value) => b.findIndex((s) => s.stdId === value.stdId) === -1
  );
};

const intersectionStd = (a, b) => {
  // console.log(a);
  // console.log(b);
  return a.filter(
    (value) => b.findIndex((s) => s.stdId === value.stdId) !== -1
  );
};

const notItem = (a, b) => {
  // console.log(a);
  // console.log(b);
  return a.filter(
    (value) => b.findIndex((t) => t.diseaseId === value.diseaseId) === -1
  );
};

const intersectionItem = (a, b) => {
  // console.log(a);
  // console.log(b);
  return a.filter(
    (value) => b.findIndex((t) => t.diseaseId === value.diseaseId) !== -1
  );
};

const ScrollDialog = (props) => {
  const userInfo = useSelector((state) => state.user);

  const [value, setValue] = useState("Standard");
  const [showWarning, setShowWarning] = useState(false);
  const classes = useStyles();
  const [checkedStd, setCheckedStd] = useState([]);
  const [checkedItem, setCheckedItem] = useState([]);

  const [availableStd, setAvailableStd] = useState([]);
  const [selectedStd, setSelectedStd] = useState([]);
  const [availableItem, setAvailableItem] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);

  const [checkStandard, setCheckStandard] = useState(true);
  const [checkMaxStandard, setCheckMaxStandard] = useState(true);
  const leftCheckedStd = intersectionStd(checkedStd, availableStd);
  const rightCheckedStd = intersectionStd(checkedStd, selectedStd);
  const leftCheckedItem = intersectionItem(checkedItem, availableItem);
  const rightCheckedItem = intersectionItem(checkedItem, selectedItem);

  useEffect(() => {
    if (props.Open) {
      // console.log(userInfo.token);
      // console.log(ServiceUrl.urlBase + "GetItemStandard");
      setCheckStandard(true)
      setCheckMaxStandard(true)
      axios
        .post(ServiceUrl.urlBase + "GetItemStandard", { connection: userInfo.connection })
        .then((response) => {
          if (response.data.length > 0) {
            setAvailableStd(response.data);
          }
        })
        .catch((error) => console.log(error));

      const reqItem = {
        connection: userInfo.connection,
        lang: userInfo.language,
        orgCode: userInfo.orgCode,
        userName: userInfo.username,
        reportNo: props.Data.reportNo,
        labNo: props.Data.labNo,
      };

      axios
        .post(ServiceUrl.urlBase + "GetItemOfCustomizedReport", reqItem)
        .then((response) => {
          //  
          if (response.data.length > 0) {
            setAvailableItem(response.data);
          }
        })
        .catch((error) => console.log(error));

      setSelectedStd([]);
      setSelectedItem([]);
    } else {
      setAvailableStd([]);
      setSelectedStd([]);
      setAvailableItem([]);
      setSelectedItem([]);
      setCheckedStd([]);
      setCheckedItem([]);
      setValue("Standard");
    }

    return () => console.log("unmount");
  }, [props.Open]);

  useEffect(() => {
    if (selectedStd.length > 5) {
      setShowWarning(true)
    }
    else {
      setShowWarning(false)
    }
  }, [selectedStd.length])

  const handleToggleStd = (value) => () => {
    // console.log(value);
    // console.log(checkedStd);
    const currentIndex = checkedStd.findIndex((s) => s.stdId === value.stdId);
    const newChecked = [...checkedStd];
    // console.log(currentIndex);

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedStd(newChecked);
  };

  const handleToggleItem = (value) => () => {
    // console.log(value);
    // console.log(checkedItem);
    const currentIndex = checkedItem.findIndex(
      (t) => t.itemName === value.itemName
    );
    const newChecked = [...checkedItem];
    // console.log(currentIndex);

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedItem(newChecked);
  };

  const handleAllRightStd = () => {
    setSelectedStd(selectedStd.concat(availableStd));
    setAvailableStd([]);
    setCheckedStd([]);
  };
  const handleCheckedRightStd = () => {
    setSelectedStd(selectedStd.concat(leftCheckedStd));
    setAvailableStd(notStd(availableStd, leftCheckedStd));
    setCheckedStd(notStd(checkedStd, leftCheckedStd));
  };

  const handleCheckedLeftStd = () => {
    setAvailableStd(availableStd.concat(rightCheckedStd));
    setSelectedStd(notStd(selectedStd, rightCheckedStd));
    setCheckedStd(notStd(checkedStd, rightCheckedStd));
  };
  const handleAllLeftStd = () => {
    setAvailableStd(availableStd.concat(selectedStd));
    setSelectedStd([]);
    setCheckedStd([]);
  };
  const handleAllRightItem = () => {
    setSelectedItem(selectedItem.concat(availableItem));
    setAvailableItem([]);
    setCheckedItem([]);
  };
  const handleCheckedRightItem = () => {
    setSelectedItem(selectedItem.concat(leftCheckedItem));
    setAvailableItem(notItem(availableItem, leftCheckedItem));
    setCheckedItem(notItem(checkedItem, leftCheckedItem));
  };
  const handleCheckedLeftItem = () => {
    setAvailableItem(availableItem.concat(rightCheckedItem));
    setSelectedItem(notItem(selectedItem, rightCheckedItem));
    setCheckedItem(notItem(checkedItem, rightCheckedItem));
  };
  const handleAllLeftItem = () => {
    setAvailableItem(availableItem.concat(selectedItem));
    setSelectedItem([]);
    setCheckedItem([]);
  };
  const handleSeqUp = () => {
    const newData = [...selectedStd];
    newData.forEach((dat, index) => {
      dat.index = index;
    });

    checkedStd.forEach((dat) => {
      const curIndex = selectedStd.findIndex((d) => d.stdId === dat.stdId);
      if (curIndex > -1 && curIndex !== 0) {
        newData.forEach((n) => {

          if (n.index === curIndex) {
            n.index = n.index - 1;
          }
          else if (n.index === curIndex - 1) {
            n.index = n.index + 1;
          }
        });
        newData.sort((a, b) => (a.index > b.index) ? 1 : -1);
      }
    });
    setSelectedStd(newData);
  };
  const handleSeqDown = () => {
    const newData = [...selectedStd];
    newData.forEach((dat, index) => {
      dat.index = index;
    });

    checkedStd.forEach((dat) => {
      const curIndex = selectedStd.findIndex((d) => d.stdId === dat.stdId);
      if (curIndex > -1 && curIndex !== selectedStd.length - 1) {
        newData.forEach((n) => {
          if (n.index === curIndex) {
            n.index = n.index + 1;
          }
          else if (n.index === curIndex + 1) {
            n.index = n.index - 1;
          }
        });
        newData.sort((a, b) => (a.index > b.index) ? 1 : -1);
      }
    });
    setSelectedStd(newData);
  };

  const handleCheckStandard = (e) => {
    console.log(e.target.checked);
    setCheckStandard(e.target.checked)
  };

  const handleCheckMaxStandard = (e) => {
    console.log(e.target.checked);
    setCheckMaxStandard(e.target.checked)
  };

  const genReport = () => {
    const reqObj = {
      OrgCode: userInfo.orgCode,
      LabNo: props.Data.labNo,
      ReportNo: props.Data.reportNo,
      Lang: userInfo.language,
      UserName: userInfo.username,
      StandardList: selectedStd,
      ItemExcludeList: selectedItem,
      checkStandard: checkStandard,
      checkMaxStandard: checkMaxStandard,
    };
    props.OnOk(reqObj);
  };

  const standardList = (items, title) => {
    // console.log("standardlist");
    // console.log(items);
    return (
      <div key={title}>
        <label
          id={`lbl${title}`}
          style={{ fontSize: "18px", width: "100%", margin: "0px 0px 5px 0px" }}
        >
          {title}
        </label>
        <Paper className={classes.paper}>
          <List dense component="div" role="list">
            {items.map((value) => {
              const labelId = `transfer-list-item-${value.stdId}-label`;

              return (
                <ListItem
                  key={value.stdId}
                  role="listitem"
                  button
                  onClick={handleToggleStd(value)}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={
                        checkedStd.findIndex((s) => s.stdId === value.stdId) !==
                        -1
                      }
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                      color="primary"
                      size="small"
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value.descr} />
                </ListItem>
              );
            })}
            <ListItem />
          </List>
        </Paper>
      </div>
    );
  };

  const itemList = (items, title) => {
    // console.log("Itemlist");
    // console.log(items);
    return (
      <div key={title}>
        <label
          id={`lbl${title}`}
          style={{ fontSize: "18px", width: "100%", margin: "0px 0px 5px 0px" }}
        >
          {title}
        </label>
        <Paper className={classes.paper}>
          <List dense component="div" role="list">
            {items.map((value) => {
              const labelId = `transfer-list-item-${value.diseaseId}-label`;

              return (
                <ListItem
                  key={value.diseaseId}
                  role="listitem"
                  button
                  onClick={handleToggleItem(value)}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={
                        checkedItem.findIndex(
                          (s) => s.diseaseId === value.diseaseId
                        ) !== -1
                      }
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                      color="primary"
                      size="small"
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value.itemName} />
                </ListItem>
              );
            })}
            <ListItem />
          </List>
        </Paper>
      </div>
    );
  };

  const handleChange = (event, newValue) => {
    // console.log(newValue);
    setValue(newValue);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`wrapped-tabpanel-${index}`}
        aria-labelledby={`wrapped-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box className={classes.root}>
            {children}
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  return (
    <Dialog
      open={props.Open}
      onClose={props.OnClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="scroll-dialog-title">Report Setup</DialogTitle>
      <DialogContent dividers>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
          wrapped="true"
        >
          <Tab value="Standard" label="Standard" />
          <Tab value="Item" label="Item" />
        </Tabs>
        <TabPanel value={value} index="Standard">
          <div className="row">
            <div className="col-md-12 col-lg-12">
              <Grid
                container
                spacing={2}
                justify="center"
                alignItems="center"
              // className={classes.root}
              >
                <Grid item>{standardList(availableStd, "Available")}</Grid>
                <Grid item>
                  <Grid container direction="column" alignItems="center">
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={handleAllRightStd}
                      disabled={availableStd.length === 0}
                      aria-label="move all right"
                    >
                      <FontAwesomeIcon icon={["fas", "angle-double-right"]} />
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={handleCheckedRightStd}
                      disabled={leftCheckedStd.length === 0}
                      aria-label="move selected right"
                    >
                      <FontAwesomeIcon icon={["fas", "angle-right"]} />
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={handleCheckedLeftStd}
                      disabled={rightCheckedStd.length === 0}
                      aria-label="move selected left"
                    >
                      <FontAwesomeIcon icon={["fas", "angle-left"]} />
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={handleAllLeftStd}
                      disabled={selectedStd.length === 0}
                      aria-label="move all left"
                    >
                      <FontAwesomeIcon icon={["fas", "angle-double-left"]} />
                    </Button>
                  </Grid>
                </Grid>
                <Grid item>{standardList(selectedStd, "Selected")}</Grid>
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    alignItems="flex-end"
                    justify="flex-end"
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={handleSeqUp}
                      disabled={rightCheckedStd.length !== 1}
                      aria-label="move all right"
                    >
                      <FontAwesomeIcon icon={["fas", "arrow-up"]} />
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={handleSeqDown}
                      disabled={rightCheckedStd.length !== 1}
                      aria-label="move selected right"
                    >
                      <FontAwesomeIcon icon={["fas", "arrow-down"]} />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </div>
          <div className="row Label-Inline">
            <label
              id="lblStandardShow"
              className="col-sm-12 col-md-2 col-lg-1-5"
            >
              เกณฑ์ที่แสดง :
            </label>
            <div className="col-sm-12 col-md-10 col-lg-10-5">
              <FormControlLabel
                className="mr-5"
                control={
                  <Checkbox
                    id="chkStandard"
                    checked={checkStandard}
                    onChange={handleCheckStandard}
                    name="chkStandard"
                    color="primary"
                    size="small"
                  />
                }
                label={<span>เกณฑ์</span>}
              />
              <FormControlLabel
                className="mr-5"
                control={
                  <Checkbox
                    id="chkMaxStandard"
                    checked={checkMaxStandard}
                    onChange={handleCheckMaxStandard}
                    name="chkMaxStandard"
                    color="primary"
                    size="small"
                  />
                }
                label={<span>เกณฑ์อนุโลมสูงสุด</span>}
              />
            </div>
          </div>
          {showWarning ? (
            <Alert
              className="mt-3"
              message="Selected standard must be less than 5."
              type="warning"
              showIcon
            />
          ) : null}
        </TabPanel>
        <TabPanel value={value} index="Item">
          <Grid
            container
            spacing={2}
            justify="center"
            alignItems="center"
          // className={classes.root}
          >
            <Grid item>{itemList(availableItem, "Available")}</Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  onClick={handleAllRightItem}
                  disabled={availableItem.length === 0}
                  aria-label="move all right"
                >
                  <FontAwesomeIcon icon={["fas", "angle-double-right"]} />
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  onClick={handleCheckedRightItem}
                  disabled={leftCheckedItem.length === 0}
                  aria-label="move selected right"
                >
                  <FontAwesomeIcon icon={["fas", "angle-right"]} />
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  onClick={handleCheckedLeftItem}
                  disabled={rightCheckedItem.length === 0}
                  aria-label="move selected left"
                >
                  <FontAwesomeIcon icon={["fas", "angle-left"]} />
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  onClick={handleAllLeftItem}
                  disabled={selectedItem.length === 0}
                  aria-label="move all left"
                >
                  <FontAwesomeIcon icon={["fas", "angle-double-left"]} />
                </Button>
              </Grid>
            </Grid>
            <Grid item>{itemList(selectedItem, "Exclude")}</Grid>
          </Grid>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        {/* <button className="mb-2 mr-2 btn btn-info" onClick={genReport}>
          OK
        </button>
        <button className="mb-2 mr-2 btn btn-light" onClick={props.OnClose}>
          Cancel
        </button> */}
        <button
          id="btnOkLookup"
          className="btn btn-primary-theme"
          onClick={genReport}
        >
          <span id="lblBtnOkLookup">OK</span>
        </button>
        <button
          id="btnCloseLookup"
          className="btn btn-cancel-theme"
          onClick={props.OnClose}
        >
          <span id="lblBtnCloseLookup">Cancel</span>
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default ScrollDialog;
