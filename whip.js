window.addEventListener('load',main,false);
function main() { 	
	const stop_button = document.getElementById('Stop')
	var s = 1; // для паузы
	var flag = 0; // для паузы 

	// Переключатель значений для паузы
	function switcher() {
		switch (flag) {
			case 0: {
				flag = 1;
				s = 0;
				stop_button.value = 'Пуск'
				break;
			}
			case 1: {
				flag = 0;
				s = 1;
				stop_button.value = 'Стоп'
			}
		}
	}	

	// Привязка паузы на клик кнопки
	Stop.onclick = function () { switcher();}
	
	// Обновление на клик кнопки
	reboot.onclick = function() {
		clearInt(interv);
		upd();
	}

	var N = document.getElementById('N').value; // число элементов
	var a = document.getElementById('distance').value; // начальное расстояние между элементами
	var beta,dt,c; // вязкость, шаг по времени, отношение жесткости к массе

	parts = []; // тут будем хранить информацию о каждом элементе
	var l_r, l_l, w_x, w_y; // расстояние между текущим и следующим элементом, расстояние между текущим и предыдущим элементом, проекции ускорений
	 
	var t = 0; // время
	
	var ctx = cnv.getContext('2d');
	var h = cnv.height;
	var w = cnv.width;
		
	// Стартовые значения при запуске страницы. 
	function upd() { 
		N = parseInt(document.getElementById('N').value); // число частиц
		c = parseFloat(document.getElementById('cm').value); // 
		a = parseFloat(document.getElementById('distance').value);
		dt0 = 0.01;
		beta = parseFloat(document.getElementById('b').value);
		initial_conditions(N, a);
		t = 0;
		interv = setInterval(ctrl, 1000 / 120);
	}

	// Очистка частоты вызывания функции
	function clearInt(intrv) { 
		clearInterval(intrv);
	}
	
	// Задание начальных значений для каждого элемента
	function initial_conditions(N, distance) {
		var len = (N - 1) * distance;
		for (var i = 0; i < N; i++) { 
			pt = [];
			pt.x = 250 + distance * i; 
			pt.y = 300;
			pt.v_x = 0;
			pt.v_y = 0;
			pt.w_x = 0;
			pt.w_y = 0;
			pt.m = (i + 1) / 25
			parts[i] = pt; 
		}
	}
		
	// Метод Эейлера
	function Euler_method() {  
		dt = dt0 * s;
		for (var i = 0; i < N - 2; i++) { 
			if(t < 350 * dt) // Время, в течение которого сообщаем возмущение
			{
				parts[N - 1].y = 300 - 50 * Math.sin(5 * t); // Возмущение для правого конца
				parts[N - 2].y = 300 - 50 * Math.sin(5 * t);
			}
			if(i == 0) {
				l_r = Math.pow(Math.pow(parts[1].x - parts[0].x, 2) + Math.pow(parts[1].y - parts[0].y, 2), 1/2);
			} else {
				l_r = Math.pow(Math.pow(parts[i + 1].x - parts[i].x, 2) + Math.pow(parts[i + 1].y - parts[i].y, 2), 1/2); // Расстояние между текущим и следующим элементами
				l_l = Math.pow(Math.pow(parts[i].x - parts[i - 1].x, 2) + Math.pow(parts[i].y - parts[i - 1].y, 2), 1/2); // Расстояние между текущим и предыдущим элементами
			}
			
			if (l_r < a) {
				del_l_r = 0; 
			} else {  
				del_l_r = (l_r - a);
			}
			if (i != 0){
				if (l_l < a) {
				del_l_l = 0;
			} else { 
				del_l_l = (l_l - a);
			}
			}
			if (i == 0) {
				w_x = c / parts[i].m * (del_l_r * (parts[1].x - parts[0].x) / l_r) - beta / parts[i].m * parts[0].v_x;
				w_y = c / parts[i].m * (del_l_r * (parts[1].y - parts[0].y) / l_r) - beta / parts[i].m * parts[0].v_y;
			} else {
				w_x = c / parts[i].m * (del_l_r * (parts[i + 1].x - parts[i].x) / l_r - del_l_l * (parts[i].x - parts[i - 1].x) / l_l) - beta / parts[i].m * parts[i].v_x;
				w_y = c / parts[i].m * (del_l_r * (parts[i + 1].y - parts[i].y) / l_r - del_l_l * (parts[i].y - parts[i - 1].y) / l_l) - beta / parts[i].m * parts[i].v_y;
			}
			// пересчет значений на текущем шаге
			parts[i].w_x = w_x;
			parts[i].w_y = w_y;
			parts[i].v_x += w_x * dt;
			parts[i].v_y += w_y * dt;
		}

		for (var i = 0; i< N - 1; i++) { 
			parts[i].x += parts[i].v_x * dt;
			parts[i].y += parts[i].v_y * dt;
		}
		t += dt;		
	}
	
	// Функция отрисовки
	function draw() { 
		ctx.clearRect(0, 0, w, h);
		for (var i = 0; i < N; i++) { 
			ctx.fillStyle = 'blue';
			ctx.beginPath();
			ctx.arc(parts[i].x, parts[i].y, 7, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
		}
	}
	
	// Расчет + отрисовка
	function ctrl() { 
		Euler_method(); 
		draw();
	}
	upd();
}