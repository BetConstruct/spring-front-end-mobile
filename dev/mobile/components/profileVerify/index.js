import React from 'react';
import {connect} from 'react-redux';
import {UploadDocument} from "../../../actions/user";

const ProfileVerify = React.createClass({
    upload () {

        var file = this.refs.file.files[0],
            fileReader = new FileReader();
        if (!file) {
            console.error("cannot read file", this.refs.file);
            return;
        }

        //eslint-disable-next-line react/prop-types
        fileReader.onloadend = (e) => { this.props.dispatch(UploadDocument(e.target.result)); };
        fileReader.readAsDataURL(file);
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state) {
    return {
        ui: state.uiState
    };
}

export default connect(mapStateToProps)(ProfileVerify);