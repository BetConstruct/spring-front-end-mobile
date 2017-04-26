import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Expandable from "../../../containers/expandable/";
import {Link} from 'react-router';
import {GetRegionDataSelector} from '../../../../helpers/selectors';

let selectorInstance = {};

class Region extends Component {
    render () {
        let region = this.props.region,
            expanded = this.props.expanded,
            Competitions = (competitions, region, key, isForce) => {
                if (!expanded && !isForce) {
                    return (null);
                }
                return competitions.map(
                    (comp) => {
                        return <li key={comp.id}>
                        <span
                            className={"fav-star-m" + (this.props.isCompetitionFavorite(comp.id) ? " active" : "") }
                            onClick={this.props.toggleCompetitionToFavorite(comp.id)}
                            />
                            <Link to={ `/prematch/${this.props.sport.alias}/${region.alias}/${comp.id}` } activeClassName="active">
                                <p><span>{comp.name}</span> <i>({comp.game})</i></p>
                            </Link>
                        </li>;
                    }
                );
            };
        return (<li key={region.id}>
            <Expandable className="sport-region-info-m" uiKey={this.props.sport.alias + region.alias}
                        initiallyExpanded={this.props.index < 3}>
                <div className={"flag-view-m icon-" + region.alias.toLowerCase().replace(/\s/g, '')}></div>
                <div className="country-games-info-m">
                    <p><i>{region.name}</i></p>
                                <span>
                                    <b>{region._totalGames}</b>
                                </span>
                </div>
                <div className="arrow-view-m"></div>
            </Expandable>

            <div className="competition-naw-wrapper-m">
                <div className="competition-list-view-m">
                    <ul>{Competitions(region.competition, region, this.props.sport.alias + region.alias, this.props.index < 3)}</ul>
                </div>
            </div>
        </li>);
    }
    shouldComponentUpdate (nextProps) {
        let currentProps = this.props;
        return nextProps.region !== this.props.region ||
            nextProps.expanded !== currentProps.expanded ||
            currentProps.favorites !== nextProps.favorites;
    }
}

Region.propTypes = {
    isCompetitionFavorite: PropTypes.func.isRequired,
    toggleCompetitionToFavorite: PropTypes.func.isRequired,
    region: PropTypes.object.isRequired,
    sport: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
};

function createSelector ({swarmDataKey, regionId, sport}) {
    selectorInstance.key !== swarmDataKey && (selectorInstance.selector = GetRegionDataSelector(swarmDataKey, regionId, sport.alias));
}

function mapStateToProps (state, ownParams) {
    createSelector(ownParams);
    return selectorInstance.selector(state);
}

export default connect(mapStateToProps)(Region)