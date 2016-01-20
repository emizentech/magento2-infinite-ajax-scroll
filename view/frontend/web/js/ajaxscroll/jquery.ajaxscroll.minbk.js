/*!
 * Infinite Ajax Scroll, a jQuery plugin 
 * Version v0.1.5
 * http://webcreate.nl/
 *
 * Copyright (c) 2011 Jeroen Fiege
 * Licensed under the MIT License: 
 * http://webcreate.nl/license
 */
(function (b) {
	
    b.ajaxscroll = function (d) {
        var m = b.extend({}, b.ajaxscroll.defaults, d);
        var c = new b.ajaxscroll.util();
        var j = new b.ajaxscroll.paging();
        var h = (m.history ? new b.ajaxscroll.history() : false);
        var f = this;
        r();
	
        function r() {
            j.onChangePage(function (x, v, w) {
                if (h) {
                    h.setPage(x, w)
                }
                m.onPageChange.call(this, x, w, v)
            });
            s();
            if (h && h.havePage()) {
                q();
                pageNum = h.getPage();
                c.forceScrollTop(function () {
                    if (pageNum > 1) {
                        l(pageNum);
                        curTreshold = p(true);
                        b("html,body").scrollTop(curTreshold)
                    } else {
                        s()
                    }
                })
            }
            return f
        }

        function s() {
            n();
            b(window).scroll(g)
        }

        function g() {
            scrTop = b(window).scrollTop();
            wndHeight = b(window).height();
            curScrOffset = scrTop + wndHeight;
            if (curScrOffset >= p()) {
                t(curScrOffset)
            }else{
				// alert(1)
				// alert(curScrOffset);
				// alert(p());
				// alert(jQuery(window).height());
			}
        }

        function q() {
            b(window).unbind("scroll", g)
        }

        function n() {
            b(m.pagination).hide()
        }

        function p(v) {

            el = b(m.container).find(m.item).last();			
            if (el.size() == 0) {
                return 0
            }
						
            treshold = el.offset().top + el.height();

            if (!v) {
                treshold = treshold*1 + m.tresholdMargin*1;
            }
 
            return treshold
        }

        function t(w, v) {
			var kl = jQuery('.category-products '+m.item+' .product-image').length;
            urlNextPage = b(m.next).attr("href");
            if (!urlNextPage) {
                return q()
            }
            j.pushPages(w, urlNextPage);
            q();
            o();
            e(urlNextPage, function (y, x) {
                result = m.onLoadItems.call(this, x);
                if (result !== false) {
                    b(x).hide();
                    curLastItem = b(m.container).find(m.item).last();
                    curLastItem.after(x);
                    b(x).fadeIn()
                }

                b(m.pagination).replaceWith(b(m.pagination, y));
				var km = jQuery('.category-products '+m.item+' .product-image').length;
                k();
                s();
				ft=ft+1;

				jQuery(''+m.item+' li .product-image img').slice(kl).hide();
				jQuery(''+m.item+' li .product-image').slice(kl).prepend(img);	
				setTimeout(function() {jQuery('.scroll_loading').remove();}, 1500);
				setTimeout(function() { jQuery(''+m.item+' li .product-image img').slice(kl).show();}, 1600);
                m.onRenderComplete.call(this, x);
                if (v) {
                    v.call(this)
                }
            })
        }
        function e(w, x) {
            var v = [];
            b.get(w, null, function (y) {
                b(m.container, y).find(m.item).each(function () {
                    v.push(this)
                });
                if (x) {
                    x.call(this, y, v)
                }
            }, "html")
        }

        function l(v) {
            curTreshold = p(true);
            if (curTreshold > 0) {
                t(curTreshold, function () {
                    q();
                    if ((j.getCurPageNum(curTreshold) + 1) < v) {
                        l(v);
                        b("html,body").animate({scrollTop:curTreshold}, 400, "swing")
                    } else {
                        b("html,body").animate({scrollTop:curTreshold}, 1000, "swing");
                        s()
                    }
                })
            }
        }

        function u() {
            loader = b(".ajaxscroll_loader");
            if (loader.size() == 0) {
                loader = b("<div class='ajaxscroll_loader'>" + m.loader + "</div>");
                loader.hide()
            }
            return loader
        }

        function o(v) {
            loader = u();
            el = b(m.container).find(m.item).last();
            el.after(loader);
            loader.fadeIn()
        }

        function k() {	
            loader = u();
            loader.remove();
        }
    };
    function a(c) {
        if (window.console && window.console.log) {
            window.console.log(c)
        }
    }

    b.ajaxscroll.defaults = {container:"#container", item:".item", pagination:"#pagination", next:".next", loader:'<img src="loader.gif"/>', tresholdMargin:'0', history:true, onPageChange:function () {
    }, onLoadItems:function () {
    }, onRenderComplete:function () {
    } };
    b.ajaxscroll.util = function () {
        var d = false;
        var f = false;
        var c = this;
        e();
        function e() {
            b(window).load(function () {
                d = true
            })
        }

        this.forceScrollTop = function (g) {
            b("html,body").scrollTop(0);
            if (!f) {
                if (!d) {
                    setTimeout(function () {
                        c.forceScrollTop(g)
                    }, 1)
                } else {
                    g.call();
                    f = true
                }
            }
        }
    };
    b.ajaxscroll.paging = function () {
        var e = [
            [0, document.location.toString()]
        ];
        var h = function () {
        };
        var d = 1;
        j();
        function j() {
            b(window).scroll(g)
        }

        function g() {
            scrTop = b(window).scrollTop();
            wndHeight = b(window).height();
            curScrOffset = scrTop + wndHeight;
            curPageNum = c(curScrOffset);
            curPagebreak = f(curScrOffset);
            if (d != curPageNum) {
                h.call(this, curPageNum, curPagebreak[0], curPagebreak[1])
            }
            d = curPageNum
        }

        function c(k) {
            for (i = (e.length - 1); i > 0; i--) {
                if (k > e[i][0]) {
                    return i + 1
                }
            }
            return 1
        }

        this.getCurPageNum = function (k) {
            return c(k)
        };
        function f(k) {
            for (i = (e.length - 1); i >= 0; i--) {
                if (k > e[i][0]) {
                    return e[i]
                }
            }
            return null
        }

        this.onChangePage = function (k) {
            h = k
        };
        this.pushPages = function (k, l) {
            e.push([k, l])
        }
    };
    b.ajaxscroll.history = function () {
        var d = false;
        var c = false;
        e();
        function e() {
            c = !!(window.history && history.pushState && history.replaceState);
            c = false
        }

        this.setPage = function (g, f) {
            this.updateState({page:g}, "", f)
        };
        this.havePage = function () {
            return(this.getState() != false)
        };
        this.getPage = function () {
            if (this.havePage()) {
                stateObj = this.getState();
                return stateObj.page
            }
            return 1
        };
        this.getState = function () {
            if (c) {
                stateObj = history.state;
                if (stateObj && stateObj.ajaxscroll) {
                    return stateObj.ajaxscroll
                }
            } else {
                haveState = (window.location.hash.substring(0, 7) == "#/page/");
                if (haveState) {
                    pageNum = parseInt(window.location.hash.replace("#/page/", ""));
                    return{page:pageNum}
                }
            }
            return false
        };
        this.updateState = function (g, h, f) {
            if (d) {
                this.replaceState(g, h, f)
            } else {
                this.pushState(g, h, f)
            }
        };
        this.pushState = function (g, h, f) {
            if (c) {
                history.pushState({ajaxscroll:g}, h, f)
            } else {
                hash = (g.page > 0 ? "#/page/" + g.page : "");
                window.location.hash = hash
            }
            d = true
        };
        this.replaceState = function (g, h, f) {
            if (c) {
                history.replaceState({ajaxscroll:g}, h, f)
            } else {
                this.pushState(g, h, f)
            }
        }
    }
})(jQuery);