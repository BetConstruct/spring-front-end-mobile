import {connect} from 'react-redux';
import {UIMixin} from '../../../mixins/uiMixin';

// stateless functional component
const ProfileMenu = (props) => Template.apply({props}); //eslint-disable-line no-undef

export default connect()(UIMixin({Component: ProfileMenu}));
