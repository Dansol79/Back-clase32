module.exports = function numerosRandom(cantidadDeNumeros){
    cantidadDeNumeros = Number(cantidadDeNumeros);
    const numbers ={};

    for(let i = 0; i <= cantidadDeNumeros; i++){
        let num = Math.floor(Math.random()* (100 - 0 + 1) + 0);
        if(numbers[num]){
            numbers[num]++;
        }else{
            numbers[num] = 1;
        }
    }
    return numbers;
}