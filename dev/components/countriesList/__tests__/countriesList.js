import React from 'react';
import {shallow, render} from 'enzyme';
import CountriesList from "../index";

test('Test if contains select with more thatn 100 options', () => {
    const list = render(<CountriesList selected="AM"/>);
    expect(list.find('select > option').length).toBeGreaterThan(100);

});

test('Test setting selected value ', () => {
    const list = render(<CountriesList selected="AM"/>);
    expect(list.find('option[selected]').get(0).attribs.value).toEqual("AM");

});

test('Test onChange', () => {
    let newValue = null;
    let testFunc = (v) => { newValue = v; };
    const list = shallow(<CountriesList onChange={testFunc}/>);
    list.find("select").simulate("change", "AU");
    expect(newValue).toEqual("AU");

});