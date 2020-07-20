import React, { Component } from "react";
// import ReactDOM from "react-dom";
// import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import "./profile.css"; 
import profile_default02 from "./profile_default02.jpg"
import firebase from '../board/firebase';

const db = firebase.firestore();
firebase.auth();

class ProfilePage extends Component{
	constructor(props){
        super(props);
        this.state={userEmail:"沒有資料", userName:"路人", userInfor:[],
        isEditing: false};
    }

    editUsername(){
        // alert("name");
        this.setState({ isEditing: true });
    }

    updateNameData(){
        let user = firebase.auth().currentUser;
        let newName = document.getElementById("updateName").value

        user.updateProfile({
        displayName: newName,
        // }).then(function() {
        }).then(()=> {   
            this.setState({userName:newName, isEditing: false});
            console.log(this.state.isEditing)
            alert("修改成功");
        }).catch(function(error) {
            console.log(error);
            // alert("修改失敗，請檢查輸入內容是否正確");
        });
    }

    canceleditUsername(){
        // alert("name");
        this.setState({ isEditing: false });
    }

    componentDidMount(){
        const user = firebase.auth().currentUser;
        let userName
        let userEmail
        let photoUrl
        let uid

        if (user != null) {
            userName = user.displayName;
            userEmail = user.email;
            photoUrl = user.photoURL;
            uid = user.uid;  
            console.log(user);
            console.log(userEmail);

            this.setState({userEmail: userEmail});

            if(userName != null){
                this.setState({userName: userName});
            }
        }
        else{
            console.log("沒有資料");
            this.props.history.push("/login");
            alert("請先登入");
        }
    }

    render(){
        if (this.state.isEditing) {
            return (
                <div>
                <div className="profileAllDiv">
                    <div className="profileMainDiv">
                        <div className="profileBanner" style={{backgroundImage: "url("+profile_default02+")"}}>

                        </div>
                        <div className="loginStatus">
                            <div className="loginInforTitle">帳號狀態</div>
                            <div className="loginInfor">
                                <div>註冊mail：</div>
                                <div>{this.state.userEmail}</div>
                            </div>
                            <div className="loginInfor">
                                <div>使用者名稱：</div>
                                <input id="updateName" type="text" />
                                <button onClick={this.updateNameData.bind(this)}>儲存</button>
                                <button onClick={this.canceleditUsername.bind(this)}>取消</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profileMyPostDiv">
                    <div className="profileMainDiv">
                        <div className="loginStatus">
                            <div className="loginInforTitle">我發表的文章</div>
                            {/* <div className="loginInfor">
                                <div>註冊mail：</div>
                                <div>{this.state.userEmail}</div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
            );
        }
		return(
            <div>
                <div className="profileAllDiv">
                    <div className="profileMainDiv">
                        <div className="profileBanner" style={{backgroundImage: "url("+profile_default02+")"}}>

                        </div>
                        <div className="loginStatus">
                            <div className="loginInforTitle">帳號狀態</div>
                            <div className="loginInfor">
                                <div>註冊mail：</div>
                                <div>{this.state.userEmail}</div>
                            </div>
                            <div className="loginInfor">
                                <div>使用者名稱：</div>
                                <div>{this.state.userName}</div>
                                <button onClick={this.editUsername.bind(this)}>修改</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profileMyPostDiv">
                    <div className="profileMainDiv">
                        <div className="loginStatus">
                            <div className="loginInforTitle">我發表的文章</div>
                            {/* <div className="loginInfor">
                                <div>註冊mail：</div>
                                <div>{this.state.userEmail}</div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
		)
    }  
}

export default ProfilePage;
