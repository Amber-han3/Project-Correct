import React, { Component } from "react";
// import ReactDOM from "react-dom";
// import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import "./mainBoard.css";
import BoardList from "./boardList"

class MainBoard extends Component{
    constructor(props){
        super(props);
        this.state={text:"", allContent:[], //紀錄文字內容用
        revise:"false",
        };  
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
    }

    remove(e){
		e.preventDefault();
        
        let removeID=event.target.getAttribute("id");
        let indexValue=Number(removeID);

        let textList= [...this.state.allContent]
        textList.splice(indexValue, 1); 
        this.setState({allContent:textList});
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
