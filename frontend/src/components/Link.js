import React from 'react';

import MuiLink from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";


let Link = React.forwardRef((props, ref) =>
    <MuiLink component={RouterLink} innerRef={ref} {...props} >
        {props.children}
    </MuiLink>
);

Link.propTypes = RouterLink.propTypes;


export default Link;