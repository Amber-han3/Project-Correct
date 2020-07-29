import React, { Component } from "react";
import "./mainBoard.css";
import boardPic01L from "./boardPic01L.jpg"
import question from "./question.png"

import firebase from './firebase';

// firebase相關

const db = firebase.firestore();

class MainBoard extends Component{
    constructor(props){
        super(props);
        this.state={

            // 登入資料相關
            userInfor:[],
            userName:firebase.auth().currentUser.displayName||firebase.auth().currentUser.email, 
            userEmail:firebase.auth().currentUser.email,

            // 一般發文紀錄文字內容用
            text:"", commentWithID:[],  
            
            //回覆相關
            replyNow:false, replyDivID:"", replyTarget:"", replyCollect:[],
            showMoreReply: false, //是否展開更多回覆

            //文字訂正狀態
            revise:false, 

        };  

        // 讀取登入狀態

        const user = firebase.auth().currentUser;
        let userName
        let userEmail
        let photoUrl

        if (user != null) {
            userName = user.displayName;
            userEmail = user.email;
            photoUrl = user.photoURL;
            console.log(user);

            this.setState({userName:userName, userEmail:userEmail});
            console.log(this.state.userEmail);
        }

        // 讀取firebase資料
        db.collection("article").orderBy("time", "desc").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // 讀取測試
                // console.log(`${doc.id} => ${doc.data().userInfor.userEmail}`);

                // 把讀取到的id存到state
                this.state.commentWithID.push({commentID: doc.id, comment: doc.data().comment,
                    userEmail: doc.data().userInfor.userEmail,
                    userName: doc.data().userInfor.userName});
                this.setState({commentWithID:this.state.commentWithID});
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

            this.setState({userInfor:{userName:userName, userEmail:userEmail} });
            console.log("this.state.userInfor"+this.state.userInfor);
        };

        // 以文章為分類存進database

        const submitTime = new Date()

