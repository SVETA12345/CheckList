import React from "react";
import {
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";

//icons

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
import Tables from "../../pages/tables";
import Customers from "../../pages/customers/Customers";
import Reports from "../../pages/reports/Reports";
import Report from "../../pages/reports/Report";
import Services from "../../pages/services/Services";
import Service from "../../pages/services/Service";
import Checklist from "../../pages/checklist/Checklist";
import Help from "../../pages/help/Help";
import Admin from "../../pages/admin/Admin";
import Strata from "../../pages/strata/Strata";
import Trash from "../../pages/trash/Trash";
import Logs from "../../pages/logs/Logs";
import Database from "../../pages/database/Database";
import Mnemonic from "../../pages/mnemonic/Mnemonic";
import MnemonicList from "../../pages/mnemonic/MnemonicList";
import TrackedWells from "../../pages/trackedwells/TrackedWells";
import OneTrackedWell from "../../pages/trackedwells/OneTrackedWell";

// context
import { useLayoutState } from "../../context/LayoutContext";


function Layout(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();
  return (
    <div className={classes.root}>
        <>
          <Header history={props.history} />
          <Sidebar />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
              <Route path="/app/customers" component={Customers} />
              <Route path="/app/dashboard" component={Dashboard} />
              <Route path="/app/tables" component={Tables} />
              <Route exact path="/app/reports" component={Reports} />
              <Route path="/app/reports/:id" component={Report} />
              <Route exact path="/app/services" component={Services} />
              <Route path="/app/services/:id" component={Service} />
              <Route path="/app/help" component={Help} />
              <Route path="/app/trash" component={Trash} />
              <Route path="/app/database" component={Database} />
              <Route path="/app/logs" component={Logs} />
              <Route path="/app/checklist" component={Checklist} />
              <Route path="/app/admin" component={Admin} />
              <Route path="/app/strata/:id" component={Strata} />
              <Route exact path="/app/mnemonic" component={Mnemonic} />
              <Route path="/app/mnemonic/:id" component={MnemonicList} />
              <Route exact path="/app/trackedwells" component={TrackedWells} />
              <Route path="/app/trackedwells/:id" component={OneTrackedWell} />
            </Switch>
          </div>
        </>
    </div>
  );
}

export default withRouter(Layout);
