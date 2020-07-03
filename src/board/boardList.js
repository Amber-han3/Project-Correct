import React, { Component } from "react";
// import ReactDOM from "react-dom";
// import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import "./mainBoard.css";

const BoardList = () =>{
	return(
		<div class="textBoxList">
			<div class="textBoxNormal">顯示內容1</div>
			<div class="textBox">
				<div class="textBoxNormal">顯示內容2</div>
				<div class="editBox">
					<div class="editBoxItem">編輯</div>
					<div class="editBoxItem">刪除</div>
				</div>
			</div>
			
			<div class="textBoxNormal">顯示內容3+被修改的樣式</div>
			<div class="textBox">
				<div class="textBoxEdit">顯示內容3+被修改的樣式</div>
				<div class="editBox">
					<div class="editBoxItem">編輯</div>
					<div class="editBoxItem">刪除</div>
					<div class="editBoxItem">筆記</div>
				</div>
			</div>

			<div class="textBoxNormal">顯示內容4</div>
		</div>
    )
}	 

export default BoardList;