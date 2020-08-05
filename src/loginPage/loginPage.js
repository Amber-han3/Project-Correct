import React, { Component } from "react";
import "./loginPageCSS.css"; 
import backgroundImg from "./pic01.jpg"
import firebase from '../board/firebase';

class LoginPage extends Component{
	constructor(props){
        super(props);
        this.state={loginState: false, signupPage:false};
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
        
    }

    changeToSignup(e){
        this.setState({signupPage:true});
    }

    backToSignin(e){
        this.setState({signupPage:false});
    }

    signup(e){
        const email = document.getElementById('mail').value;
        const password = document.getElementById('password').value;
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(()=>{
            alert("註冊完成");
            this.props.history.push("/main");
        }).catch(function(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode+errorMessage);
            alert("註冊帳號或密碼格式錯誤，請填入正確格式帳號密碼");

        });
    }

	render(){
        let accountDiv
        if(this.state.signupPage){
            // 註冊畫面
            accountDiv =                 
                <div className="accountDiv">
                    <div>註冊新帳號</div>
                    <div className="accountInputDiv">
                        <div>帳號</div>
                        <input id="mail" placeholder="範例：example@gmail.com"></input>
                    </div>
                    <div className="accountInputDiv">
                        <div>密碼</div>
                        <input type="password" id="password" placeholder="請勿少於6個字元"></input>
                    </div>
                    <div className="signup" onClick={this.signup.bind(this)}>註冊</div>
                    <div className="backToSignin" onClick={this.backToSignin.bind(this)}>回到登入</div>
                </div>

        }else{
            // 登入畫面
            accountDiv =                 
                <div className="accountDiv">
                    <div>登入後繼續使用</div>
                    <div className="accountInputDiv">
                        <div>帳號</div>
                        <input id="mail" placeholder="example@gmail.com"></input>
                    </div>
                    <div className="accountInputDiv">
                        <div>密碼</div>
                        <input type="password" id="password"></input>
                    </div>
                    <button className="signBtn" onClick={this.signin.bind(this)}>登入</button>
                    <div className="separateLine"></div>
                    <div>沒有帳號？
                        <div className="toSignupPage" onClick={this.changeToSignup.bind(this)} >前往註冊</div>
                    </div>
                </div>
        }

		return(
            <div className="mainImg" style={{backgroundImage: "url("+backgroundImg+")"}}>
                {accountDiv}
            </div>
        )
        
    }
}

export default LoginPage;