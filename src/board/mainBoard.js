import React, { Component } from "react";
import "./mainBoard.css";
import boardPic01L from "./boardPic01L.jpg"

import firebase from './firebase';

// firebase相關

const db = firebase.firestore();
firebase.auth();

class MainBoard extends Component{
    constructor(props){
        super(props);
        this.state={text:"", commentWithID:[],  //紀錄文字內容用
            // loginStatus: false, userInfor:[],  //確認登入狀態
            userInfor:[],
            // reviseStatus:false, //文字訂正狀態
            replyNow:false, replyDivID:"", replyTarget:[], //回覆狀態
            userName:"路人", userEmail:"沒有紀錄", //先拆開來測試
        };  

        // 讀取登入狀態

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

            // this.state.userInfor.push({userName:userName, userEmail:userEmail});
            // this.setState({userInfor: this.state.userInfor});
            // console.log("this.state.userInfor"+this.state.userInfor);
            this.setState({userName:userName, userEmail:userEmail});
            console.log(this.state.userEmail);
        }

        // 讀取firebase資料
        db.collection("article").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // 讀取測試
                // console.log(`${doc.id} => ${doc.data().comment}`);
                console.log(`${doc.id} => ${doc.data().userInfor.userEmail}`);

                // 把讀取到的id存到state
                this.state.commentWithID.push({commentID: doc.id, comment: doc.data().comment,
                    userEmail: doc.data().userInfor.userEmail});
                this.setState({commentWithID:this.state.commentWithID});
                // console.log("commentWithID:"+this.state.commentWithID);
                console.log(this.state.commentWithID.userEmail);
            });
        });
        
    }

    addNewPost(e){
        e.preventDefault();
        let postText=document.getElementById("postDiv").value

        // firebase相關

        const firebase = require("firebase");
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
            // this.state.userInfor.push({userEmail:userEmail});
            this.setState({userInfor:{userName:userName, userEmail:userEmail} });
            // this.setState({userInfor: this.state.userInfor});
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
    
                    data.push({commentID: doc.id, comment: doc.data().comment, userEmail: doc.data().userInfor[0]});
                    console.log(data.userEmail);
                });
                // console.log(this.state.commentWithID);
                this.setState({commentWithID:data});
            });         

        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });

        // 以使用者為分類存進database

        // db.collection("user").doc(this.state.userInfor.userEmail).add({
        //     time: submitTime,
        //     userEmail: this.state.userInfor.userEmail,
        //     comment: postText,
        // });

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
    
    // 回覆相關功能

	reply(e){
		e.preventDefault();
        
        let itemID=event.target.getAttribute("commentID");
        console.log(itemID);

        this.setState({replyNow: true, replyDivID:itemID});

    }

    sendReply(e){
        e.preventDefault();
        let replyDivID = this.state.replyDivID
        let reply = document.getElementById("replyContent").value
        console.log(reply);

        // 以文章為分類存進database

        require("firebase/firestore");

        const submitTime = new Date()

        db.collection("article").doc(replyDivID).add({
            time: submitTime,
            // userInfor: this.state.userInfor,
            userEmail: this.state.userEmail,
            reply: [reply]
        })
        // .then((docRef) => {
        //         console.log("Document written with comment: ", docRef.id.comment);

        //     // 取出db內容傳入新陣列，再放入state(避免重複render)，顯示在畫面上

        //         db.collection("article").get().then((querySnapshot) => {
        //         let data=[];
        //         querySnapshot.forEach((doc) => {
    
        //             //this.state.commentWithID.push({commentID: doc.id, comment: doc.data().comment});
        //             //this.setState({commentWithID:this.state.commentWithID});
    
        //             data.push({commentID: doc.id, comment: doc.data().comment, userEmail: doc.data().userInfor[0]});
        //             console.log(data.userEmail);
        //         });
        //         // console.log(this.state.commentWithID);
        //         this.setState({commentWithID:data});
        //     });         

        // })
        // .catch(function(error) {
        //     console.error("Error adding document: ", error);
        // });
        
    }

    replyClose(e){
        this.setState({replyNow: false});
    }

    render(){

        let replyBox
        if(this.state.replyNow){
            replyBox =
                <div className="replyInputDiv">
                    <div>回覆給：
                        <div>{}</div>
                    </div>
                    <textarea id="replyContent"></textarea>
                    <div>顯示名稱：{this.state.userEmail}</div>
                    <button id="replyBtn" onClick={this.sendReply.bind(this)}>送出</button>
                    <button id="replyClose" onClick={this.replyClose.bind(this)}>取消</button>
                </div>
        }

        let newPostDiv = this.state.commentWithID.map((text, index)=>{
                return  <div id={index} className="textBox">
                            <div id={index} className="textBoxNormal" 
                            commentID={text.commentID} >{text.comment}
                                <div>發表人：{text.userEmail}</div>
                                <div id={index} className="editBoxShow">
                                    <div id={index} commentID={text.commentID} 
                                    // className="editBoxItem" onClick={this.revise.bind(this)}>訂正</div>
                                    // <div id={index} commentID={text.commentID} 
                                    className="editBoxItem" onClick={this.reply.bind(this)}>回覆</div>
                                    <div id={index} commentID={text.commentID} 
                                    className="editBoxItem" onClick={this.remove.bind(this)}>刪除</div>
                                </div>
                            </div>
                        </div>
        })

        return(<div className="boardPic" 
                style={{backgroundImage: "url("+boardPic01L+")",
                backgroundSize: 'cover', 
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: "fixed",
                }}> 
                    <div className="postboardAll" >
                        <div className="postList">
                            <div className="postarea">
                                <textarea placeholder="分享點什麼吧" id="postDiv"></textarea>
                                {/* onChange={this.handleTextChange.bind(this)}></textarea> */}
                                <button className="postBtn" onClick={this.addNewPost.bind(this)}>送出</button>
                            </div>
                            <div className="textBoxList">
                                {newPostDiv}
                            </div>
                        </div>
                        <div className="replyList">{replyBox}</div>
                    </div>
                </div>
        )
        
    }
}

export default MainBoard;
