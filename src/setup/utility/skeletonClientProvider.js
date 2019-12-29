import {getStore, setStore} from "trim-redux";
import {queryStringParams} from "rssr-query-string";
import {matchPath} from "react-router-dom";
import {browserHistory} from "../browserHistory";
import {routeMap} from "../routeMap";
import App from "../../App/App";

export const skeletonClientProvider = function () {
    // when server fetch data successfully
    if (getStore('skeletonError') !== true){
        debugLog(false)
        return;
    }

    // calculate fetch params
    const ftechParams = {
        match: {},
        query: queryStringParams()
    };

    routeMap.find(route => {
        // is object for matched or null for not matched
        const match = matchPath(browserHistory.location.pathname, route);

        if (match)
            ftechParams.match = match;

        return match;
    });

    App.skeleton(ftechParams)
        .then(function (response) {
            setStore('skeleton', response.data)
            debugLog(true)
        })
}


function debugLog(inClient) {
    if (JSON.parse(process.env.RSSR_SKELETON_DEBUG))
        console.info((inClient ? '🙎‍♂️' : '🌎') + ' fetch skeleton in ' + (inClient ? 'client' : 'server'));
}
