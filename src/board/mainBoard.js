import React, { Component } from "react";
// import ReactDOM from "react-dom";
// import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import "./mainBoard.css";
import BoardList from "./boardList"

class MainBoard extends Component{
    render(){
        return(<div className="postboardAll">
                    <div className="postarea">
                        <textarea placeholder="輸入"></textarea>
                        <button className="postBtn">送出</button>
                    </div>
                    <BoardList />
                </div>
        )
        
    }
}

export default MainBoard;