import React, { useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Fade,
  Divider
} from "@material-ui/core";
import { withRouter } from "react-router-dom";

// styles
import useStyles from "./styles";

// logo
import logo2 from "./4_IGIRGI.png"
// context
import { useUserDispatch, loginUser } from "../../context/UserContext";

function Login(props) {
  var classes = useStyles();

  // global
  var userDispatch = useUserDispatch();

  // local
  const [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(false);
  const [activeTabId, setActiveTabId] = useState(0);
  const [nameValue, setNameValue] = useState("");
  const [loginValue, setLoginValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer} style={{backgroundColor:"#b2b2b2"}}>
        <img src={logo2} alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText} style={{textAlign: "center"}}>Качество данных ГИС<br/><Divider style={{backgroundColor: "white"}}/>АО «‎ИГиРГИ»</Typography>
      </div>
      <div className={classes.formContainer} style={{backgroundColor:"white"}}>
        <div className={classes.form}>
          <Tabs
            value={activeTabId}
            onChange={(e, id) => setActiveTabId(id)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Войти" classes={{ root: classes.tab }} />
            {/*<Tab label="Новый" classes={{ root: classes.tab }} />*/}
          </Tabs>
          {activeTabId === 0 && (
            <React.Fragment>
              <Typography variant="h2" className={classes.greeting}>
                Введите свой логин и пароль
              </Typography>
              <div className={classes.formDividerContainer}>
                <div className={classes.formDivider} /> 
              </div>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Ошибка в логине или пароле.
                </Typography>
              </Fade>
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={e => {setLoginValue(e.target.value.toLowerCase()); localStorage.setItem('login', e.target.value.toLowerCase());}}
                margin="normal"
                placeholder="Введите логин"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Введите пароль"
                type="password"
                fullWidth
              />
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    disabled={
                      loginValue.length === 0 || passwordValue.length === 0
                    }
                    onClick={() =>
                      loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError,
                      )
                    }
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Войти
                  </Button>
                )}
                {/*<Button
                  color="primary"
                  size="large"
                  className={classes.forgetButton}
                >
                  Забыли пароль
                </Button>*/}
              </div>
            </React.Fragment>
          )}
          {activeTabId === 1 && (
            <React.Fragment>
              <Typography variant="h2" className={classes.subGreeting}>
                Отправьте заявку на создание нового аккаунта
              </Typography>
              <div className={classes.formDividerContainer}>
                <div className={classes.formDivider} /> 
              </div>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Ошибка в логине или пароле.
                </Typography>
              </Fade>
              <TextField
                id="name"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={nameValue}
                onChange={e => setNameValue(e.target.value)}
                margin="normal"
                placeholder="Full Name"
                type="text"
                fullWidth
              />
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={e => setLoginValue(e.target.value)}
                margin="normal"
                placeholder="Email Adress"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <div className={classes.creatingButtonContainer}>
                {isLoading ? (
                  <CircularProgress size={26} />
                ) : (
                  <Button
                    onClick={() =>
                      loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError,
                        error
                      )
                    }
                    disabled={
                      loginValue.length === 0 ||
                      passwordValue.length === 0 ||
                      nameValue.length === 0
                    }
                    size="large"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.createAccountButton}
                  >
                    Отправить заявку
                  </Button>
                )}
              </div>
            </React.Fragment>
                  )}
        </div>
        <Typography color="primary" className={classes.copyright}>
        © {new Date().getFullYear()} <a style={{ textDecoration: 'none', color: 'inherit' }}>АО «‎ИГиРГИ»</a>. Все права защищены.
        </Typography>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
