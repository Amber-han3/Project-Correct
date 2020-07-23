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
        // this.state={loginStatus:false};
        this.state={loginStatus:true};
    }

    // checkLogin(e){
    //     firebase.auth();
    //     const user = firebase.auth().currentUser;
    //     if (user != null){
    //         this.setState({loginState:true});
    //         console.log("uaer login");
    //     }else{
    //         this.setState({loginState:false});
    //         console.log("guest");
    //     }
    // }

    logout(e){
        // alert("logout");
        firebase.auth();
        const user = firebase.auth().currentUser;
        console.log(user);
    
        if (user != null) {
            firebase.auth().signOut()
            .then(()=>{
                this.setState({loginState:false});
                console.log(this.state.loginState);
                alert("已登出");

                // // 登出成功則跳轉到登入頁(沒反應？)
                // this.props.history.push("/login");
            });
        }else{
            // console.log("未登入");
            // this.props.history.push("/login");
        }
    }

    componentDidMount(){

        firebase.auth().onAuthStateChanged((user)=> {
            if (user) {
                this.setState({loginState:true});
                console.log("user login");
            } else {
                this.setState({loginState:false}); //確認這行是不是有問題
                console.log("guest");
            }
        });
    }

    // 原本的render
    render(){
        
        let navbarChange
        if(this.state.loginStatus){
            navbarChange = <ul className="navbar">
                        <li>
                            <Link to="/main">動態</Link>
                        </li>
                        <li>
                            <Link to="/profile">帳號</Link>
                        </li>
                        {/* nav切換處理好記得把登入拿掉 */}
                        <li>
                            <Link to="/login">登入</Link> 
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
                    {/* <ul className="navbar">
                        <li>
                            <Link to="/main">動態</Link>
                        </li>
                        <li>
                            <Link to="/profile">帳號</Link>
                        </li>
                        <li>
                            <Link to="/login">登入</Link> 
                        </li>
                        <li id="logout" onClick={this.logout.bind(this)}>
                            <Link to="/logout">登出</Link> 
                        </li>
                    </ul> */}
                </div>

                <div>{this.props.children}</div>

                <Switch>
                    {/* 預設顯示登入頁 */}
                    {/* <Route exact path="/" component={LoginPage}></Route> */}
                     {/*記得換回來  */}
                     <Route exact path="/" component={MainBoard}></Route>

                    {/* 登入tag之後要拿掉 */}
                    <Route path="/login" component={LoginPage}></Route>
                    <Route path="/main" component={MainBoard}></Route> 
                    <Route path="/profile" component={ProfilePage}></Route> 
                    <Redirect from={"/logout"} to={"/login"} />
                </Switch>
            </div> 
        </Router>
         
    }
}

// // 原本的
// window.addEventListener("load", ()=>{
//     let myComponent=React.createElement(MainPage, null);
//     ReactDOM.render(myComponent, document.querySelector("#root"));
// })

ReactDOM.render( 
    <Router>
      <MainPage />
    </Router>,
    document.querySelector("#root")
  );