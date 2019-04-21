import React, {Component} from 'react';
import {connect} from 'react-redux';
import {firstLoadStart,
    firstLoadComplete,
    firstLoadError,
    userStarsLoadStart,
    userStarsLoadComplete,
    userStarsLoadError} from './actions.js';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import UserInfo from './UserInfo.js';

const MainStyle = styled.main`
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
`;

const H1Center = styled.h1`
    text-align:center
`;

const top10KyivLink = "https://api.github.com/search/users?q=location:Kyiv&sort=followers&order=desc&page=1&per_page=10";
//There was no sort by popularity, so used sort by followers instead


class ReduxApp extends Component{
    componentDidMount() {
        this.props.firstLoadStart();
        fetch(top10KyivLink)
            .then((response) => {return response.json()})
            .then((data) => {this.props.firstLoadComplete(data)})
            .catch((err) => {this.props.firstLoadError(err)});
    }
    render () {
       return (
        <MainStyle>
            {this.props.wait && (<H1Center>Not loading yet...</H1Center>) /* First message before loading */}    
            {this.props.loading && (<H1Center>Loading...</H1Center>) /* Message while loading */}  
            {this.props.error && (<div><H1Center>Error! Try again later!</H1Center><code>{this.props.error.toString()}</code></div>) /* in case of error */}
            {this.props.respond && this.props.starCount && (
                this.props.respond.items.map((user)=>{
                    return (<UserInfo login={user.login} avatar_url={user.avatar_url} 
                        html_url={user.html_url} starCount={this.props.starCount[user.login]} 
                        userStarsLoadStart={this.props.userStarsLoadStart} 
                        userStarsLoadComplete={this.props.userStarsLoadComplete}
                        userStarsLoadError={this.props.userStarsLoadError}
                        key={user.login}/>)
                })
            ) /* Here will be main output*/}          
        </MainStyle>
       );
   }
}

const mapStateToProps = (state) => {return {
    wait: state.wait,
    loading: state.loading,
    error: state.error,
    respond: state.respond,
    starCount: state.starCount
}}; //wanted to return{...state}, but was afraid that it can break something in redux connection or the component

const mapDispatchToProps = (dispatch) => {return {
    firstLoadStart: () => {dispatch(firstLoadStart())},
    firstLoadComplete: (data) => {dispatch(firstLoadComplete(data))},
    firstLoadError: (error) => {dispatch(firstLoadError(error))},
    userStarsLoadStart: (user) => {dispatch(userStarsLoadStart(user))},
    userStarsLoadComplete: (user, count) => {dispatch(userStarsLoadComplete(user, count))},
    userStarsLoadError: (user, error) => {dispatch(userStarsLoadError(user, error))}
}};

ReduxApp.propTypes = {
    wait: PropTypes.bool,
    loading: PropTypes.bool,
    error: PropTypes.object,
    respond: PropTypes.object,
    starCount: PropTypes.object,
    firstLoadStart: PropTypes.func.isRequired,
    firstLoadComplete: PropTypes.func.isRequired,
    firstLoadError: PropTypes.func.isRequired,
    userStarsLoadStart: PropTypes.func.isRequired,
    userStarsLoadComplete: PropTypes.func.isRequired,
    userStarsLoadError: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxApp);
