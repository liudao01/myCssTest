//fancybox by creekoo!  fancyapps.com/fancybox/    www.creekoo.com
! function(a, b, c, d) {
	"use strict";
	var e = c(a), f = c(b), g = c.fancybox = function() {
		g.open.apply(this, arguments)
	}, h = navigator.userAgent.match(/msie/), i = null, j = b.createTouch !== d, k = function(a) {
		return a && a.hasOwnProperty && a instanceof c
	}, l = function(a) {
		return a && "string" === c.type(a)
	}, m = function(a) {
		return l(a) && a.indexOf("%") > 0
	}, n = function(a) {
		return a && !(a.style.overflow && "hidden" === a.style.overflow) && (a.clientWidth && a.scrollWidth > a.clientWidth || a.clientHeight && a.scrollHeight > a.clientHeight)
	}, o = function(a, b) {
		var c = parseInt(a, 10) || 0;
		return b && m(a) && ( c = g.getViewport()[b] / 100 * c), Math.ceil(c)
	}, p = function(a, b) {
		return o(a, b) + "px"
	};
	c.extend(g, {
		version : "2.1.4",
		defaults : {
			padding : 10,
			margin : 20,
			width : 640,
			height : 420,
			minWidth : 100,
			minHeight : 100,
			maxWidth : 9999,
			maxHeight : 9999,
			autoSize : !0,
			autoHeight : !1,
			autoWidth : !1,
			autoResize : !0,
			autoCenter : !j,
			fitToView : !0,
			aspectRatio : !1,
			topRatio : .5,
			leftRatio : .5,
			scrolling : "auto",
			wrapCSS : "",
			arrows : !0,
			closeBtn : !0,
			closeClick : !0,
			nextClick : !1,
			mouseWheel : !0,
			autoPlay : !1,
			playSpeed : 3e3,
			preload : 3,
			modal : !1,
			loop : !0,
			ajax : {
				dataType : "html",
				headers : {
					"X-fancyBox" : !0
				}
			},
			iframe : {
				scrolling : "auto",
				preload : !0
			},
			swf : {
				wmode : "transparent",
				allowfullscreen : "true",
				allowscriptaccess : "always"
			},
			keys : {
				next : {
					13 : "left",
					34 : "up",
					39 : "left",
					40 : "up"
				},
				prev : {
					8 : "right",
					33 : "down",
					37 : "right",
					38 : "down"
				},
				close : [27],
				play : [32],
				toggle : [70]
			},
			direction : {
				next : "left",
				prev : "right"
			},
			scrollOutside : !0,
			index : 0,
			type : null,
			href : null,
			content : null,
			title : null,
			tpl : {
				wrap : '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
				image : '<img class="fancybox-image" src="{href}" alt="" />',
				iframe : '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + ( h ? ' allowtransparency="true"' : "") + "></iframe>",
				error : '<p class="fancybox-error">图片无法预览<br/>请稍后重试</p>',
				closeBtn : '<a  class="fancybox-item fancybox-close" href="javascript:;"></a>',
				next : '<a   class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
				prev : '<a   class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
			},
			openEffect : "fade",
			openSpeed : 150,
			openEasing : "swing",
			openOpacity : !0,
			openMethod : "zoomIn",
			closeEffect : "fade",
			closeSpeed : 150,
			closeEasing : "swing",
			closeOpacity : !0,
			closeMethod : "zoomOut",
			nextEffect : "elastic",
			nextSpeed : 250,
			nextEasing : "swing",
			nextMethod : "changeIn",
			prevEffect : "elastic",
			prevSpeed : 250,
			prevEasing : "swing",
			prevMethod : "changeOut",
			helpers : {
				overlay : !0,
				title : !0
			},
			onCancel : c.noop,
			beforeLoad : c.noop,
			afterLoad : c.noop,
			beforeShow : c.noop,
			afterShow : c.noop,
			beforeChange : c.noop,
			beforeClose : c.noop,
			afterClose : c.noop
		},
		group : {},
		opts : {},
		previous : null,
		coming : null,
		current : null,
		isActive : !1,
		isOpen : !1,
		isOpened : !1,
		wrap : null,
		skin : null,
		outer : null,
		inner : null,
		player : {
			timer : null,
			isActive : !1
		},
		ajaxLoad : null,
		imgPreload : null,
		transitions : {},
		helpers : {},
		open : function(a, b) {
			return a && (c.isPlainObject(b) || ( b = {}), !1 !== g.close(!0)) ? (c.isArray(a) || ( a = k(a) ? c(a).get() : [a]), c.each(a, function(e, f) {
				var i, j, m, n, o, p, q, h = {};
				"object" === c.type(f) && (f.nodeType && ( f = c(f)), k(f) ? ( h = {
					href : f.data("fancybox-href") || f.attr("href"),
					title : f.data("fancybox-title") || f.attr("title"),
					isDom : !0,
					element : f
				}, c.metadata && c.extend(!0, h, f.metadata())) : h = f), i = b.href || h.href || (l(f) ? f : null), j = b.title !== d ? b.title : h.title || "", m = b.content || h.content, n = m ? "html" : b.type || h.type, !n && h.isDom && ( n = f.data("fancybox-type"), n || ( o = f.prop("class").match(/fancybox\.(\w+)/), n = o ? o[1] : null)), l(i) && (n || (g.isImage(i) ? n = "image" : g.isSWF(i) ? n = "swf" : "#" === i.charAt(0) ? n = "inline" : l(f) && ( n = "html", m = f)), "ajax" === n && ( p = i.split(/\s+/, 2), i = p.shift(), q = p.shift())), m || ("inline" === n ? i ? m = c(l(i) ? i.replace(/.*(?=#[^\s]+$)/, "") : i) : h.isDom && ( m = f) : "html" === n ? m = i : n || i || !h.isDom || ( n = "inline", m = f)), c.extend(h, {
					href : i,
					type : n,
					content : m,
					title : j,
					selector : q
				}), a[e] = h
			}), g.opts = c.extend(!0, {}, g.defaults, b), b.keys !== d && (g.opts.keys = b.keys ? c.extend({}, g.defaults.keys, b.keys) : !1), g.group = a, g._start(g.opts.index)) :
			void 0
		},
		cancel : function() {
			var a = g.coming;
			a && !1 !== g.trigger("onCancel") && (g.hideLoading(), g.ajaxLoad && g.ajaxLoad.abort(), g.ajaxLoad = null, g.imgPreload && (g.imgPreload.onload = g.imgPreload.onerror = null), a.wrap && a.wrap.stop(!0, !0).trigger("onReset").remove(), g.coming = null, g.current || g._afterZoomOut(a))
		},
		close : function(a) {
			g.cancel(), !1 !== g.trigger("beforeClose") && (g.unbindEvents(), g.isActive && (g.isOpen && a !== !0 ? (g.isOpen = g.isOpened = !1, g.isClosing = !0, c(".fancybox-item, .fancybox-nav").remove(), g.wrap.stop(!0, !0).removeClass("fancybox-opened"), g.transitions[g.current.closeMethod]()) : (c(".fancybox-wrap").stop(!0).trigger("onReset").remove(), g._afterZoomOut())))
		},
		play : function(a) {
			var b = function() {
				clearTimeout(g.player.timer)
			}, d = function() {
				b(), g.current && g.player.isActive && (g.player.timer = setTimeout(g.next, g.current.playSpeed))
			}, e = function() {
				b(), c("body").unbind(".player"), g.player.isActive = !1, g.trigger("onPlayEnd")
			}, f = function() {
				g.current && (g.current.loop || g.current.index < g.group.length - 1) && (g.player.isActive = !0, c("body").bind({
					"afterShow.player onUpdate.player" : d,
					"onCancel.player beforeClose.player" : e,
					"beforeLoad.player" : b
				}), d(), g.trigger("onPlayStart"))
			};
			a === !0 || !g.player.isActive && a !== !1 ? f() : e()
		},
		next : function(a) {
			var b = g.current;
			b && (l(a) || ( a = b.direction.next), g.jumpto(b.index + 1, a, "next"))
		},
		prev : function(a) {
			var b = g.current;
			b && (l(a) || ( a = b.direction.prev), g.jumpto(b.index - 1, a, "prev"))
		},
		jumpto : function(a, b, c) {
			var e = g.current;
			e && ( a = o(a), g.direction = b || e.direction[a >= e.index ? "next" : "prev"], g.router = c || "jumpto", e.loop && (0 > a && ( a = e.group.length + a % e.group.length), a %= e.group.length), e.group[a] !== d && (g.cancel(), g._start(a)))
		},
		reposition : function(a, b) {
			var f, d = g.current, e = d ? d.wrap : null;
			e && ( f = g._getPosition(b), a && "scroll" === a.type ? (
			delete f.position, e.stop(!0, !0).animate(f, 200)) : (e.css(f), d.pos = c.extend({}, d.dim, f)))
		},
		update : function(a) {
			var b = a && a.type, c = !b || "orientationchange" === b;
			c && (clearTimeout(i), i = null), g.isOpen && !i && ( i = setTimeout(function() {
				var d = g.current;
				d && !g.isClosing && (g.wrap.removeClass("fancybox-tmp"), (c || "load" === b || "resize" === b && d.autoResize) && g._setDimension(), "scroll" === b && d.canShrink || g.reposition(a), g.trigger("onUpdate"), i = null)
			}, c && !j ? 0 : 300))
		},
		toggle : function(a) {
			g.isOpen && (g.current.fitToView = "boolean" === c.type(a) ? a : !g.current.fitToView, j && (g.wrap.removeAttr("style").addClass("fancybox-tmp"), g.trigger("onUpdate")), g.update())
		},
		hideLoading : function() {
			f.unbind(".loading"), c("#fancybox-loading").remove()
		},
		showLoading : function() {
			var a, b;
			g.hideLoading(), a = c('<div id="fancybox-loading"><div></div></div>').click(g.cancel).appendTo("body"), f.bind("keydown.loading", function(a) {
				27 === (a.which || a.keyCode) && (a.preventDefault(), g.cancel())
			}), g.defaults.fixed || ( b = g.getViewport(), a.css({
				position : "absolute",
				top : .5 * b.h + b.y,
				left : .5 * b.w + b.x
			}))
		},
		getViewport : function() {
			var b = g.current && g.current.locked || !1, c = {
				x : e.scrollLeft(),
				y : e.scrollTop()
			};
			return b ? (c.w = b[0].clientWidth, c.h = b[0].clientHeight) : (c.w = j && a.innerWidth ? a.innerWidth : e.width(), c.h = j && a.innerHeight ? a.innerHeight : e.height()), c
		},
		unbindEvents : function() {
			g.wrap && k(g.wrap) && g.wrap.unbind(".fb"), f.unbind(".fb"), e.unbind(".fb")
		},
		bindEvents : function() {
			var b, a = g.current;
			a && (e.bind("orientationchange.fb" + ( j ? "" : " resize.fb") + (a.autoCenter && !a.locked ? " scroll.fb" : ""), g.update), b = a.keys, b && f.bind("keydown.fb", function(e) {
				var f = e.which || e.keyCode, h = e.target || e.srcElement;
				return 27 === f && g.coming ? !1 : (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey || h && (h.type || c(h).is("[contenteditable]")) || c.each(b, function(b, h) {
					return a.group.length > 1 && h[f] !== d ? (g[b](h[f]), e.preventDefault(), !1) : c.inArray(f, h) > -1 ? (g[b](), e.preventDefault(), !1) :
					void 0
				}),
				void 0)
			}), c.fn.mousewheel && a.mouseWheel && g.wrap.bind("mousewheel.fb", function(b, d, e, f) {
				for (var h = b.target || null, i = c(h), j = !1; i.length && !(j || i.is(".fancybox-skin") || i.is(".fancybox-wrap")); )
					j = n(i[0]), i = c(i).parent();
				0 === d || j || g.group.length > 1 && !a.canShrink && (f > 0 || e > 0 ? g.prev(f > 0 ? "down" : "left") : (0 > f || 0 > e) && g.next(0 > f ? "up" : "right"), b.preventDefault())
			}))
		},
		trigger : function(a, b) {
			var d, e = b || g.coming || g.current;
			if (e) {
				if (c.isFunction(e[a]) && ( d = e[a].apply(e, Array.prototype.slice.call(arguments, 1))), d === !1)
					return !1;
				e.helpers && c.each(e.helpers, function(b, d) {
					d && g.helpers[b] && c.isFunction(g.helpers[b][a]) && ( d = c.extend(!0, {}, g.helpers[b].defaults, d), g.helpers[b][a](d, e))
				}), c.event.trigger(a + ".fb")
			}
		},
		isImage : function(a) {
			return l(a) && a.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|tif|tiff|ico|bmp|webp)((\?|#).*)?$)/i)
		},
		isSWF : function(a) {
			return l(a) && a.match(/\.(swf)((\?|#).*)?$/i)
		},
		_start : function(a) {
			var d, e, f, h, i, b = {};
			if ( a = o(a), d = g.group[a] || null, !d)
				return !1;
			if ( b = c.extend(!0, {}, g.opts, d), h = b.margin, i = b.padding, "number" === c.type(h) && (b.margin = [h, h, h, h]), "number" === c.type(i) && (b.padding = [i, i, i, i]), b.modal && c.extend(!0, b, {
					closeBtn : !1,
					closeClick : !1,
					nextClick : !1,
					arrows : !1,
					mouseWheel : !1,
					keys : null,
					helpers : {
						overlay : {
							closeClick : !1
						}
					}
				}), b.autoSize && (b.autoWidth = b.autoHeight = !0), "auto" === b.width && (b.autoWidth = !0), "auto" === b.height && (b.autoHeight = !0), b.group = g.group, b.index = a, g.coming = b, !1 === g.trigger("beforeLoad"))
				return g.coming = null,
				void 0;
			if ( f = b.type, e = b.href, !f)
				return g.coming = null, g.current && g.router && "jumpto" !== g.router ? (g.current.index = a, g[g.router](g.direction)) : !1;
			if (g.isActive = !0, ("image" === f || "swf" === f) && (b.autoHeight = b.autoWidth = !1, b.scrolling = "visible"), "image" === f && (b.aspectRatio = !0), "iframe" === f && j && (b.scrolling = "scroll"), b.wrap = c(b.tpl.wrap).addClass("fancybox-" + ( j ? "mobile" : "desktop") + " fancybox-type-" + f + " fancybox-tmp " + b.wrapCSS).appendTo(b.parent || "body"), c.extend(b, {
				skin : c(".fancybox-skin", b.wrap),
				outer : c(".fancybox-outer", b.wrap),
				inner : c(".fancybox-inner", b.wrap)
			}), c.each(["Top", "Right", "Bottom", "Left"], function(a, c) {
				b.skin.css("padding" + c, p(b.padding[a]))
			}), g.trigger("onReady"), "inline" === f || "html" === f) {
				if (!b.content || !b.content.length)
					return g._error("content")
			} else if (!e)
				return g._error("href");
			"image" === f ? g._loadImage() : "ajax" === f ? g._loadAjax() : "iframe" === f ? g._loadIframe() : g._afterLoad()
		},
		_error : function(a) {
			c.extend(g.coming, {
				type : "html",
				autoWidth : !0,
				autoHeight : !0,
				minWidth : 0,
				minHeight : 0,
				scrolling : "no",
				hasError : a,
				content : g.coming.tpl.error
			}), g._afterLoad()
		},
		_loadImage : function() {
			var a = g.imgPreload = new Image;
			a.onload = function() {
				this.onload = this.onerror = null, g.coming.width = this.width, g.coming.height = this.height, g._afterLoad()
			}, a.onerror = function() {
				this.onload = this.onerror = null, g._error("image")
			}, a.src = g.coming.href, a.complete !== !0 && g.showLoading()
		},
		_loadAjax : function() {
			var a = g.coming;
			g.showLoading(), g.ajaxLoad = c.ajax(c.extend({}, a.ajax, {
				url : a.href,
				error : function(a, b) {
					g.coming && "abort" !== b ? g._error("ajax", a) : g.hideLoading()
				},
				success : function(b, c) {
					"success" === c && (a.content = b, g._afterLoad())
				}
			}))
		},
		_loadIframe : function() {
			var a = g.coming, b = c(a.tpl.iframe.replace(/\{rnd\}/g, (new Date).getTime())).attr("scrolling", j ? "auto" : a.iframe.scrolling).attr("src", a.href);
			c(a.wrap).bind("onReset", function() {
				try {
					c(this).find("iframe").hide().attr("src", "//about:blank").end().empty()
				} catch(a) {
				}
			}), a.iframe.preload && (g.showLoading(), b.one("load", function() {
				c(this).data("ready", 1), j || c(this).bind("load.fb", g.update), c(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show(), g._afterLoad()
			})), a.content = b.appendTo(a.inner), a.iframe.preload || g._afterLoad()
		},
		_preloadImages : function() {
			var e, f, a = g.group, b = g.current, c = a.length, d = b.preload ? Math.min(b.preload, c - 1) : 0;
			for ( f = 1; d >= f; f += 1)
				e = a[(b.index + f) % c], "image" === e.type && e.href && ((new Image).src = e.href)
		},
		_afterLoad : function() {
			var e, f, h, i, j, l, a = g.coming, b = g.current, d = "fancybox-placeholder";
			if (g.hideLoading(), a && g.isActive !== !1) {
				if (!1 === g.trigger("afterLoad", a, b))
					return a.wrap.stop(!0).trigger("onReset").remove(), g.coming = null,
					void 0;
				switch(b&&(g.trigger("beforeChange",b),b.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove()),g.unbindEvents(),e=a,f=a.content,h=a.type,i=a.scrolling,c.extend(g,{wrap:e.wrap,skin:e.skin,outer:e.outer,inner:e.inner,current:e,previous:b}),j=e.href,h) {
				case"inline":
				case"ajax":
				case"html":
					e.selector ? f = c("<div>").html(f).find(e.selector) : k(f) && (f.data(d) || f.data(d, c('<div class="' + d + '"></div>').insertAfter(f).hide()), f = f.show().detach(), e.wrap.bind("onReset", function() {
						c(this).find(f).length && f.hide().replaceAll(f.data(d)).data(d, !1)
					}));
					break;
				case"image":
					f = e.tpl.image.replace("{href}", j);
					break;
				case"swf":
					f = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + j + '"></param>', l = "", c.each(e.swf, function(a, b) {
						f += '<param name="' + a + '" value="' + b + '"></param>', l += " " + a + '="' + b + '"'
					}), f += '<embed src="' + j + '" type="application/x-shockwave-flash" width="100%" height="100%"' + l + "></embed></object>"
				}
				k(f) && f.parent().is(e.inner) || e.inner.append(f), g.trigger("beforeShow"), e.inner.css("overflow", "yes" === i ? "scroll" : "no" === i ? "hidden" : i), g._setDimension(), g.reposition(), g.isOpen = !1, g.coming = null, g.bindEvents(), g.isOpened ? b.prevMethod && g.transitions[b.prevMethod]() : c(".fancybox-wrap").not(e.wrap).stop(!0).trigger("onReset").remove(), g.transitions[g.isOpened?e.nextMethod:e.openMethod](), g._preloadImages()
			}
		},
		_setDimension : function() {
			var y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, a = g.getViewport(), b = 0, d = !1, e = !1, f = g.wrap, h = g.skin, i = g.inner, j = g.current, k = j.width, l = j.height, n = j.minWidth, q = j.minHeight, r = j.maxWidth, s = j.maxHeight, t = j.scrolling, u = j.scrollOutside ? j.scrollbarWidth : 0, v = j.margin, w = o(v[1] + v[3]), x = o(v[0] + v[2]);
			if (f.add(h).add(i).width("auto").height("auto").removeClass("fancybox-tmp"), y = o(h.outerWidth(!0) - h.width()), z = o(h.outerHeight(!0) - h.height()), A = w + y, B = x + z, C = m(k) ? (a.w - A) * o(k) / 100 : k, D = m(l) ? (a.h - B) * o(l) / 100 : l, "iframe" === j.type) {
				if ( L = j.content, j.autoHeight && 1 === L.data("ready"))
					try {
						L[0].contentWindow.document.location && (i.width(C).height(9999), M = L.contents().find("body"), u && M.css("overflow-x", "hidden"), D = M.height())
					} catch(N) {
					}
			} else
				(j.autoWidth || j.autoHeight) && (i.addClass("fancybox-tmp"), j.autoWidth || i.width(C), j.autoHeight || i.height(D), j.autoWidth && ( C = i.width()), j.autoHeight && ( D = i.height()), i.removeClass("fancybox-tmp"));
			if ( k = o(C), l = o(D), G = C / D, n = o(m(n) ? o(n, "w") - A : n), r = o(m(r) ? o(r, "w") - A : r), q = o(m(q) ? o(q, "h") - B : q), s = o(m(s) ? o(s, "h") - B : s), E = r, F = s, j.fitToView && ( r = Math.min(a.w - A, r), s = Math.min(a.h - B, s)), J = a.w - w, K = a.h - x, j.aspectRatio ? (k > r && ( k = r, l = o(k / G)), l > s && ( l = s, k = o(l * G)), n > k && ( k = n, l = o(k / G)), q > l && ( l = q, k = o(l * G))) : ( k = Math.max(n, Math.min(k, r)), j.autoHeight && "iframe" !== j.type && (i.width(k), l = i.height()), l = Math.max(q, Math.min(l, s))), j.fitToView)
				if (i.width(k).height(l), f.width(k + y), H = f.width(), I = f.height(), j.aspectRatio)
					for (; (H > J || I > K) && k > n && l > q && !(b++ > 19); )
						l = Math.max(q, Math.min(s, l - 10)), k = o(l * G), n > k && ( k = n, l = o(k / G)), k > r && ( k = r, l = o(k / G)), i.width(k).height(l), f.width(k + y), H = f.width(), I = f.height();
				else
					k = Math.max(n, Math.min(k, k - (H - J))), l = Math.max(q, Math.min(l, l - (I - K)));
			u && "auto" === t && D > l && J > k + y + u && (k += u), i.width(k).height(l), f.width(k + y), H = f.width(), I = f.height(), d = (H > J || I > K) && k > n && l > q, e = j.aspectRatio ? E > k && F > l && C > k && D > l : (E > k || F > l) && (C > k || D > l), c.extend(j, {
				dim : {
					width : p(H),
					height : p(I)
				},
				origWidth : C,
				origHeight : D,
				canShrink : d,
				canExpand : e,
				wPadding : y,
				hPadding : z,
				wrapSpace : I - h.outerHeight(!0),
				skinSpace : h.height() - l
			}), !L && j.autoHeight && l > q && s > l && !e && i.height("auto")
		},
		_getPosition : function(a) {
			var b = g.current, c = g.getViewport(), d = b.margin, e = g.wrap.width() + d[1] + d[3], f = g.wrap.height() + d[0] + d[2], h = {
				position : "absolute",
				top : d[0],
				left : d[3]
			};
			return b.autoCenter && b.fixed && !a && f <= c.h && e <= c.w ? h.position = "fixed" : b.locked || (h.top += c.y, h.left += c.x), h.top = p(Math.max(h.top, h.top + (c.h - f) * b.topRatio)), h.left = p(Math.max(h.left, h.left + (c.w - e) * b.leftRatio)), h
		},
		_afterZoomIn : function() {
			var a = g.current;
			a && (g.isOpen = g.isOpened = !0, g.wrap.css("overflow", "visible").addClass("fancybox-opened"), g.update(), (a.closeClick || a.nextClick && g.group.length > 1) && g.inner.css("cursor", "pointer").bind("click.fb", function(b) {
				c(b.target).is("a") || c(b.target).parent().is("a") || (b.preventDefault(), g[a.closeClick?"close":"next"]())
			}), a.closeBtn && c(a.tpl.closeBtn).appendTo(g.skin).bind("click.fb", function(a) {
				a.preventDefault(), g.close()
			}), a.arrows && g.group.length > 1 && ((a.loop || a.index > 0) && c(a.tpl.prev).appendTo(g.outer).bind("click.fb", g.prev), (a.loop || a.index < g.group.length - 1) && c(a.tpl.next).appendTo(g.outer).bind("click.fb", g.next)), g.trigger("afterShow"), a.loop || a.index !== a.group.length - 1 ? g.opts.autoPlay && !g.player.isActive && (g.opts.autoPlay = !1, g.play()) : g.play(!1))
		},
		_afterZoomOut : function(a) {
			a = a || g.current, c(".fancybox-wrap").trigger("onReset").remove(), c.extend(g, {
				group : {},
				opts : {},
				router : !1,
				current : null,
				isActive : !1,
				isOpened : !1,
				isOpen : !1,
				isClosing : !1,
				wrap : null,
				skin : null,
				outer : null,
				inner : null
			}), g.trigger("afterClose", a)
		}
	}), g.transitions = {
		getOrigPosition : function() {
			var a = g.current, b = a.element, c = a.orig, d = {}, e = 50, f = 50, h = a.hPadding, i = a.wPadding, j = g.getViewport();
			return !c && a.isDom && b.is(":visible") && ( c = b.find("img:first"), c.length || ( c = b)), k(c) ? ( d = c.offset(), c.is("img") && ( e = c.outerWidth(), f = c.outerHeight())) : (d.top = j.y + (j.h - f) * a.topRatio, d.left = j.x + (j.w - e) * a.leftRatio), ("fixed" === g.wrap.css("position") || a.locked) && (d.top -= j.y, d.left -= j.x), d = {
				top : p(d.top - h * a.topRatio),
				left : p(d.left - i * a.leftRatio),
				width : p(e + i),
				height : p(f + h)
			}
		},
		step : function(a, b) {
			var c, d, e, f = b.prop, h = g.current, i = h.wrapSpace, j = h.skinSpace;
			("width" === f || "height" === f) && ( c = b.end === b.start ? 1 : (a - b.start) / (b.end - b.start), g.isClosing && ( c = 1 - c), d = "width" === f ? h.wPadding : h.hPadding, e = a - d, g.skin[f](o("width" === f ? e : e - i * c)), g.inner[f](o("width" === f ? e : e - i * c - j * c)))
		},
		zoomIn : function() {
			var a = g.current, b = a.pos, d = a.openEffect, e = "elastic" === d, f = c.extend({
				opacity : 1
			}, b);
			delete f.position, e ? ( b = this.getOrigPosition(), a.openOpacity && (b.opacity = .1)) : "fade" === d && (b.opacity = .1), g.wrap.css(b).animate(f, {
				duration : "none" === d ? 0 : a.openSpeed,
				easing : a.openEasing,
				step : e ? this.step : null,
				complete : g._afterZoomIn
			})
		},
		zoomOut : function() {
			var a = g.current, b = a.closeEffect, c = "elastic" === b, d = {
				opacity : .1
			};
			c && ( d = this.getOrigPosition(), a.closeOpacity && (d.opacity = .1)), g.wrap.animate(d, {
				duration : "none" === b ? 0 : a.closeSpeed,
				easing : a.closeEasing,
				step : c ? this.step : null,
				complete : g._afterZoomOut
			})
		},
		changeIn : function() {
			var h, a = g.current, b = a.nextEffect, c = a.pos, d = {
				opacity : 1
			}, e = g.direction, f = 200;
			c.opacity = .1, "elastic" === b && ( h = "down" === e || "up" === e ? "top" : "left", "down" === e || "right" === e ? (c[h] = p(o(c[h]) - f), d[h] = "+=" + f + "px") : (c[h] = p(o(c[h]) + f), d[h] = "-=" + f + "px")), "none" === b ? g._afterZoomIn() : g.wrap.css(c).animate(d, {
				duration : a.nextSpeed,
				easing : a.nextEasing,
				complete : g._afterZoomIn
			})
		},
		changeOut : function() {
			var a = g.previous, b = a.prevEffect, d = {
				opacity : .1
			}, e = g.direction, f = 200;
			"elastic" === b && (d["down" === e || "up" === e ? "top" : "left"] = ("up" === e || "left" === e ? "-" : "+") + "=" + f + "px"), a.wrap.animate(d, {
				duration : "none" === b ? 0 : a.prevSpeed,
				easing : a.prevEasing,
				complete : function() {
					c(this).trigger("onReset").remove()
				}
			})
		}
	}, g.helpers.overlay = {
		defaults : {
			closeClick : !0,
			speedOut : 200,
			showEarly : !0,
			css : {},
			locked : !j,
			fixed : !0
		},
		overlay : null,
		fixed : !1,
		create : function(a) {
			a = c.extend({}, this.defaults, a), this.overlay && this.close(), this.overlay = c('<div class="fancybox-overlay"></div>').appendTo("body"), this.fixed = !1, a.fixed && g.defaults.fixed && (this.overlay.addClass("fancybox-overlay-fixed"), this.fixed = !1)
		},
		open : function(a) {
			var b = this;
			a = c.extend({}, this.defaults, a), this.overlay ? this.overlay.unbind(".overlay").width("auto").height("auto") : this.create(a), this.fixed || (e.bind("resize.overlay", c.proxy(this.update, this)), this.update()), a.closeClick && this.overlay.bind("click.overlay", function(a) {
				c(a.target).hasClass("fancybox-overlay") && (g.isActive ? g.close() : b.close())
			}), this.overlay.css(a.css).show()
		},
		close : function() {
			c(".fancybox-overlay").remove(), e.unbind("resize.overlay"), this.overlay = null, this.margin !== !1 && (c("body").css("margin-right", this.margin), this.margin = !1), this.el && this.el.removeClass("fancybox-lock")
		},
		update : function() {
			var c, a = "100%";
			this.overlay.width(a).height("100%"), h ? ( c = Math.max(b.documentElement.offsetWidth, b.body.offsetWidth), f.width() > c && ( a = f.width())) : f.width() > e.width() && ( a = f.width()), this.overlay.width(a).height(f.height())
		},
		onReady : function(a, d) {
			c(".fancybox-overlay").stop(!0, !0), this.overlay || (this.margin = f.height() > e.height() || "scroll" === c("body").css("overflow-y") ? c("body").css("margin-right") : !1, this.el = b.all && !b.querySelector ? c("html") : c("body"), this.create(a)), a.locked && this.fixed && (d.locked = this.overlay.append(d.wrap), d.fixed = !1), a.showEarly === !0 && this.beforeShow.apply(this, arguments)
		},
		beforeShow : function(a, b) {
			b.locked && (this.el.addClass("fancybox-lock"), this.margin !== !1 && c("body").css("margin-right", o(this.margin) + b.scrollbarWidth)), this.open(a)
		},
		onUpdate : function() {
			this.fixed || this.update()
		},
		afterClose : function(a) {
			this.overlay && !g.isActive && this.overlay.fadeOut(a.speedOut, c.proxy(this.close, this))
		}
	}, g.helpers.title = {
		defaults : {
			type : "inside",
			position : "bottom"
		},
		beforeShow : function(a) {
			var f, i, b = g.current, d = b.title, e = a.type;
			if (c.isFunction(d) && ( d = d.call(b.element, b)), l(d) && "" !== c.trim(d)) {
				switch(f=c('<div class="fancybox-title fancybox-title-'+e+'-wrap">'+d+"</div>"),e) {
				case"inside":
					i = g.skin;
					break;
				case"outside":
					i = g.wrap;
					break;
				case"over":
					i = g.inner;
					break;
				default:
					i = g.skin, f.appendTo("body"), h && f.width(f.width()), f.wrapInner('<span class="child"></span>'), g.current.margin[2] += Math.abs(o(f.css("margin-bottom")))
				}
				f["top"===a.position?"prependTo":"appendTo"](i)
			}
		}
	}, c.fn.fancybox = function(a) {
		var b, d = c(this), e = this.selector || "", h = function(f) {
			var j, k, h = c(this).blur(), i = b;
			f.ctrlKey || f.altKey || f.shiftKey || f.metaKey || h.is(".fancybox-wrap") || ( j = a.groupAttr || "data-fancybox-group", k = h.attr(j), k || ( j = "rel", k = h.get(0)[j]), k && "" !== k && "nofollow" !== k && ( h = e.length ? c(e) : d, h = h.filter("[" + j + '="' + k + '"]'), i = h.index(this)), a.index = i, g.open(h, a) !== !1 && f.preventDefault())
		};
		return a = a || {}, b = a.index || 0, e && a.live !== !1 ? f.undelegate(e, "click.fb-start").delegate(e + ":not('.fancybox-item, .fancybox-nav')", "click.fb-start", h) : d.unbind("click.fb-start").bind("click.fb-start", h), this.filter("[data-fancybox-start=1]").trigger("click"), this
	}, f.ready(function() {
		c.scrollbarWidth === d && (c.scrollbarWidth = function() {
			var a = c('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"), b = a.children(), d = b.innerWidth() - b.height(99).innerWidth();
			return a.remove(), d
		}), c.support.fixedPosition === d && (c.support.fixedPosition = function() {
			var a = c('<div style="position:fixed;top:20px;"></div>').appendTo("body"), b = 20 === a[0].offsetTop || 15 === a[0].offsetTop;
			return a.remove(), b
		}()), c.extend(g.defaults, {
			scrollbarWidth : c.scrollbarWidth(),
			fixed : c.support.fixedPosition,
			parent : c("body")
		})
	})
}(window, document, jQuery), function(a) {
	function b(b) {
		var c = b || window.event, d = [].slice.call(arguments, 1), e = 0, f = 0, g = 0, b = a.event.fix(c);
		return b.type = "mousewheel", c.wheelDelta && ( e = c.wheelDelta / 120), c.detail && ( e = -c.detail / 3), g = e,
		void 0 !== c.axis && c.axis === c.HORIZONTAL_AXIS && ( g = 0, f = -1 * e),
		void 0 !== c.wheelDeltaY && ( g = c.wheelDeltaY / 120),
		void 0 !== c.wheelDeltaX && ( f = -1 * c.wheelDeltaX / 120), d.unshift(b, e, f, g), (a.event.dispatch || a.event.handle).apply(this, d)
	}

	var d, c = ["DOMMouseScroll", "mousewheel"];
	if (a.event.fixHooks)
		for ( d = c.length; d; )
			a.event.fixHooks[c[--d]] = a.event.mouseHooks;
	a.event.special.mousewheel = {
		setup : function() {
			if (this.addEventListener)
				for (var a = c.length; a; )
					this.addEventListener(c[--a], b, !1);
			else
				this.onmousewheel = b
		},
		teardown : function() {
			if (this.removeEventListener)
				for (var a = c.length; a; )
					this.removeEventListener(c[--a], b, !1);
			else
				this.onmousewheel = null
		}
	}, a.fn.extend({
		mousewheel : function(a) {
			return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
		},
		unmousewheel : function(a) {
			return this.unbind("mousewheel", a)
		}
	})
}(jQuery); 