import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AddStudentForm from './AddStudentForm';
import ClassTable from './ClassTable';


function DisplayUserInfo(props) {
     if (props.user_info.name) {
       return (
         <div>
           <div> {props.user_info.name} </div>
           <div> {props.user_info.completedChallenges.length} challenges completed</div>
           <div> Days Inactive: {props.user_info.daysInactive} </div>
         </div>
       );
     } else {
        return (
          <div>  </div>
        );
     }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      students: [],
      errors: [],
      user_info: {}
    };
  }

  componentDidMount() {
    return this.fetchStudentList();
  }

  fetchStudentList() {
    return fetch('/students')
      .then((res) => {
        res.json().then((data) => {
          if(data.length === 0){
            this.setState({ errors: ["classroom is empty"] });
          } else {
            this.setState({ students: data });
          }
        });
      });
  }

  handleSearch(e) {
    var githubName = document.getElementById('github-name-input').value;

    if (!githubName) return;


    fetch('/users/' + githubName)
      .then(res => res.json())
      .then((user_info) => {
        this.setState({ user_info });
      });
  };

  render() {
    return (
      <div className="App">
        <h1>User Info</h1>
          <input type="text" id="github-name-input"></input>
          <button onClick={this.handleSearch.bind(this)}>Search</button>
          <DisplayUserInfo user_info={this.state.user_info}/>
          <AddStudentForm fetchStudentsFromParent={this.fetchStudentList.bind(this)}/>
          <ClassTable students={this.state.students} errors={this.state.errors}/>
      </div>
    );
  }
}

export default App;
