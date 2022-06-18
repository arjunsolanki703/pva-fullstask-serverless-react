import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
    justifycontent: "center",
    marginLeft: "5px",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

const CustomizedSwitches = (props) => {
  // const [checked, setChecked] = useState(props.checked);
  return (
    <FormGroup>
      <Typography component="div">
        <Grid component="label" container alignItems="center" spacing={1}>
          {props.text ? (
            <Grid item className={props.className}>
              <b className={props.className}>{props.text}</b>
            </Grid>
          ) : (
            <></>
          )}

          <Grid item className={props.className}>
            OFF
          </Grid>
          <Grid item>
            <AntSwitch
              checked={props.checked}
              onChange={async () => {
                // setChecked(!checked);
                await props.onChange();
              }}
              name="checkedC"
              disabled={props.disabled}
            />
          </Grid>
          <Grid item className={props.className}>
            ON
          </Grid>
        </Grid>
      </Typography>
    </FormGroup>
  );
};

export default CustomizedSwitches;
