import React, {PropTypes} from "react";
import {keyboardNumbers} from "../../../constants/keyboardNumbers";
import {t} from "../../../helpers/translator";

class Keyboard extends React.Component {
    handleNumberFieldClick (num) {
        return (event) => {
            event.preventDefault();
            this.applyChange(this.updateValue([this.currentValue, num].join("")));
        };
    }
    updateValue (value = "") {
        if (this.props.settings.processHandler && value.indexOf(".") !== value.length - 1) {
            value = this.props.settings.processHandler(value);
        }
        let strValue = value.toString();
        !isNaN(+value) && strValue.indexOf(".") !== strValue.length - 1 && (strValue = (+strValue).toString());
        this.currentValue = strValue;
        return this.currentValue;
    }
    handleClick (type) {
        return (event) => {
            switch (type) {
                case undefined: {
                    event.preventDefault();
                    let update = this.currentValue.toString().split("");
                    update.pop();
                    this.applyChange(this.updateValue(update.join("")));
                    break;
                }
                case ".":
                    event.preventDefault();
                    this.currentValue.indexOf(".") === -1 && this.applyChange(this.updateValue([this.currentValue || 0, "."].join("")));
                    break;
                case true:
                    this.props.settings.onCloseCallback && this.props.settings.onCloseCallback();
                    break;
            }
        };
    }
    applyChange (value = "") {
        this.props.settings.changeHandler && this.props.settings.changeHandler(value);
    }
    componentWillMount () {
        document.body.setAttribute("virtual-keyboard", "opened");
        this.currentValue = this.props.settings.currentValue;
        setTimeout(() => {
            this.props.settings.onOpenCallback && this.props.settings.onOpenCallback(this.props.settings.e);
        });
    }
    componentWillUnmount () {
        document.body.removeAttribute("virtual-keyboard");
    }
    fillNumbers () {
        return keyboardNumbers.map((num) => (<li ket={num} onClick={this.handleNumberFieldClick(num)}><span>{num}</span></li>));
    }
    render () {
        if (this.props.bindToElement) {
            //TODO calculate keyboard styles
        }
        return (
            <div className="virtual-keyboard-wrapper">
                <div className="virtual-keyboard-m">
                    <ul className="key-numbers-m">
                        {this.fillNumbers()}
                    </ul>
                    <ul className="key-simbols-m">
                        <li onClick={this.handleClick(".")}><span>.</span></li>
                        <li onClick={this.handleClick()}><span></span></li>
                        <li onClick={this.handleClick(true)}><span>{t("Done")}</span></li>
                    </ul>
                </div>
            </div>
        );
    }
}

Keyboard.propTypes = {
    settings: PropTypes.object,
    bindToElement: PropTypes.bool
};

export default Keyboard;