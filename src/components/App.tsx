import React, { Suspense } from 'react';

const Test = React.lazy(async () => import('./Test'));

const App = props => {
    const x: Array<number | string> = [1, 2, 'czesc'];
    return (
        <Suspense fallback={<div>Page is Loading...</div>}>
            <h4>
                <Test />
                <br />
                Hello World
                <ul>
                    {x.map((variable: string | number) => (
                        <li key={variable}>{'' + variable}</li>
                    ))}
                </ul>
            </h4>
        </Suspense>
    );
};

export default App;
