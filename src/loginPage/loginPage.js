import React, { Component } from "react";
// import ReactDOM from "react-dom";
// import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import "./loginPageCSS.css"; 
import Pic01 from "./pic01.jpg"

class LoginPage extends Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
            <div className="mainPic" style={{backgroundImage: "url("+Pic01+")"}}>
                <div className="accountDiv">
                    <div>開始使用</div>
                    <div className="accountInputDiv">
                        <div>帳號</div>
                        <input></input>
                    </div>
                    <div className="accountInputDiv">
                        <div>密碼</div>
                        <input type="password"></input>
                    </div>
                    <button>登入</button>
                    <div className="beforeSignup"></div>
                    <div>或 
                        <a>註冊新帳號</a>
                    </div>
                </div>
            </div>
		)
	}
}

export default LoginPage;