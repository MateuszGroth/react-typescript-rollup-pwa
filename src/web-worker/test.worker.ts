import { expose } from 'comlink';

function test(arg) {
    let str = 'test Worker';
    // let flag = true;
    // while (flag && arg) {
    //     flag = true;
    //     str += str;
    //     if (str.length > 100) {
    //         str = 'abc';
    //     }
    // }
    return str;
}

expose(test);

// setTimeout(() => {
//     postMessage('test 2');
// }, 4000);
