import { FunctionComponent } from 'react';
export interface ComponentProps {
    className?: string;
    disabled?: boolean;
    value?: any;
    active?: boolean | string;
    onChange?: CallableFunction;
    onBlur?: CallableFunction;
    onFocus?: CallableFunction;
    onClick?: CallableFunction;
    label?: string;
    style?: object | any;
    onMouseDown?: CallableFunction;
}

export interface ModalReducerAction {
    type: 'show' | 'hide';
    payload?: FunctionComponent;
}

export interface ModalState {
    visible: boolean;
    content?: FunctionComponent;
}

export type Callback = (...args: any[]) => void;

export interface InputState {
    value?: string | number;
    valid?: boolean;
    touched?: boolean;
    message?: string;
    focus?: boolean;
}

export type MoveDirection = 'up' | 'down' | 'left' | 'center' | 'right';

export interface Desk {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface OfficeRoom {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    limit: number;
    desks: Array<Desk>;
}
export interface OfficeFloor {
    id: string;
    level: number;
    rooms: Array<OfficeRoom>;
}

export interface MoveReducerState {
    upDisabled: boolean;
    downDisabled: boolean;
    leftDisabled: boolean;
    rightDisabled: boolean;
    centerDisabled: boolean;
    isDimmed: boolean;
    isHidden: boolean;
}

export interface MoveReducerAction {
    type: MoveDirection | 'reset' | 'dimm' | 'hide' | 'show';
    payload?: { disabled: boolean };
}
