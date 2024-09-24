import React from "react";
import { withStyles } from "@material-ui/styles";
import {
    IconButton,
    Tooltip
  } from "@material-ui/core";
import {
    Delete as DeleteIcon,
    Edit as EditIcon
  } from "@material-ui/icons";
const defaultToolbarSelectStyles = {
  iconButton: {
  },
  iconContainer: {
    marginRight: "24px",
  },
};

class CustomToolbarSelect extends React.Component {
  handleClickChangeName = () => {
    this.props.onChangeName();
  };

  handleClickRowsDelete = () => {
    this.props.onRowsDelete();
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.iconContainer}>
        <Tooltip title={"Изменить название"}>
          <IconButton className={classes.iconButton} onClick={this.handleClickChangeName} style={{outline:"none"}}>
            <EditIcon className={classes.icon} />
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

export default withStyles(defaultToolbarSelectStyles, { name: "CustomToolbarSelect" })(CustomToolbarSelect);