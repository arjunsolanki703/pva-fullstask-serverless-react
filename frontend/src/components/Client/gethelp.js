import React, { useState } from 'react'

import Loader from "../common/Loader";
import Navbar from "../common/navbar";
import SupportTicket from './supportTicket'

function Gethelp(props) {
    const [loading, setLoading_] = useState(0);
  return (
    <div className="offset-lg-2 col-lg-10 col-md-12 col-12 navbar-wrapper px-0">
        <Navbar
          setSidebar={props.setSidebar}
          sidebar={props.sidebar}
          currentPage="Create A Support Ticket"
        />
            <SupportTicket {...props}/>
      </div>
  )
}

export default Gethelp;