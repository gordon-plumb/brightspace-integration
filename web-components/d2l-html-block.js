import '@brightspace-ui/core/components/html-block/html-block.js';
import { HtmlBlockUserProfileRenderer } from '@brightspace-ui-labs/user-profile-card/user-profile-html-block.js';
import { provideInstance } from '@brightspace-ui/core/mixins/provider-mixin.js';

provideInstance(document, 'html-block-renderers', [
	new HtmlBlockUserProfileRenderer()
]);
