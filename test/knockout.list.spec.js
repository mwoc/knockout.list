/*global describe, beforeEach, afterEach, createTestElement, ko, expect, it, itemFactory, scrollToBottom, sinon, $, tileRange*/
var itemHeight = 30;
var viewportHeight = itemHeight * 3;
var dividerHeight = 20;
var offsetElementHeight = 40;
describe('knockout.list with height ' + viewportHeight + 'px and items of height ' + itemHeight + 'px and divider of height 20px', function () {
    var clock;
    var element;
    var scrollElement;
    beforeEach(function () {
        clock = sinon.useFakeTimers();
    });

    afterEach(function () {
        clock.restore();
    });

    describe('scrolling through the same element as it is bound to', function () {
        beforeEach(function () {
            element = createTestElement({
                viewportHeight: viewportHeight,
                itemHeight: itemHeight
            });
            scrollElement = element;
        });

        describe('with an observable array as data source', function () {
            describe('when the data source is empty', function () {
                var model;
                beforeEach(function () {
                    model = { items: ko.observableArray(), dividers: ko.observable() };
                    ko.applyBindings(model, element);
                    clock.tick(110);
                });

                it('renders no tiles', function () {
                    expect(element, 'to have number of tiles', 0);
                });

                it('has scroll height equal to container', function () {
                    expect(scrollElement, 'to have scroll height', viewportHeight);
                });

                it('has content height equals to the height of all items', function () {
                    expect(element, 'to have content height', 0);
                });

                describe('and it has 3 dividers', function () {
                    beforeEach(function () {
                        model.dividers({ 20: "A", 40: 'B', 60: 'C' });
                        clock.tick(110);
                    });

                    it('places all dividers sequential from the start of the list', function () {
                        expect(element, 'to have number of dividers', 3);
                    });

                    it('has scroll height equal to container', function () {
                        expect(scrollElement, 'to have scroll height', viewportHeight);
                    });

                    it('has content height equals to the height of all dividers', function () {
                        expect(element, 'to have content height', dividerHeight * 3);
                    });

                    it('has no overlapping tiles', function () {
                        expect(element, 'to have no gap or overlapping between tiles and dividers');
                    });
                });
            });

            describe('when the data source is smaller then the eviction treshold of 100 items', function () {
                var model;
                var numberOfItems = 99;

                describe('and the initial visible index is set to the first item', function () {
                    beforeEach(function () {
                        model = {
                            items: ko.observableArray(itemFactory.create(numberOfItems)),
                            visibleIndex: ko.observable(0).extend({ notify: 'always' }),
                            dividers: ko.observable()
                        };
                        ko.applyBindings(model, element);
                        clock.tick(110);
                    });

                    it('renders ' + numberOfItems + ' tiles', function () {
                        expect(element, 'to have number of tiles', numberOfItems);
                    });

                    it('has scroll height equals to the height of all items', function () {
                        expect(scrollElement, 'to have scroll height', numberOfItems * itemHeight);
                    });

                    it('has content height equals to the height of all items', function () {
                        expect(element, 'to have content height', numberOfItems * itemHeight);
                    });

                    it('has no overlapping tiles', function () {
                        expect(element, 'to have no gap or overlapping between tiles');
                    });
                });

                describe('and the initial visible index is set to the last item', function () {
                    beforeEach(function () {
                        model = {
                            items: ko.observableArray(itemFactory.create(numberOfItems)),
                            visibleIndex: ko.observable(99).extend({ notify: 'always' }),
                            dividers: ko.observable()
                        };
                        ko.applyBindings(model, element);
                        clock.tick(110);
                    });

                    it('scrolls the last item into view', function () {
                        expect(scrollElement, 'to have scroll top', numberOfItems * itemHeight - viewportHeight);
                    });

                    it('still has ' + numberOfItems + ' tiles', function () {
                        expect(element, 'to have number of tiles', numberOfItems);
                    });
                });

                describe('and the viewport is scrolled to the bottom', function () {
                    beforeEach(function () {
                        model = {
                            items: ko.observableArray(itemFactory.create(numberOfItems)),
                            visibleIndex: ko.observable(0).extend({ notify: 'always' }),
                            dividers: ko.observable()
                        };
                        ko.applyBindings(model, element);
                        clock.tick(110);
                        scrollToBottom(scrollElement);
                    });

                    it('still has ' + numberOfItems + ' tiles', function () {
                        expect(element, 'to have number of tiles', numberOfItems);
                    });

                    it('has no overlapping tiles', function () {
                        expect(element, 'to have no gap or overlapping between tiles');
                    });

                    describe('and it has 3 dividers', function () {
                        beforeEach(function () {
                            model.dividers({ 20: "A", 40: 'B', 60: 'C' });
                            clock.tick(110);
                        });

                        it('places all dividers sequential from the start of the list', function () {
                            expect(element, 'to have number of dividers', 3);
                        });

                        it('has scroll height equals to the height of all items and dividers', function () {
                            expect(scrollElement, 'to have scroll height', dividerHeight * 3 + numberOfItems * itemHeight);
                        });

                        it('has content height equals to the height of all items and dividers', function () {
                            expect(element, 'to have content height', dividerHeight * 3 + numberOfItems * itemHeight);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles and dividers');
                        });
                    });

                    describe('and the visible index is set to the first item', function () {
                        beforeEach(function () {
                            model.visibleIndex(0);
                            clock.tick(110);
                        });

                        it('scrolls the first item into view', function () {
                            expect(scrollElement, 'to have scroll top', 0);
                        });
                    });
                });

            });

            describe('when the data source is larger then the eviction treshold of 100 items', function () {
                var model;
                var numberOfItems = 100;
                beforeEach(function () {
                    model = {
                        items: ko.observableArray(itemFactory.create(numberOfItems)),
                        visibleIndex: ko.observable(0).extend({ notify: 'always' }),
                        dividers: ko.observable()
                    };
                });

                describe('and the initial visible index is set to the first item', function () {
                    beforeEach(function () {
                        model.visibleIndex(0);
                        ko.applyBindings(model, element);
                        clock.tick(110);
                    });

                    it('has scroll height equals to the height of all items', function () {
                        expect(scrollElement, 'to have scroll height', numberOfItems * itemHeight);
                    });

                    it('has content height equals to the height of all items', function () {
                        expect(element, 'to have content height', numberOfItems * itemHeight);
                    });

                    it('has tiles item0 to item5', function () {
                        expect(element, 'to only have tiles', tileRange(0, 5));
                    });

                    it('has no overlapping tiles', function () {
                        expect(element, 'to have no gap or overlapping between tiles');
                    });

                    describe('and the viewport is scrolled to item 20', function () {
                        beforeEach(function () {
                            scrollTo(scrollElement, 20 * itemHeight);
                            clock.tick(110);
                        });

                        it('has tiles item17 to item25', function () {
                            clock.tick(110);
                            expect(element, 'to only have tiles', tileRange(17, 25));
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and the viewport is scrolled to item 20 and back to item 10', function () {
                        beforeEach(function () {
                            scrollTo(scrollElement, 20 * itemHeight);
                            scrollTo(scrollElement, 10 * itemHeight);
                            clock.tick(110);
                        });

                        it('has tiles item7 to item16', function () {
                            expect(element, 'to only have tiles', tileRange(7, 15));
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });

                        describe('and it has 3 dividers', function () {
                            beforeEach(function () {
                                model.dividers({ 10: "A", 40: 'B', 60: 'C' });
                                clock.tick(110);
                            });

                            it('places all dividers sequential from the start of the list', function () {
                                expect(element, 'to have number of dividers', 3);
                            });

                            it('has scroll height equals to the height of all items and dividers', function () {
                                expect(scrollElement, 'to have scroll height', dividerHeight * 3 + numberOfItems * itemHeight);
                            });

                            it('has content height equals to the height of all items and dividers', function () {
                                expect(element, 'to have content height', dividerHeight * 3 + numberOfItems * itemHeight);
                            });

                            it('has no overlapping tiles', function () {
                                expect(element, 'to have no gap or overlapping between tiles');
                            });
                        });
                    });

                    describe('and the viewport is scrolled to the bottom', function () {
                        beforeEach(function () {
                            scrollToBottom(scrollElement);
                            clock.tick(110);
                        });

                        it('has tiles item94 to item99', function () {
                            expect(element, 'to only have tiles', tileRange(94, 99));
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });

                        describe('and it has 3 dividers', function () {
                            beforeEach(function () {
                                model.dividers({ 10: "A", 40: 'B', 95: 'C' });
                                clock.tick(110);
                            });

                            it('places all dividers sequential from the start of the list', function () {
                                expect(element, 'to have number of dividers', 3);
                            });

                            it('has scroll height equals to the height of all items and dividers', function () {
                                expect(scrollElement, 'to have scroll height', dividerHeight * 3 + numberOfItems * itemHeight);
                            });

                            it('has content height equals to the height of all items and dividers', function () {
                                expect(element, 'to have content height', dividerHeight * 3 + numberOfItems * itemHeight);
                            });

                            it('has no overlapping tiles', function () {
                                expect(element, 'to have no gap or overlapping between tiles');
                            });
                        });
                    });

                    describe('and a new item is added to the bottom of the list that is outside of the render tiles', function () {
                        beforeEach(function () {
                            model.items.push(itemFactory());
                            clock.tick(110);
                            model.visibleIndex(model.items().length - 1);
                            $(scrollElement).trigger('scroll');
                            clock.tick(110);
                        });

                        it('has tiles item95 to item100', function () {
                            expect(element, 'to only have tiles', tileRange(95, 100));
                        });

                        it('has scroll height equals to the height of all items', function () {
                            expect(scrollElement, 'to have scroll height', (numberOfItems + 1) * itemHeight);
                        });

                        it('has content height equals to the height of all items', function () {
                            expect(element, 'to have content height', (numberOfItems + 1) * itemHeight);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and a new item is added to the middle of the list that is outside of the render tiles', function () {
                        beforeEach(function () {
                            model.items.splice(50, 0, itemFactory('newItem'));
                            clock.tick(110);
                            model.visibleIndex(50);
                            $(scrollElement).trigger('scroll');
                            clock.tick(110);
                        });

                        it('has tiles item45 to item52 and the new item', function () {
                            expect(element, 'to only have tiles', tileRange(45, 52).concat('#newItem'));
                        });

                        it('has scroll height equals to the height of all items', function () {
                            expect(scrollElement, 'to have scroll height', (numberOfItems + 1) * itemHeight);
                        });

                        it('has content height equals to the height of all items', function () {
                            expect(element, 'to have content height', (numberOfItems + 1) * itemHeight);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and a new item inside the viewport', function () {
                        beforeEach(function () {
                            scrollTo(scrollElement, 50 * itemHeight);
                            model.items.splice(51, 0, itemFactory('newItem'));
                            clock.tick(110);
                        });

                        it('has tiles item47 to item54 and the new item', function () {
                            expect(element, 'to only have tiles', tileRange(47, 54).concat('#newItem'));
                        });

                        it('has scroll height equals to the height of all items', function () {
                            expect(scrollElement, 'to have scroll height', (numberOfItems + 1) * itemHeight);
                        });

                        it('has content height equals to the height of all items', function () {
                            expect(element, 'to have content height', (numberOfItems + 1) * itemHeight);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and items has just been sorted in the reverse direction', function () {
                        beforeEach(function () {
                            scrollTo(scrollElement, 50 * itemHeight);
                            model.items.sort(function (x, y) {
                                return parseInt(y.slice(4), 10) - parseInt(x.slice(4), 10);
                            });
                            clock.tick(110);
                        });

                        it('has tiles item44 to item52 and the new item', function () {
                            expect(element, 'to only have tiles', tileRange(44, 52));
                        });

                        it('has scroll height equals to the height of all items', function () {
                            expect(scrollElement, 'to have scroll height', numberOfItems * itemHeight);
                        });

                        it('has content height equals to the height of all items', function () {
                            expect(element, 'to have content height', numberOfItems * itemHeight);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and the data is replaced', function () {
                        beforeEach(function () {
                            scrollTo(scrollElement, 50 * itemHeight);
                            clock.tick(110);
                            model.items(itemFactory.create(100));
                            clock.tick(110);
                        });

                        it('has tiles item147 to item155 and the new item', function () {
                            expect(element, 'to only have tiles', tileRange(147, 155));
                        });

                        it('has scroll height equals to the height of all items', function () {
                            expect(scrollElement, 'to have scroll height', numberOfItems * itemHeight);
                        });

                        it('has content height equals to the height of all items', function () {
                            expect(element, 'to have content height', numberOfItems * itemHeight);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });
                }); // end visible index set to first item

                describe('and the initial visible index is set to the last item', function () {
                    beforeEach(function () {
                        model.visibleIndex(99);
                        ko.applyBindings(model, element);
                        clock.tick(110);
                    });

                    it('scrolls the last item into view', function () {
                        expect(scrollElement, 'to have scroll top', numberOfItems * itemHeight - viewportHeight);
                    });

                    it('has tiles item94 to item99', function () {
                        expect(element, 'to only have tiles', tileRange(94, 99));
                    });
                });
            });
        });
    }); // end 'scrolling through the same element as it is bound to'

    describe('scrolling through parent of element it is bound to', function () {

        describe('with offset elements of ' + offsetElementHeight + 'px tall above and below list', function () {
            beforeEach(function () {
                element = createTestElementWithScrollableParent({
                    viewportHeight: viewportHeight,
                    itemHeight: itemHeight,
                    offsetElementHeight: offsetElementHeight
                });
                scrollElement = $(element).parents('.scrollable').get(0);
            });

            describe('with an observable array as data source', function () {
                describe('when the data source is empty', function () {
                    var model;
                    beforeEach(function () {
                        model = { items: ko.observableArray(), dividers: ko.observable() };
                        ko.applyBindings(model, element);
                        clock.tick(110);
                    });

                    it('renders no tiles', function () {
                        expect(element, 'to have number of tiles', 0);
                    });

                    it('has scroll height equal to container', function () {
                        expect(scrollElement, 'to have scroll height', viewportHeight);
                    });

                    it('has content height equals to the height of all items', function () {
                        expect(element, 'to have content height', 0);
                    });

                    describe('and it has 3 dividers', function () {
                        beforeEach(function () {
                            model.dividers({ 20: "A", 40: 'B', 60: 'C' });
                            clock.tick(110);
                        });

                        it('places all dividers sequential from the start of the list', function () {
                            expect(element, 'to have number of dividers', 3);
                        });

                        it('has scroll height equal to container', function () {
                            expect(scrollElement, 'to have scroll height', dividerHeight * 3 + 2 * offsetElementHeight);
                        });

                        it('has content height equals to the height of all dividers', function () {
                            expect(element, 'to have content height', dividerHeight * 3);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles and dividers');
                        });
                    });
                });

                describe('when the data source is smaller then the eviction treshold of 100 items', function () {
                    var model;
                    var numberOfItems = 99;
                    beforeEach(function () {
                        model = {
                            items: ko.observableArray(itemFactory.create(numberOfItems)),
                            visibleIndex: ko.observable(0).extend({ notify: 'always' }),
                            dividers: ko.observable()
                        };
                        ko.applyBindings(model, element);
                        clock.tick(110);
                    });

                    it('renders ' + numberOfItems + ' tiles', function () {
                        expect(element, 'to have number of tiles', numberOfItems);
                    });

                    it('has scroll height equals to the height of all items', function () {
                        expect(scrollElement, 'to have scroll height', numberOfItems * itemHeight + 2 * offsetElementHeight);
                    });

                    it('has content height equals to the height of all items', function () {
                        expect(element, 'to have content height', numberOfItems * itemHeight);
                    });

                    it('has no overlapping tiles', function () {
                        expect(element, 'to have no gap or overlapping between tiles');
                    });

                    describe('and the viewport is scrolled to the bottom', function () {
                        beforeEach(function () {
                            scrollToBottom(scrollElement);
                        });

                        it('still has ' + numberOfItems + ' tiles', function () {
                            expect(element, 'to have number of tiles', numberOfItems);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });

                        describe('and it has 3 dividers', function () {
                            beforeEach(function () {
                                model.dividers({ 20: "A", 40: 'B', 60: 'C' });
                                clock.tick(110);
                            });

                            it('places all dividers sequential from the start of the list', function () {
                                expect(element, 'to have number of dividers', 3);
                            });

                            it('has scroll height equals to the height of all items and dividers', function () {
                                expect(scrollElement, 'to have scroll height', dividerHeight * 3 + numberOfItems * itemHeight + 2 * offsetElementHeight);
                            });

                            it('has content height equals to the height of all items and dividers', function () {
                                expect(element, 'to have content height', dividerHeight * 3 + numberOfItems * itemHeight);
                            });

                            it('has no overlapping tiles', function () {
                                expect(element, 'to have no gap or overlapping between tiles and dividers');
                            });
                        });

                        describe('and the visible index is set to the first item', function () {
                            beforeEach(function () {
                                model.visibleIndex(0);
                                clock.tick(110);
                            });

                            it('scrolls the first item into view', function () {
                                expect(scrollElement, 'to have scroll top', 0 + offsetElementHeight);
                            });
                        });
                    });

                });

                describe('when the data source is larger then the eviction treshold of 100 items', function () {
                    var model;
                    var numberOfItems = 100;
                    beforeEach(function () {
                        model = {
                            items: ko.observableArray(itemFactory.create(numberOfItems)),
                            visibleIndex: ko.observable(0).extend({ notify: 'always' }),
                            dividers: ko.observable()
                        };
                        ko.applyBindings(model, element);
                        clock.tick(110);
                    });

                    it('has scroll height equals to the height of all items', function () {
                        expect(scrollElement, 'to have scroll height', numberOfItems * itemHeight + 2 * offsetElementHeight);
                    });

                    it('has content height equals to the height of all items', function () {
                        expect(element, 'to have content height', numberOfItems * itemHeight);
                    });

                    it('has tiles item0 to item5', function () {
                        expect(element, 'to only have tiles', tileRange(0, 5));
                    });

                    it('has no overlapping tiles', function () {
                        expect(element, 'to have no gap or overlapping between tiles');
                    });

                    describe('and the viewport is scrolled to item 20', function () {
                        beforeEach(function () {
                            scrollTo(scrollElement, 20 * itemHeight + offsetElementHeight);
                            clock.tick(110);
                        });

                        it('has tiles item17 to item25', function () {
                            clock.tick(110);
                            expect(element, 'to only have tiles', tileRange(17, 25));
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and the viewport is scrolled to item 20 and back to item 10', function () {
                        beforeEach(function () {
                            scrollTo(scrollElement, 20 * itemHeight + offsetElementHeight);
                            scrollTo(scrollElement, 10 * itemHeight + offsetElementHeight);
                            clock.tick(110);
                        });

                        it('has tiles item7 to item15', function () {
                            expect(element, 'to only have tiles', tileRange(7, 15));
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });

                        describe('and it has 3 dividers', function () {
                            beforeEach(function () {
                                model.dividers({ 10: "A", 40: 'B', 60: 'C' });
                                clock.tick(110);
                            });

                            it('places all dividers sequential from the start of the list', function () {
                                expect(element, 'to have number of dividers', 3);
                            });

                            it('has scroll height equals to the height of all items and dividers', function () {
                                expect(scrollElement, 'to have scroll height', dividerHeight * 3 + numberOfItems * itemHeight + 2 * offsetElementHeight);
                            });

                            it('has content height equals to the height of all items and dividers', function () {
                                expect(element, 'to have content height', dividerHeight * 3 + numberOfItems * itemHeight);
                            });

                            it('has no overlapping tiles', function () {
                                expect(element, 'to have no gap or overlapping between tiles');
                            });
                        });
                    });

                    describe('and the viewport is scrolled to the bottom', function () {
                        beforeEach(function () {
                            scrollToBottom(scrollElement);
                            clock.tick(110);
                        });

                        it('has tiles item95 to item99', function () {
                            expect(element, 'to only have tiles', tileRange(95, 99));
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });

                        describe('and it has 3 dividers', function () {
                            beforeEach(function () {
                                model.dividers({ 10: "A", 40: 'B', 95: 'C' });
                                clock.tick(110);
                            });

                            it('places all dividers sequential from the start of the list', function () {
                                expect(element, 'to have number of dividers', 3);
                            });

                            it('has scroll height equals to the height of all items and dividers', function () {
                                expect(scrollElement, 'to have scroll height', dividerHeight * 3 + numberOfItems * itemHeight + 2 * offsetElementHeight);
                            });

                            it('has content height equals to the height of all items and dividers', function () {
                                expect(element, 'to have content height', dividerHeight * 3 + numberOfItems * itemHeight);
                            });

                            it('has no overlapping tiles', function () {
                                expect(element, 'to have no gap or overlapping between tiles');
                            });
                        });
                    });

                    describe('and a new item is added to the bottom of the list that is outside of the render tiles', function () {
                        beforeEach(function () {
                            model.items.push(itemFactory());
                            clock.tick(110);
                            model.visibleIndex(model.items().length - 1);
                            $(scrollElement).trigger('scroll');
                            clock.tick(110);
                        });

                        it('has tiles item95 to item100', function () {
                            expect(element, 'to only have tiles', tileRange(95, 100));
                        });

                        it('has scroll height equals to the height of all items', function () {
                            expect(scrollElement, 'to have scroll height', (numberOfItems + 1) * itemHeight + 2 * offsetElementHeight);
                        });

                        it('has content height equals to the height of all items', function () {
                            expect(element, 'to have content height', (numberOfItems + 1) * itemHeight);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and a new item is added to the middle of the list that is outside of the render tiles', function () {
                        beforeEach(function () {
                            model.items.splice(50, 0, itemFactory('newItem'));
                            clock.tick(110);
                            model.visibleIndex(50);
                            $(scrollElement).trigger('scroll');
                            clock.tick(110);
                        });

                        it('has tiles item45 to item52 and the new item', function () {
                            expect(element, 'to only have tiles', tileRange(45, 52).concat('#newItem'));
                        });

                        it('has scroll height equals to the height of all items', function () {
                            expect(scrollElement, 'to have scroll height', (numberOfItems + 1) * itemHeight + 2 * offsetElementHeight);
                        });

                        it('has content height equals to the height of all items', function () {
                            expect(element, 'to have content height', (numberOfItems + 1) * itemHeight);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and a new item inside the viewport', function () {
                        beforeEach(function () {
                            scrollTo(scrollElement, 50 * itemHeight + offsetElementHeight);
                            model.items.splice(51, 0, itemFactory('newItem'));
                            clock.tick(110);
                        });

                        it('has tiles item47 to item54 and the new item', function () {
                            expect(element, 'to only have tiles', tileRange(47, 54).concat('#newItem'));
                        });

                        it('has scroll height equals to the height of all items', function () {
                            expect(scrollElement, 'to have scroll height', (numberOfItems + 1) * itemHeight + 2 * offsetElementHeight);
                        });

                        it('has content height equals to the height of all items', function () {
                            expect(element, 'to have content height', (numberOfItems + 1) * itemHeight);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and items has just been sorted in the reverse direction', function () {
                        beforeEach(function () {
                            scrollTo(scrollElement, 50 * itemHeight + offsetElementHeight);
                            model.items.sort(function (x, y) {
                                return parseInt(y.slice(4), 10) - parseInt(x.slice(4), 10);
                            });
                            clock.tick(110);
                        });

                        it('has tiles item44 to item52 and the new item', function () {
                            expect(element, 'to only have tiles', tileRange(44, 52));
                        });

                        it('has scroll height equals to the height of all items', function () {
                            expect(scrollElement, 'to have scroll height', numberOfItems * itemHeight + 2 * offsetElementHeight);
                        });

                        it('has content height equals to the height of all items', function () {
                            expect(element, 'to have content height', numberOfItems * itemHeight);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and the data is replaced', function () {
                        beforeEach(function () {
                            scrollTo(scrollElement, 50 * itemHeight + offsetElementHeight);
                            clock.tick(110);
                            model.items(itemFactory.create(100));
                            clock.tick(110);
                        });

                        it('has tiles item147 to item155 and the new item', function () {
                            expect(element, 'to only have tiles', tileRange(147, 155));
                        });

                        it('has scroll height equals to the height of all items', function () {
                            expect(scrollElement, 'to have scroll height', numberOfItems * itemHeight + 2 * offsetElementHeight);
                        });

                        it('has content height equals to the height of all items', function () {
                            expect(element, 'to have content height', numberOfItems * itemHeight);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });
                });
            });
        }); // end with offset

        describe('with offset elements larger than the viewport above and below list', function () {
            var bigOffsetElementHeight = viewportHeight * 2;
            beforeEach(function () {
                element = createTestElementWithScrollableParent({
                    viewportHeight: viewportHeight,
                    itemHeight: itemHeight,
                    offsetElementHeight: bigOffsetElementHeight
                });
                scrollElement = $(element).parents('.scrollable').get(0);
            });

            describe('with an observable array as data source', function () {
                describe('when the data source is smaller then the eviction treshold of 100 items', function () {
                    var model;
                    var numberOfItems = 99;
                    beforeEach(function () {
                        model = {
                            items: ko.observableArray(itemFactory.create(numberOfItems)),
                            visibleIndex: ko.observable(0).extend({ notify: 'always' }),
                            dividers: ko.observable()
                        };
                        ko.applyBindings(model, element);
                        clock.tick(110);
                    });

                    it('renders ' + numberOfItems + ' tiles', function () {
                        expect(element, 'to have number of tiles', numberOfItems);
                    });

                    it('has scroll height equals to the height of all items', function () {
                        expect(scrollElement, 'to have scroll height', numberOfItems * itemHeight + 2 * bigOffsetElementHeight);
                    });

                    it('has content height equals to the height of all items', function () {
                        expect(element, 'to have content height', numberOfItems * itemHeight);
                    });

                    it('has no overlapping tiles', function () {
                        expect(element, 'to have no gap or overlapping between tiles');
                    });

                    describe('and it has 3 dividers', function () {
                        beforeEach(function () {
                            model.dividers({ 20: "A", 40: 'B', 60: 'C' });
                            clock.tick(110);
                        });

                        it('places all dividers sequential from the start of the list', function () {
                            expect(element, 'to have number of dividers', 3);
                        });

                        it('has scroll height equals to the height of all items and dividers', function () {
                            expect(scrollElement, 'to have scroll height', dividerHeight * 3 + numberOfItems * itemHeight + 2 * bigOffsetElementHeight);
                        });

                        it('has content height equals to the height of all items and dividers', function () {
                            expect(element, 'to have content height', dividerHeight * 3 + numberOfItems * itemHeight);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles and dividers');
                        });
                    });

                    describe('and the viewport is scrolled to the top', function () {
                        beforeEach(function () {
                            scrollToTop(scrollElement);
                        });

                        it('still has ' + numberOfItems + ' tiles', function () {
                            expect(element, 'to have number of tiles', numberOfItems);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and the viewport is scrolled to the bottom', function () {
                        beforeEach(function () {
                            scrollToBottom(scrollElement);
                        });

                        it('still has ' + numberOfItems + ' tiles', function () {
                            expect(element, 'to have number of tiles', numberOfItems);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and the visible index is set to the first item', function () {
                        beforeEach(function () {
                            model.visibleIndex(0);
                            clock.tick(110);
                        });

                        it('scrolls the first item into view', function () {
                            expect(scrollElement, 'to have scroll top', 0 + bigOffsetElementHeight);
                        });
                    });

                    describe('and the visible index is set to the last item', function () {
                        beforeEach(function () {
                            model.visibleIndex(98);
                            clock.tick(110);
                        });

                        it('scrolls the last item into view', function () {
                            expect(scrollElement, 'to have scroll top', 0 + bigOffsetElementHeight - viewportHeight + numberOfItems * itemHeight);
                        });
                    });
                });

                describe('when the data source is larger then the eviction treshold of 100 items', function () {
                    var model;
                    var numberOfItems = 100;
                    beforeEach(function () {
                        model = {
                            items: ko.observableArray(itemFactory.create(numberOfItems)),
                            visibleIndex: ko.observable(0).extend({ notify: 'always' }),
                            dividers: ko.observable()
                        };
                        ko.applyBindings(model, element);
                        clock.tick(110);
                    });

                    it('has scroll height equals to the height of all items', function () {
                        expect(scrollElement, 'to have scroll height', numberOfItems * itemHeight + 2 * bigOffsetElementHeight);
                    });

                    it('has content height equals to the height of all items', function () {
                        expect(element, 'to have content height', numberOfItems * itemHeight);
                    });

                    it('has tiles item0 to item5', function () {
                        expect(element, 'to only have tiles', tileRange(0, 5));
                    });

                    it('has no overlapping tiles', function () {
                        expect(element, 'to have no gap or overlapping between tiles');
                    });

                    describe('and it has 3 dividers', function () {
                        beforeEach(function () {
                            model.dividers({ 10: "A", 40: 'B', 60: 'C' });
                            clock.tick(110);
                        });

                        it('places all dividers sequential from the start of the list', function () {
                            expect(element, 'to have number of dividers', 3);
                        });

                        it('has scroll height equals to the height of all items and dividers', function () {
                            expect(scrollElement, 'to have scroll height', dividerHeight * 3 + numberOfItems * itemHeight + 2 * bigOffsetElementHeight);
                        });

                        it('has content height equals to the height of all items and dividers', function () {
                            expect(element, 'to have content height', dividerHeight * 3 + numberOfItems * itemHeight);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and the viewport is scrolled to item 20', function () {
                        beforeEach(function () {
                            scrollTo(scrollElement, 20 * itemHeight + bigOffsetElementHeight);
                            clock.tick(110);
                        });

                        it('has tiles item17 to item25', function () {
                            clock.tick(110);
                            expect(element, 'to only have tiles', tileRange(17, 25));
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and the viewport is scrolled to item 20 and back to item 10', function () {
                        beforeEach(function () {
                            scrollTo(scrollElement, 20 * itemHeight + bigOffsetElementHeight);
                            scrollTo(scrollElement, 10 * itemHeight + bigOffsetElementHeight);
                            clock.tick(110);
                        });

                        it('has tiles item7 to item15', function () {
                            expect(element, 'to only have tiles', tileRange(7, 15));
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and the viewport is scrolled to the top', function () {
                        beforeEach(function () {
                            scrollToTop(scrollElement);
                            clock.tick(110);
                        });

                        it('renders 0 tiles', function () {
                            expect(element, 'to have number of tiles', 0);
                        });
                    });

                    describe('and the viewport is scrolled to the bottom', function () {
                        beforeEach(function () {
                            scrollToBottom(scrollElement);
                            clock.tick(110);
                        });

                        it('renders 0 tiles', function () {
                            expect(element, 'to have number of tiles', 0);
                        });
                    });

                    describe('and a new item is added to the bottom of the list that is outside of the render tiles', function () {
                        beforeEach(function () {
                            model.items.push(itemFactory());
                            clock.tick(110);
                            model.visibleIndex(model.items().length - 1);
                            $(scrollElement).trigger('scroll');
                            clock.tick(110);
                        });

                        it('has tiles item95 to item100', function () {
                            expect(element, 'to only have tiles', tileRange(95, 100));
                        });

                        it('has scroll height equals to the height of all items', function () {
                            expect(scrollElement, 'to have scroll height', (numberOfItems + 1) * itemHeight + 2 * bigOffsetElementHeight);
                        });

                        it('has content height equals to the height of all items', function () {
                            expect(element, 'to have content height', (numberOfItems + 1) * itemHeight);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and a new item is added to the middle of the list that is outside of the render tiles', function () {
                        beforeEach(function () {
                            model.items.splice(50, 0, itemFactory('newItem'));
                            clock.tick(110);
                            model.visibleIndex(50);
                            $(scrollElement).trigger('scroll');
                            clock.tick(110);
                        });

                        it('has tiles item45 to item52 and the new item', function () {
                            expect(element, 'to only have tiles', tileRange(45, 52).concat('#newItem'));
                        });

                        it('has scroll height equals to the height of all items', function () {
                            expect(scrollElement, 'to have scroll height', (numberOfItems + 1) * itemHeight + 2 * bigOffsetElementHeight);
                        });

                        it('has content height equals to the height of all items', function () {
                            expect(element, 'to have content height', (numberOfItems + 1) * itemHeight);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and a new item inside the viewport', function () {
                        beforeEach(function () {
                            scrollTo(scrollElement, 50 * itemHeight + bigOffsetElementHeight);
                            model.items.splice(51, 0, itemFactory('newItem'));
                            clock.tick(110);
                        });

                        it('has tiles item47 to item54 and the new item', function () {
                            expect(element, 'to only have tiles', tileRange(47, 54).concat('#newItem'));
                        });

                        it('has scroll height equals to the height of all items', function () {
                            expect(scrollElement, 'to have scroll height', (numberOfItems + 1) * itemHeight + 2 * bigOffsetElementHeight);
                        });

                        it('has content height equals to the height of all items', function () {
                            expect(element, 'to have content height', (numberOfItems + 1) * itemHeight);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and items has just been sorted in the reverse direction', function () {
                        beforeEach(function () {
                            scrollTo(scrollElement, 50 * itemHeight + bigOffsetElementHeight);
                            model.items.sort(function (x, y) {
                                return parseInt(y.slice(4), 10) - parseInt(x.slice(4), 10);
                            });
                            clock.tick(110);
                        });

                        it('has tiles item44 to item52 and the new item', function () {
                            expect(element, 'to only have tiles', tileRange(44, 52));
                        });

                        it('has scroll height equals to the height of all items', function () {
                            expect(scrollElement, 'to have scroll height', numberOfItems * itemHeight + 2 * bigOffsetElementHeight);
                        });

                        it('has content height equals to the height of all items', function () {
                            expect(element, 'to have content height', numberOfItems * itemHeight);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });

                    describe('and the data is replaced', function () {
                        beforeEach(function () {
                            scrollTo(scrollElement, 50 * itemHeight + bigOffsetElementHeight);
                            clock.tick(110);
                            model.items(itemFactory.create(100));
                            clock.tick(110);
                        });

                        it('has tiles item147 to item155 and the new item', function () {
                            expect(element, 'to only have tiles', tileRange(147, 155));
                        });

                        it('has scroll height equals to the height of all items', function () {
                            expect(scrollElement, 'to have scroll height', numberOfItems * itemHeight + 2 * bigOffsetElementHeight);
                        });

                        it('has content height equals to the height of all items', function () {
                            expect(element, 'to have content height', numberOfItems * itemHeight);
                        });

                        it('has no overlapping tiles', function () {
                            expect(element, 'to have no gap or overlapping between tiles');
                        });
                    });
                });

            });
        });
    }); // end 'scrolling through parent of element it is bound to'
});

var itemWidth = 50;
var viewportWidth = 160;
var tilesSideBySide = Math.floor(viewportWidth / itemWidth);

describe('knockout.list grid with height ' + viewportHeight + 'px, width ' + viewportWidth + 'px, items of height ' + itemHeight + 'px and width ' + itemWidth + 'px, divider of height 20px', function () {
    var clock;
    var element;
    var scrollElement;
    beforeEach(function () {
        clock = sinon.useFakeTimers();
        element = createTestGridElement({
            viewportHeight: viewportHeight,
            viewportWidth: viewportWidth,
            itemHeight: itemHeight,
            itemWidth: itemWidth
        });
        scrollElement = element;
    });

    afterEach(function () {
        clock.restore();
    });

    describe('with an observable array as data source', function () {
        describe('when the data source is empty', function () {
            var model;
            beforeEach(function () {
                model = { items: ko.observableArray(), dividers: ko.observable() };
                ko.applyBindings(model, element);
                clock.tick(110);
            });

            it('renders no tiles', function () {
                expect(element, 'to have number of tiles', 0);
            });

            it('has scroll height equal to container', function () {
                expect(scrollElement, 'to have scroll height', viewportHeight);
            });

            it('has content height equals to the height of all items', function () {
                expect(element, 'to have content height', 0);
            });

            describe('and it has 3 dividers', function () {
                beforeEach(function () {
                    model.dividers({ 20: "A", 40: 'B', 60: 'C' });
                    clock.tick(110);
                });

                it('places all dividers sequential from the start of the list', function () {
                    expect(element, 'to have number of dividers', 3);
                });

                it('has scroll height equal to container', function () {
                    expect(scrollElement, 'to have scroll height', viewportHeight);
                });

                it('has content height equals to the height of all dividers', function () {
                    expect(element, 'to have content height', dividerHeight * 3);
                });

                it('has no overlapping tiles', function () {
                    expect(element, 'to have no gap or overlapping between tiles and dividers');
                });
            });
        });

        describe('when the data source is smaller then the eviction treshold of 100 items', function () {
            var model;
            var numberOfItems = 99;
            beforeEach(function () {
                model = {
                    items: ko.observableArray(itemFactory.create(numberOfItems)),
                    visibleIndex: ko.observable(0).extend({ notify: 'always' }),
                    dividers: ko.observable()
                };
                ko.applyBindings(model, element);
                clock.tick(110);
            });

            it('renders ' + numberOfItems + ' tiles', function () {
                expect(element, 'to have number of tiles', numberOfItems);
            });

            it('has scroll height equals to the height of all items', function () {
                expect(scrollElement, 'to have scroll height', Math.ceil(numberOfItems / tilesSideBySide) * itemHeight);
            });

            it('has content height equals to the height of all items', function () {
                expect(element, 'to have content height', Math.ceil(numberOfItems / tilesSideBySide) * itemHeight);
            });

            it('has no overlapping tiles', function () {
                expect(element, 'to have no gap or overlapping between tiles');
            });

            describe('and the viewport is scrolled to the bottom', function () {
                beforeEach(function () {
                    scrollToBottom(scrollElement);
                });

                it('still has ' + numberOfItems + ' tiles', function () {
                    expect(element, 'to have number of tiles', numberOfItems);
                });

                it('has no overlapping tiles', function () {
                    expect(element, 'to have no gap or overlapping between tiles');
                });

                describe('and it has 3 dividers', function () {
                    beforeEach(function () {
                        model.dividers({ 20: "A", 40: 'B', 60: 'C' });
                        clock.tick(110);
                    });

                    it('places all dividers sequential from the start of the list', function () {
                        expect(element, 'to have number of dividers', 3);
                    });

                    it('has scroll height equals to the height of all items and dividers', function () {
                        var numViewIndexes = calculateNumViewIndexes(numberOfItems, model.dividers(), tilesSideBySide);
                        expect(scrollElement, 'to have scroll height', dividerHeight * 3 + Math.ceil(numViewIndexes / tilesSideBySide) * itemHeight);
                    });

                    it('has content height equals to the height of all items and dividers', function () {
                        var numViewIndexes = calculateNumViewIndexes(numberOfItems, model.dividers(), tilesSideBySide);
                        expect(element, 'to have content height', dividerHeight * 3 + Math.ceil(numViewIndexes / tilesSideBySide) * itemHeight);
                    });

                    it('has no overlapping tiles', function () {
                        expect(element, 'to have no gap or overlapping between tiles and dividers');
                    });
                });

                describe('and the visible index is set to the first item', function () {
                    beforeEach(function () {
                        model.visibleIndex(0);
                        clock.tick(110);
                    });

                    it('scrolls the first item into view', function () {
                        expect(element, 'to have scroll top', 0);
                    });
                });
            });

        });

        describe('when the data source is larger then the eviction treshold of 100 items', function () {
            var model;
            var numberOfItems = 100;
            beforeEach(function () {
                model = {
                    items: ko.observableArray(itemFactory.create(numberOfItems)),
                    visibleIndex: ko.observable(0).extend({ notify: 'always' }),
                    dividers: ko.observable()
                };
                ko.applyBindings(model, element);
                clock.tick(110);
            });

            it('has scroll height equals to the height of all items', function () {
                expect(scrollElement, 'to have scroll height', Math.ceil(numberOfItems / tilesSideBySide) * itemHeight);
            });

            it('has content height equals to the height of all items', function () {
                expect(element, 'to have content height', Math.ceil(numberOfItems / tilesSideBySide) * itemHeight);
            });

            it('has tiles item0 to item17', function () {
                expect(element, 'to only have tiles', tileRange(0, 17));
            });

            it('has no overlapping tiles', function () {
                expect(element, 'to have no gap or overlapping between tiles');
            });

            describe('and the viewport is scrolled to item 20', function () {
                beforeEach(function () {
                    scrollTo(scrollElement, Math.ceil(20 / tilesSideBySide) * itemHeight);
                    clock.tick(110);
                });

                it('has tiles item12 to item38', function () {
                    clock.tick(110);
                    expect(element, 'to only have tiles', tileRange(12, 38));
                });

                it('has no overlapping tiles', function () {
                    expect(element, 'to have no gap or overlapping between tiles');
                });
            });

            describe('and the viewport is scrolled to item 20 and back to item 10', function () {
                beforeEach(function () {
                    scrollTo(scrollElement, Math.ceil(20 / tilesSideBySide) * itemHeight);
                    scrollTo(scrollElement, Math.ceil(10 / tilesSideBySide) * itemHeight);
                    clock.tick(110);
                });

                it('has tiles item3 to item29', function () {
                    expect(element, 'to only have tiles', tileRange(3, 29));
                });

                it('has no overlapping tiles', function () {
                    expect(element, 'to have no gap or overlapping between tiles');
                });

                describe('and it has 3 dividers', function () {
                    beforeEach(function () {
                        model.dividers({ 10: "A", 40: 'B', 60: 'C' });
                        clock.tick(110);
                    });

                    it('places all dividers sequential from the start of the list', function () {
                        expect(element, 'to have number of dividers', 3);
                    });

                    it('has scroll height equals to the height of all items and dividers', function () {
                        var numViewIndexes = calculateNumViewIndexes(numberOfItems, model.dividers(), tilesSideBySide);
                        expect(scrollElement, 'to have scroll height', dividerHeight * 3 + Math.ceil(numViewIndexes / tilesSideBySide) * itemHeight);
                    });

                    it('has content height equals to the height of all items and dividers', function () {
                        var numViewIndexes = calculateNumViewIndexes(numberOfItems, model.dividers(), tilesSideBySide);
                        expect(element, 'to have content height', dividerHeight * 3 + Math.ceil(numViewIndexes / tilesSideBySide) * itemHeight);
                    });

                    it('has no overlapping tiles', function () {
                        expect(element, 'to have no gap or overlapping between tiles');
                    });
                });
            });

            describe('and the viewport is scrolled to the bottom', function () {
                beforeEach(function () {
                    scrollToBottom(scrollElement);
                    clock.tick(110);
                });

                it('has tiles item84 to item99', function () {
                    expect(element, 'to only have tiles', tileRange(84, 99));
                });

                it('has no overlapping tiles', function () {
                    expect(element, 'to have no gap or overlapping between tiles');
                });

                describe('and it has 3 dividers', function () {
                    beforeEach(function () {
                        model.dividers({ 10: "A", 40: 'B', 95: 'C' });
                        clock.tick(110);
                    });

                    it('places all dividers sequential from the start of the list', function () {
                        expect(element, 'to have number of dividers', 3);
                    });

                    it('has scroll height equals to the height of all items and dividers', function () {
                        var numViewIndexes = calculateNumViewIndexes(numberOfItems, model.dividers(), tilesSideBySide);
                        expect(scrollElement, 'to have scroll height', dividerHeight * 3 + Math.ceil(numViewIndexes / tilesSideBySide) * itemHeight);
                    });

                    it('has content height equals to the height of all items and dividers', function () {
                        var numViewIndexes = calculateNumViewIndexes(numberOfItems, model.dividers(), tilesSideBySide);
                        expect(element, 'to have content height', dividerHeight * 3 + Math.ceil(numViewIndexes / tilesSideBySide) * itemHeight);
                    });

                    it('has no overlapping tiles', function () {
                        expect(element, 'to have no gap or overlapping between tiles');
                    });
                });
            });

            describe('and a new item is added to the bottom of the list that is outside of the render tiles', function () {
                // TODO: make sure the item is added on the next row, not in an already existing row
                beforeEach(function () {
                    model.items.push(itemFactory());
                    clock.tick(110);
                    model.visibleIndex(model.items().length - 1);
                    $(scrollElement).trigger('scroll');
                    clock.tick(110);
                });

                it('has tiles item84 to item100', function () {
                    expect(element, 'to only have tiles', tileRange(84, 100));
                });

                it('has scroll height equals to the height of all items', function () {
                    expect(scrollElement, 'to have scroll height', (Math.ceil((numberOfItems + 1) / tilesSideBySide)) * itemHeight);
                });

                it('has content height equals to the height of all items', function () {
                    expect(element, 'to have content height', (Math.ceil((numberOfItems + 1) / tilesSideBySide)) * itemHeight);
                });

                it('has no overlapping tiles', function () {
                    expect(element, 'to have no gap or overlapping between tiles');
                });
            });

            describe('and a new item is added to the middle of the list that is outside of the render tiles', function () {
                // TODO: make sure the item is added on the next row, not in an already existing row
                beforeEach(function () {
                    model.items.splice(50, 0, itemFactory('newItem'));
                    clock.tick(110);
                    model.visibleIndex(50);
                    $(scrollElement).trigger('scroll');
                    clock.tick(110);
                });

                it('has tiles item33 to item58 and the new item', function () {
                    expect(element, 'to only have tiles', tileRange(33, 58).concat('#newItem'));
                });

                it('has scroll height equals to the height of all items', function () {
                    expect(scrollElement, 'to have scroll height', (Math.ceil((numberOfItems + 1) / tilesSideBySide)) * itemHeight);
                });

                it('has content height equals to the height of all items', function () {
                    expect(element, 'to have content height', (Math.ceil((numberOfItems + 1) / tilesSideBySide)) * itemHeight);
                });

                it('has no overlapping tiles', function () {
                    expect(element, 'to have no gap or overlapping between tiles');
                });
            });

            describe('and a new item is added inside the viewport', function () {
                // TODO: make sure the item is added on the next row, not in an already existing row
                beforeEach(function () {
                    scrollTo(scrollElement, Math.ceil(50 / tilesSideBySide) * itemHeight);
                    model.items.splice(51, 0, itemFactory('newItem'));
                    clock.tick(110);
                });

                it('has tiles item42 to item67 and the new item', function () {
                    expect(element, 'to only have tiles', tileRange(42, 67).concat('#newItem'));
                });

                it('has scroll height equals to the height of all items', function () {
                    expect(scrollElement, 'to have scroll height', (Math.ceil((numberOfItems + 1) / tilesSideBySide)) * itemHeight);
                });

                it('has content height equals to the height of all items', function () {
                    expect(element, 'to have content height', (Math.ceil((numberOfItems + 1) / tilesSideBySide)) * itemHeight);
                });

                it('has no overlapping tiles', function () {
                    expect(element, 'to have no gap or overlapping between tiles');
                });
            });

            describe('and items has just been sorted in the reverse direction', function () {
                beforeEach(function () {
                    scrollTo(element, Math.ceil(50 / tilesSideBySide) * itemHeight);
                    model.items.sort(function (x, y) {
                        return parseInt(y.slice(4), 10) - parseInt(x.slice(4), 10);
                    });
                    clock.tick(110);
                });

                it('has tiles item31 to item57 and the new item', function () {
                    expect(element, 'to only have tiles', tileRange(31, 57));
                });

                it('has scroll height equals to the height of all items', function () {
                    expect(scrollElement, 'to have scroll height', Math.ceil(numberOfItems / tilesSideBySide) * itemHeight);
                });

                it('has content height equals to the height of all items', function () {
                    expect(element, 'to have content height', Math.ceil(numberOfItems / tilesSideBySide) * itemHeight);
                });

                it('has no overlapping tiles', function () {
                    expect(element, 'to have no gap or overlapping between tiles');
                });
            });

            describe('and the data is replaced', function () {
                beforeEach(function () {
                    scrollTo(scrollElement, Math.ceil(50 / tilesSideBySide) * itemHeight);
                    clock.tick(110);
                    model.items(itemFactory.create(100));
                    clock.tick(110);
                });

                it('has tiles item142 to item168 and the new item', function () {
                    expect(element, 'to only have tiles', tileRange(142, 168));
                });

                it('has scroll height equals to the height of all items', function () {
                    expect(scrollElement, 'to have scroll height', Math.ceil(numberOfItems / tilesSideBySide) * itemHeight);
                });

                it('has content height equals to the height of all items', function () {
                    expect(element, 'to have content height', Math.ceil(numberOfItems / tilesSideBySide) * itemHeight);
                });

                it('has no overlapping tiles', function () {
                    expect(element, 'to have no gap or overlapping between tiles');
                });
            });
        });
    });
});

