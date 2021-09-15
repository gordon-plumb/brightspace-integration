import '@brightspace-ui/core/components/colors/colors.js';
import { formatNumber, parseNumber } from '@brightspace-ui/intl/lib/number.js';
import { formatTime, parseTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { d2lfetch } from 'd2l-fetch/src';
import { fetchAuth } from 'd2l-fetch-auth';
import { fetchDedupe } from 'd2l-fetch-dedupe';
import { fetchSimpleCache } from 'd2l-fetch-simple-cache';
import { setCancelSyntheticClickEvents  } from '@polymer/polymer/lib/utils/settings.js';
import { announce } from '@brightspace-ui/core/helpers/announce';
import { registerGestureSwipe } from '@brightspace-ui/core/helpers/gestures.js';
import { clearDismissible, setDismissible } from '@brightspace-ui/core/helpers/dismissible';
import { createClient } from '@brightspace-ui/logging';
import { provideInstance, requestInstance } from '@brightspace-ui/core/mixins/provider-mixin.js';

window.D2L = window.D2L || {};

window.D2L.Intl = {
	FormatNumber: formatNumber,
	FormatTime: formatTime,
	ParseNumber: parseNumber,
	ParseTime: parseTime
};

d2lfetch.use({
	name: 'auth',
	fn: fetchAuth,
	options: {
		enableTokenCache: true
	}
});
d2lfetch.use({ name: 'dedupe', fn: fetchDedupe });
d2lfetch.use({ name: 'simple-cache', fn: fetchSimpleCache });
window.d2lfetch = d2lfetch;

window.D2L.Telemetry = {
	Load: async function() {
		const telemetry = await import('d2l-telemetry-browser-client');
		return telemetry.default;
	},
	CreateClient: async function() {
		const telemetry = await D2L.Telemetry.Load();
		const endpoint = document.documentElement.getAttribute('data-telemetry-endpoint');
		if (endpoint === null) {
			throw new Error('Unable to create telemetry client, missing endpoint.');
		}
		const client = new telemetry.Client({ endpoint: endpoint });
		return client;
	}
};

window.dispatchEvent(new CustomEvent('d2l-logging-loaded', { detail: { createClient } }));

/*
 * DE35087 - This was added by Polymer to handle ghost clicks in mobile browsers, but it has negative effects when using VoiceOver on iOS.
 * Events were being incorrectly canceled, mostly affecting selecting radio buttons but other user actions as well.
 * This line turns off this functionality.  See https://github.com/Polymer/polymer/issues/5289 for more info.
 */
setCancelSyntheticClickEvents(false);

window.D2L.Announce = announce;

window.D2L.Gestures = window.D2L.Gestures || {};
window.D2L.Gestures.Swipe = { register: registerGestureSwipe };

window.D2L.Dismissible = {
	Clear: function(id) {
		clearDismissible(id);
	},
	Set: function(cb) {
		return setDismissible(cb);
	}
};

window.D2L.Provider = {
	provideInstance: provideInstance,
	requestInstance: requestInstance
};
