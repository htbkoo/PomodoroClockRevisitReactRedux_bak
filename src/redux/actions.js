// @flow
// Unfortunately flow type canNOT refer to variable, even if they are constants, so duplication is inevitable
// Reference: https://stackoverflow.com/a/42202467
export type StartCountingAction = { type: "StartCounting" };
export type PauseCountingAction = { type: "PauseCounting" };
export type StopCountingAction = { type: "StopCounting" };
export type TickTimeAction = { type: "TickTime", lapse: number };

export type Action =
    | StartCountingAction
    | PauseCountingAction
    | StopCountingAction
    | TickTimeAction;

export type Dispatch = (Action) => void;

export const actionTypes = {
    StartCounting: "StartCounting",
    PauseCounting: "PauseCounting",
    StopCounting: "StopCounting",
    TickTime: "TickTime"
};

export function startCounting(): StartCountingAction {
    return {type: actionTypes.StartCounting};
}

export function pauseCounting(): PauseCountingAction {
    return {type: actionTypes.PauseCounting};
}

export function stopCounting(): StopCountingAction {
    return {type: actionTypes.StopCounting};
}

export function tickTime(lapse: number): TickTimeAction {
    return {type: actionTypes.TickTime, lapse};
}