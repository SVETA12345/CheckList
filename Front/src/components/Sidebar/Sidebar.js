import React, { useState, useEffect } from "react";
import { Drawer, IconButton, List } from "@material-ui/core";
import {
  Delete as DeleteIcon,
  Layers as LayersIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Description as DescriptionIcon,
  NoteAdd as NoteAddIcon,
  Help as HelpIcon,
  Equalizer as EqualizerIcon,
  Storage as StorageIcon,
  TableChart as TableChartIcon,
  Toll as TollIcon,
} from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import SidebarLink from "./components/SidebarLink/SidebarLink";
import Dot from "./components/Dot";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";

const structure = [
  { id: 0, label: "Статистика", link: "/app/dashboard", icon: <EqualizerIcon /> },
  { id: 1, type: "divider" },
  { 
    id: 2, 
    label: "Общества группы",
    link: "/app/customers",
    icon: <PersonIcon/>
  },
  { 
    id: 3, 
    label: "Создать скважину",
    link: "/app/database",
    icon: <StorageIcon/>
  },
  { 
    id: 4, 
    label: "Сервисные компании",
    link: "/app/services",
    icon: <SettingsIcon/>
  },
  { 
    id: 5, 
    label: "База мнемоник",
    link: "/app/mnemonic",
    icon: <TableChartIcon/>
  },
  { id: 6, type: "divider" },
  
  { id: 7, 
    label: "Создать отчёт", 
    link: "/app/checklist", 
    icon: <NoteAddIcon />
  },
  { 
    id: 8, 
    label: "Отчёты по контролю качества",
    link: "/app/reports",
    icon: <DescriptionIcon/> 
  },
  { id: 9, type: "divider" },
  { 
    id: 10, 
    label: "База данных скважин",
    link: "/app/trackedwells",
    icon: <TollIcon/>
  },
  { id: 11, type: "divider" },
  { 
    id: 12, 
    label: "Корзина",
    link: "/app/trash",
    icon: <DeleteIcon/> 
  },
  { 
    id: 13, 
    label: "Логи",
    link: "/app/logs",
    icon: <LayersIcon/> 
  },
  { 
    id: 14, 
    label: "Помощь",
    link: "/app/help",
    icon: <HelpIcon/> 
  },
];

function Sidebar({ location }) {
  var classes = useStyles();
  var theme = useTheme();
  const role = localStorage.getItem("role")

  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function() {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {role === "superuser" ? structure.map(link => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        )) :
        structure.filter(item => item.id != 10 && item.id != 5 && item.id != 11).map(link => (
            <SidebarLink
              key={link.id}
              location={location}
              isSidebarOpened={isSidebarOpened}
              {...link}
            />
          )
        )}
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
