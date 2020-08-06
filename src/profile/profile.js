import React, { Component } from "react";
import "./profile.css"; 
import profile_default from "./profile_default02.jpg"
import firebase from '../board/firebase';
import edit2 from "./edit2.png"
import saveChange from "./saveChange.png"
import cancelChange from "./cancelChange.png"

// const db = firebase.firestore();

class ProfilePage extends Component{
	constructor(props){
        super(props);
        this.state={userInfor:[],
            userName:firebase.auth().currentUser.displayName||"未設定", 
            userEmail:firebase.auth().currentUser.email||"沒有資料", 
            isEditing: false};

        const user = firebase.auth().currentUser;
        let userName
        let userEmail

        if (user != null) {
            userName = user.displayName;
            userEmail = user.email;

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

    editUsername(){
        this.setState({ isEditing: true });
    }

    updateNameData(){
        let user = firebase.auth().currentUser;
        let newName = document.getElementById("updateName").value

        user.updateProfile({
        displayName: newName,
        }).then(()=> {   
            this.setState({userName:newName, isEditing: false});
            alert("修改成功");
        }).catch(function(error) {
            console.log(error);
            alert("修改失敗，請檢查輸入內容是否正確");
        });
    }

    canceleditUsername(){
        this.setState({ isEditing: false });
    }

    render(){

        // 編輯顯示名稱欄位元件
        let editUsername
        if(this.state.isEditing) {
            editUsername = <div className="loginInfor">
                <div>顯示名稱：</div>
                <input id="updateName" type="text" placeholder="換成你喜歡的名字"/>
                <img className="profileEditIcon" src={saveChange}
                    onClick={this.updateNameData.bind(this)}></img>
                <img className="profileEditIcon" src={cancelChange}
                    onClick={this.canceleditUsername.bind(this)}></img>
            </div>
        }else{
            editUsername = <div className="loginInfor">
                <div>顯示名稱：</div>
                <div>{this.state.userName}</div>
                <img className="profileEditIcon" src={edit2} title="編輯名稱"
                onClick={this.editUsername.bind(this)}></img>
            </div>
        }       

        // 畫面渲染

        return (
            <div>
            <div className="profileAllDiv">
                <div className="profileMainDiv">
                    <div className="profileBanner" 
                        style={{backgroundImage: "url("+profile_default+")"}}>
                    </div>
                    <div className="loginStatus">
                        <div className="loginInforTitle">帳號狀態</div>
                        <div className="loginInfor">
                            <div>註冊mail：</div>
                            <div>{this.state.userEmail}</div>
                        </div>

                        {/* 編輯顯示名稱元件 */}
                        {editUsername}

                    </div>
                </div>
            </div>
        </div>
        );
    }  
}

export default ProfilePage;
