(function($) {

	"use strict";

	/* ----------------------------------------------------------- */
	/*  FUNCTION TO STOP LOCAL AND YOUTUBE VIDEOS IN SLIDESHOW
    /* ----------------------------------------------------------- */

	function stop_videos() {
		var video = document.getElementById("video");
		if (video && video.paused !== true && video.ended !== true) {
			video.pause();
		}
		var youtubeVideo = document.querySelector('.youtube-video');
		if (youtubeVideo && youtubeVideo.contentWindow) {
			youtubeVideo.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
		}
	}

	$(window).on("load", function() {

		/* ----------------------------------------------------------- */
		/*  PAGE PRELOADER
        /* ----------------------------------------------------------- */
		
		var preloader = $('#preloader');
		setTimeout(function() {
			preloader.addClass('preloaded');
		}, 800);

	});

	$(document).ready(function() {

		/* ----------------------------------------------------------- */
		/*  STOP VIDEOS
        /* ----------------------------------------------------------- */

		$('.slideshow nav span').on('click', function () {
			stop_videos();
		});

		/* ----------------------------------------------------------- */
		/*  MOBILE MENU
		/* ----------------------------------------------------------- */

		$('#mobile-nav li').on('click', function () {
			$('#mobile-nav li').removeClass('active');
			$(this).addClass('active');
			$('#desktop-nav li').removeClass('active');
			var index = $(this).index() + 1;
			$('#desktop-nav li:nth-child(' + index + ')').addClass('active');
		});
		
		$('#trigger-mobile').on('click', function () {
			$(this).toggleClass('show-menu');
			$('#mobile-nav').toggleClass('hide-list');
		});

		/* ----------------------------------------------------------- */
		/*  DESKTPOP MENU
        /* ----------------------------------------------------------- */

		$('#desktop-nav li').on('click', function () {
			$('#desktop-nav li').removeClass('active');
			$(this).addClass('active');
			$('#mobile-nav li').removeClass('active');
			var index = $(this).index() + 1;
			$('#mobile-nav li:nth-child(' + index + ')').addClass('active');
		});

		/* ----------------------------------------------------------- */
		/*  PORTFOLIO GALLERY
        /* ----------------------------------------------------------- */

		if ($('.gridlist').length) {
			new CBPGridGallery( document.getElementById( 'grid-gallery' ) );
		}

		$(".gridlist figure").on('click', function() {
			$("#navbar-collapse-toggle").addClass('modal-open');
		});

		$('.slideshow').on('transitionend', function(event) {
			var gridGallery = document.getElementById('grid-gallery');
			if (event.target === this && event.originalEvent.propertyName === 'opacity' &&
				gridGallery && !gridGallery.classList.contains('slideshow-open')) {
				$("#navbar-collapse-toggle").removeClass('modal-open');
			}
		});

		/* ----------------------------------------------------------- */
		/*  PORTFOLIO DIRECTION AWARE HOVER EFFECT
        /* ----------------------------------------------------------- */

		var item = $(".gridlist li figure");
		var elementsLength = item.length;
		for (var i = 0; i < elementsLength; i++) {
			if ($(window).width() > 991) {
				$(item[i]).hoverdir();
			}
		}

		/* ----------------------------------------------------------- */
		/*  100% JAVASCRIPT CONTACT SUBMISSION (GITHUB PAGES READY)
        /* ----------------------------------------------------------- */

		// Load environment configuration from window.ENV (js/config.js)
		var env = window.ENV || {};
		var EMAILJS_CONFIG = {
			publicKey: env.EMAILJS_PUBLIC_KEY || "",
			serviceId: env.EMAILJS_SERVICE_ID || "",
			templateId: env.EMAILJS_TEMPLATE_ID || "",
			autoreplyTemplateId: env.EMAILJS_AUTOREPLY_TEMPLATE_ID || ""
		};

		function isEmailJsReady() {
			return typeof emailjs !== "undefined" &&
				EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey.trim() !== "" &&
				EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.serviceId.trim() !== "" &&
				EMAILJS_CONFIG.templateId && EMAILJS_CONFIG.templateId.trim() !== "";
		}

		function submitContactForm(formData, onSuccess, onError) {
			// Strategy 1: If EmailJS credentials are provided, use EmailJS (100% client-side JS on GitHub Pages)
			if (isEmailJsReady()) {
				emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });

				var templateParams = {
					name: formData.name,
					from_name: formData.name,
					email: formData.email,
					reply_to: formData.email,
					subject: formData.subject,
					message: formData.message,
					to_name: "Ibukun Folarin"
				};

				// Send the primary notification email to Ibukun
				emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams)
					.then(function(response) {
						// Optional: If an auto-reply template ID is set, send instant acknowledgment back to the visitor
						if (EMAILJS_CONFIG.autoreplyTemplateId && EMAILJS_CONFIG.autoreplyTemplateId.trim() !== "") {
							emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.autoreplyTemplateId, {
								name: formData.name,
								to_name: formData.name,
								email: formData.email,
								to_email: formData.email,
								subject: formData.subject,
								message: formData.message
							}).catch(function(autoErr) {
								console.warn("Auto-reply error:", autoErr);
							});
						}
						onSuccess(response);
					}, function(error) {
						console.warn("EmailJS error, falling back to FormSubmit API:", error);
						sendViaFormSubmit(formData, onSuccess, onError);
					});
				return;
			}

			// Strategy 2: FormSubmit Client-Side AJAX API (Zero-setup client-side API)
			sendViaFormSubmit(formData, onSuccess, onError);
		}

		function sendViaFormSubmit(formData, onSuccess, onError) {
			$.ajax({
				url: "https://formsubmit.co/ajax/ibukunolufolarin@gmail.com",
				method: "POST",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify({
					name: formData.name,
					email: formData.email,
					subject: formData.subject,
					message: formData.message,
					_subject: "✦ Portfolio Message: " + formData.subject + " (" + formData.name + ")",
					_replyto: formData.email,
					_template: "table",
					_captcha: "false"
				}),
				timeout: 12000,
				success: function(res) {
					if (res && (res.success === "true" || res.success === true || res.message)) {
						onSuccess(res);
					} else {
						onError(res && res.message ? res.message : "Service message confirmation needed.");
					}
				},
				error: function() {
					// Pure client-side static environment: gracefully offer 1-click mailto fallback
					onError("Unable to connect to automatic email service.");
				}
			});
		}

		$("#contactform").on("submit", function(e) {
			e.preventDefault();

			var name = $("#contact-name").val().trim();
			var email = $("#contact-email").val().trim();
			var subject = $("#contact-subject").val().trim();
			var message = $("#contact-message").val().trim();

			if (!name || !email || !message) {
				return false;
			}

			var $form = $(this);
			var $btn = $("#submit-btn");
			var $btnText = $btn.find(".button-text");
			var $btnIcon = $btn.find(".button-icon");

			// Set Loading State
			$btn.addClass("btn-loading");
			$btnText.text("Sending Message...");
			$btnIcon.attr("class", "button-icon fa fa-spinner fa-spin");
			$form.find("input, textarea, button").prop("disabled", true);

			var formData = {
				name: name,
				email: email,
				subject: subject || "Portfolio Website Inquiry",
				message: message
			};

			submitContactForm(formData, function(response) {
				// Success Callback
				$btn.removeClass("btn-loading");
				$btnText.text("Send Message");
				$btnIcon.attr("class", "button-icon fa fa-send");
				$form.find("input, textarea, button").prop("disabled", false);

				// Populate and show success card
				$("#contact-success-card .feedback-sender-name").text(name);
				$("#contact-success-card .feedback-sender-email").text(email);

				$form.fadeOut(300, function() {
					$("#contact-success-card").removeClass("d-none").fadeIn(300);
				});

				$form[0].reset();
			}, function(errMsg) {
				// Error Callback
				$btn.removeClass("btn-loading");
				$btnText.text("Send Message");
				$btnIcon.attr("class", "button-icon fa fa-send");
				$form.find("input, textarea, button").prop("disabled", false);

				// Prepare one-click email client fallback link
				var mailtoUrl = "mailto:ibukunolufolarin@gmail.com" +
					"?subject=" + encodeURIComponent("Portfolio Inquiry: " + (subject || "Collaboration")) +
					"&body=" + encodeURIComponent("Hello Ibukun,\n\n" + message + "\n\nBest regards,\n" + name + " (" + email + ")");
				
				$("#fallback-mailto-btn").attr("href", mailtoUrl);
				if (errMsg) {
					$("#contact-error-message").text(errMsg + " You can send your message directly via email with one click below:");
				}

				$form.fadeOut(300, function() {
					$("#contact-error-card").removeClass("d-none").fadeIn(300);
				});
			});

			return false;
		});

		// "Send Another Message" action
		$(document).on("click", ".btn-send-another", function() {
			$("#contact-success-card").fadeOut(300, function() {
				$(this).addClass("d-none");
				$("#contactform").fadeIn(300);
			});
		});

		// "Try Again" action
		$(document).on("click", ".btn-retry", function() {
			$("#contact-error-card").fadeOut(300, function() {
				$(this).addClass("d-none");
				$("#contactform").fadeIn(300);
			});
		});

	});

	$(document).keyup(function(e) {

		/* ----------------------------------------------------------- */
		/*  KEYBOARD NAVIGATION IN PORTFOLIO SLIDESHOW
        /* ----------------------------------------------------------- */
		if (e.keyCode === 27) {
			stop_videos();
			$('.close-content').click();
		}
		if ((e.keyCode === 37) || (e.keyCode === 39)) {
			stop_videos();
		}
	});


})(jQuery);
