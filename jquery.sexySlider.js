(function($) {
    $.fn.sexySlider = function sexySlider(customOptions) {
        var options = $.extend({
            speed: 1000, //speed
            shift: 80, //сдвиг элементов по горизонтали
            autoplay: true, //параметр, отвечающий за автоматическую анимацию
            sliderItemNumber: 18, //общее число анимированных элементов
            row: 2, //число строк
            col: 3, //число колонок
            delay: 500, //Пауза между слайдами
            sliderItemWidth: 240, //ширина анимированного элемента
            sliderItemHeight: 240, //высота анимированного элемента
            sliderItemMarginV: 20, //расстояние между анимированными элементами
            sliderItemMarginH: 30,
            paginationStyle: 'circlePag', //стиль пагинатора
            arrows: false,
            colorPalette: ['red', 'green', 'blue', 'red', 'green', 'blue', 'red', 'green', 'blue'],
            animationType: 'horisontalSlider',
            hoverType: 'border'
        }, customOptions);
        //МЕТОДЫ
        //событие на hover
        $(document).on('mouseenter', '.slider_item', function(){
            $(this).find('.front_side_block, .hover_side_block').toggleClass('show_sth hide_sth');
            switch (options.hoverType) {
                case 'border':
                    $(this).find('.table_cell').css('border', '5px solid rgba(0,0,0,0.5)');
                    break;
                case 'none':
                    $(this).find('.table_cell').css('border', 'none');
                    break;
            }
        });
        $(document).on('mouseleave', '.slider_item', function(){
            $(this).find('.front_side_block, .hover_side_block').toggleClass('show_sth hide_sth');
            switch (options.hoverType) {
                case 'border':
                    $(this).find('.table_cell').css('borderColor', 'transparent');
                    break;
                case '':
                    break;
            }
        });
        //Конструируем макет
        function constructor () {
            $(options.container).html('');
            //Рассчитываем размеры контейнера
            containerWidth = options.col * (1*options.sliderItemWidth + 1*options.sliderItemMarginH) - options.sliderItemMarginH;
            containerHeight = options.row * (1*options.sliderItemHeight + 1*options.sliderItemMarginV) - options.sliderItemMarginV;
            $(options.container).css({width: containerWidth, height: containerHeight});
            //Создаем wrappers и items
            var globalCount = 0;
            sliderWrapperNumber = options.sliderItemNumber/(options.row*options.col);
            for (var i=0; i<sliderWrapperNumber; i++) {
                if (i==0) {
                    $(options.container).append('<div class="slider_wrapper '+options.colorPalette[i]+' active" wrapper_number="'+i+'"></div>');
                }
                else if (i == sliderWrapperNumber-1) {
                    $(options.container).append('<div class="slider_wrapper '+options.colorPalette[i]+' last" wrapper_number="'+i+'"></div>');
                }
                else {
                    $(options.container).append('<div class="slider_wrapper '+options.colorPalette[i]+'" wrapper_number="'+i+'"></div>');
                }
                var count=options.col*options.row;
                for (var j=options.col; j>0; j--) {
                    for (var k=0; k<options.row && globalCount < options.sliderItemNumber; k++) {
                        $(options.container + ' [wrapper_number='+i+']').append('<div class="slider_item" item_id="'+ globalCount++ +'" style="top: '+Number((k)*options.sliderItemHeight+(k)*options.sliderItemMarginV)+'px; right:'+Number((j-1)*options.sliderItemWidth+(j-1)*options.sliderItemMarginH)+'px; width:'+options.sliderItemWidth+'px; height:'+options.sliderItemHeight+'px;" number="'+(count--)+'"><div class="hover_side_block show_hide_transition"><div class="table_cell layer_2" style="width:'+options.sliderItemWidth+'px;height:'+options.sliderItemHeight+'px"><span></span></div></div><div class="front_side_block show_hide_transition"><div class="table_cell layer_1" style="width:'+options.sliderItemWidth+'px;height:'+options.sliderItemHeight+'px"><span></span></div></div></div>');
                    }
                }
            }
            for (i=0; i<8; i++) {
                for (j=0; j<9; j++) {
                    $('[wrapper_number='+i+']').find('.slider_item').eq(j).find('.front_side_block, .hover_side_block').css('background','url("/editor/images/slide_'+(i+1)+'/Start-Imgs_0'+(j+1) +'.jpg")');
                }
            }
        }
        //Вся пагинация
        function pagination() {
            var paginationButton = $('.sexySlider_pagination button');
            $(options.container + ' + .sexySlider_pagination').remove();
            $(options.container).after('<div class="sexySlider_pagination"></div>');
            switch (options.paginationStyle) {
                case 'circle':
                    paginationButton.attr('type', 'circlePag');
                    break;
                case 'disc':
                    paginationButton.attr('type', 'discPag');
                    break;
                case 'square':
                    paginationButton.attr('type', 'squarePag');
                    break;
                case 'border_square':
                    paginationButton.attr('type', 'border_squarePag');
                    break;
                case 'number':
                    paginationButton.each(function(indx, element){
                        $(element).html('<div></div>');
                    });
                    break;
            }
            for (var i=0; i<sliderWrapperNumber; i++) {
                if (i==0) {
                    $(options.container + '+ .sexySlider_pagination').append('<button type="'+options.paginationStyle+'" class="active_pag"></button>')
                }
                else {
                    $(options.container + '+ .sexySlider_pagination').append('<button type="'+options.paginationStyle+'"></button>')
                }
            }
            $(options.container + ' + .sexySlider_pagination button').click(function(){
                if (!$(this).hasClass('active_pag')) {
                    options.autoplay = false;
                    $(options.container + '+ .sexySlider_pagination button.active_pag').removeClass('active_pag');
                    $(this).addClass('active_pag');
                    animation('pagination');
                }
            });
        }
        //Стрелки
        function arrows() {
            $(options.container).append('<div class="arrow_right_block"></div>')
                                .append('<div class="arrow_left_block"></div>');
            $('.arrow_right_block, .arrow_left_block').click(function(){
                options.autoplay = false;
                if ($(this).hasClass('arrow_right_block')) {
                    animation('arrow_next');
                }
                else if ($(this).hasClass('arrow_left_block')) {
                    animation('arrow_prev');
                }
            });
        }
        //Расставляем атрибуты созданной таблицы (editor.js) в зависимости от типа анимации
        function classes(elementsNumber) {
            switch (options.animationType) {
                case 'horisontalSlider':
                    if (options.col == 1 && options.row == 1) {
                        $(options.container + ' .slider_item').attr({duration: Math.floor(elementsNumber/2), delay: Math.floor(elementsNumber/2)})
                    }
                    else {
                        for (var i=1, j=1; i<elementsNumber; i++, j++) {
                            $(options.container + ' .slider_item[number='+i+']').attr({duration: j, delay: j});
                            if (j==options.col*options.row) {
                                j=0;
                            }
                        }
                    }
                    break;
                case 'randomDisappear':
                    for (i=1; i<elementsNumber; i++) {
                        $(options.container + ' .slider_item[number='+i+']').attr({duration: Math.floor(Math.random()*(20-10)+10), delay: Math.floor(Math.random()*(20-10)+10)});
                    }
                    break
                case 'rotator': {
                    if (options.col == 1 && options.row == 1) {
                        $(options.container + ' .slider_item').attr({duration: Math.floor(elementsNumber/2), delay: Math.floor(elementsNumber/2)})
                    }
                    else {
                        for (var i=1, j=1; i<elementsNumber; i++, j++) {
                            $(options.container + ' .slider_item[number='+i+']').attr({duration: j, delay: j});
                            if (j==options.col*options.row) {
                                j=0;
                            }
                        }
                    }
                }
            }
        }
        //Первоначальная расстановка элементов. Вызывается один раз
        function placing() {
            switch (options.animationType) {
                case 'horisontalSlider':
                    $(options.container + ' .slider_wrapper').each(function(indx, element){
                        if (indx == 0) {
                            $(element).addClass('toCenter');
                        }
                        else {
                            $(element).addClass('toLeft');
                        }
                    });
                    break;
                case 'compressor':
                    positions = [];
                    speed = [];
                    center = [containerWidth/2-options.sliderItemWidth/2, containerHeight/2-options.sliderItemHeight/2]
                    for (var i=1; i<=options.col*options.row; i++) {
                        speed[i] = Math.floor(Math.random()*1500 + 500);
                        positions[i] = [$('.slider_wrapper:first-child').find($('[number='+i+']')).css('right'), $('.slider_wrapper:first-child').find($('[number='+i+']')).css('top')]
                    }
                    $(options.container + ' .slider_wrapper').each(function(indx, element){
                        if (indx == 0) {
                            $(element).addClass('active_compress');
                        }
                        else {
                            $(element).addClass('compressed').find('.slider_item').css({right: center[0], top: center[1]});

                        }
                    });
                    break;
                case 'randomDisappear':
                    $(options.container + ' .slider_wrapper').each(function(indx, element){
                        if (indx == 0) {
                            $(element).addClass('disappear_show');
                        }
                        else {
                            $(element).addClass('disappear_hide');
                        }

                    });
                    break;
                case 'rotator':
                    $(options.container + ' .slider_wrapper').each(function(indx, element){
                        if (indx == 0) {
                            $(element).addClass('rotator_show');
                        }
                        else {
                            $(element).addClass('rotator_hide');
                        }

                    });
                    break;
            }
        }
        //Функция, выбирающая тип анимации
        function animation(paginationControl) {
            if (window.autoInterval) {
                clearInterval(window.autoInterval)
            }
            if  (options.animationType == 'horisontalSlider') {
                if (options.autoplay) {
                    autoInterval = setInterval(function(){
                        horisontalAnimation();
                    }, 3600);
                }
                else {
                    horisontalAnimation(paginationControl);
                }
            }
            else if (options.animationType == 'compressor') {
                if (options.autoplay) {
                    autoInterval = setInterval(function(){
                        compressor('arrow_next');
                        classes(options.sliderItemNumber);
                    }, 3600);
                }
                else {
                    compressor(paginationControl)
                }
            }
            else if(options.animationType == 'randomDisappear') {
                if (window.autoInterval) {
                    clearInterval(window.autoInterval);
                }
                if (options.autoplay) {
                    autoInterval = setInterval(function(){
                        randomDisappear();
                        classes(options.sliderItemNumber);
                    }, 3600);
                }
                else {
                    randomDisappear(paginationControl);
                    classes(options.sliderItemNumber);
                }
            }
            else if(options.animationType == 'rotator') {
                if (window.autoInterval) {
                    clearInterval(window.autoInterval);
                }
                if (options.autoplay) {
                    autoInterval = setInterval(function(){
                        rotator();
                    }, 3600);
                }
                else {
                    rotator(paginationControl)
                }
            }
        }
        /*horisontalAnimation*/
        function horisontalAnimation(pag_navigation) {
            var active = $(options.container + ' .slider_wrapper.active');
            if (options.autoplay) {
                active.toggleClass('active toCenter toRight');
                setTimeout(function(){
                    active.toggleClass('toLeft toRight');
                    if (!active.next().hasClass('slider_wrapper')) {
                        $(options.container + ' .slider_wrapper:first-child').toggleClass('toLeft active toCenter');
                    }
                    else {
                        active.next().toggleClass('toLeft active toCenter');
                    }
                    $(options.container + '+ .sexySlider_pagination button.active_pag').removeClass('active_pag');
                    $(options.container + '+ .sexySlider_pagination button').eq($(options.container + ' .slider_wrapper.active').attr('wrapper_number')).addClass('active_pag');
                }, options.speed);
            }
            else if(pag_navigation == 'pagination'){
                active.toggleClass('active toCenter toRight');
                setTimeout(function(){
                    active.toggleClass('toLeft toRight');
                    var index = $(options.container + ' + .sexySlider_pagination button.active_pag').index();
                    $(options.container + ' .slider_wrapper').eq(index).toggleClass('toLeft active toCenter');
                }, options.speed);
            }
            else if(pag_navigation == 'arrow_next') {
                active.toggleClass('active toCenter toRight');
                setTimeout(function(){
                    active.toggleClass('toLeft toRight');
                    if (!active.next().hasClass('slider_wrapper')) {
                        $(options.container + ' .slider_wrapper:first-child').toggleClass('toLeft active toCenter');
                    }
                    else {
                        active.next().toggleClass('toLeft active toCenter');
                    }
                    $(options.container + '+ .sexySlider_pagination button.active_pag').removeClass('active_pag');
                    $(options.container + '+ .sexySlider_pagination button').eq($(options.container + ' .slider_wrapper.active').attr('wrapper_number')).addClass('active_pag');
                }, options.speed);
            }
            else if(pag_navigation == 'arrow_prev') {
                active.toggleClass('active toCenter toRight');
                setTimeout(function(){
                    active.toggleClass('toLeft toRight');
                    if (!active.prev().hasClass('slider_wrapper')) {
                        $(options.container + ' .slider_wrapper.last').toggleClass('toLeft active toCenter');
                    }
                    else {
                        active.prev().toggleClass('toLeft active toCenter');
                    }
                    $(options.container + '+ .sexySlider_pagination button.active_pag').removeClass('active_pag');
                    $(options.container + '+ .sexySlider_pagination button').eq($(options.container + ' .slider_wrapper.active').attr('wrapper_number')).addClass('active_pag');
                }, options.speed);
            }
        }
        /*randomDisappear*/
        function randomDisappear(pag_navigation) {
            var active = $(options.container + ' .slider_wrapper.active');
            if (options.autoplay) {
                $(options.container + ' .active').toggleClass('active disappear_show disappear_hide');
                setTimeout(function(){
                    if (!active.next().hasClass('slider_wrapper')) {
                        $(options.container + ' .slider_wrapper:first-child').toggleClass('active disappear_show disappear_hide');
                    }
                    else {
                        active.next().toggleClass('active disappear_show disappear_hide');
                    }
                    $(options.container + '+ .sexySlider_pagination button.active_pag').removeClass('active_pag');
                    $(options.container + '+ .sexySlider_pagination button').eq($(options.container + ' .slider_wrapper.active').attr('wrapper_number')).addClass('active_pag');
                }, options.speed);
            }
            else if (pag_navigation == 'pagination') {
                $(options.container + ' .active').toggleClass('active disappear_show disappear_hide');
                setTimeout(function(){
                    var index = $(options.container + ' + .sexySlider_pagination button.active_pag').index();
                    $(options.container + ' .slider_wrapper').eq(index).toggleClass('active disappear_show disappear_hide');
                }, options.speed);
            }
            else if(pag_navigation == 'arrow_next') {
                active.toggleClass('active disappear_show disappear_hide');
                setTimeout(function(){
                    if (!active.next().hasClass('slider_wrapper')) {
                        $(options.container + ' .slider_wrapper:first-child').toggleClass('active disappear_show disappear_hide');
                    }
                    else {
                        active.next().toggleClass('active disappear_show disappear_hide');
                    }
                    $(options.container + '+ .sexySlider_pagination button.active_pag').removeClass('active_pag');
                    $(options.container + '+ .sexySlider_pagination button').eq($(options.container + ' .slider_wrapper.active').attr('wrapper_number')).addClass('active_pag');
                }, options.speed);
            }
            else if(pag_navigation == 'arrow_prev') {
                active.toggleClass('active disappear_show disappear_hide');
                setTimeout(function(){
                    if (!active.prev().hasClass('slider_wrapper')) {
                        $(options.container + ' .slider_wrapper.last').toggleClass('active disappear_show disappear_hide');
                    }
                    else {
                        active.prev().toggleClass('active disappear_show disappear_hide');
                    }
                    $(options.container + '+ .sexySlider_pagination button.active_pag').removeClass('active_pag');
                    $(options.container + '+ .sexySlider_pagination button').eq($(options.container + ' .slider_wrapper.active').attr('wrapper_number')).addClass('active_pag');
                }, options.speed);
            }
        }
        /*rotator*/
        function rotator(pag_navigation) {
            var active = $(options.container + ' .slider_wrapper.active');
            if (options.autoplay) {
                $(options.container + ' .active').toggleClass('active rotator_show rotator_hide');
                setTimeout(function(){
                    if (!active.next().hasClass('slider_wrapper')) {
                        $(options.container + ' .slider_wrapper:first-child').toggleClass('active rotator_show rotator_hide');
                    }
                    else {
                        active.next().toggleClass('active rotator_show rotator_hide');
                    }
                    $(options.container + '+ .sexySlider_pagination button.active_pag').removeClass('active_pag');
                    $(options.container + '+ .sexySlider_pagination button').eq($(options.container + ' .slider_wrapper.active').attr('wrapper_number')).addClass('active_pag');
                }, options.speed);
            }
            else if (pag_navigation == 'pagination') {
                $(options.container + ' .active').toggleClass('active rotator_show rotator_hide');
                setTimeout(function(){
                    var index = $(options.container + ' + .sexySlider_pagination button.active_pag').index();
                    $(options.container + ' .slider_wrapper').eq(index).toggleClass('active rotator_show rotator_hide');
                }, options.speed);
            }
            else if(pag_navigation == 'arrow_next') {
                var active = $(options.container + ' .slider_wrapper.active');
                $(options.container + ' .active').toggleClass('active rotator_show rotator_hide');
                setTimeout(function(){
                    if (!active.next().hasClass('slider_wrapper')) {
                        $(options.container + ' .slider_wrapper:first-child').toggleClass('active rotator_show rotator_hide');
                    }
                    else {
                        active.next().toggleClass('active rotator_show rotator_hide');
                    }
                    $(options.container + '+ .sexySlider_pagination button.active_pag').removeClass('active_pag');
                    $(options.container + '+ .sexySlider_pagination button').eq($(options.container + ' .slider_wrapper.active').attr('wrapper_number')).addClass('active_pag');
                }, options.speed);
            }
            else if(pag_navigation == 'arrow_prev') {
                $(options.container + ' .active').toggleClass('active rotator_show rotator_hide');
                setTimeout(function(){
                    if (!active.prev().hasClass('slider_wrapper')) {
                        $(options.container + ' .slider_wrapper:last').toggleClass('active rotator_show rotator_hide');
                    }
                    else {
                        active.prev().toggleClass('active rotator_show rotator_hide');
                    }
                    $(options.container + '+ .sexySlider_pagination button.active_pag').removeClass('active_pag');
                    $(options.container + '+ .sexySlider_pagination button').eq($(options.container + ' .slider_wrapper.active').attr('wrapper_number')).addClass('active_pag');
                }, options.speed);
            }
        }
        /*compressor*/
        function compressor(pag_navigation) {
            for (var i=1; i<=options.col*options.row; i++) {
                speed[i] = Math.floor(Math.random()*1500 + 500);
            }
            var active = $(options.container + ' .slider_wrapper.active');
            if (pag_navigation == 'pagination') {
                for (i = 1; i<=options.col*options.row; i++) {
                    active.find($('[number='+i+']')).animate({right: center[0], top: center[1]}, speed[i]);
                    active.animate({opacity: 0}, 400)
                }
                var index = $(options.container + ' + .sexySlider_pagination button.active_pag').index();
                active.toggleClass('active compressed active_compress');
                $(options.container + ' .slider_wrapper').eq(index).toggleClass('active compressed active_compress');
                    active = $(options.container + ' .slider_wrapper.active');

                for (i = 1; i<=options.col*options.row; i++) {
                    active.find($('[number='+i+']')).animate({right: positions[i][0], top: positions[i][1]}, speed[i]);
                }
                setTimeout(function(){
                    active.animate({opacity: 1}, 300)
                }, 500)
            }
            else if(pag_navigation == 'arrow_next') {
                console.log('sth');
                var active = $(options.container + ' .slider_wrapper.active');
                for (var i = 1; i<=options.col*options.row; i++) {
                    active.find($('[number='+i+']')).animate({right: center[0], top: center[1]}, speed[i]);
                    active.animate({opacity: 0}, 400)
                }
                active.toggleClass('active compressed active_compress');
                setTimeout(function(){
                    if (!active.next().hasClass('slider_wrapper')) {
                        $(options.container + ' .slider_wrapper:first-child').toggleClass('active compressed active_compress');
                        active = $(options.container + ' .slider_wrapper.active');
                        for (var i = 1; i<=options.col*options.row; i++) {
                            active.find($('[number='+i+']')).animate({right: positions[i][0], top: positions[i][1]}, speed[i]);
                        }
                        setTimeout(function(){
                            active.animate({opacity: 1}, 300)
                        }, 500)
                    }
                    else {
                        active.next().toggleClass('active compressed active_compress');
                        active = $(options.container + ' .slider_wrapper.active');
                        for (var i = 1; i<=options.col*options.row; i++) {
                            active.find($('[number='+i+']')).animate({right: positions[i][0], top: positions[i][1]}, speed[i]);
                        }
                        setTimeout(function(){
                            active.animate({opacity: 1}, 300)
                        }, 500)
                    }
                    $(options.container + '+ .sexySlider_pagination button.active_pag').removeClass('active_pag');
                    $(options.container + '+ .sexySlider_pagination button').eq($(options.container + ' .slider_wrapper.active').attr('wrapper_number')).addClass('active_pag');
                }, options.speed);
            }
            else if(pag_navigation == 'arrow_prev') {
                var active = $(options.container + ' .slider_wrapper.active');
                for (var i = 1; i<=options.col*options.row; i++) {
                    active.find($('[number='+i+']')).animate({right: center[0], top: center[1]}, speed[i]);
                    active.animate({opacity: 0}, 400)
                }
                active.toggleClass('active compressed active_compress');
                setTimeout(function(){
                    if (!active.prev().hasClass('slider_wrapper')) {
                        $(options.container + ' .slider_wrapper.last').toggleClass('active compressed active_compress');
                        active = $(options.container + ' .slider_wrapper.active');
                        for (var i = 1; i<=options.col*options.row; i++) {
                            active.find($('[number='+i+']')).animate({right: positions[i][0], top: positions[i][1]}, speed[i]);
                        }
                        setTimeout(function(){
                            active.animate({opacity: 1}, 300)
                        }, 500)
                    }
                    else {
                        active.prev().toggleClass('active compressed active_compress');
                        active = $(options.container + ' .slider_wrapper.active');
                        for (var i = 1; i<=options.col*options.row; i++) {
                            active.find($('[number='+i+']')).animate({right: positions[i][0], top: positions[i][1]}, speed[i]);
                        }
                        setTimeout(function(){
                            active.animate({opacity: 1}, 300)
                        }, 500)
                    }
                    $(options.container + '+ .sexySlider_pagination button.active_pag').removeClass('active_pag');
                    $(options.container + '+ .sexySlider_pagination button').eq($(options.container + ' .slider_wrapper.active').attr('wrapper_number')).addClass('active_pag');
                }, options.speed);
            }
        }


        //Реализация
        var make = function() {
            constructor();
            pagination();
            placing();
            classes(options.sliderItemNumber);
            animation();
            if (options.arrows) {
                arrows();
            }
        };
        return this.each(make);
    }
})(jQuery);





