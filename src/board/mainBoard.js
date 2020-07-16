import React, { Component } from "react";
// import ReactDOM from "react-dom";
// import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import "./mainBoard.css";
import BoardList from "./boardList";

import firebase from './firebase';

// firebase相關

const db = firebase.firestore();

class MainBoard extends Component{
    constructor(props){
        super(props);
        this.state={text:"", commentWithID:[],  //紀錄文字內容用
        revise:"false",
        };  

        // 讀取firebase資料
        db.collection("users").get().then((querySnapshot) => {
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

        // 把回覆存進database

        const submitTime = new Date()

        db.collection("users").add({
            time: submitTime,
            userID: "no",
            comment: postText,
        })
        .then((docRef) => {
             console.log("Document written with comment: ", docRef.id.comment);

            // 取出db內容傳入新陣列，再放入state(避免重複render)

             db.collection("users").get().then((querySnapshot) => {
                let data=[];
                querySnapshot.forEach((doc) => {
    
                    //this.state.commentWithID.push({commentID: doc.id, comment: doc.data().comment});
                    //this.setState({commentWithID:this.state.commentWithID});
    
                    data.push({commentID: doc.id, comment: doc.data().comment});
                    console.log(data);
                });
                console.log(this.state.commentWithID);
                this.setState({commentWithID:data});
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
        db.collection("users").doc(itemID).delete();

	}

	revise(e){
		e.preventDefault();
        // alert("revise");
        
        let itemID=event.target.getAttribute("commentID");
        alert(itemID);

        // this.setState({revise: "true"});
    }

    saveChange(e){
        this.setState({revise: "false"});
    }

    render(){

        let newPostDiv = this.state.commentWithID.map((text, index)=>{
                return  <div id={index} className="textBox">
                            <div id={index} className="textBoxNormal" 
                            commentID={text.commentID} >{text.comment}

                                <div id={index} className="editBoxShow">
                                    <div id={index} commentID={text.commentID} 
                                    className="editBoxItem" onClick={this.revise.bind(this)}>訂正</div>
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
                            <div>新增欄位從這開始</div>
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
