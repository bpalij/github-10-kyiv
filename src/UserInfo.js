import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


const UserDiv = styled.article`
    border: 1px solid black;
    width: 700px;
    margin: 0 auto 10px;
`;

const UserImg = styled.img`
    float: left;
    margin-right: 10px;
`;

// const InlineDiv = styled.div`
//     display: inline-block;
//     width: 100%;
// `;

const ClearFix = styled.div`
    clear: both;
`;

function getOwnUserPublicRepoPageLink(user, page){
    return `https://api.github.com/users/${user}/repos?page=${+page}&per_page=100`;
    // +page - convert to number
    // unfortunately, github does not let request all repos, only max 100 for once
}

// NOTE: May work wrong, if total stars is > max safe int (which is near to impossible); alternative counter below this one
function countTotalStarsHavingAllOwnPublicReposOfUser(allRepos) {
    return allRepos.reduce((stars, repo) => {return stars+(+repo.stargazers_count)/*to be sure we are adding numbers, not strings*/},0 /* init value */)
}

// NOTE: May work wrong, if browser does not support BigInt, alternative above this counter
// create-react-app does not compile it, so disabled this by commenting
// function countTotalStarsHavingAllOwnPublicReposOfUserBigInt(allRepos) {
//     return allRepos.reduce((stars, repo) => {return stars+BigInt(repo.stargazers_count)/*to be sure we are adding numbers, not strings*/},0n /* init value */)
// }

// created universal workaround with support >100 repos
// NOTE: May work wrong, if a single repo has more than max safe int stars (what is VERY near to impossible)
async function getAllOwnPublicReposOfUser(user){
    try {
        let resultArray=[];
        let temp;
        // experimented with different loops
        // let pageNumber=1;
        // do {
        //     temp=null;
        //     temp = await fetch(getRepoLink(user,pageNumber))
        //         .then((response) => {return response.json()})
        //         .catch((e)=> {throw (e)});
        //     if (!Array.isArray(temp)) {throw new Error("Not-array response!")};
        //     if (temp.length>100) {throw new Error("Array bigger than must be!")};
        //     if (temp.length===0) {return resultArray}
        //     if (temp.length<100) {
        //         resultArray=resultArray.concat(temp);
        //         return resultArray;
        //     }
        //     if (temp.length===100) {
        //         resultArray=resultArray.concat(temp);
        //         pageNumber++;
        //         continue;
        //     } 
        // } while (true /* exits are specified inside */);
        for (let pageNumber=1; true /* exits are specified inside */; pageNumber++) {
            temp=null;
            temp = await fetch(getOwnUserPublicRepoPageLink(user,pageNumber)) //getting a page with repos
                .then((response) => {return response.json()}); //this could be a second await, but this will work fine too
                // .catch((e)=> {Promise.reject(e)}); //error handling here is not necessary, but added just to be more confident //experimented with different finishes of func (return-resolve, throw-reject)
            if (temp instanceof Error) {Promise.reject(temp)}; //error handling
            if (!Array.isArray(temp)) {throw new Error("Not-array response!")}; //just for safety //experimented with different finishes of func (return-resolve, throw-reject)
            if (temp.length>100) {throw new Error("Array bigger than must be!")}; //just for safety //experimented with different finishes of func (return-resolve, throw-reject)
            if (temp.length===0) {return resultArray} //empty page = repos are on the previous ones or the user has no repos, no need to continue //experimented with different finishes of func (return-resolve, throw-reject)
            if (temp.length<100) { //page is not full, it means we already have all repos and no need to continue
                resultArray=resultArray.concat(temp);
                Promise.resolve(resultArray); //experimented with different finishes of func (return-resolve, throw-reject)
            }
            if (temp.length===100) {
                resultArray=resultArray.concat(temp); //the page is full, so concat to result and check next
                // pageNumber++;
                // continue;
            } 
        }
    } catch (e) { // do not think try-catch is required, but added just to be more sure
        throw e;
    }
}
// function tested in codesandbox on user "gaearon" who had 234 repos at that moment(3 pages required), "SilverFire" who had 72 repos(1page), "satyanadella" who had 0 repos 
// if we had a total amount of repos before their getting, we could generate an array of fetch promises and use Promise.all() instead of a traditional loop with async-await, which could be faster, because page n would not have to wait page n-1, but we do not have info about repo amount, so it is done the way it is done    

class UserInfo extends Component{
    componentDidMount() {
        this.props.userStarsLoadStart(this.props.login);
        getAllOwnPublicReposOfUser(this.props.login)
            .then((repos) => {
                this.props.userStarsLoadComplete(this.props.login, 
                    countTotalStarsHavingAllOwnPublicReposOfUser(repos))
            })
            .catch((e)=>{this.props.userStarsLoadError(this.props.login, e)})
    }
    render() {
        return (
            <UserDiv>
                <UserImg alt={`${this.props.login} avatar`} src={this.props.avatar_url} width="150px"></UserImg>
                <div>
                    <section><a href={this.props.html_url} target="_blank" rel="noopener noreferrer">{this.props.login}</a></section>
                    <section>Total stars on own public repos: {this.props.starCount}</section>
                </div>
                <ClearFix></ClearFix>
            </UserDiv>
        )
    }
}

//extra info like e-mail, description, etc. omitted, 
// because github api does not provide that data in standard user search and nothing is written in task pdf
// instead added total stars count on own public repos, as written in extra task 

UserInfo.propTypes = {
   login: PropTypes.string.isRequired,
   avatar_url: PropTypes.string.isRequired,
   html_url: PropTypes.string.isRequired,
   starCount: PropTypes.oneOfType([
       PropTypes.string,
       PropTypes.number
   ]).isRequired,
   userStarsLoadStart: PropTypes.func.isRequired,
   userStarsLoadComplete: PropTypes.func.isRequired,
   userStarsLoadError: PropTypes.func.isRequired
}

export default UserInfo;