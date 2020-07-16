import React, { Component } from "react";
// import ReactDOM from "react-dom";
// import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import "./loginPageCSS.css"; 
import Pic01 from "./pic01.jpg"
import firebase from '../board/firebase';

firebase.auth();

class LoginPage extends Component{
	constructor(props){
        super(props);
        this.state={loginState: false};
    }
   
    signin(e){
        // alert(("signup"));

        const email = document.getElementById('mail').value;
        const password = document.getElementById('password').value;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(()=>{
            this.setState({loginState:true});
            console.log(this.state.loginState);
            alert("登入成功");
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorCode+errorMessage);
        });

        firebase.auth().onAuthStateChanged(function(user) {
            console.log(user);  

            // // 處理中
            // const user = firebase.auth().currentUser;
            // let userName
            // let userEmail
            // let photoUrl
            // let uid
            // let emailVerified
    
            // if (user != null) {
            //     userName = user.displayName;
            //     userEmail = user.email;
            //     photoUrl = user.photoURL;
            //     emailVerified = user.emailVerified;
            //     uid = user.uid;  
            //     console.log(user);
            //     console.log(userEmail);
            // }

          });
        
    }

    signup(e){
        const email = document.getElementById('mail').value;
        const password = document.getElementById('password').value;
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(()=>{
            alert("註冊完成");
        }).catch(function(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode+errorMessage);
        });
    }

	render(){
		return(
            <div className="mainPic" style={{backgroundImage: "url("+Pic01+")"}}>
                <div className="accountDiv">
                    <div>開始使用</div>
                    <div className="accountInputDiv">
                        <div>帳號</div>
                        <input id="mail"></input>
                    </div>
                    <div className="accountInputDiv">
                        <div>密碼</div>
                        <input type="password" id="password"></input>
                    </div>
                    <button onClick={this.signin.bind(this)}>登入</button>
                    <div className="beforeSignup"></div>
                    <div>或 
                        <div className="signup" onClick={this.signup.bind(this)} >註冊新帳號</div>
                    </div>
                </div>
            </div>
		)
    }
    

    
}

export default LoginPage;