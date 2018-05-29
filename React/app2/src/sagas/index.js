import{call, put, take, fork} from "redux-saga/effects" ;
function * fetchUrl(url){
    console.log(url)
    const data = yield call(fetch, url);
    yield put({type:"FETCH_SUCCESS", data})
}

export default function * watchFetchRequests(){
    while(true){
        const action = yield take("FETCH_REQUEST");
        yield fork(fetchUrl, action.Url)
    }
}