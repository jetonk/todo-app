import React, { Component } from 'react';
import './Home.css';
import { withRouter } from 'react-router-dom'


class Home extends Component {
    constructor(props){
        super(props);
        this.state = {value: ''};
        this.handleChange = this.handleChange.bind(this);
        this.onKeyPressed = this.onKeyPressed.bind(this);
        this.redirect = this.redirect.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    redirect(){
        if(this.state.value === ''){
            alert('Email cannot be empty.');
            return;
        }
        const isValid = this.validateEmail(this.state.value);
        if(!isValid){
            alert('Email address is invalid.');
            return;
        }
        this.props.history.push('/list', {email: this.state.value})
    }

    onKeyPressed(event){
        if(event.key === 'Enter') { //13 is the enter keycode
            this.redirect();
        }
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }

    render() {
        return (
            <div className="container">
                <div className="col-md-6 col-md-offset-3">
                    <div className="main">
                    <div className="jumbotron">
                        <h3>Type your email.</h3>
                        <div className="form-group">
                            <input type="text" placeholder="Email" className="form-control txt-email" value={this.state.value} onChange={this.handleChange} onKeyPress={this.onKeyPressed}/>
                        </div>
                        <div className="form-group">
                            <button onClick={this.redirect} className="btn btn-success btn-lg">Submit</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}
withRouter(Home);

export default Home;