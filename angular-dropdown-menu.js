/**
 * Директива простейшего дропдаун меню
 *
 * Вызов директивы происходит только через аттрибут
 * lin-dropdown-menu
 *
 * Нужно ли закрывать при клике по элементу или в любой другой области
 * Изначально стоит true:
 * lin-dm-auto-closed
 *
 * Пункты меню передаются в виде объекта (listMenu)
 * lin-dm-list="listMenu"
 *
 * Есть несколько видов надстроек пункта меню:
 *
 * Ссылка:
 * --------------------------
 * 		text: 'Пункт меню',
 * 		url: 'http://slaaless.github.io/', -> Не обязательно
 * 		target: '_blank' || '_self' -> Дефолтно проставляется '_blank'
 * --------------------------
 *
 * Темплейт:
 * --------------------------
 * 		template: '<div custom-directive || ng-click="fun()">Опция 1</div>'
 * --------------------------
 *
 * Темплейт ссылка:
 * --------------------------
 * 		templateUrl: 'linDropdown/templates/linDropdownMenu.html'
 *
 * 		Замечание: Темплейт должен быть в $templateCache
 * --------------------------
 *
 *
 */

(function() {
    'use strict';

    var app = angular.module('linDropdown', []);
    app.directive('linDropdownMenu', linDropdownMenu);
    app.directive('linDropdownMenuItem', linDropdownMenuItem);

    app.run(['$templateCache', function ($templateCache) {
        $templateCache.put('linDropdown/templates/linDropdownMenu.html', [
            '<span class="dropdown-menu__clicker">',
            '</span>',
            '<ul class="dropdown-menu__list">',
                '<li class="dropdown-menu__item" lin-dropdown-menu-item="item" ng-repeat="item in linDmList">',
                '</li>',
            '</ul>'
        ].join(''));

        $templateCache.put('linDropdown/templates/linDropdownMenuItem.html', [
        '<a href="{{linDropdownMenuItem.url}}" ng-click="selectItem()">{{linDropdownMenuItem.text}}</a>'
        ].join(''));
    }]);

    function linDropdownMenu($document, $compile, $templateCache) {
        var directive = {
            restrict: 'A',
            scope: {
                linDmList: '=',
                linDmAutoClosed: '='
            },
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {
            el.append($compile($templateCache.get('linDropdown/templates/linDropdownMenu.html'))(scope));
            el.addClass('dropdown-menu');
            var itemClosed = scope.linDmAutoClosed ? scope.linDmAutoClosed : true;
            var opened = false;

            angular.element(document.body).on('click', function(event) {
                var hasElement = angular.element(event.target);

                if (hasElement.hasClass('dropdown-menu__clicker')) {
                    opened = !opened;
                    el.toggleClass('dropdown-menu_status_active');
                    event.preventDefault();
                    return false;
                }

                if (itemClosed) {
                    opened = !opened;
                    el.removeClass('dropdown-menu_status_active');
                }
            });
        }
    }

    function linDropdownMenuItem($compile, $templateCache) {
        var directive = {
            restrict: 'A',
            scope: {
                linDropdownMenuItem: '='
            },
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {

            if (scope.linDropdownMenuItem.template) {
                el.append($compile(angular.element(scope.linDropdownMenuItem.template))(scope.$parent.$parent.$parent));
                return;
            }

            if (scope.linDropdownMenuItem.templateUrl) {
                el.append($compile($templateCache.get(scope.linDropdownMenuItem.templateUrl))(scope.$parent.$parent.$parent));
                return;
            }

            var target = scope.linDropdownMenuItem.target ? scope.linDropdownMenuItem.target : '_blank';
            scope.selectItem = function() {
                if (scope.linDropdownMenuItem.url) {
                    window.open(scope.linDropdownMenuItem.url, target);
                }
            }

            el.append($compile($templateCache.get('linDropdown/templates/linDropdownMenuItem.html'))(scope));
        }
    }
})();
