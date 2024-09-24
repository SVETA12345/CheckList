import React from "react";
import { Grid, Paper, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// logo
import logo from "../login/4_IGIRGI.png";

export default function Error() {
  var classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotype}>
        <img className={classes.logotypeIcon} src={logo} alt="logo" />
        <Typography variant="h3" color="white" className={classes.logotypeText}>
          АО «‎ИГиРГИ»
        </Typography>
      </div>
      <Paper classes={{ root: classes.paperRoot }}>
        <Typography
          variant="h1"
          color="primary"
          className={classnames(classes.textRow, classes.errorCode)}
        >
          404
        </Typography>
        <Typography variant="h5" color="primary" className={classes.textRow}>
          Страница с таким адресом не существует.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/app/checklist"
          size="large"
          className={classes.backButton}
        >
          Вернуться на главную
        </Button>
      </Paper>
    </Grid>
  );
}
