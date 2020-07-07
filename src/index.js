import React from "react";
import ReactDOM from "react-dom";
import Navbar from "./navbar/navbar";
// import MainBoard from "./board/mainBoard"
import LoginPage from "./loginPage/loginPage";

// import BoardList from "./board/boardList" 

// 最大的容器

class MainPage extends React.Component{
    render(){
        return <div>
            <Navbar />
            {/* <MainBoard /> */}
            {/* <BoardList /> */}
            <LoginPage />
        </div>   
    }
}

window.addEventListener("load", ()=>{
    let myComponent=React.createElement(MainPage, null);
    ReactDOM.render(myComponent, document.querySelector("#root"));
})
