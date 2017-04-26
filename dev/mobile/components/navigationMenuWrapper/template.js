import React from "react";
import NavMenu from "../../components/navMenu/";
import SearchBar from "../../components/searchBar/";

module.exports = function NavigationMenuWrapperTemplate () {
    return (
       <div className="import-view-container">
           <div className="navigation-container-m">
               <NavMenu/>
               <SearchBar type={this.props.routeType}/>
           </div>
       </div>
    );
};