        db.collection("article").add({
            time: submitTime,
            userInfor: {userName:userName, userEmail:userEmail},
            userName:userName, 
            userEmail:userEmail,
            comment: postText,
        })
        .then((docRef) => {
            //  console.log("Document written with comment: ", docRef.id.comment);

            // 取出db內容傳入新陣列，再放入state(避免重複render)，顯示在畫面上

             db.collection("article").orderBy("time", "desc").get().then((querySnapshot) => {
                let data=[];
                querySnapshot.forEach((doc) => {
    
                    data.push({commentID: doc.id, comment: doc.data().comment, 
                        userEmail: doc.data().userInfor.userEmail,
                        userName: doc.data().userInfor.userName});
                });
                this.setState({commentWithID:data});
                alert("發布成功");

                // 清空已送出的內容
                document.getElementById("postDiv").value=""
            });         

        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
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

        alert("刪除成功");

        this.setState({replyNow:false, showMoreReply:false});
        
    }
    
    // 回覆相關功能

	reply(e){
        e.preventDefault();

        // 輸入回覆部分

        let itemID=event.target.getAttribute("commentID");
        console.log(itemID);
        let replyTarget=event.target.getAttribute("comment");

        this.setState({replyNow: true, replyDivID:itemID, replyTarget:replyTarget,
            showMoreReply:true});

        // 從資料庫讀取回來
        db.collection("article").doc(itemID).collection("reply")
        .orderBy("time", "desc").get().then((querySnapshot) => {
            let data=[];
            querySnapshot.forEach((doc) => {

                data.push({replyListID: doc.id, reply: doc.data().reply, 
                    userEmail: doc.data().userInfor.userEmail,
                    userName: doc.data().userInfor.userName});
            });

            this.setState({replyCollect:data});
            console.log(this.state.replyCollect);

        });

        this.setState({replyCollect:this.state.replyCollect});
        
    }

    sendReply(e){
        e.preventDefault();
        let replyDivID = this.state.replyDivID
        let newReply = document.getElementById("replyContent").value

        // 將內容回覆存在對應內容集合下

        require("firebase/firestore");
        const submitTime = new Date()

        db.collection("article").doc(replyDivID).collection("reply").add({
            time: submitTime,
            userInfor: {userName:this.state.userName, userEmail:this.state.userEmail},
            userEmail: this.state.userEmail,
            userName:this.state.userName,
            reply:newReply
        })
        .then((docRef) => {

            // 重新呼叫資料庫，更新畫面
            db.collection("article").doc(replyDivID).collection("reply")
            .orderBy("time", "desc").get().then((querySnapshot) => {
                let data=[];
                querySnapshot.forEach((doc) => {

                    data.push({replyListID: doc.id, reply: doc.data().reply, 
                        userEmail: doc.data().userInfor.userEmail,
                        userName: doc.data().userInfor.userName});
                });

                this.setState({replyCollect:data});
                console.log(this.state.replyCollect);

            });

            this.setState({replyCollect:this.state.replyCollect});
            alert("回應成功");

            // 清空已送出的內容
            document.getElementById("replyContent").value=""   

        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
        
    }

    // 關閉回覆輸入欄位
    replyClose(e){
        this.setState({replyNow:false, showMoreReply:false});
    }

    // 訂正功能

    revise(e){

        this.setState({revise:true, replyNow:false});

        // 帶入原始回覆內容
        document.getElementById("reviseContent").value=this.state.replyTarget
    }

    sendRevise(e){

    }

    reviseClose(e){
        this.setState({revise:false, replyNow:true});
    }

    render(){

        // 將資料庫讀回來的留言資料顯示在畫面上
        let newPostDiv = this.state.commentWithID.map((text, index)=>{
                return  <div id={index} className="textBox">
                            <div id={index} className="textBoxNormal" 
                            commentID={text.commentID}>
                                <div className="author">發表人：{text.userName||text.userEmail}</div>
                                {text.comment}

                                <div id={index} className="editBoxShow">
                                    <div id={index} commentID={text.commentID} comment={text.comment}
                                    className="editBoxItem" onClick={this.reply.bind(this)}>回覆</div>
                                    <div id={index} commentID={text.commentID} 
                                    className="editBoxItem" onClick={this.remove.bind(this)}>刪除</div>
                                </div>
                            </div>                        
                        </div>
        })

        // 顯示帳號名稱(有自訂名字優先使用，沒有則使用mail)
        let accountName
        if(this.state.userName!=null||this.state.userName!=undefined){
            accountName = this.state.userName
        }else{
            accountName = this.state.userEmail
        }

        // 輸入回覆欄位設置點擊顯示
        let replyBox
        if(this.state.replyNow){
            replyBox =
                <div className="replyInputDiv">
                    <div>回覆給：
                        <div className="replyTarget">{this.state.replyTarget}</div>
                    </div>
                    <textarea id="replyContent"></textarea>
                    <div>顯示名稱<img className="replyNameIcon" src={question}
                    title="提示：可在帳號頁修改成自己喜歡的名字"></img>：{accountName}</div>

                    {/* 訂正調整中 */}
                    <button id="replyClose" onClick={this.revise.bind(this)}
                        className="editBoxItem">訂正</button>

                    <button id="replyBtn" onClick={this.sendReply.bind(this)}
                        className="editBoxItem">送出</button>
                    <button id="replyClose" onClick={this.replyClose.bind(this)}
                        className="editBoxItem">取消</button>

                </div>
        }else if(this.state.revise){
            replyBox =
                <div className="replyInputDiv">
                    <div className="reviseTitle">訂正模式<img className="replyNameIcon" src={question}
                    title="您可以幫忙修改發文者的文法或內容錯誤，此模式會進行特殊顯示"></img></div>
                    <div>回覆給：
                        <div className="replyTarget">{this.state.replyTarget}</div>
                    </div>
                    <textarea id="reviseContent" value={this.state.replyTarget}></textarea>
                    <div>顯示名稱<img className="replyNameIcon" src={question}
                    title="提示：可在帳號頁修改成自己喜歡的名字"></img>：{accountName}</div>
                    <button id="replyBtn" onClick={this.sendRevise.bind(this)}
                        className="editBoxItem">訂正</button>
                    <button id="replyClose" onClick={this.reviseClose.bind(this)}
                        className="editBoxItem">取消</button>
                </div>            
        }

        // 展開回覆列表並顯示在畫面上

        let replyList
        let replyListDiv
        if(this.state.showMoreReply){

            replyList = this.state.replyCollect.map((text, index)=>{

            return  <div id={index} className="textBox">
                        <div id={index} className="textBoxNormal" 
                        replyListID={text.replyListID}>
                            <div className="author">發表人：{text.userName||text.userEmail}</div>
                            {text.reply}

                            {/* <div id={index} className="editBoxShow">
                                <div id={index} commentID={text.commentID} comment={text.comment}
                                className="editBoxItem" onClick={this.reply.bind(this)}>回覆</div>
                                <div id={index} commentID={text.commentID} 
                                className="editBoxItem" onClick={this.remove.bind(this)}>刪除</div>
                            </div> */}
                        </div>
                    </div>
            })

            if(replyList.length!=0){

            replyListDiv = <div className="replyListDiv">
                    <div className="replyListTitle">
                        <div className="replyTarget">{this.state.replyTarget}</div>
                        <div>的全部回覆</div>
                        {replyList}
                    </div>
                </div>
            }else{
                replyListDiv = <div className="replyListDiv">
                    <div className="replyListTitle">
                        <div className="replyTarget">{this.state.replyTarget}</div>
                        <div>的全部回覆</div>
                        <div className="replyNotFound">還沒有任何回覆</div>
                    </div>
                </div>
            }
        }

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
                                <button className="postBtn" onClick={this.addNewPost.bind(this)}>送出</button>
                            </div>
                            <div className="textBoxList">
                                {newPostDiv}
                            </div>
                        </div>
                        <div className="replyList">
                            <div>{replyListDiv}</div>
                            <div>{replyBox}</div>
                        </div>
                    </div>
                </div>
        )
        
    }
}

export default MainBoard;
