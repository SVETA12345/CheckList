import React from "react";

// styles
import useStyles from "./styles";

// components
import { Typography } from "../Wrappers";

export default function PageTitle(props) {
  var classes = useStyles();

  return (
    <div className={classes.pageTitleContainer}>
      <Typography className={classes.typo} variant="h1" style={props.style} size="sm">
        {props.title}{props.title1row}{props.enter && <br/>}{props.title2row}{props.enter && <br/>}{props.title3row}
      </Typography>
      <div className={classes.buttonContainer}>
      {props.button && props.button}
      {props.button2 && props.button2}
      </div>
    </div>
  );
}
