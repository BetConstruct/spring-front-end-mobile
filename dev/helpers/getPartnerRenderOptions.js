import Config from "../config/main";

export class GetRenderOptions {

    constructor () {
        this.setRenderOptions();
    }
    setRenderOptions () {
        this.renderOptions = {};
        if (Config.isPartnerIntegration && Config.isPartnerIntegration.mode) {
            let keys = Object.keys(Config.isPartnerIntegration.mode),
                length = keys.length,
                i = 0;

            this.isPartnerIntegration = Config.isPartnerIntegration.mode.iframe;
            for (; i < length; i++) {
                if (Config.isPartnerIntegration.mode[keys[i]]) {
                    this.renderOptions = Config.isPartnerIntegration[keys[i]];
                    break;
                }
            }
        }
    }
}

export let RenderOptions = new GetRenderOptions();