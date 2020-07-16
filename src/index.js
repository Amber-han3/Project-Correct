import React from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";

// 改把nav直接寫在index
// import Navbar from "./navbar/navbar";
import "./navbar/navbar.css";

import MainBoard from "./board/mainBoard"
import LoginPage from "./loginPage/loginPage";

// import BoardList from "./board/boardList" 

// 最大的容器

// 原本的
// class MainPage extends React.Component{
//     render(){
//         return <div>
//             <Navbar />
//             <LoginPage />
//             <MainBoard />
//             {/* <BoardList /> */} 
//         </div>   
//     }
// }

// 加router

class MainPage extends React.Component{

    logout(e){
        // alert("logout");
        firebase.auth();
        const user = firebase.auth().currentUser;
        console.log(user);
    
        if (user != null) {
            firebase.auth().signOut()
            .then(()=>{
                // this.setState({loginState:true});
                // console.log(this.state.loginState);
                alert("已登出");

                const user = firebase.auth().currentUser;
                console.log(user);
            });
          
        };
    }

    render(){
        return <Router>
            <div>
                <div className="headerLine">
                    <div className="websiteTitle">CORRECT</div>
                    <ul className="navbar">
                        <li>
                            <Link to="/main">動態</Link>
                        </li>
                        <li>筆記</li>
                        <li>尋找</li>
                        <li>帳號</li>
                        <li>
                            <Link to="/login">登入</Link> 
                        </li>
                        <li id="logout" onClick={this.logout.bind(this)}>
                            <Link to="/login">登出</Link> 
                        </li>
                    </ul>
                </div>
                {/* <LoginPage />
                <MainBoard /> */}

                <div>{this.props.children}</div>

                <Switch>
                    {/* 預設顯示登入頁 */}
                    <Route exact path="/" component={LoginPage}></Route> 

                    {/* 登入tag之後要拿掉 */}
                    <Route path="/login" component={LoginPage}></Route>
                    <Route path="/main" component={MainBoard}></Route> 
                </Switch>
            </div> 
        </Router>
         
    }
}

// // 原本的
// window.addEventListener("load", ()=>{
//     let myComponent=React.createElement(MainPage, null);
//     ReactDOM.render(myComponent, document.querySelector("#root"));
// })

ReactDOM.render( 
    <Router>
      <MainPage />
    </Router>,
    document.querySelector("#root")
  );