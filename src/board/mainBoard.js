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
        this.state={text:"", allContent:[], //紀錄文字內容用
        revise:"false",
        };  

        // 官網的讀取測試(只讀取集合)
        db.collection("users").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // console.log(`${doc.id} => ${doc.data()}`);
                // 可以跨doc讀到全部comment欄位
                console.log(`${doc.id} => ${doc.data().comment}`);

                // 把讀取到的id存到allContent，跟removeID一樣作法

                // 測試直接把東西存進state

                this.state.allContent.push(doc.data().comment);
        
                this.setState({allContent:this.state.allContent});
                console.log("allContent:"+this.state.allContent);
            });
        });
        
    }

    handleTextChange(e){
        if (typeof(e.currentTarget.value) == "string" || typeof(e.currentTarget.value) == "number" ){
            this.setState({text:e.currentTarget.value});
        }   //目前好像沒作用
    }

    addNewPost(e){
        e.preventDefault();
        let postText=this.state.text;
        this.state.allContent.push(postText);

        this.setState({allContent:this.state.allContent});
        console.log("allContent:"+this.state.allContent);

        // // firebase相關

        const firebase = require("firebase");
        // Required for side-effects
        require("firebase/firestore");

        // 可把回覆存進database了

        db.collection("users").add({
            userID: "no",
            comment: postText,
        })
        .then(function(docRef) {
            console.log("Document written with comment: ", docRef.id.comment);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });

    } 

    remove(e){
		e.preventDefault();
        
        let removeID=event.target.getAttribute("id");
        let indexValue=Number(removeID);

        let textList= [...this.state.allContent]
        textList.splice(indexValue, 1); 
        this.setState({allContent:textList});

        // // 先讀取自動生成的文件id

        // db.collection("users").get().then((querySnapshot) => {
        //     querySnapshot.forEach((doc) => {
        //         console.log(`${doc.id} => ${doc.data().comment}`);

        //         console.log(this.state.allContent[indexValue]);
        //     });
        // });

        // 同步刪除firebase內容
        // const firebase = require("firebase");
        // // Required for side-effects
        // require("firebase/firestore");
        // // db.ref('users').child(id).remove();
        // // firebase.firestore().ref('users').child(id).remove();
        // firebase.firestore().ref('users').child(hnHPrASSZFA7JxZk1gN0).remove();

	}

	revise(e){
		e.preventDefault();
        alert("revise");
        
        let text=this.state.text
        console.log(text);

        this.setState({revise: "true"});


    }

    saveChange(e){
        this.setState({revise: "false"});
    }

    render(){

        let newPostDiv = this.state.allContent.map((text, index)=>{
            return <div id={index} className="textBox">
                        <div id={index} className="textBoxNormal">{text}</div>

                        <div id={index} className="editBoxShow">
                            <div id={index} className="editBoxItem" onClick={this.revise.bind(this)}>訂正</div>
                            <div id={index} className="editBoxItem" onClick={this.remove.bind(this)}>刪除</div>
                        </div>
                    </div>
        })

        return(<div className="postboardAll">
                    {/* <div className="postboardPos"> */}
                        <div className="postarea">
                            <textarea placeholder="分享點什麼吧" 
                            value={this.state.text}
                            onChange={this.handleTextChange.bind(this)}></textarea>
                            <button className="postBtn" onClick={this.addNewPost.bind(this)}>送出</button>
                        </div>
                        <div className="textBoxList">
                            <div>新增欄位從這開始</div>
                            {newPostDiv}
                        </div>
                        <div>總樣式種類預覽</div>
                        <BoardList />
                    {/* </div> */}
                </div>
        )
        
    }
}

export default MainBoard;
