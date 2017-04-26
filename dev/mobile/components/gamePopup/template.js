import React from 'react';
import {t} from "../../../helpers/translator";

module.exports = function depositFormTemplate () {
    return (
        <div className="cashout-dialog">
            <div className="cashout-column-view">
                {
                    (this.props.uiState.popupParams.game.types.funMode === 1) && (
                        <div className="play-game-buttons-view">
                        <button className="button-view-normal-m trans-m" onClick={() => {
                            this.closeDialog("fun");
                        }} type="button">{t("Play for fun")}</button></div>
                    )
                }
                {
                    (this.props.uiState.popupParams.game.types.realMode === 1) && (
                        <div className="play-game-buttons-view">
                        <button className="button-view-normal-m" onClick={() => {
                            this.closeDialog("real");
                        }} type="button">{t("Play")}</button></div>
                    )
                }
            </div>
        </div>
    );
};

