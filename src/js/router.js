/*
TODO: 该路由器需要重新设计
*/

class Router {

    constructor(routes) {
        /*
          [
            {
              pathReg: /\/pathregex/,
              render: function () => {}
            }
          ]
        */
        this.currentUrl = '';
        this.routes = routes;
        this.init();
        this.linkHijack();
    }

    init() {
        var _this = this;
        window.addEventListener('load', this.render.bind(this), false);
        window.addEventListener('popstate', function(e) {
            let url = e.target.location.href.split(e.target.location.origin);
            console.log('yes' + url);
            // _this.render(url);
        }, false);
    }

    linkHijack() {
        var _this = this;
        document.onclick = function(event) {
            event = event || window.event;
            var target = event.target || event.srcElement;
            if (target.tagName == 'A')
                target.onclick = function(event) {
                    event.cancelBubble = true;
                    event.preventDefault();
                    let url = target.attributes.getNamedItem('href').value;
                    // _this.render(url);
                };
            target.onclick && target.onclick(event);
        };
    }

    _parse(rest, res={queries: {}, fragment: undefined}) {
        if (rest.length > 0) {
            if (rest[0] && rest[0].startsWith("?")) {
                rest[0].substr(1).split("&").forEach(
                    function(item) {
                        let key = item.split("=")[0],
                            value = item.split("=")[1];
                        res.queries[key] = value;
                    });
            } else if (rest[0] && rest[0].startsWith("#")) {
                res.fragment = rest[0];
            }
            this._parse(rest.slice(1), res);
        }
        return res;
    }

    parsing(url) {
        try {

            var response = {
                request: {},
                render: function() {console.log("404 Not Found");}
            };

            for(var i=0; i < this.routes.length; i++) {
                var route = this.routes[i],
                    pathReg = route.pathReg,
                    render = route.render;

                this.updateUrl(url);

                if(pathReg.test(url)) {

                    var parsedUrl = /^([^?#]+)(\?[^?#]+)?(#.+)?/.exec(url),
                        path = parsedUrl[1],
                        result = this._parse(parsedUrl.slice(2));

                    response.request.path = path;
                    response.request.queries = result.queries;
                    response.request.fragment = result.fragment;
                    response.render = render;
                    return response;

                }
            }
            this.currentUrl = '/404';
            return response;

        } catch(err) {
            // return 500 page
            // console.error(err);
            this.currentUrl = '/500';
            return {
                request: {},
                render: function() {console.log("500 Not Found");}
             };
        }
    }

    updateUrl(url) {
        history.pushState({}, null, url);
        this.currentUrl = url;

    }

    render(url) {
        let view = this.parsing(url);
        view.render(view.request);
    }
}

export { Router };
