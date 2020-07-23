import React, { Component } from "react";
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

        const email = document.getElementById('mail').value;
        const password = document.getElementById('password').value;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(()=>{
            this.setState({loginState:true});
            console.log(this.state.loginState);
            alert("登入成功");

            // 登入成功則跳轉到主頁面
            this.props.history.push("/main");

        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode+errorMessage);
            alert("帳號或密碼輸入錯誤");
        });

        // firebase.auth().onAuthStateChanged(function(user) {
        //     console.log(user);  
        
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
            console.log(errorCode+errorMessage);
            alert("註冊帳號或密碼格式錯誤，註冊請在上方填入正確帳號密碼");

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
                    <button className="signBtn" onClick={this.signin.bind(this)}>登入</button>
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