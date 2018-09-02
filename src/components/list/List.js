import React, { Component } from 'react';
import './List.css';
import axios from 'axios';
import { withRouter } from 'react-router-dom'
import Config from '../../config';
const API_URL = Config.API_URL;

class List extends Component {
    constructor(props){
        super(props);
        this.state = {
            list: [],
            newlist: '',
            newitem: '',
            items: [],
            showItems: false,
            isChecked: false,
            selectedList: ''
        };
        this.handleInput = this.handleInput.bind(this);
        this.handleInputItem = this.handleInputItem.bind(this);
        this.addNewList = this.addNewList.bind(this);
        this.addNewItem = this.addNewItem.bind(this);
        this.showItems = this.showItems.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.backHome = this.backHome.bind(this);
        this.onKeyPressedNewList = this.onKeyPressedNewList.bind(this);
        this.onKeyPressedNewItem = this.onKeyPressedNewItem.bind(this);
    }

    async getList(email){
        let response = await axios.get(`${API_URL}/list/${email}`);
        if(response.data.success){
            this.setState({
                list: response.data.body,
            });
        }
    }

    componentDidMount(){
        let email;
        if(this.props.location.state){
           email = this.props.location.state.email;
           this.getList(email);
        }else{
           this.backHome();
        }
    }

    handleInput(event) {
        this.setState({newlist: event.target.value});
    }

    handleInputItem(event) {
        this.setState({newitem: event.target.value});
    }

    async addNewList(){
        if(this.state.newlist === ''){
            alert(`Description cannot be empty.`);
            return false;
        }
        let newList = {
            description: this.state.newlist,
            email:  this.props.location.state.email
        };
        let created = await axios.post(`${API_URL}/list/create`, newList);
        if(created.data.success){
            this.setState({
                newlist: ''
            })
        }
        this.setState({
            list: this.state.list.concat(created.data.body)
        });
    }

    showItems(item){
        this.setState({
            showItems: true,
            selectedList: item._id
        });
        this.getItems(item._id);
    }

    async getItems(listId){
        let response = await axios.get(`${API_URL}/list/${listId}/items/`);
        if(response.data.success){
            this.setState({
                items: response.data.body.items,
            });
        }else{
            this.setState({
                items: []
            });
        }
    }

    async addNewItem(){
        if(this.state.newitem === ''){
            alert(`Title cannot be empty.`);
            return false;
        }
        let listId = this.state.selectedList;
        let newItem = {
            title: this.state.newitem,
            state:  false
        };
        let created = await axios.put(`${API_URL}/list/${listId}/item`, newItem);
        if(created.data.success){
            let email = this.props.location.state.email;
            this.getList(email);
            this.setState({
                newitem: ''
            });
        }
        this.setState({

            items: created.data.body.items
        });
    }

    onKeyPressedNewList(event){
        if(event.key === 'Enter') { //13 is the enter keycode
            this.addNewList()
        }
    }
    onKeyPressedNewItem(event){
        if(event.key === 'Enter') { //13 is the enter keycode
            this.addNewItem()
        }
    }


    async handleCheckbox(event){
        const target = event.target;
        const name = target.name;
        const items = this.state.items;
        items[name].state = target.checked;
        const itemId = items[name]._id;
        const listId = this.state.selectedList;
        let update = await axios.put(`${API_URL}/list/${listId}/item/${itemId}/state`, {state: target.checked});
        if(update.data.success){
            this.setState({
                items,
            })
        }
    }

    backHome(){
        this.props.history.push('/')
    }

    render() {
        return (
            <div className="container">
                <div className="pull-left">
                    <button className="btn btn-warning btn-lg glyphicon glyphicon-home" onClick={this.backHome}></button>
                </div>
                <div className="main-list">
                <h1 className="text-center">Todo List</h1>
                <div className="col-md-6">
                    <h3>List</h3>
                        <ul className="list-group">
                            {this.state.list.map((item, index) => (
                                <li key={index} className="list-group-item" onClick={() => this.showItems(item)}>
                                    <span className="badge">{item.items.length}</span>
                                    {item.description}
                                </li>
                            ))}
                        </ul>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-9">
                                <input type="text" placeholder="Description" className="form-control" value={this.state.newlist} onChange={this.handleInput} onKeyPress={this.onKeyPressedNewList}/>
                            </div>
                            <div className="col-md-3">
                                <button className="btn btn-info glyphicon glyphicon-plus" onClick={this.addNewList}></button>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showItems && (
                    <div className="col-md-6">
                        <h3>Items</h3>
                        <ul className="list-group">
                            {this.state.items.map((item, index) => (
                                <li key={index} className="list-group-item">
                                    <div className="checkboxes">
                                        {item.title}
                                        <label className="switch pull-right">
                                            <input type="checkbox" checked={this.state.items[index].state} name={index} onChange={this.handleCheckbox}/>
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="form-group">
                            <div className="col-md-9">
                                <input type="text" placeholder="Title" className="form-control" value={this.state.newitem} onChange={this.handleInputItem} onKeyPress={this.onKeyPressedNewItem}/>
                            </div>
                            <div className="col-md-3">
                                <button className="btn btn-info glyphicon glyphicon-plus" onClick={this.addNewItem}></button>
                            </div>
                        </div>
                    </div>
                )}
                </div>
            </div>
        );
    }
}

withRouter(List);

export default List;