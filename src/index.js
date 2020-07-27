import React from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import { Redirect } from 'react-router'


import "./navbar/navbar.css";

import MainBoard from "./board/mainBoard"
import LoginPage from "./loginPage/loginPage";
import ProfilePage from "./profile/profile";

import firebase from './board/firebase';

class MainPage extends React.Component{
    constructor(props){
        super(props);
        this.state={loginStatus:false};
        // this.state={loginStatus:true};

        firebase.auth().onAuthStateChanged((user)=> {
            if (user) {
                this.setState({loginState:true});
                console.log("user login");
            } else {
                this.setState({loginState:false}); 
                console.log("guest");
            }
        });
    }

    logout(e){
        const user = firebase.auth().currentUser;
        console.log(user);
    
        if (user != null) {
            firebase.auth().signOut()
            .then(()=>{
                this.setState({loginState:false});
                console.log(this.state.loginState);
                alert("已登出");
            });
        };
    }

    render(){
        
        let navbarChange
        if(this.state.loginState){
            navbarChange = <ul className="navbar">
                        <li>
                            <Link to="/main">動態</Link>
                        </li>
                        <li>
                            <Link to="/profile">帳號</Link>
                        </li>
                        <li id="logout" onClick={this.logout.bind(this)}>
                            <Link to="/logout">登出</Link> 
                        </li>
                    </ul>
        }
        else{navbarChange =  <ul className="navbar">
                    <li>
                        <Link to="/login">登入</Link> 
                    </li>
                </ul>
        }
        
        return <Router>
            <div>
                <div className="headerLine">
                    <div className="websiteTitle">CORRECT</div>
                    {navbarChange}
                </div>

                <div>{this.props.children}</div>

                <Switch>
                    {/* 預設顯示登入頁 */}
                    <Route exact path="/" component={LoginPage}></Route>

                    <Route path="/login" component={LoginPage}></Route>
                    <Route path="/main" component={MainBoard}></Route> 
                    <Route path="/profile" component={ProfilePage}></Route> 
                    <Redirect from={"/logout"} to={"/login"} />
                </Switch>
            </div> 
        </Router>
         
    }
}

ReactDOM.render( 
    <Router>
      <MainPage />
    </Router>,
    document.querySelector("#root")
  );