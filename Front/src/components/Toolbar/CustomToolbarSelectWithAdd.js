import React from "react";
import { withStyles } from "@material-ui/styles";
import {
    IconButton,
    Tooltip
  } from "@material-ui/core";
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Add as AddIcon
  } from "@material-ui/icons";
const defaultToolbarSelectStyles = {
  iconButton: {
  },
  iconContainer: {
    marginRight: "24px",
  },
};

class CustomToolbarSelectWithAdd extends React.Component {
  handleClickChangeName = () => {
    this.props.onChangeName();
  };

  handleClickRowsDelete = () => {
    this.props.onRowsDelete();
  };

  handleClickRowsAdd = () => {
    this.props.onRowsAdd();
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.iconContainer}>
        <Tooltip title={"Добавить месторождение"}>
          <IconButton className={classes.iconButton} onClick={this.handleClickRowsAdd} style={{outline:"none"}}>
            <AddIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
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

export default withStyles(defaultToolbarSelectStyles, { name: "CustomToolbarSelectWithAdd" })(CustomToolbarSelectWithAdd);