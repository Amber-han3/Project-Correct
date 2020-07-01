import React from "react";
import ReactDOM from "react-dom";

// 標題

class TodoTitle extends React.Component{
    constructor(props){
        super(props);
        this.state={color:"orange"};
    }
    render(){
        return <h1 
        style={{color:this.state.color}}
        onClick={this.clickHandler.bind(this)}>Todo List</h1>
    }
    clickHandler(e){
        this.setState({color:"blue"});
    }
}

// 輸入

class AddTodo extends React.Component{
    constructor(props){
        super(props);
        this.state={text:"", todos:[]}; //初始化state，紀錄資料
        this.handleRemove = this.handleRemove.bind(this)
    }
    render(){
        let todoList= this.state.todos
        let lists = todoList.map((list, index)=>{
            return <div>
                <li key={index} id={index}>{list}</li>
                <button id={index} onClick={this.handleRemove}>刪除</button>
            </div>})

        return <div>
            <form onSubmit={this.handleSubmit.bind(this)}>
                <input type="text" value={this.state.text}
                    onChange={this.handleTextChange.bind(this)}
                />
                <input type="submit" value="新增" />
            </form>
            <div>{this.state.text}</div>
            <ul>
                {lists}             
            </ul>
        </div>
    }

    handleTextChange(e){
        this.setState({text:e.currentTarget.value});
    }
    handleSubmit(e){
        e.preventDefault();
        // console.log(this.state.text);
        let todo=this.state.text;
        this.state.todos.push(todo);

        this.setState({todos:this.state.todos});
        console.log("todos:"+this.state.todos);

    }
    handleRemove(e){
        e.preventDefault();
        let removeID=event.target.getAttribute("id");
        // let indexValue=parseInt(removeID);
        let indexValue=Number(removeID);
        console.log(indexValue);
        console.log(typeof(indexValue));

        let list= [...this.state.todos]
        list.splice(indexValue, 1); 
        //console.log(removeItem);
        this.setState({todos:list});
    }
}

// 最大的容器

class MyTodoList extends React.Component{
    render(){
        return <div>
            <TodoTitle />
            <AddTodo />
        </div>   
    }
}

window.addEventListener("load", ()=>{
    let myComponent=React.createElement(MyTodoList, null);
    ReactDOM.render(myComponent, document.querySelector("#root"));
})
