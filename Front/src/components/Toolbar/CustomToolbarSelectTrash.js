import React from "react";
import { withStyles } from "@material-ui/styles";
import {
    IconButton,
    Tooltip
  } from "@material-ui/core";
import {
    Delete as DeleteIcon,
    Loop as LoopIcon,
  } from "@material-ui/icons";

const defaultToolbarSelectStyles = {
  iconButton: {
  },
  iconContainer: {
    marginRight: "24px",
  },
};

class CustomToolbarSelectTrash extends React.Component {
  handleClickRowsDelete = () => {
    this.props.onRowsDelete();
  };

  handleClickRowsRecovery = () => {
    this.props.onRowsRecovery();
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.iconContainer}>
        <Tooltip title={"Восстановить"}>
          <IconButton className={classes.iconButton} onClick={this.handleClickRowsRecovery} style={{outline:"none"}}>
            <LoopIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Удалить"}>
          <IconButton className={classes.iconButton} onClick={this.handleClickRowsDelete} style={{outline:"none"}}>
            <DeleteIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

export default withStyles(defaultToolbarSelectStyles, { name: "CustomToolbarSelectTrash" })(CustomToolbarSelectTrash);