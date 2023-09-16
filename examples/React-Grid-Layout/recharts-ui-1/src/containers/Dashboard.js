import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route } from "react-router"; //{ Route, Switch }

import GridLayout from "../components/GridLayout";
import LayoutEditor from "../components/LayoutEditor";

const Dashboard = ({ data, id, layouts }) => {
  // console.log("Dashboard.js data:", data);
  // console.log("Dashboard.js id:", id);
  // console.log("Dashboard.js layouts:", layouts);
  return (
    <div className="dashboard">
      <GridLayout data={data} layouts={layouts} />
      <Route exact path="/:id/layout" component={LayoutEditor} />
    </div>
  );
};

Dashboard.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  layouts: PropTypes.object.isRequired
};

const mapStateToProps = (state, { match: { params: { id } } }) => {
  return {
    data: Object.keys(state.data),
    layouts: { ...state.layouts },
    id
  };
};

export default connect(mapStateToProps, null, null, { pure: false })(Dashboard);
