// @flow
import React from 'react';
import {mount} from "enzyme";
import jsonpath from "jsonpath";

import {newStore} from "./redux/storeFactory";
import AppWithStore from "./components/AppWithStore";
import type {State} from "./redux/state";
import {newInitialStateBuilder} from "./redux/state";

jest.useFakeTimers();

describe('AppWithStore - acceptance test', function () {
    const isCountingState = newInitialStateBuilder().withIsCounting(true).build();

    describe("features", function () {
        describe("session", function () {
            it('should be able to render with store without crash', function () {
                // given
                const store = newStore();

                // when
                mount(<AppWithStore store={store}/>);
            });

            it('should be able to click start then change state.isCounting to true', function () {
                // given
                const {store, app} = getStoreAndApp();
                const getStartButton = () => app.find("#btn_start");

                expect(getStartButton()).toHaveLength(1);

                // when
                getStartButton().simulate("click");

                // then
                assertStoreState(store).to.have("session.isCounting", true);
                expect(getStartButton()).toHaveLength(0);
            });

            it('should, when state.isCounting=true, count down the time per 100ms', function () {
                //    given
                const {store} = getStoreAndApp(isCountingState);
                const startTime = getTime(store);

                //    when
                jest.runTimersToTime(100);

                //    then
                assertStoreState(store).to.have("session.time", startTime - 100);
            });

            it('should, when state.isCounting=false, not count down the time', function () {
                //    given
                const store = newStore();
                mount(<AppWithStore store={store}/>);
                const startTime = getTime(store);

                //    when
                jest.runTimersToTime(100);

                //    then
                assertStoreState(store).to.have("session.time", startTime);
            });

            it('should update state.isCounting to false when clicking pause button', function () {
                //    given
                const {store, app} = getStoreAndApp(isCountingState);

                //    when
                app.find("#btn_pause").simulate("click");

                //    then
                assertStoreState(store).to.have("session.isCounting", false);
            });

            it('should update state.isCounting to false and reset time when clicking stop button', function () {
                //    given
                const {store, app} = getStoreAndApp(isCountingState);
                const interval = store.getState().interval;
                const startTime = getTime(store);
                jest.runTimersToTime(interval);
                assertStoreState(store).to.have("session.time", startTime - interval);

                //    when
                app.find("#btn_stop").simulate("click");

                //    then
                assertStoreState(store)
                    .to.have("session.isCounting", false)
                    .and.have("session.time", startTime);
            });

            it('should update state.isCounting to false when time = 0', function () {
                //    given
                const interval = 100,
                    predefinedState = newInitialStateBuilder().withOriginalTime(interval).withTime(interval).withInterval(interval).withIsCounting(true).build();
                const {store} = getStoreAndApp(predefinedState);
                assertStoreState(store)
                    .to.have("session.isCounting", true)
                    .and.have("session.time", interval);

                //    when
                jest.runTimersToTime(interval);

                //    then
                assertStoreState(store)
                    .to.have("session.isCounting", false)
                    .and.have("session.time", 0);
            });
        });
    });

    describe("store state", function () {
        it("should have state.isCounting=false for getStore()", function () {
            // given
            const store = getStore();
            assertStoreState(store).to.have("session.isCounting", false);

            // when
            mount(<AppWithStore store={store}/>);

            // then
            assertStoreState(store).to.have("session.isCounting", false);
        });

        it("should have state.isCounting=true for getStore(isCountingState)", function () {
            // given
            const store = getStore(isCountingState);
            assertStoreState(store).to.have("session.isCounting", true);

            // when
            mount(<AppWithStore store={store}/>);

            // then
            assertStoreState(store).to.have("session.isCounting", true);
        });
    });

    function getStoreAndApp(predefinedState: ?State) {
        const store = getStore(predefinedState);
        const app = mount(<AppWithStore store={store}/>);
        return {store, app};
    }

    function getStore(predefinedState: ?State) {
        return ((typeof predefinedState === "undefined") || (predefinedState === null))
            ? newStore()
            : newStore(predefinedState);
    }

    function assertStoreState(store) {
        const state = store.getState();
        const andHave = {};
        const assertionObj = {
            have(key, value) {
                let path = `$.${key}`;
                expect(jsonpath.query(state, path, 1).length).toBeGreaterThanOrEqual(1);
                expect(jsonpath.value(state, path)).toEqual(value);
                return andHave;
            }
        };
        andHave.and = assertionObj;
        return {to: assertionObj};
    }

    function getTime(store) {
        return jsonpath.value(store.getState(), "$.session.time");
    }
});