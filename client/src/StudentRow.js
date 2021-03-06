import React, { Component } from 'react';

class StudentRow extends Component {
  render() {
    return(
      <tr>
        <td>{this.props.name}</td>
        <td>{this.props.username}</td>
        <td>{this.props.email}</td>
        <td>{this.props.notes}</td>
        <td>{this.props.daysInactive}</td>
        <td>{this.props.newSubmissionsCount}</td>
      </tr>
    );
  }
}

export default StudentRow;