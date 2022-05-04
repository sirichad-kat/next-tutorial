import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStylesCircular = makeStyles((theme) => ({
   root: {
      position: "relative",
   },
   bottom: {
      color: theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
   },
   top: {
      color: "#34C5B2",
      // color: '#1a90ff',
      animationDuration: "550ms",
      position: "absolute",
      left: 0,
   },
   circle: {
      strokeLinecap: "round",
   },
}));

function MyCircularProgress(props) {
   const classes = useStylesCircular();
   const iconSize = props.iconSize || 40;

   return (
      <div className={classes.root}>
         <CircularProgress variant="determinate" className={classes.bottom} size={iconSize} thickness={4} {...props} value={100} />
         <CircularProgress
            variant="indeterminate"
            disableShrink
            className={classes.top}
            classes={{
               circle: classes.circle,
            }}
            size={iconSize}
            thickness={4}
            {...props}
         />
      </div>
   );
}

const useStyles = makeStyles({
   root: {
      display: "flex",
      justifyContent: "center",
      margin: "20px",
   },
});

const AutocompleteStyles = makeStyles({
   root: {
      display: "flex",
      justifyContent: "center",
   },
});

export default function CustomizedProgressBars(props) {
   let classes = useStyles();
   if (props.inline || false) {
      classes = AutocompleteStyles();
   }
   const iconSize = props.iconSize || 40;

   return (
      <div className={classes.root}>
         <MyCircularProgress size={iconSize} />
      </div>
   );
}
