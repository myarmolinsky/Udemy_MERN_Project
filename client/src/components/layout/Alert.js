import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Alert = (
  { alerts } //make sure alerts is not null and it is not an empty array
) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {/*whenever you map through a list and output jsx, you need to give it a unique key, we make it the alert.id*/}
      {/*className is for styling*/}
      {/*map will loop through alerts and return some jsx for each alert*/}
      {alert.msg}
    </div>
  ));

//map through the alerts and output the message along with the class styling

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  //we want to map the state via connect()
  //we set 'mapStateToProps' to an arrow function which takes 'state' as a parameter
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
