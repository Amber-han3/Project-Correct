import React, { Component } from "react";
// import ReactDOM from "react-dom";
// import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import "./mainBoard.css"; 

class BoardList extends Component{
	constructor(props){
		super(props);
	}

	remove(e){
		e.preventDefault();
		alert("remove");
	}

	revise(e){
		e.preventDefault();
		alert("revise");
	}

	render(){
		return(
			<div className="textBoxList">
			<div className="textBoxNormal">顯示樣式1</div>
			<div className="textBox">
				<div className="textBoxNormal">顯示樣式2</div>
				<div className="editBox">
					<div className="editBoxItem" onClick={this.revise.bind(this)}>訂正</div>
					<div className="editBoxItem" onClick={this.remove.bind(this)}>刪除</div>
				</div>
			</div>
			
			<div className="textBoxNormal">顯示樣式3+被修改的樣式</div>
			<div className="textBox">
				<div className="textBoxEdit">顯示樣式3+被修改的樣式</div>
				<div className="editBox">
					<div className="editBoxItem">訂正</div>
					<div className="editBoxItem">刪除</div>
					<div className="editBoxItem">筆記</div>
				</div>
			</div>

			<div className="textBoxNormal">顯示樣式1</div>
		</div>			
		)
	}
}

export default BoardList;