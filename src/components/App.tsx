import React from 'react';

const App = props => {
    const x: Array<number | string> = [1, 2, 'czesc'];
    return (
        <h4>
            Hello World
            <ul>
                {x.map((variable: string | number) => (
                    <li key={variable}>{'' + variable}</li>
                ))}
            </ul>
        </h4>
    );
};

export default App;
