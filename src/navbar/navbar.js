import React from "react";
// import ReactDOM from "react-dom";
// import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import "./navbar.css";

const Navbar = () =>{
	return(
        <div className="headerLine">
            <div className="websiteTitle">CORRECT</div>
            <ul className="navbar">
                <li>動態</li>
                <li>筆記</li>
                <li>尋找</li>
                <li>帳號</li>
                <li>登入</li>
                <li>登出</li>  
            </ul>
	    </div>
    )
}	 

export default Navbar;
