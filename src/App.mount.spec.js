// @flow
import {Provider} from 'react-redux';
import React from 'react';
import {mount} from "enzyme";

import App from './App';
import {StateBuilder} from "./redux/state";
import {createMockStore, getDefaultStore} from "./testUtils/mockStoreFactory";

describe('App - mount test', function () {
    it('renders without crashing', () => {
        const store = getDefaultStore();

        mount(
            <Provider store={store}>
                <App/>
            </Provider>
        );
    });

    it('should be able to display default time', function () {
        // given
        const state = new StateBuilder().withTime(1500000).build();
        const store = createMockStore(state);
        const expectedTime = "25m 00s 000";

        // when
        let app = mount(
            <Provider store={store}>
                <App/>
            </Provider>
        );
        let clockTime = app.find("#clock-time");

        // then
        expect(clockTime).toIncludeText(expectedTime)
    });
});