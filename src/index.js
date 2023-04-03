import ProgressBar from './ProgressBar';
import htmx from 'htmx.org';

class ProgressPlugin {

	constructor(options = {}) {
		const defaultOptions = {
			className: 'swup-progress-bar',
			delay: 300,
			transition: undefined,
			minValue: undefined,
			initialValue: undefined,
			hideImmediately: true
		};

		this.options = {
			...defaultOptions,
			...options
		};

		this.showProgressBarTimeout = null;
		this.hideProgressBarTimeout = null;

		this.progressBar = new ProgressBar({
			className: this.options.className,
			animationDuration: this.options.transition,
			minValue: this.options.minValue,
			initialValue: this.options.initialValue
		});
	}

	startShowingProgress = () => {
		this.progressBar.setValue(0);
		this.showProgressBarAfterDelay();
	};

	stopShowingProgress = () => {
		this.progressBar.setValue(1);
		if (this.options.hideImmediately) {
			this.hideProgressBar();
		} else {
			this.finishAnimationAndHideProgressBar();
		}
	};

	showProgressBar = () => {
		this.cancelHideProgressBarTimeout();
		this.progressBar.show();
	};

	showProgressBarAfterDelay = () => {
		this.cancelShowProgressBarTimeout();
		this.cancelHideProgressBarTimeout();
		this.showProgressBarTimeout = window.setTimeout(this.showProgressBar, this.options.delay);
	};

	hideProgressBar = () => {
		this.cancelShowProgressBarTimeout();
		this.progressBar.hide();
	};

	finishAnimationAndHideProgressBar = () => {
		this.cancelShowProgressBarTimeout();
		this.hideProgressBarTimeout = window.setTimeout(this.hideProgressBar, this.options.transition);
	};

	cancelShowProgressBarTimeout = () => {
		window.clearTimeout(this.showProgressBarTimeout);
		delete this.showProgressBarTimeout;
	};

	cancelHideProgressBarTimeout = () => {
		window.clearTimeout(this.hideProgressBarTimeout);
		delete this.hideProgressBarTimeout;
	};
}

const progress = new ProgressPlugin({});

htmx.defineExtension('progress-bar', {
	onEvent: function (name, evt) {
		if (name === "htmx:configRequest") {
			console.log('start');
			progress.startShowingProgress();
		}
		if (name === "htmx:load") {
			progress.stopShowingProgress();
		}
	}
});
