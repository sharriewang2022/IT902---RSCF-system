import React from 'react';

interface Iprops {
    message?:string
}

function ErrorPage(props:Iprops) {
    return ( <div>
        <h2>Page error</h2>
        <p>{props.message}</p>
    </div> );
}

export default ErrorPage;