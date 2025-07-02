const alpha = document.getElementById('alpha');

alpha.addEventListener('click',convertirAlpha);

function convertirAlpha(){
    let calc = document.getElementById('calc');
    if (calc.textContent == 'CALC') {
        calc.textContent = '=';
        calc.style.backgroundColor = 'red';
    } else {
        calc.textContent = 'CALC';
        calc.style.backgroundColor = 'white';
    }
}