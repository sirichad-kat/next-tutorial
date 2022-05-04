import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 250;
const useStylesIndexPage = makeStyles((theme) => ({
   root: {
      display: "flex",
   },
   appBar: {
      transition: theme.transitions.create(["margin", "width"], {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.leavingScreen,
      }),
   },
   appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
         easing: theme.transitions.easing.easeOut,
         duration: theme.transitions.duration.enteringScreen,
      }),
   },
   menuButton: {
      marginRight: theme.spacing(2),
   },
   hide: {
      display: "none",
   },
   drawer: {
      paddingTop: "50px",
      width: drawerWidth,
      flexShrink: 0,
   },
   drawerPaper: {
      paddingTop: "50px",
      width: drawerWidth,
   },
   drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
   },
   content: {
      flexGrow: 1,
      padding: "0px",
      transition: theme.transitions.create("margin", {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
      [theme.breakpoints.down("sm")]: {
         marginLeft: 0,
      },
      maxWidth: `100vw`,
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
         maxWidth: `calc(99vw - ${drawerWidth}px)`
      }
   },
}));

export default useStylesIndexPage;
