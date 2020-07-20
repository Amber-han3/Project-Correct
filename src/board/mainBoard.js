import React, { Component } from "react";
// import ReactDOM from "react-dom";
// import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import "./mainBoard.css";
import BoardList from "./boardList";

import firebase from './firebase';

// firebase相關

const db = firebase.firestore();
firebase.auth();

class MainBoard extends Component{
    constructor(props){
        super(props);
        this.state={text:"", commentWithID:[],  //紀錄文字內容用
            loginStatus: false, userInfor:[],  //確認登入狀態
            reviseStatus:false, //文字訂正狀態
        };  

        // // 讀取登入狀態

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

            this.setState({loginStatus: true});
            console.log(this.state.loginStatus);
            // this.state.userInfor.push({userName:userName, userEmail:userEmail});
            // this.setState({userInfor: this.state.userInfor});
            // console.log("this.state.userInfor"+this.state.userInfor);
        }

        // 讀取firebase資料
        db.collection("article").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // 可以跨doc讀到全部comment欄位
                console.log(`${doc.id} => ${doc.data().comment}`);

                // 把讀取到的id存到state
                this.state.commentWithID.push({commentID: doc.id, comment: doc.data().comment});
                this.setState({commentWithID:this.state.commentWithID});
                console.log("commentWithID:"+this.state.commentWithID);
                // console.log("commentID:"+this.state.commentWithID[0].commentID);
                // console.log("comment:"+this.state.commentWithID[0].comment);
            });
        });
        
    }

    handleTextChange(e){
        // this.setState({text: this.state.text});
    }

    addNewPost(e){
        e.preventDefault();
        let postText=document.getElementById("textareaDiv").value
        // this.setState({text: postText});
        // console.log(this.state.text);

        // firebase相關

        const firebase = require("firebase");
        // Required for side-effects
        require("firebase/firestore");

        // 讀取auth資料

        const user = firebase.auth().currentUser;
        let userName
        let userEmail
        let photoUrl

        if (user != null) {
            userName = user.displayName;
            userEmail = user.email;
            photoUrl = user.photoURL;
            console.log(user);

            // this.state.userInfor.push({userName:userName, userEmail:userEmail});
            this.state.userInfor.push({userEmail:userEmail});
            this.setState({userInfor: this.state.userInfor});
            console.log("this.state.userInfor"+this.state.userInfor);
        };

        // 以文章為分類存進database

        const submitTime = new Date()

        db.collection("article").add({
            time: submitTime,
            // userID: "no",
            userInfor: this.state.userInfor,
            comment: postText,
        })
        .then((docRef) => {
             console.log("Document written with comment: ", docRef.id.comment);

            // 取出db內容傳入新陣列，再放入state(避免重複render)，顯示在畫面上

             db.collection("article").get().then((querySnapshot) => {
                let data=[];
                querySnapshot.forEach((doc) => {
    
                    //this.state.commentWithID.push({commentID: doc.id, comment: doc.data().comment});
                    //this.setState({commentWithID:this.state.commentWithID});
    
                    data.push({commentID: doc.id, comment: doc.data().comment});
                    // console.log(data);
                });
                // console.log(this.state.commentWithID);
                this.setState({commentWithID:data});
            });         

        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });

        // 以使用者為分類存進database

        db.collection("user").doc(this.state.userInfor.userEmail).add({
            time: submitTime,
            userEmail: this.state.userInfor.userEmail,
            comment: postText,
        });

    } 

    remove(e){
		e.preventDefault();
        
        // 在state裡的id
        let indexValue=event.target.getAttribute("id");
        let textList= [...this.state.commentWithID]
        textList.splice(indexValue, 1); 
        this.setState({commentWithID:textList});

        // firbase的處理
        let itemID=event.target.getAttribute("commentID");

        // 同步刪除firebase內容
        db.collection("article").doc(itemID).delete();

	}

	revise(e){
		e.preventDefault();
        // alert("revise");
        
        let itemID=event.target.getAttribute("commentID");
        // alert(itemID);

        // this.setState({reviseStatus: true});
    }

    saveChange(e){
        this.setState({revise: "false"});
    }

    // componentWillMount(){
    //     // 讀取登入狀態

    //     const user = firebase.auth().currentUser;
    //     let userName
    //     let userEmail
    //     let photoUrl
    //     let uid

    //     if (user != null) {
    //         userName = user.displayName;
    //         userEmail = user.email;
    //         photoUrl = user.photoURL;
    //         uid = user.uid;  
    //         console.log(user);

    //         this.setState({loginStatus: true});
    //         // this.state.userInfor.push({userName:userName, userEmail:userEmail});
    //         // this.setState({userInfor: this.state.userInfor});
    //         // console.log("this.state.userInfor"+this.state.userInfor);
    //     }
    // }

    render(){

        let newPostDiv = this.state.commentWithID.map((text, index)=>{
                return  <div id={index} className="textBox">
                            <div id={index} className="textBoxNormal" 
                            commentID={text.commentID} >{text.comment}

                                <div id={index} className="editBoxShow">
                                    <div id={index} commentID={text.commentID} 
                                    // className="editBoxItem" onClick={this.revise.bind(this)}>訂正</div>
                                    // <div id={index} commentID={text.commentID} 
                                    className="editBoxItem" onClick={this.revise.bind(this)}>回覆</div>
                                    <div id={index} commentID={text.commentID} 
                                    className="editBoxItem" onClick={this.remove.bind(this)}>刪除</div>
                                </div>
                                
                            </div>
                        </div>
        })

        return(<div className="postboardAll">
                    {/* <div className="postboardPos"> */}
                        <div className="postarea">
                            <textarea placeholder="分享點什麼吧" id="textareaDiv"
                            // value={this.state.text}
                            onChange={this.handleTextChange.bind(this)}></textarea>
                            <button className="postBtn" onClick={this.addNewPost.bind(this)}>送出</button>
                        </div>
                        <div className="textBoxList">
                            {/* <div>新增欄位從這開始</div> */}
                            {newPostDiv}
                        </div>
                        {/* <div>總樣式種類預覽</div>
                        <BoardList /> */}
                    {/* </div> */}
                </div>
        )
        
    }
}

export default MainBoard;
