const alpha = document.getElementById('alpha');

alpha.addEventListener('click',convertirAlpha);

const botones = ['CALC','∫','(-)','grados','hyp','sin','cos','tan',')','S⇄D','M+','.','×10ˣ']; 
const alternativos = ['=',':','A','B','C','D','E','F','X','Y','M','RanInt','e'];

function convertirAlpha(){
    for (let i = 0; i < botones.length; i++) {
        let aReemp = document.getElementById(`${botones[i]}`);
        if (aReemp.textContent == botones[i]) {
            aReemp.textContent = alternativos[i];
            aReemp.style.backgroundColor = 'red';
        } else {
            aReemp.textContent = botones[i];
            aReemp.style.backgroundColor = 'white';
        }
    }
}

const shift = document.getElementById('shift');

shift.addEventListener('click',convertirShift);

const botons = ['MODO','CALC','∫','x⁻¹','log','ᵇ⁄c','√','x²','^','log','ln','(-)',"°'''",'hyp','sin','cos','tan','RCL','ENG',')','(','S⇄D','M+','7','8','9','DEL','AC','4','5','×','÷','1','2','3','+','-','0','.','×10ˣ','Ans']; 
const alternativs = ['config','SOLVE','deriv','fact','sumat','aᵇ⁄c','cubic','cubo','raiz','10^','e^','ang','left','Abs','sin-1','cos-1','tan-1','STO','izq','%',',','aᵇ⁄c-ᵇ⁄c','M-','CONST','CONV','CLR','INS','APAG','MATRIX','VECTOR','nPr','nCr','STAT','CMPLX','BASE','Pol','Rec','Rnd','Rand#','pi','DRGflecha'];

function convertirShift(){
    for (let i = 0; i < botons.length; i++) {
        let aReemp = document.getElementById(`${botons[i]}`);
        if (aReemp.textContent == botons[i]) {
            aReemp.textContent = alternativs[i];
            aReemp.style.backgroundColor = 'orange';
        } else {
            aReemp.textContent = botons[i];
            aReemp.style.backgroundColor = 'white';
        }
    }
}