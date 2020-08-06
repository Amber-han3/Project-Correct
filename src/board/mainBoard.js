import React, { Component } from "react";
import "./mainBoard.css";
import "./mainBoardRWD.css";
import boardBackground from "./boardBackground.jpg"
import question from "./question.png"

import firebase from './firebase';

const db = firebase.firestore();

class MainBoard extends Component{
    constructor(props){
        super(props);
        this.state={

            // 登入資料相關
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

        if (user != null) {
            userName = user.displayName;
            userEmail = user.email; 
            this.setState({userName:userName, userEmail:userEmail});
        }

        // 讀取firebase資料
        db.collection("article").orderBy("time", "desc").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

                // 把讀取到的id存到state
                this.state.commentWithID.push({commentID: doc.id, comment: doc.data().comment,
                    userEmail: doc.data().userEmail,
                    userName: doc.data().userName,
                });
                this.setState({commentWithID:this.state.commentWithID});
            });
        });
        
    }

    addNewPost(e){
        e.preventDefault();
        let postText=document.getElementById("postDiv").value

        const user = firebase.auth().currentUser;
        let userName
        let userEmail
        if (user != null) {
            userName = user.displayName;
            userEmail = user.email;
            this.setState({userName:userName, userEmail:userEmail});
        };

        const submitTime = new Date()
        if(postText!=''){
            db.collection("article").add({
                time: submitTime,
                userName:userName, 
                userEmail:userEmail,
                comment: postText,
            })
            .then((docRef) => {

                // 取出db內容傳入新陣列，再放入state(避免重複render)，顯示在畫面上
                db.collection("article").orderBy("time", "desc").get().then((querySnapshot) => {
                    let data=[];
                    querySnapshot.forEach((doc) => {
                        data.push({commentID: doc.id, comment: doc.data().comment, 
                            userEmail: doc.data().userEmail,
                            userName: doc.data().userName,
                        });
                    });
                    
                    this.setState({commentWithID:data});

                    // 清空已送出的內容
                    document.getElementById("postDiv").value=""
                });         

            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        }
    } 

    remove(e){
		e.preventDefault();
        
        let indexValue=event.target.getAttribute("id");
        let textList= [...this.state.commentWithID]
        textList.splice(indexValue, 1); 
        this.setState({commentWithID:textList});

        // 同步刪除firebase內容
        let itemID=event.target.getAttribute("commentID");
        db.collection("article").doc(itemID).delete();
        alert("刪除成功");
        this.setState({replyNow:false, showMoreReply:false});
    }
    
    // 回覆相關功能

	reply(e){
        e.preventDefault();

        let replyDivID=event.target.getAttribute("commentID");
        let replyTarget=event.target.getAttribute("comment");
        this.setState({replyNow: true, replyDivID:replyDivID, replyTarget:replyTarget,
            showMoreReply:true});

        // 從資料庫讀取回來
        db.collection("article").doc(replyDivID).collection("reply")
        .orderBy("time", "desc").get().then((querySnapshot) => {
            let data=[];
            querySnapshot.forEach((doc) => {
                data.push({replyListID: doc.id, reply: doc.data().reply, 
                    userEmail: doc.data().userEmail,
                    userName: doc.data().userName,
                    revise:doc.data().revise,
                    reviseOrigin:doc.data().reviseOrigin});
            });

            this.setState({replyCollect:data});
        });

        this.setState({replyCollect:this.state.replyCollect});
    }

    sendReply(e){
        e.preventDefault();
        let replyDivID = this.state.replyDivID
        let newReply = document.getElementById("replyContent").value

        // 將回覆存在對應內容集合下
        const submitTime = new Date()
        
        if(newReply!=''){
            db.collection("article").doc(replyDivID).collection("reply").add({
                time: submitTime,
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
                            userEmail: doc.data().userEmail,
                            userName: doc.data().userName,
                            revise:doc.data().revise,
                            reviseOrigin: doc.data().reviseOrigin});
                    });

                    this.setState({replyCollect:data});
                });

                this.setState({replyCollect:this.state.replyCollect});

                // 清空已送出的內容
                document.getElementById("replyContent").value=""   
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            }); 
        }
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
        e.preventDefault();
        let reviseOrigin = this.state.replyTarget
        let reviseText = document.getElementById("reviseContent").value
        let replyDivID = this.state.replyDivID

        // 將回覆存在對應內容集合下
        const submitTime = new Date()

        db.collection("article").doc(replyDivID).collection("reply").add({
            time: submitTime,
            userEmail: this.state.userEmail,
            userName:this.state.userName,
            reply:reviseText,
            reviseOrigin: reviseOrigin,
            revise: true
        })
        .then((docRef) => {
            // 重新呼叫資料庫，更新畫面
            db.collection("article").doc(replyDivID).collection("reply")
            .orderBy("time", "desc").get().then((querySnapshot) => {
                let data=[];
                querySnapshot.forEach((doc) => {

                    data.push({replyListID: doc.id, reply: doc.data().reply, 
                        userEmail: doc.data().userEmail,
                        userName: doc.data().userName,
                        revise:doc.data().revise,
                        reviseOrigin:doc.data().reviseOrigin
                    });
                });

                this.setState({replyCollect:data}); 
            });

            this.setState({replyCollect:this.state.replyCollect});
            alert("訂正完成");

            // 清空已送出的內容
            document.getElementById("replyContent").value=""   

        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    reviseClose(e){
        this.setState({revise:false, replyNow:true});
    }

    render(){
        // 顯示資料庫內留言資料
        let newPostDiv = this.state.commentWithID.map((text, index)=>{
            return  <div id={index} className="textBox">
                        <div id={index} className="textBoxNormal" 
                        commentID={text.commentID}>
                            <div className="author">發表人：{text.userName||text.userEmail}</div>
                                {text.comment}
                            <div id={index} className="editMenu">
                                <div id={index} commentID={text.commentID} comment={text.comment}
                                    className="editButtons commentBtnColor" 
                                    onClick={this.reply.bind(this)}>回覆</div>
                                <div id={index} commentID={text.commentID} 
                                    className="editButtons cancelBtnColor" 
                                    onClick={this.remove.bind(this)}>刪除</div>
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

        // 訂正模式切換
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
                    <button id="replyClose" onClick={this.revise.bind(this)}
                        className="editButtons reviseBtnColor">訂正</button>
                    <button id="replyBtn" onClick={this.sendReply.bind(this)}
                        className="editButtons commentBtnColor">回覆</button>
                    <button id="replyClose" onClick={this.replyClose.bind(this)}
                        className="editButtons cancelBtnColor">取消</button>
                </div>
        }else if(this.state.revise){
            let reviseContent = ">>"+this.state.replyTarget
            replyBox =
                <div className="replyInputDiv">
                    <div className="reviseTitle">訂正模式<img className="replyNameIcon" src={question}
                    title="您可以幫忙修改發文者的文法或內容錯誤，此模式會特別標註您的修改"></img></div>
                    <div>回覆給：
                        <div className="replyTarget">{this.state.replyTarget}</div>
                    </div>
                    <textarea id="reviseContent" 
                        style={{color:"red"}}>{reviseContent}</textarea>
                    <div>顯示名稱<img className="replyNameIcon" src={question}
                        title="提示：可在帳號頁修改成自己喜歡的名字"></img>：{accountName}</div>
                    <button id="replyBtn" onClick={this.sendRevise.bind(this)}
                        className="editButtons reviseBtnColor">訂正</button>
                    <button id="replyClose" onClick={this.reviseClose.bind(this)}
                        className="editButtons cancelBtnColor">取消</button>
                </div>            
        }

        let replyList
        let replyListDiv
        if(this.state.showMoreReply){

            replyList = this.state.replyCollect.map((text, index)=>{
                // 有被修改則變色顯示
                if(text.revise==true){
                    return  <div id={index} className="textBox">
                        <div id={index} className="textBoxNormal" 
                        replyListID={text.replyListID}>
                            <div className="author">{text.userName||text.userEmail}給的修改建議</div>
                            <div className="reviseOrigin">{text.reviseOrigin}</div>
                            <div className="textRevised">
                                {text.reply}</div>
                        </div>
                    </div>
                }else{
                    return  <div id={index} className="textBox">
                        <div id={index} className="textBoxNormal" 
                        replyListID={text.replyListID}>
                            <div className="author">發表人：{text.userName||text.userEmail}</div>
                            {text.reply}
                        </div>
                    </div>
                }
            })

            // 有回覆與沒有任何回覆的畫面變化
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
                style={{backgroundImage: "url("+boardBackground+")"}}> 
                    <div className="postboardAll" >
                        <div className="postList">
                            <div className="postarea">
                                <textarea placeholder="分享點什麼吧" id="postDiv"></textarea>
                                <button className="postBtn" onClick={this.addNewPost.bind(this)}>送出</button>
                            </div>
                            {/* 留言內容列表 */}
                            <div className="textBoxList">
                                {newPostDiv}
                            </div>
                        </div>
                        {/* 回覆內容列表 */}
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
