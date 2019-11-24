import React from 'react';
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';

ErrorSnackbar.propTypes = {};

function ErrorSnackbar(props) {
    const [open, setOpen] = React.useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

  return (
      <div>
          <Snackbar
              anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
              }}
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
              ContentProps={{
                  'aria-describedby': 'message-id',
              }}
              message={<span id="message-id">{props.message}</span>}
              action={[
                  <IconButton
                      key="close"
                      aria-label="close"
                      color="inherit"
                      onClick={handleClose}
                  >
                  <CloseIcon />
                  </IconButton>,
              ]}
          />
    </div>
  );
}

export default ErrorSnackbar;